'use strict';
const crypto = require('crypto');
const prisma  = require('../config/prisma');
const redisStore = require('../config/redis');

/*
  UAE Pass OAuth 2.0 / OpenID Connect flow:
  1. Client calls GET /auth/uae-pass/init     → gets redirect URL
  2. User authenticates on UAE Pass portal
  3. UAE Pass redirects to your callback URL
  4. Server calls POST /auth/uae-pass/callback → exchanges code for tokens
  5. Server fetches user profile from UAE Pass
  6. Issue JWT and return to client

  Required env vars:
    UAE_PASS_CLIENT_ID
    UAE_PASS_CLIENT_SECRET
    UAE_PASS_REDIRECT_URI      (e.g. https://api.honeymoon.ae/api/v1/auth/uae-pass/callback)
    UAE_PASS_BASE_URL          (e.g. https://stg-id.uaepass.ae for staging)
    UAE_PASS_SCOPES            (e.g. urn:uae:digitalid:profile:general)
*/

const UAE_PASS_CONFIG = {
  clientId:     process.env.UAE_PASS_CLIENT_ID,
  clientSecret: process.env.UAE_PASS_CLIENT_SECRET,
  redirectUri:  process.env.UAE_PASS_REDIRECT_URI,
  baseUrl:      process.env.UAE_PASS_BASE_URL || 'https://stg-id.uaepass.ae',
  scopes:       process.env.UAE_PASS_SCOPES   || 'urn:uae:digitalid:profile:general',
  // Endpoints
  get authUrl()     { return `${this.baseUrl}/idshub/authorize`; },
  get tokenUrl()    { return `${this.baseUrl}/idshub/token`; },
  get userInfoUrl() { return `${this.baseUrl}/idshub/userinfo`; },
  get logoutUrl()   { return `${this.baseUrl}/idshub/logout`; },
};

/* ── PKCE helpers ───────────────────────────────────────────────────────────── */
function generateCodeVerifier() {
  return crypto.randomBytes(43).toString('base64url');
}

function generateCodeChallenge(verifier) {
  return crypto.createHash('sha256').update(verifier).digest('base64url');
}

function generateState() {
  return crypto.randomBytes(16).toString('hex');
}

/* ─────────────────────────────────────────────────────────────────────────────
   STEP 1: Generate authorization URL
─────────────────────────────────────────────────────────────────────────────*/
async function getAuthorizationUrl(role = 'user') {
  if (!UAE_PASS_CONFIG.clientId) {
    throw new Error('UAE_PASS_CLIENT_ID not configured');
  }

  const state        = generateState();
  const codeVerifier = generateCodeVerifier();
  const challenge    = generateCodeChallenge(codeVerifier);

  // Store state + verifier in Redis (5 min TTL)
  await redisStore.set(`uaepass:state:${state}`, { codeVerifier, role }, 300);

  const params = new URLSearchParams({
    response_type:          'code',
    client_id:               UAE_PASS_CONFIG.clientId,
    redirect_uri:            UAE_PASS_CONFIG.redirectUri,
    scope:                   UAE_PASS_CONFIG.scopes,
    state,
    code_challenge:          challenge,
    code_challenge_method:   'S256',
    acr_values:              'urn:safelayer:tws:policies:authentication:level:low',
  });

  return {
    authorizationUrl: `${UAE_PASS_CONFIG.authUrl}?${params.toString()}`,
    state,
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
   STEP 2: Handle callback — exchange code for tokens
─────────────────────────────────────────────────────────────────────────────*/
async function handleCallback(code, state) {
  if (!code || !state) throw new Error('Missing code or state');

  // Verify state and retrieve code verifier
  const stored = await redisStore.get(`uaepass:state:${state}`);
  if (!stored) throw new Error('Invalid or expired state — possible CSRF attack');
  await redisStore.del(`uaepass:state:${state}`);

  const { codeVerifier, role } = stored;

  // Exchange code for tokens
  const tokenResponse = await fetch(UAE_PASS_CONFIG.tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type:    'authorization_code',
      code,
      redirect_uri:  UAE_PASS_CONFIG.redirectUri,
      client_id:     UAE_PASS_CONFIG.clientId,
      client_secret: UAE_PASS_CONFIG.clientSecret,
      code_verifier: codeVerifier,
    }).toString(),
  });

  if (!tokenResponse.ok) {
    const err = await tokenResponse.text();
    throw new Error(`UAE Pass token exchange failed: ${err}`);
  }

  const tokens = await tokenResponse.json();

  // Fetch user profile
  const profileResponse = await fetch(UAE_PASS_CONFIG.userInfoUrl, {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });

  if (!profileResponse.ok) throw new Error('Failed to fetch UAE Pass profile');
  const profile = await profileResponse.json();

  return { tokens, profile, role };
}

/* ─────────────────────────────────────────────────────────────────────────────
   STEP 3: Upsert user from UAE Pass profile
─────────────────────────────────────────────────────────────────────────────*/
async function upsertUserFromUAEPass(profile, role = 'user') {
  /*
    UAE Pass profile fields (actual field names vary by ACR/scope):
    - sub            → unique UAE Pass ID
    - email
    - phone_number
    - given_name     → first name (English)
    - family_name    → last name (English)
    - gender
    - national_id_number
    - idn             → Emirates ID number
  */

  const uaePassId = profile.sub;
  const email     = profile.email;
  const phone     = profile.phone_number;

  if (role === 'user') {
    // Check if user exists (by uaePassId or email)
    let user = await prisma.user.findFirst({
      where: { OR: [{ uaePassId }, ...(email ? [{ email }] : [])] }
    });

    if (!user) {
      // New registration via UAE Pass
      const { nanoid } = await import('nanoid').catch(() => ({ nanoid: () => Math.random().toString(36).slice(2,8).toUpperCase() }));
      user = await prisma.user.create({
        data: {
          firstName:    profile.given_name || 'UAE',
          lastName:     profile.family_name || 'Pass User',
          email:        email || null,
          phone:        phone || null,
          uaePassId,
          emailVerified: !!email,
          phoneVerified: !!phone,
          status:       'Active',
          referralCode: `REF${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2,6).toUpperCase()}`,
          loyaltyPoints: 0,
        }
      });
    } else if (!user.uaePassId) {
      // Link existing account to UAE Pass
      user = await prisma.user.update({
        where: { id: user.id },
        data: { uaePassId, phoneVerified: !!phone }
      });
    }

    return { user, isNew: !user.createdAt };
  }

  if (role === 'vendor') {
    let vendor = await prisma.vendor.findFirst({
      where: { OR: [{ uaePassId }, ...(email ? [{ email }] : [])] }
    });

    if (!vendor) {
      vendor = await prisma.vendor.create({
        data: {
          firstName:    profile.given_name || 'Vendor',
          lastName:     profile.family_name || '',
          email:        email || null,
          phone:        phone || null,
          uaePassId,
          companyName:  `${profile.given_name || ''} Events`,
          category:     'Venue',
          location:     'Dubai',
          status:       'Pending', // needs admin approval
          emailVerified: !!email,
          phoneVerified: !!phone,
        }
      });
    } else if (!vendor.uaePassId) {
      vendor = await prisma.vendor.update({
        where: { id: vendor.id },
        data: { uaePassId }
      });
    }

    return { vendor, isNew: !vendor.createdAt };
  }

  throw new Error('Invalid role for UAE Pass');
}

module.exports = {
  getAuthorizationUrl,
  handleCallback,
  upsertUserFromUAEPass,
  UAE_PASS_CONFIG,
};

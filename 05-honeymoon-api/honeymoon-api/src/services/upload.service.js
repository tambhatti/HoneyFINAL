'use strict';
const path  = require('path');
const crypto = require('crypto');

/* ── AWS SDK v3 (lazy init) ─────────────────────────────────────────────────── */
let s3Client  = null;
let s3Cmds    = null;

function getS3() {
  if (!s3Client) {
    try {
      const { S3Client } = require('@aws-sdk/client-s3');
      s3Cmds = require('@aws-sdk/client-s3');
      s3Client = new S3Client({
        region:      process.env.AWS_REGION      || 'me-central-1',
        credentials: {
          accessKeyId:     process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      });
    } catch {
      console.warn('[Upload] @aws-sdk/client-s3 not installed — uploads disabled');
    }
  }
  return { s3Client, s3Cmds };
}

const BUCKET = process.env.AWS_S3_BUCKET || 'honeymoon-uploads';
const CDN    = process.env.AWS_CLOUDFRONT_URL; // optional CloudFront CDN

/* ── File type constraints ──────────────────────────────────────────────────── */
const ALLOWED_IMAGE_TYPES  = ['image/jpeg','image/jpg','image/png','image/webp'];
const ALLOWED_DOC_TYPES    = ['application/pdf','image/jpeg','image/png'];
const MAX_IMAGE_SIZE       = 5  * 1024 * 1024;  // 5MB
const MAX_DOC_SIZE         = 10 * 1024 * 1024;  // 10MB

/* ── Build S3 key ───────────────────────────────────────────────────────────── */
function buildKey(folder, originalName) {
  const ext    = path.extname(originalName).toLowerCase() || '.jpg';
  const uid    = crypto.randomBytes(12).toString('hex');
  const date   = new Date().toISOString().slice(0, 7); // YYYY-MM
  return `${folder}/${date}/${uid}${ext}`;
}

/* ── Public URL ─────────────────────────────────────────────────────────────── */
function publicUrl(key) {
  if (CDN) return `${CDN.replace(/\/$/, '')}/${key}`;
  return `https://${BUCKET}.s3.${process.env.AWS_REGION || 'me-central-1'}.amazonaws.com/${key}`;
}

/* ─────────────────────────────────────────────────────────────────────────────
   UPLOAD BUFFER  (from multer memory storage)
─────────────────────────────────────────────────────────────────────────────*/
async function uploadBuffer(buffer, mimetype, originalName, folder = 'misc') {
  const { s3Client: s3, s3Cmds: cmds } = getS3();

  if (!s3) {
    // DEV fallback: return fake URL
    const fakeKey = buildKey(folder, originalName);
    console.log(`[Upload] DEV MODE — skipping S3 upload: ${fakeKey}`);
    return { key: fakeKey, url: `https://placeholder.honeymoon.ae/${fakeKey}` };
  }

  const key = buildKey(folder, originalName);

  await s3.send(new cmds.PutObjectCommand({
    Bucket:      BUCKET,
    Key:         key,
    Body:        buffer,
    ContentType: mimetype,
    CacheControl:'public, max-age=31536000',
    Metadata: {
      uploadedAt: new Date().toISOString(),
    },
  }));

  return { key, url: publicUrl(key) };
}

/* ─────────────────────────────────────────────────────────────────────────────
   DELETE FROM S3
─────────────────────────────────────────────────────────────────────────────*/
async function deleteFile(key) {
  const { s3Client: s3, s3Cmds: cmds } = getS3();
  if (!s3 || !key) return;
  try {
    await s3.send(new cmds.DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
  } catch (err) {
    console.error('[Upload] S3 delete failed:', err.message);
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   GENERATE PRE-SIGNED URL (for large uploads direct from client — Session 4)
─────────────────────────────────────────────────────────────────────────────*/
async function getPresignedPutUrl(folder, filename, mimetype, ttlSeconds = 300) {
  const { s3Client: s3, s3Cmds: cmds } = getS3();
  if (!s3) throw new Error('S3 not configured');

  const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
  const key = buildKey(folder, filename);

  const url = await getSignedUrl(
    s3,
    new cmds.PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: mimetype }),
    { expiresIn: ttlSeconds }
  );

  return { url, key, publicUrl: publicUrl(key) };
}

/* ─────────────────────────────────────────────────────────────────────────────
   MULTER MIDDLEWARE FACTORY
─────────────────────────────────────────────────────────────────────────────*/
function createMulter(allowedTypes = ALLOWED_IMAGE_TYPES, maxSize = MAX_IMAGE_SIZE) {
  const multer = require('multer');
  return multer({
    storage: multer.memoryStorage(),
    limits:  { fileSize: maxSize },
    fileFilter: (req, file, cb) => {
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error(`File type not allowed. Accepted: ${allowedTypes.join(', ')}`));
      }
      cb(null, true);
    },
  });
}

/* ── Pre-configured upload middlewares ──────────────────────────────────────── */
const uploadImage    = createMulter(ALLOWED_IMAGE_TYPES,  MAX_IMAGE_SIZE);
const uploadDocument = createMulter(ALLOWED_DOC_TYPES,    MAX_DOC_SIZE);

/* ── Folder constants ───────────────────────────────────────────────────────── */
const FOLDERS = {
  userAvatars:      'users/avatars',
  vendorAvatars:    'vendors/avatars',
  vendorBanners:    'vendors/banners',
  tradeLicenses:    'vendors/licenses',
  serviceImages:    'services/images',
  bookingImages:    'bookings/inspirational',
  receipts:         'payments/receipts',
  homeContent:      'cms/home',
};

module.exports = {
  uploadBuffer,
  deleteFile,
  getPresignedPutUrl,
  publicUrl,
  uploadImage,
  uploadDocument,
  FOLDERS,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_DOC_TYPES,
};

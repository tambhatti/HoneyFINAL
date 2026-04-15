'use strict';
/**
 * AI Planner Service — Feature #3
 * Uses Anthropic Claude API to generate personalised honeymoon plans.
 * Set ANTHROPIC_API_KEY in .env to enable. Falls back to rule-based planner.
 */

const PACKAGES = {
  Dubai:     ['Burj Al Arab Bridal Suite','Desert Safari Dinner','Dhow Cruise','Atlantis Aquaventure'],
  'Abu Dhabi':['Emirates Palace Honeymoon','Yas Island Escape','Louvre Abu Dhabi Tour','Desert Camp'],
  Sharjah:   ['Al Noor Island Dinner','Arts District Tour','Cultural Heritage Stay','Desert Resort'],
};

const CATEGORIES = ['Venue','Photography','Catering','Beauty','Decoration','Music','Transport'];

/* ── Rule-based fallback planner ───────────────────────────────────────────── */
function buildRuleBasedPlan(params) {
  const { location, budget, guestCount, preferences = [], style = 'luxury', duration = 3 } = params;
  const basePerDay = { luxury: 8000, modern: 5000, traditional: 3500, outdoor: 4000 }[style] || 5000;
  const totalBudget = budget || basePerDay * duration;
  const activities  = (PACKAGES[location] || PACKAGES['Dubai']).slice(0, duration + 1);
  const breakdown   = {};
  const weights     = { Venue:0.30, Catering:0.25, Photography:0.15, Decoration:0.12, Beauty:0.08, Music:0.06, Transport:0.04 };
  CATEGORIES.forEach(c => { breakdown[c] = Math.round(totalBudget * weights[c]); });

  return {
    title:       `Your ${style.charAt(0).toUpperCase()+style.slice(1)} Honeymoon in ${location}`,
    location, style, duration, guestCount,
    totalBudget, breakdown,
    itinerary:   activities.map((act, i) => ({
      day: i + 1,
      theme: i === 0 ? 'Arrival & Check-in' : i === duration - 1 ? 'Farewell' : 'Experience Day',
      activity: act,
      tips: `Book at least 2 weeks in advance. ${i === 0 ? 'Request honeymoon welcome amenities at check-in.' : ''}`,
    })),
    vendorSuggestions: preferences.length
      ? CATEGORIES.filter(c => preferences.includes(c.toLowerCase()))
      : CATEGORIES.slice(0, 4),
    aiMessage: `Based on your preferences for a ${style} honeymoon in ${location} for ${guestCount || 2} guests over ${duration} days, we've crafted a personalised plan within AED ${totalBudget.toLocaleString()}.`,
    source: 'rule-based',
  };
}

/* ── Claude AI planner ─────────────────────────────────────────────────────── */
async function generatePlan(params) {
  const { location, budget, guestCount, preferences, style, duration, additionalNotes } = params;

  if (!process.env.ANTHROPIC_API_KEY) {
    return buildRuleBasedPlan(params);
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':       'application/json',
        'x-api-key':          process.env.ANTHROPIC_API_KEY,
        'anthropic-version':  '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-5',
        max_tokens: 2048,
        system: `You are a luxury honeymoon planner specialising in UAE destinations. 
Generate a detailed honeymoon plan as JSON only — no markdown, no preamble.
Return exactly: { title, location, style, duration, guestCount, totalBudget, 
breakdown (object with category amounts), itinerary (array of {day,theme,activity,tips}),
vendorSuggestions (array of strings), aiMessage, source: "claude" }`,
        messages: [{
          role: 'user',
          content: `Plan a honeymoon:
Location: ${location || 'Dubai'}
Budget: AED ${budget || 20000}
Guests/Couple: ${guestCount || 2}
Duration: ${duration || 3} days
Style: ${style || 'luxury'}
Preferences: ${(preferences || []).join(', ') || 'flexible'}
Notes: ${additionalNotes || 'none'}`,
        }],
      }),
    });

    if (!response.ok) throw new Error(`Anthropic API error: ${response.status}`);
    const data = await response.json();
    const text = data.content?.[0]?.text || '';
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch (e) {
    console.error('[AI Planner] Claude error:', e.message, '— falling back to rule-based');
    return buildRuleBasedPlan(params);
  }
}

module.exports = { generatePlan };

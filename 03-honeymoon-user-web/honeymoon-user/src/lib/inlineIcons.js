import { svgDataUri } from './svgDataUri';

const FB_PATH =
  'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z';

export const imgGlobeFilled = svgDataUri(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#174a37"><circle cx="12" cy="12" r="10" stroke="#174a37" stroke-width="2" fill="none"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="#174a37" stroke-width="2" fill="none"/></svg>'
);

export const imgGlobeOutline = svgDataUri(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#174a37" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'
);

export const imgFacebookIcon = svgDataUri(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1877F2"><path d="${FB_PATH}"/></svg>`
);

export const imgStar = svgDataUri(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>'
);

export const imgAiSparkle = svgDataUri(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#CFB383"><text y="20" font-size="20">✨</text></svg>'
);

export const imgTrophyBadge = svgDataUri(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#CFB383"><text y="20" font-size="20">🏆</text></svg>'
);

export const imgShieldIcon = svgDataUri(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#174a37"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>'
);

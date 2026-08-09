/* Motion constants, kept out of ui.jsx so that file exports only components
   and React Fast Refresh keeps working during dev. */

/* §4 — critically damped by default; bounce only where a gesture carried momentum. */
export const uiSpring = { type: 'spring', bounce: 0, duration: 0.4 };
export const sheetSpring = { type: 'spring', bounce: 0.18, duration: 0.32 };
export const drawerSpring = { type: 'spring', bounce: 0.18, duration: 0.32 };

/* §6 — Apple's momentum projection: land where the flick was going, not where
   the finger stopped. Exponential decay, not the v²/2a textbook form. */
export const project = (velocity, decelerationRate = 0.998) =>
  (velocity / 1000) * decelerationRate / (1 - decelerationRate);

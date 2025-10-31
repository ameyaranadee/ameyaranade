// website/src/routes/posters/formation.ts
export type Rect = { x: number; y: number; r?: number }; // r = rotation in degrees
export type SavedPosition = { x: number; y: number; w: number; h: number; z: number; r: number };

export const BASE = { w: 1200, h: 800 };
export const FORMATION_SCALE = 0.25;

/*
  Formation defines default positions for your posters on page load.
  - x, y are absolute in BASE units (0..BASE.w / 0..BASE.h)
  - r is rotation in degrees (0 = upright, 90 = rotated 90° CCW/left, -90 = rotated 90° CW/right)
  - Images will use their natural sizes * FORMATION_SCALE once loaded
*/

// Your actual arranged positions (in screen pixels, will be converted to BASE units)
// These positions were captured from your actual arrangement
export const DEFAULT_POSITIONS: Record<string, SavedPosition> = {
	'/src/lib/assets/posters/1975.jpg': {
		x: 346.75390625,
		y: 91.20703125,
		w: 168.45962524414062,
		h: 240.4296875,
		z: 40,
		r: 0
	},
	'/src/lib/assets/posters/avicii.jpg': {
		x: 678.69921875,
		y: 188.19921875,
		w: 165.5,
		h: 153.625,
		z: 34,
		r: 0
	},
	'/src/lib/assets/posters/batman.jpg': {
		x: 497.51171875,
		y: 329.75128173828125,
		w: 184,
		h: 276,
		z: 35,
		r: 0
	},
	'/src/lib/assets/posters/daft-punk.jpg': {
		x: 843.9114379882812,
		y: 146.66146850585938,
		w: 184,
		h: 260.5,
		z: 44,
		r: 0
	},
	'/src/lib/assets/posters/dawn-fm.jpg': {
		x: 675.6393432617188,
		y: 341.17578125,
		w: 168.68096923828125,
		h: 291.02734375,
		z: 7,
		r: 0
	},
	'/src/lib/assets/posters/ironman.jpg': {
		x: 106.51953125,
		y: 151.9986572265625,
		w: 242.5,
		h: 342.5,
		z: 41,
		r: 0
	},
	'/src/lib/assets/posters/whiplash.jpg': {
		x: 515.10546875,
		y: 82.87109375,
		w: 165.07940673828125,
		h: 247.71484375,
		z: 33,
		r: 0
	},
	'/src/lib/assets/posters/abstract.jpg': {
		x: 347.3359375,
		y: 329.01953125,
		w: 151.4140625,
		h: 196.98046875,
		z: 38,
		r: 0
	}
};

// Map image filenames to their formation positions (for new images without saved positions)
export const FORMATION_MAP: Record<string, Rect> = {
	ironman: { x: 150, y: 400 },
	abstract: { x: 380, y: 480, r: 90 },
	'1975': { x: 250, y: 450 },
	whiplash: { x: 500, y: 300 },
	batman: { x: 450, y: 500 },
	'dawn-fm': { x: 550, y: 480 },
	avicii: { x: 620, y: 320 },
	'daft-punk': { x: 800, y: 320 }
};

// Legacy array format
export const FORMATION: Rect[] = [
	{ x: 150, y: 400 },
	{ x: 380, y: 480, r: 90 },
	{ x: 250, y: 300 },
	{ x: 500, y: 300 },
	{ x: 480, y: 500 },
	{ x: 650, y: 480 },
	{ x: 620, y: 320 },
	{ x: 800, y: 320 }
];

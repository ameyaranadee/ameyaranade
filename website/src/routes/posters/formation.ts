// website/src/routes/posters/formation.ts
export type Rect = { x: number; y: number; w: number; h: number };

export const BASE = { w: 1200, h: 800 };

export const FORMATION: Rect[] = [
	{ x: 210, y: 40, w: 210, h: 260 }, // The 1975 (tall-ish)
	{ x: 430, y: 28, w: 190, h: 250 }, // Whiplash
	{ x: 610, y: 40, w: 200, h: 240 }, // small square (album)
	{ x: 790, y: 20, w: 230, h: 280 }, // Daft Punk sheet (tall)
	{ x: 980, y: 80, w: 160, h: 200 }, // small right

	{ x: 120, y: 250, w: 230, h: 280 }, // Iron Man
	{ x: 350, y: 270, w: 230, h: 170 }, // horizontal gradient
	{ x: 590, y: 240, w: 240, h: 320 }, // The Batman (tall center)
	{ x: 840, y: 250, w: 220, h: 270 }, // black poster

	{ x: 880, y: 470, w: 210, h: 210 } // orange planet
];

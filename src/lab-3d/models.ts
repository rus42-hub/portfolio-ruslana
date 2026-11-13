export interface LabModel {
  slug: string;
  title: string;
  kind: string;
  year: string;
  text: string;
  poster: string;
  backdrop?: string;
  background: string;
  /** Blender camera position: gives the first view of the model. */
  camera: [number, number, number];
  /** Bigger values move the camera further away. */
  fit: number;
  /** Vertical shift of the look-at point, in model radii. */
  lift: number;
  /** Brightness of the baked texture on the site. */
  gain?: number;
  /** Camera height in degrees for the turning views. */
  pitch?: number;
  /** Bloom strength for glowing windows and crystals. */
  glow?: number;
  /** 360° view: look point above the model centre, in model radii. */
  focus?: number;
  /** 360° view: closest zoom (1 = default distance). */
  closest?: number;
  /** Live light: HDR copy of the Blender world used to light real materials. */
  light?: string;
  /** Lamp strength for live light (default 8). */
  lampPower?: number;
  /** Warm tint for the lamps (hex). */
  lampTint?: string;
  /** Strength of the world light on the materials (default 1). */
  envLight?: number;
  /** Material names (regex) of parts that glow through their whole body. */
  glowParts?: string;
  /** Brightness per material name (regex), for colours that look black on the site. */
  tone?: Record<string, number>;
  /** 360° view opens on this moment of the Blender camera path (0-1). */
  startAt?: number;
  /** Direction of the slow turn in the 360° view: 1 or -1 (default 1). */
  spin?: number;
  /** Colours for the glowing crystals, one per crystal. */
  glowTints?: string[];
  /** Soften plain materials (no sparkle). */
  matte?: boolean;
  /** Soft all-around fill light strength. */
  fill?: number;
  /** Mesh names (regex) shown with smooth shading. */
  smoothParts?: string;
  /** Shadow offset for small parts that speckle. */
  shadowSoftness?: number;
  /** Coloured light inside the glowing liquid. */
  innerGlow?: { color: string; power: number };
  /** Mesh names (regex) redrawn as cork. */
  corkParts?: string;
  /** Glowing materials tinted by side of the first view. */
  sideGlow?: { parts: string; left: string; right: string; power?: number };
  /** 'aces' for stronger colour. */
  toneMapping?: 'agx' | 'aces';
  /** Overall brightness (default 1). */
  exposure?: number;
  /** Brightness of the 360 world behind the model (default 1). */
  worldLight?: number;
  /** Coloured side lights. */
  rims?: { color: string; angle: number; power: number }[];
  /** 360 world image and its rotation in radians. */
  world?: string;
  worldTurn?: number;
}

const root = '/lab-3d/models';

export const labModels: LabModel[] = [
  { slug: 'stonehenge', title: 'Stonehenge', kind: 'Scène 3D', year: '2024', text: 'Une île flottante autour du cercle de pierres, avec une sphère de galaxie au centre. Modélisation, matières et lumière réalisées dans Blender.', poster: `${root}/stonehenge-poster.jpg`, world: `${root}/stonehenge-world.jpg`, worldTurn: Math.PI / 2, lampPower: 1.3, lampTint: '#ffc48a', light: `${root}/stonehenge-light.hdr`, background: '#6d5146', camera: [-36.26, 7.98, 8.97], fit: 0.5, lift: 0.42, pitch: 4, gain: 1, focus: 0.32, closest: 0.28 },
  { slug: 'chateau', title: 'Château', kind: 'Scène 3D', year: '2025', text: 'Un château de conte posé sur des îlots, éclairé par ses fenêtres et par la nuit bleue autour de lui.', poster: `${root}/castle-poster.jpg`, world: `${root}/chateau-galaxie-world.jpg`, worldTurn: Math.PI / 2, glow: 0.2, sideGlow: { parts: '^allGrass', left: '#ff6fd8', right: '#2fe6d2', power: 0.9 }, glowParts: '^Cube', glowTints: ['#9d4dff', '#35d977', '#b45cff'], closest: 0.12, startAt: 0.6, lampPower: 0.32, lampTint: '#ffd8a8', light: `${root}/chateau-galaxie-light.hdr`, background: 'radial-gradient(circle at 50% 40%, #16438f, #071a45 60%, #030a20)', camera: [27.61, -54.46, 14.07], fit: 0.62, lift: 0.05 },
  { slug: 'foret', title: 'La Forêt', kind: 'Scène 3D', year: '2025', text: 'Une île low poly avec son lac, ses arbres et ses nénuphars, pensée comme un petit monde à faire tourner.', poster: `${root}/forest-poster.jpg`, world: `${root}/forest-world.jpg`, worldTurn: Math.PI / 2, lampPower: 1.3, lampTint: '#ffc78a', envLight: 0.42, toneMapping: 'aces', exposure: 0.85, matte: true, spin: -1, startAt: 0.88, tone: { '^Cube\\.001-colour$': 2.2, '^Trunk_|^Материал$|^suelo$': 2 }, light: `${root}/foret-light.hdr`, background: '#a9c7d9', camera: [21.19, 48.06, 13.01], fit: 0.5, lift: 0.08, focus: 0.3, closest: 0.25 },
  { slug: 'potion', title: 'La Potion', kind: 'Objet 3D', year: '2025', text: 'Une fiole de verre remplie d’un liquide magique, posée sur une table de métal usé.', poster: `${root}/potion-poster.jpg`, world: `${root}/potion-world.jpg`, worldTurn: Math.PI / 2, lampPower: 0.35, lampTint: '#ffc996', envLight: 0.45, exposure: 0.85, worldLight: 0.7, tone: { '^Shabby': 0.4 }, rims: [{ color: '#ff3fa6', angle: 0, power: 0.85 }, { color: '#2f63ff', angle: Math.PI, power: 0.9 }, { color: '#9b4dff', angle: Math.PI / 2, power: 0.45 }, { color: '#9b4dff', angle: -Math.PI / 2, power: 0.45 }], smoothParts: '^Cylinder001$', corkParts: '^Cylinder001$', shadowSoftness: 0.03, innerGlow: { color: '#ff2fa8', power: 4 }, spin: -1, light: `${root}/potion-light.hdr`, background: 'linear-gradient(120deg, #123f66, #54386f 55%, #b35a44)', camera: [-17.88, 4.6, 6.3], fit: 0.58, lift: 0.08 },
];

export const labModel = (slug: string) => labModels.find(model => model.slug === slug)!;

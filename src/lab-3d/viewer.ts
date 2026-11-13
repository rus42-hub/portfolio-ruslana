import { ACESFilmicToneMapping, Box3, Color, DoubleSide, EquirectangularReflectionMapping, Group, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, NoToneMapping, PMREMGenerator, PerspectiveCamera, Quaternion, SRGBColorSpace, Scene, Sphere, TextureLoader, Vector3, WebGLRenderer, type Material } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { Vector2, AgXToneMapping, PCFSoftShadowMap, Light, CanvasTexture, RepeatWrapping, HemisphereLight, DirectionalLight, BufferAttribute, PointLight, MeshStandardMaterial, type BufferGeometry, type Texture } from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

export interface ViewerOptions {
  container: HTMLElement;
  url: string;
  camera: [number, number, number];
  fit: number;
  lift: number;
  gain?: number;
  /** The camera animation of the Blender scene, in glTF axes. */
  path?: CameraPath;
  /** 360 world drawn behind the model, and its rotation in radians. */
  world?: string;
  worldTurn?: number;
  /** Camera height in degrees for the turning views; by default the angle of the Blender camera. */
  pitch?: number;
  /** Soft glow around the brightest parts (lit windows, crystals), like Bloom in Blender. */
  glow?: number;
  /** 360° view: where the camera looks, as a share of the model radius above its centre (the stones, not the rock below). */
  focus?: number;
  /** Live light: real materials and lamps lit by this HDR copy of the Blender world, as Eevee does. */
  light?: string;
  /** Lamp brightness multiplier on top of the Blender values. */
  lampPower?: number;
  /** Colour the lamps are tinted with (hex); her lamps are white, the scenes want warmer light. */
  lampTint?: string;
  /** Strength of the world light (sky) on the materials; below 1 for scenes that look washed out. */
  envLight?: number;
  /** Self-lit parts (material names) that glow through their whole body, like crystals lit from inside. */
  glowParts?: string;
  /** Brightness per material (regex on its name): dark Blender colours that turn black under web light. */
  tone?: Record<string, number>;
  /** 360° view: which moment of the Blender camera path it opens on (0 = start, 1 = end). */
  startAt?: number;
  /** One colour per glowing crystal (hex), in material order; without it each keeps its own average colour. */
  glowTints?: string[];
  /** Soften every plain material (no sparkle on low poly leaves). */
  matte?: boolean;
  /** Strength of a soft all-around fill light, so no side of the model goes black. */
  fill?: number;
  /** Mesh names (regex) drawn with smooth shading instead of visible flat facets. */
  smoothParts?: string;
  /** Shadow offset along the surface; raise it when shadows speckle on small parts. */
  shadowSoftness?: number;
  /** A coloured light at the centre of the glowing liquid (hex colour, strength). */
  innerGlow?: { color: string; power: number };
  /** Mesh names (regex) redrawn as cork with an even grain. */
  corkParts?: string;
  /** Materials (regex) that glow: one colour on the left, one on the right of her camera view. */
  sideGlow?: { parts: string; left: string; right: string; power?: number };
  /** 'aces' gives stronger, more saturated colour than the default AgX. */
  toneMapping?: 'agx' | 'aces';
  /** Overall brightness after tone mapping (default 1). */
  exposure?: number;
  /** Brightness of the 360 world behind the model (default 1); lower for a darker, mysterious mood. */
  worldLight?: number;
  /** Coloured lights from the sides (angle in radians around the model), like the pink and blue of her world on the glass. */
  rims?: { color: string; angle: number; power: number }[];
  onProgress?: (share: number) => void;
}

export interface CameraPath {
  fov: number;
  frames: { p: [number, number, number]; q: [number, number, number, number] }[];
}

const FIELD_OF_VIEW = 28;

/** Tileable noise waves drawn in code (her Swamp Water uses a Noise texture as bump), no extra download. */
function rippleNormals() {
  const size = 512;
  // Periodic value noise: random heights on a wrapping grid, smoothly blended, three octaves.
  const octave = (cells: number, seed: number) => {
    const values = Array.from({ length: cells * cells }, (_, i) => {
      const x = Math.sin((i + 1) * 12.9898 + seed * 78.233) * 43758.5453;
      return x - Math.floor(x);
    });
    const at = (x: number, y: number) => values[((y % cells) + cells) % cells * cells + ((x % cells) + cells) % cells];
    const smooth = (t: number) => t * t * (3 - 2 * t);
    return (px: number, py: number) => {
      const fx = px / size * cells, fy = py / size * cells;
      const x0 = Math.floor(fx), y0 = Math.floor(fy);
      const tx = smooth(fx - x0), ty = smooth(fy - y0);
      const top = at(x0, y0) + (at(x0 + 1, y0) - at(x0, y0)) * tx;
      const bottom = at(x0, y0 + 1) + (at(x0 + 1, y0 + 1) - at(x0, y0 + 1)) * tx;
      return top + (bottom - top) * ty;
    };
  };
  const layers = [[octave(6, 1), 0.6], [octave(12, 2), 0.28], [octave(24, 3), 0.12]] as const;
  const height = new Float32Array(size * size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    height[y * size + x] = layers.reduce((sum, [noise, weight]) => sum + noise(x, y) * weight, 0);
  }
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const context = canvas.getContext('2d')!;
  const image = context.createImageData(size, size);
  const h = (x: number, y: number) => height[((y + size) % size) * size + ((x + size) % size)];
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const dx = (h(x + 1, y) - h(x - 1, y)) * 6;
    const dy = (h(x, y + 1) - h(x, y - 1)) * 6;
    const length = Math.hypot(dx, dy, 1);
    const i = (y * size + x) * 4;
    image.data[i] = (-dx / length * 0.5 + 0.5) * 255;
    image.data[i + 1] = (-dy / length * 0.5 + 0.5) * 255;
    image.data[i + 2] = (1 / length * 0.5 + 0.5) * 255;
    image.data[i + 3] = 255;
  }
  context.putImageData(image, 0, 0);
  const texture = new CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(3, 3);
  return texture;
}

/** Smooth shading: each vertex takes the mean normal of the faces meeting there at a gentle angle (hard 90° edges stay sharp). */
function smoothNormals(geometry: BufferGeometry) {
  const position = geometry.getAttribute('position');
  const normal = geometry.getAttribute('normal');
  if (!position || !normal) return;
  const groups = new Map<string, number[]>();
  for (let i = 0; i < position.count; i++) {
    const key = [position.getX(i), position.getY(i), position.getZ(i)].map(value => value.toFixed(4)).join();
    (groups.get(key) ?? groups.set(key, []).get(key)!).push(i);
  }
  const smooth = new Float32Array(normal.count * 3);
  for (const members of groups.values()) for (const i of members) {
    let x = 0, y = 0, z = 0;
    for (const j of members) {
      const dot = normal.getX(i) * normal.getX(j) + normal.getY(i) * normal.getY(j) + normal.getZ(i) * normal.getZ(j);
      if (dot > 0.5) { x += normal.getX(j); y += normal.getY(j); z += normal.getZ(j); }
    }
    const length = Math.hypot(x, y, z) || 1;
    smooth.set([x / length, y / length, z / length], i * 3);
  }
  geometry.setAttribute('normal', new BufferAttribute(smooth, 3));
}

/** Cylinder wrap: around the side by angle, flat on the end caps, so a grain texture is never stretched. */
function wrapCylinder(geometry: BufferGeometry) {
  geometry.computeBoundingBox();
  const centre = geometry.boundingBox!.getCenter(new Vector3());
  const size = geometry.boundingBox!.getSize(new Vector3());
  const radius = Math.max(size.x, size.z) / 2 || 1;
  const position = geometry.getAttribute('position');
  const normal = geometry.getAttribute('normal');
  const uv = new Float32Array(position.count * 2);
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i) - centre.x, y = position.getY(i) - centre.y, z = position.getZ(i) - centre.z;
    if (Math.abs(normal.getY(i)) > 0.7) uv.set([x / radius * 0.5, z / radius * 0.5], i * 2);
    else uv.set([(Math.atan2(x, z) / Math.PI + 1) * 1.6, y / radius * 0.5], i * 2);
  }
  geometry.setAttribute('uv', new BufferAttribute(uv, 2));
}

/** Cork grain drawn in code: crumbs of light and dark brown, the same in every direction. */
function corkGrain() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const context = canvas.getContext('2d')!;
  context.fillStyle = '#8c6642';
  context.fillRect(0, 0, size, size);
  let seed = 7;
  const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  for (let i = 0; i < 900; i++) {
    const x = random() * size, y = random() * size, r = 1.6 + random() * 3;
    const shade = random();
    context.fillStyle = shade < 0.45 ? `rgba(96, 66, 40, ${0.2 + random() * 0.2})` : `rgba(176, 138, 98, ${0.15 + random() * 0.2})`;
    // Drawn on all four sides of the tile too, so the grain repeats without a seam.
    for (const [dx, dy] of [[0, 0], [size, 0], [-size, 0], [0, size], [0, -size]]) {
      context.beginPath();
      context.arc(x + dx, y + dy, r, 0, Math.PI * 2);
      context.fill();
    }
  }
  const texture = new CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/** Saturated main colour of a baked texture (its bright, non-black pixels), for parts that glow evenly. */
function averageColour(image: CanvasImageSource) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 32;
  const context = canvas.getContext('2d', { willReadFrequently: true })!;
  context.drawImage(image, 0, 0, 32, 32);
  const data = context.getImageData(0, 0, 32, 32).data;
  let r = 0, g = 0, b = 0;
  for (let i = 0; i < data.length; i += 4) {
    const weight = Math.max(data[i], data[i + 1], data[i + 2]) / 255;
    r += data[i] * weight; g += data[i + 1] * weight; b += data[i + 2] * weight;
  }
  const top = Math.max(r, g, b) || 1;
  // Keep the hue strong (turquoise, pink, violet): the baked edges are pale, the crystal body is not.
  const colour = new Color(r / top, g / top, b / top);
  const hsl = colour.getHSL({ h: 0, s: 0, l: 0 });
  return colour.setHSL(hsl.h, Math.max(hsl.s, 0.85), 0.6).convertSRGBToLinear();
}

/** Crystal texture with its dark middle filled by its own colour, so the body glows and keeps its iridescent facets. */
function litFromInside(texture: Texture, tint?: Color) {
  const image = texture.image as CanvasImageSource & { width: number; height: number };
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext('2d', { willReadFrequently: true })!;
  context.drawImage(image, 0, 0);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
  const glow = (tint ? tint.clone() : averageColour(image)).convertLinearToSRGB();
  const fill = [glow.r * 255, glow.g * 255, glow.b * 255];
  const data = pixels.data;
  for (let i = 0; i < data.length; i += 4) {
    const light = Math.max(data[i], data[i + 1], data[i + 2]) / 255;
    // Dark texels take most of the glow colour, bright facets keep their own.
    const share = Math.min(1, 0.6 + 0.4 * (1 - light));
    for (let c = 0; c < 3; c++) data[i + c] = data[i + c] * (1 - share) + fill[c] * share;
  }
  context.putImageData(pixels, 0, 0);
  const lit = new CanvasTexture(canvas);
  lit.flipY = texture.flipY;
  lit.colorSpace = texture.colorSpace;
  lit.wrapS = texture.wrapS;
  lit.wrapT = texture.wrapT;
  lit.channel = texture.channel;
  return lit;
}

/** Loads a baked model and draws it only when asked, so an idle page uses no GPU time. */
export async function createViewer({ container, url, camera: blenderCamera, fit, lift, gain = 1, path, world, worldTurn = 0, pitch: pitchDegrees, glow = 0, focus = 0, light, lampPower = 8, lampTint, envLight = 1, glowParts, tone, startAt = 0, glowTints, matte = false, fill = 0, smoothParts, shadowSoftness = 0, innerGlow, corkParts, sideGlow, toneMapping = 'agx', exposure = 1, worldLight = 1, rims, onProgress }: ViewerOptions) {
  const renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = NoToneMapping;
  renderer.domElement.className = 'lab-canvas';
  container.append(renderer.domElement);

  const scene = new Scene();
  const pivot = new Group();
  const camera = new PerspectiveCamera(FIELD_OF_VIEW, 1, 0.05, 50);
  scene.add(pivot);

  // Glow is only added for scenes that had Bloom in Blender: it costs an extra pass per frame.
  let composer: EffectComposer | null = null;
  if (glow) {
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(new Vector2(256, 256), glow, 0.55, 0.82));
    composer.addPass(new OutputPass());
  }
  const paint = () => {
    // Water ripples drift slowly each time the scene is drawn.
    if (ripples) ripples.offset.set(performance.now() * 0.000012, performance.now() * 0.000008);
    if (composer) composer.render(); else renderer.render(scene, camera);
  };
  const fitCanvas = (width: number, height: number) => {
    renderer.setSize(width, height, false);
    composer?.setSize(width, height);
  };

  const draco = new DRACOLoader().setDecoderPath('/lab-3d/draco/');
  const gltf = await new GLTFLoader().setDRACOLoader(draco).loadAsync(url, event => {
    if (event.total) onProgress?.(event.loaded / event.total);
  });
  draco.dispose();

  // Baked textures already hold the Blender lighting, so they are drawn without lights.
  let ripples: CanvasTexture | null = null;
  // Glowing grass, tinted after load by which side of the first view it stands on.
  const sideParts: Mesh[] = [];
  let glass = false;
  let water = false;
  if (light) {
    // Live light: keep the materials exported from Blender and let the lamps and the world light them.
    renderer.toneMapping = AgXToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    const hdr = await new RGBELoader().loadAsync(light);
    hdr.mapping = EquirectangularReflectionMapping;
    scene.environment = hdr;
    scene.environmentRotation.y = worldTurn;
    scene.environmentIntensity = envLight;
    const glowing = glowParts ? new RegExp(glowParts) : null;
    const smoothing = smoothParts ? new RegExp(smoothParts) : null;
    const corking = corkParts ? new RegExp(corkParts) : null;
    const sideTinting = sideGlow ? new RegExp(sideGlow.parts) : null;
    if (toneMapping === 'aces') renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = exposure;
    let crystals = 0;
    const toned = new Set<Material>();
    const lamps: Light[] = [];
    gltf.scene.traverse(object => {
      if (object instanceof Light) lamps.push(object);
      if (!(object instanceof Mesh)) return;
      object.castShadow = true;
      object.receiveShadow = true;
      const name = (object.material as Material).name || '';
      if (/water/i.test(name)) {
        // Live water: rippling, see-through, and reflecting the world.
        ripples = rippleNormals();
        object.material = new MeshPhysicalMaterial({ color: new Color('#1d4515'), roughness: 0.06, metalness: 0, transmission: 0.1, specularIntensity: 0.1, thickness: 1, ior: 1.4, attenuationColor: new Color('#16380f'), attenuationDistance: 0.35, normalMap: ripples, normalScale: new Vector2(0.35, 0.35), envMapIntensity: 0.35 });
        object.castShadow = false;
        // A shadow on the water drew a dark double outline under the boat.
        object.receiveShadow = false;
      } else if (/glass/i.test(name)) {
        // Plain see-through glass: three.js refraction blurs and whitens whatever is behind it (the dark potion turned milky).
        // Dark smoky glass, like her Blender bottle: visible on its own, the potion still glowing through it.
        object.material = new MeshPhysicalMaterial({ color: new Color('#100f15'), roughness: 0.04, metalness: 0, transparent: true, opacity: 0.45, depthWrite: false, clearcoat: 0.6, clearcoatRoughness: 0.04, specularIntensity: 0.7, envMapIntensity: 0.55 });
        object.castShadow = false;
      } else if (/-liquid$/.test(name)) {
        // Live liquid: its own glow (baked) inside a coloured, see-through body.
        const glowMap = (object.material as MeshPhysicalMaterial).emissiveMap;
        object.material = new MeshPhysicalMaterial({ color: new Color('#6a0a52'), roughness: 0.12, metalness: 0, emissive: new Color('#ff36c8'), emissiveMap: glowMap, emissiveIntensity: 2.6, clearcoat: 0.6, clearcoatRoughness: 0.05, iridescence: 0.3, iridescenceIOR: 1.4, envMapIntensity: 0.3 });
        object.castShadow = false;
        if (innerGlow) {
          // The potion lights its glass and the table around it, as its emission does in Eevee.
          const centre = new Box3().setFromObject(object).getCenter(new Vector3());
          const glowLight = new PointLight(new Color(innerGlow.color), innerGlow.power, 0, 2);
          glowLight.position.copy(centre);
          scene.add(glowLight);
        }
      } else if (/-baked$/.test(name)) {
        const glowMap = (object.material as MeshPhysicalMaterial).emissiveMap;
        if (glowing?.test(name) && glowMap) {
          // Crystals: the bake only lights their edges, so fill the whole body with a colour, bright enough to bloom.
          const tint = glowTints?.length ? new Color(glowTints[crystals++ % glowTints.length]) : undefined;
          object.material = new MeshBasicMaterial({ map: litFromInside(glowMap, tint), color: new Color(1.25, 1.25, 1.25), toneMapped: true });
        } else object.material = new MeshBasicMaterial({ map: glowMap, toneMapped: true });
        object.castShadow = false;
      } else {
        // Plain materials must not turn see-through or glassy on the site.
        const plain = object.material as MeshPhysicalMaterial;
        const factor = Object.entries(tone ?? {}).find(([pattern]) => new RegExp(pattern).test(name))?.[1];
        if (factor && !toned.has(plain)) { plain.color.multiplyScalar(factor); toned.add(plain); }
        if ('transmission' in plain && plain.transmission > 0) { plain.transmission = 0; plain.needsUpdate = true; }
        if (matte && !toned.has(plain)) {
          // Low poly leaves catch the sun on every facet and sparkle: Blender showed them soft.
          plain.roughness = Math.max(plain.roughness, 0.92);
          if ('specularIntensity' in plain) plain.specularIntensity = 0.15;
          plain.envMapIntensity = 0.7;
        }
        if (smoothing?.test(object.name)) smoothNormals(object.geometry);
        if (corking?.test(object.name)) {
          // Cork drawn with its own even grain wrapped around the cylinder: the baked one streaked as the view turned.
          wrapCylinder(object.geometry);
          object.material = new MeshStandardMaterial({ map: corkGrain(), roughness: 0.9, metalness: 0 });
          object.castShadow = false;
          object.receiveShadow = false;
        }
        if (sideTinting?.test(name)) sideParts.push(object);
      }
    });
    // Soft fill from all around, so the side away from the lamps is dim instead of black.
    if (fill) scene.add(new HemisphereLight(new Color('#fff0dc'), new Color('#3b2a22'), fill));
    rims?.forEach(({ color, angle, power }) => {
      const rim = new DirectionalLight(new Color(color), power);
      rim.position.set(Math.sin(angle), 0.35, Math.cos(angle));
      scene.add(rim);
    });
    // The glTF exporter turns Blender watts into candela at 683 lm/W, far brighter than Blender shows them.
    // Undo that factor so a 1000 W lamp looks as it does in her scenes.
    lamps.forEach(lamp => {
      lamp.intensity = lamp.intensity / 683 * lampPower;
      if (lampTint) lamp.color.multiply(new Color(lampTint));
      // Spot lights fade softly at their edge, so no hard crescent of light on the table.
      if ('penumbra' in lamp) lamp.penumbra = 1;
    });
    // Shadows cost a full render per lamp (six for a point light): only the two strongest lamps cast them.
    lamps.sort((a, b) => b.intensity - a.intensity).slice(0, 2).forEach(lamp => {
      if (!('shadow' in lamp) || !lamp.shadow) return;
      lamp.castShadow = true;
      lamp.shadow.mapSize.set(2048, 2048);
      lamp.shadow.bias = -0.0005;
      // Stops shadow speckles crawling over small curved parts (the cork) while the view turns.
      lamp.shadow.normalBias = shadowSoftness;
      lamp.shadow.radius = 4;
    });
  }
  if (!light) gltf.scene.traverse(object => {
    if (!(object instanceof Mesh)) return;
    const source = object.material as Material & { map?: MeshBasicMaterial['map'] };
    if (object.name.startsWith('baked')) {
      // toneMapped: false keeps the colours exactly as baked, even when glass switches tone mapping on.
      object.material = new MeshBasicMaterial({ map: source.map ?? null, side: DoubleSide, color: new Color(gain, gain, gain), toneMapped: false });
    } else if (/water/i.test(source.name)) {
      // Live water: dark, slightly see-through, and reflecting the 360 world.
      water = true;
      object.material = new MeshPhysicalMaterial({ color: new Color('#1d6f78'), roughness: 0.18, metalness: 0, transparent: true, opacity: 0.9, clearcoat: 0.5, clearcoatRoughness: 0.1, envMapIntensity: 0.15, emissive: new Color('#0a3f47'), emissiveIntensity: 0.6 });
    } else {
      // Real glass: it bends and tints what is behind it instead of fading it.
      glass = true;
      object.material = new MeshPhysicalMaterial({ color: new Color('#f4f8ff'), roughness: 0.04, metalness: 0, transmission: 1, thickness: 0.35, ior: 1.5, specularIntensity: 1, clearcoat: 0.6, clearcoatRoughness: 0.05, attenuationColor: new Color('#dfe9ff'), attenuationDistance: 2.5, envMapIntensity: 1.2 });
    }
    source.dispose();
  });
  if (glass) {
    const environment = new PMREMGenerator(renderer);
    scene.environment = environment.fromScene(new RoomEnvironment()).texture;
    environment.dispose();
    renderer.toneMapping = ACESFilmicToneMapping;
  }

  if (world) {
    const texture = await new TextureLoader().loadAsync(world);
    texture.mapping = EquirectangularReflectionMapping;
    texture.colorSpace = SRGBColorSpace;
    scene.background = texture;
    scene.backgroundIntensity = worldLight;
    scene.backgroundRotation.y = worldTurn;
    if (water) { scene.environment = texture; scene.environmentRotation.y = worldTurn; }
  }

  // Centre on the bounding sphere so every model turns around its own middle.
  if (path) {
    // Her camera turns in small jerks between frames (hidden by motion blur in the video):
    // average each rotation with its neighbours so the flight is smooth.
    const raw = path.frames.map(frame => new Quaternion().fromArray(frame.q));
    const flight: CameraPath = { ...path, frames: path.frames.map((frame, i) => {
      const sum = new Quaternion(0, 0, 0, 0);
      for (let k = -4; k <= 4; k++) {
        const q = raw[Math.max(0, Math.min(raw.length - 1, i + k))].clone();
        if (q.dot(raw[i]) < 0) q.set(-q.x, -q.y, -q.z, -q.w);
        sum.set(sum.x + q.x, sum.y + q.y, sum.z + q.z, sum.w + q.w);
      }
      return { p: frame.p, q: sum.normalize().toArray() as [number, number, number, number] };
    }) };
    pivot.add(gltf.scene);
    camera.fov = path.fov;
    camera.far = 2000;
    camera.near = 0.2;
    const size = () => {
      const width = container.offsetWidth;
      const height = container.offsetHeight;
      if (!width || !height) return;
      fitCanvas(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      paint();
    };
    const from = new Quaternion();
    const to = new Quaternion();
    /** Moves along the Blender camera animation, from 0 to 1. */
    const seek = (share: number) => {
      const position = Math.max(0, Math.min(1, share)) * (flight.frames.length - 1);
      const index = Math.min(Math.floor(position), flight.frames.length - 2);
      const blend = position - index;
      const a = flight.frames[index];
      const b = flight.frames[index + 1];
      camera.position.set(a.p[0] + (b.p[0] - a.p[0]) * blend, a.p[1] + (b.p[1] - a.p[1]) * blend, a.p[2] + (b.p[2] - a.p[2]) * blend);
      camera.quaternion.copy(from.fromArray(a.q).slerp(to.fromArray(b.q), blend));
      paint();
    };
    // Free 360°: the camera circles the model at the height of the middle of the Blender path.
    const sphere = new Box3().setFromObject(gltf.scene).getBoundingSphere(new Sphere());
    const middle = path.frames[Math.floor(path.frames.length / 2)].p;
    const pitch = Math.atan2(middle[1] - sphere.center.y, Math.hypot(middle[0] - sphere.center.x, middle[2] - sphere.center.z));
    const orbitDistance = sphere.radius * 0.78 / Math.sin((path.fov / 2) * Math.PI / 180);
    const startAngle = Math.atan2(middle[0] - sphere.center.x, middle[2] - sphere.center.z);
    /** Circles the model; angle in radians (0 = middle of the Blender path), height in radians above the horizon, zoom 1 = default distance. */
    const orbit = (angle: number, height = pitch, zoom = 1) => {
      const turn = startAngle + angle;
      const distance = orbitDistance * zoom;
      // Zooming moves towards the focus point, so the stones grow instead of the rock underneath.
      const target = sphere.center.clone().setY(sphere.center.y + sphere.radius * focus);
      camera.position.set(
        target.x + Math.sin(turn) * Math.cos(height) * distance,
        target.y + Math.sin(height) * distance,
        target.z + Math.cos(turn) * Math.cos(height) * distance,
      );
      camera.lookAt(target);
      paint();
    };
    // The 360° view starts exactly where her Blender camera starts, so the page opens on her framing.
    const first = path.frames[Math.round(startAt * (path.frames.length - 1))].p;
    const focusPoint = sphere.center.clone().setY(sphere.center.y + sphere.radius * focus);
    const offset = new Vector3(first[0], first[1], first[2]).sub(focusPoint);
    const orbitStart = {
      angle: Math.atan2(offset.x, offset.z) - startAngle,
      height: Math.asin(offset.y / offset.length()),
      zoom: offset.length() / orbitDistance,
    };
    if (sideGlow) {
      // Left and right as seen from her Blender camera, facing the castle door.
      const front = path.frames[0].p;
      const toCamera = new Vector3(front[0], front[1], front[2]).sub(focusPoint);
      const right = toCamera.clone().negate().cross(new Vector3(0, 1, 0)).normalize();
      sideParts.forEach(part => {
        const where = new Box3().setFromObject(part).getCenter(new Vector3()).sub(focusPoint);
        const material = (part.material as MeshStandardMaterial).clone();
        material.emissive = new Color(where.dot(right) > 0 ? sideGlow.right : sideGlow.left);
        // Her grass glowed through its whole blade in Blender, so the colour is not darkened by its texture.
        material.emissiveMap = null;
        material.emissiveIntensity = sideGlow.power ?? 1.4;
        part.material = material;
      });
    }
    new ResizeObserver(size).observe(container);
    seek(0);
    size();
    return { seek, orbit, orbitHeight: pitch, orbitStart, turn() {}, zoom() {}, triangles: renderer.info.render.triangles };
  }

  const bounds = new Box3().setFromObject(gltf.scene);
  const sphere = bounds.getBoundingSphere(new Sphere());
  gltf.scene.position.sub(sphere.center);
  const scale = 1 / sphere.radius;
  gltf.scene.position.multiplyScalar(scale);
  gltf.scene.scale.multiplyScalar(scale);
  // Shrinking the scene brings the lamps closer: they fade with distance squared, so dim them back.
  gltf.scene.traverse(object => {
    if (object instanceof Light && 'decay' in object) { const lamp = object as unknown as { intensity: number; distance: number }; lamp.intensity *= scale * scale; if (lamp.distance) lamp.distance *= scale; }
  });
  pivot.add(gltf.scene);

  const [x, y, z] = blenderCamera;
  const startYaw = Math.atan2(-x, -y);
  // A low camera keeps the horizon in the frame, so the 360 world shows sky and mountains, not only ground.
  const pitch = pitchDegrees === undefined ? Math.atan2(z, Math.hypot(x, y)) : pitchDegrees * Math.PI / 180;
  const base = fit / Math.sin((FIELD_OF_VIEW / 2) * Math.PI / 180);
  let zoom = 1;

  function place() {
    const distance = base * zoom;
    camera.position.set(0, Math.sin(pitch) * distance + lift, Math.cos(pitch) * distance);
    camera.lookAt(new Vector3(0, lift, 0));
  }
  function render() { paint(); }
  function resize() {
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    if (!width || !height) return;
    fitCanvas(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    render();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(container);
  place();
  pivot.rotation.y = startYaw;
  resize();

  return {
    seek() {},
    orbit(_angle: number, _height?: number, _zoom?: number) {},
    orbitHeight: 0,
    orbitStart: { angle: 0, height: 0, zoom: 1 },
    /** Rotation in radians, relative to the view of the Blender camera. */
    turn(angle: number) {
      pivot.rotation.y = startYaw + angle;
      // The 360 world turns with the island, so the sunset stays behind the same side.
      scene.backgroundRotation.y = worldTurn + startYaw + angle;
      render();
    },
    zoom(value: number) { zoom = value; place(); render(); },
    triangles: renderer.info.render.triangles,
  };
}

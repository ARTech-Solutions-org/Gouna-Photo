const OUT_W = 1200;
const OUT_H = 1800;
const PAD = 54;
const FOOTER_H = 240;
const GOLD = '#c9a227';

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
    if (h < 0) h += 1;
  }
  return [h, max === 0 ? 0 : d / max, max];
}

function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: return [v, t, p];
    case 1: return [q, v, p];
    case 2: return [p, v, t];
    case 3: return [p, q, v];
    case 4: return [t, p, v];
    default: return [v, p, q];
  }
}

// لون الإطار مأخوذ من أسفل الصورة ومغمّق، عشان لوجو المهرجان (الفاتح) يبان
function adaptiveColor(photo: HTMLImageElement): string {
  const c = document.createElement('canvas');
  c.width = 32;
  c.height = 4;
  const x = c.getContext('2d')!;
  const sy = photo.naturalHeight * 0.88;
  x.drawImage(photo, 0, sy, photo.naturalWidth, photo.naturalHeight - sy, 0, 0, 32, 4);
  const d = x.getImageData(0, 0, 32, 4).data;
  let r = 0, g = 0, b = 0;
  const n = d.length / 4;
  for (let i = 0; i < d.length; i += 4) {
    r += d[i]; g += d[i + 1]; b += d[i + 2];
  }
  const [h, s, v] = rgbToHsv(r / n / 255, g / n / 255, b / n / 255);
  const [R, G, B] = hsvToRgb(h, Math.min(s, 0.6), Math.min(v, 0.16));
  return `rgb(${Math.round(R * 255)},${Math.round(G * 255)},${Math.round(B * 255)})`;
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** يرجّع الصورة النهائية داخل إطار بمقاس ثابت 1200x1800 مع اللوجوهات */
export async function framePhoto(photoDataUrl: string): Promise<string> {
  const [photo, gouna, bank] = await Promise.all([
    loadImage(photoDataUrl),
    loadImage('/elements/title.png'),
    loadImage('/elements/compound_path.png'),
  ]);

  const canvas = document.createElement('canvas');
  canvas.width = OUT_W;
  canvas.height = OUT_H;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // الخلفية
  ctx.fillStyle = adaptiveColor(photo);
  ctx.fillRect(0, 0, OUT_W, OUT_H);

  // خط دهبي رفيع حوالين الطباعة كلها
  const o = Math.round(PAD * 0.35);
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 3;
  ctx.strokeRect(o, o, OUT_W - o * 2, OUT_H - o * 2);

  // الصورة: تتظبط جوه مساحة ثابتة من غير قص أو تمطيط
  const boxX = PAD;
  const boxY = PAD;
  const boxW = OUT_W - PAD * 2;
  const boxH = OUT_H - PAD * 2 - FOOTER_H;
  const scale = Math.min(boxW / photo.naturalWidth, boxH / photo.naturalHeight);
  const dw = Math.round(photo.naturalWidth * scale);
  const dh = Math.round(photo.naturalHeight * scale);
  const dx = Math.round(boxX + (boxW - dw) / 2);
  const dy = Math.round(boxY + (boxH - dh) / 2);
  ctx.drawImage(photo, dx, dy, dw, dh);

  // خط دهبي حوالين الصورة
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 3;
  ctx.strokeRect(dx - 1.5, dy - 1.5, dw + 3, dh + 3);

  // الفوتر واللوجوهات (حجمها ومكانها ثابتين)
  const fy = OUT_H - PAD - FOOTER_H;
  const ip = FOOTER_H * 0.16;
  const gH = FOOTER_H - ip * 2;
  const gW = gH * (gouna.naturalWidth / gouna.naturalHeight);
  ctx.drawImage(gouna, PAD + ip, fy + ip, gW, gH);

  const bH = gH * 0.5;
  const bW = bH * (bank.naturalWidth / bank.naturalHeight);
  const pp = bH * 0.28;
  const plW = bW + pp * 2;
  const plH = bH + pp * 2;
  const plX = OUT_W - PAD - ip - plW;
  const plY = fy + (FOOTER_H - plH) / 2;

  ctx.fillStyle = '#f4eedf';
  roundedRect(ctx, plX, plY, plW, plH, plH * 0.18);
  ctx.fill();
  ctx.drawImage(bank, plX + pp, plY + pp, bW, bH);

  return canvas.toDataURL('image/jpeg', 0.95);
}

// Генерирует все PNG-иконки PWA и favicon.ico из одного inline SVG-исходника.
// Запуск: node scripts/generate-icons.mjs

import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const publicDir = join(root, "public");
const appDir = join(root, "src", "app");

const BACKGROUND = "#121113";
const GOLD = "#A8834A";
const ACCENT = "#8B2635";

// Центральная эмблема: тот же язык, что у CardBack/RoleIcon — кольца + ромб.
// Всё содержимое укладывается в ~74% холста, что удовлетворяет safe zone
// maskable-иконок (требуется <=80%).
function emblemSvg(size) {
  const c = size / 2;
  const outerR = size * 0.37;
  const innerR = size * 0.27;
  const d = size * 0.155;

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="${BACKGROUND}" />
    <circle cx="${c}" cy="${c}" r="${outerR}" fill="none" stroke="${GOLD}" stroke-width="${size * 0.027}" />
    <circle cx="${c}" cy="${c}" r="${innerR}" fill="none" stroke="${GOLD}" stroke-width="${size * 0.014}" />
    <path d="M ${c} ${c - d} L ${c + d} ${c} L ${c} ${c + d} L ${c - d} ${c} Z" fill="${ACCENT}" />
  </svg>`;
}

async function renderPng(size, outPath, { flatten = false } = {}) {
  const svg = Buffer.from(emblemSvg(size));
  let image = sharp(svg, { density: 384 }).resize(size, size);

  if (flatten) {
    image = image.flatten({ background: BACKGROUND });
  }

  const buffer = await image.png().toBuffer();
  await writeFile(outPath, buffer);
  console.log(`wrote ${outPath} (${size}x${size}${flatten ? ", no alpha" : ""})`);
}

function icoDirEntry({ width, height, size, offset }) {
  const entry = Buffer.alloc(16);
  entry.writeUInt8(width >= 256 ? 0 : width, 0);
  entry.writeUInt8(height >= 256 ? 0 : height, 1);
  entry.writeUInt8(0, 2); // colorCount
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // planes
  entry.writeUInt16LE(32, 6); // bitCount
  entry.writeUInt32LE(size, 8); // bytesInRes
  entry.writeUInt32LE(offset, 12); // imageOffset
  return entry;
}

async function buildFavicon(sizes, outPath) {
  const images = [];
  for (const size of sizes) {
    const svg = Buffer.from(emblemSvg(size));
    const png = await sharp(svg, { density: 384 }).resize(size, size).png().toBuffer();
    images.push({ size, png });
  }

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4); // count

  let offset = 6 + images.length * 16;
  const dirEntries = [];
  for (const { size, png } of images) {
    dirEntries.push(icoDirEntry({ width: size, height: size, size: png.length, offset }));
    offset += png.length;
  }

  const buffer = Buffer.concat([header, ...dirEntries, ...images.map((i) => i.png)]);
  await writeFile(outPath, buffer);
  console.log(`wrote ${outPath} (sizes: ${sizes.join(", ")})`);
}

async function main() {
  await mkdir(publicDir, { recursive: true });

  await renderPng(192, join(publicDir, "icon-192.png"));
  await renderPng(512, join(publicDir, "icon-512.png"));
  // Тот же дизайн укладывается в safe zone maskable-иконок без изменений.
  await renderPng(512, join(publicDir, "icon-maskable.png"));
  // iOS не поддерживает альфа-канал у apple-touch-icon — заливаем фон.
  await renderPng(180, join(publicDir, "apple-touch-icon.png"), { flatten: true });

  await buildFavicon([16, 32], join(appDir, "favicon.ico"));
}

main();

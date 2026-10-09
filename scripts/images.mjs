// Gera variantes WebP responsivas a partir de public/images/*.jpg  →  npm run images
import sharp from 'sharp'
import { readdirSync } from 'node:fs'
const dir = 'public/images'
for (const f of readdirSync(dir).filter((f) => /\.jpe?g$/i.test(f))) {
  const name = f.replace(/\.jpe?g$/i, '')
  for (const w of [640, 1280, 1920]) {
    const out = `${dir}/${name}-${w}.webp`
    const info = await sharp(`${dir}/${f}`).resize({ width: w, withoutEnlargement: true }).webp({ quality: 72, effort: 5 }).toFile(out)
    console.log(out, Math.round(info.size / 1024) + 'KB')
  }
}

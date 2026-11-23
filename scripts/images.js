import { mkdir, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourceDir = path.join(root, 'images-src')
const outputDir = path.join(root, 'src/assets/images')

const presets = {
  work: [400, 800],
  post: [160, 320],
  avatar: [96, 192],
}

const formats = {
  avif: (image) => image.avif({ quality: 50, effort: 6 }),
  webp: (image) => image.webp({ quality: 75, effort: 6 }),
  jpg: (image) => image.jpeg({ quality: 78, mozjpeg: true }),
  png: (image) => image.png({ compressionLevel: 9 }),
}

const kb = (bytes) => (bytes / 1024).toFixed(1)

await mkdir(outputDir, { recursive: true })

const files = (await readdir(sourceDir)).filter((file) => file.endsWith('.svg'))
const totals = { avif: 0, webp: 0, jpg: 0, png: 0 }

for (const file of files) {
  const name = path.basename(file, '.svg')
  const preset = presets[name.split('-')[0]]

  if (!preset) {
    console.warn(`skip ${file}: no preset`)
    continue
  }

  for (const width of preset) {
    const sizes = {}

    for (const [format, encode] of Object.entries(formats)) {
      const image = sharp(path.join(sourceDir, file), { density: 144 }).resize({ width })
      const encoded = encode(image)

      if (format === 'png') {
        sizes[format] = (await encoded.toBuffer()).length
      } else {
        await encoded.toFile(path.join(outputDir, `${name}-${width}.${format}`))
        sizes[format] = (await stat(path.join(outputDir, `${name}-${width}.${format}`))).size
      }

      totals[format] += sizes[format]
    }

    console.log(
      `${name}-${width}`.padEnd(18),
      Object.entries(sizes)
        .map(([format, size]) => `${format} ${kb(size)} KB`)
        .join('  '),
    )
  }
}

console.log(
  'TOTAL'.padEnd(18),
  Object.entries(totals)
    .map(([format, size]) => `${format} ${kb(size)} KB`)
    .join('  '),
)

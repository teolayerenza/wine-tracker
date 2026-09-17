import sharp from 'sharp'
import { mkdirSync } from 'node:fs'

mkdirSync('public/icons', { recursive: true })

for (const size of [180, 192, 512]) {
  await sharp('public/logo.svg').resize(size, size).png().toFile(`public/icons/icon-${size}.png`)
}
console.log('Icons generated from public/logo.svg')

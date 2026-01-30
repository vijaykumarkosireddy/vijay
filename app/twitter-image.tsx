import { ImageResponse } from 'next/og'
import OpengraphImage, { alt as ogAlt, size as ogSize, contentType as ogContentType } from './opengraph-image'

export const runtime = 'edge'

export const alt = ogAlt
export const size = ogSize
export const contentType = ogContentType

export default async function Image() {
  return OpengraphImage()
}

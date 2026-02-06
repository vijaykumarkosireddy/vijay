import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import sharp from "sharp"

export async function POST(request: Request) {
  try {
    const data = await request.formData()
    const file: File | null = data.get("file") as unknown as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Check if file is an image
    const isImage = file.type.startsWith("image/")

    // Sanitize filename and add timestamp
    const baseName = file.name.replace(/\s+/g, "-").replace(/\.[^/.]+$/, "")
    const timestamp = Date.now()

    if (isImage) {
      // Process image with sharp for optimization
      const image = sharp(buffer)
      const metadata = await image.metadata()

      // Optimize and save original format
      const optimizedBuffer = await image
        .resize(1920, 1920, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({ quality: 85, progressive: true })
        .toBuffer()

      const fileName = `${timestamp}-${baseName}.jpg`
      const path = join(process.cwd(), "public", "uploads", fileName)
      await writeFile(path, optimizedBuffer)

      // Generate WebP version
      const webpBuffer = await sharp(buffer)
        .resize(1920, 1920, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: 85 })
        .toBuffer()

      const webpFileName = `${timestamp}-${baseName}.webp`
      const webpPath = join(process.cwd(), "public", "uploads", webpFileName)
      await writeFile(webpPath, webpBuffer)

      // Generate blur placeholder (base64)
      const blurBuffer = await sharp(buffer)
        .resize(20, 20, { fit: "inside" })
        .blur()
        .toBuffer()
      const blurDataURL = `data:image/jpeg;base64,${blurBuffer.toString("base64")}`

      return NextResponse.json({
        success: true,
        url: `/uploads/${fileName}`,
        webpUrl: `/uploads/${webpFileName}`,
        blurDataURL,
        width: metadata.width,
        height: metadata.height,
      })
    } else {
      // Non-image file - just save as is
      const fileName = `${timestamp}-${file.name.replace(/\s+/g, "-")}`
      const path = join(process.cwd(), "public", "uploads", fileName)
      await writeFile(path, buffer)

      return NextResponse.json({
        success: true,
        url: `/uploads/${fileName}`,
      })
    }
  } catch (error) {
    console.error("Upload Error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

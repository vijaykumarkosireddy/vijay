import { NextResponse } from "next/server"
import sharp from "sharp"
import clientPromise from "@/lib/mongodb"
import { DB_CONFIG } from "@/constants/database"

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

      // Optimize image
      const optimizedBuffer = await image
        .resize(1920, 1920, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({ quality: 85, progressive: true })
        .toBuffer()

      // Generate WebP version
      const webpBuffer = await sharp(buffer)
        .resize(1920, 1920, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: 85 })
        .toBuffer()

      // Generate blur placeholder
      const blurBuffer = await sharp(buffer)
        .resize(20, 20, { fit: "inside" })
        .blur()
        .toBuffer()

      // Convert to base64
      const jpegBase64 = optimizedBuffer.toString("base64")
      const webpBase64 = webpBuffer.toString("base64")
      const blurBase64 = blurBuffer.toString("base64")

      // Store in MongoDB
      const client = await clientPromise
      const db = client.db(DB_CONFIG.NAME)
      const fileName = `${timestamp}-${baseName}`

      const imageDoc = {
        fileName,
        mimeType: "image/jpeg",
        jpegData: jpegBase64,
        webpData: webpBase64,
        blurData: blurBase64,
        width: metadata.width,
        height: metadata.height,
        uploadedAt: new Date(),
      }

      const result = await db.collection("uploads").insertOne(imageDoc)

      return NextResponse.json({
        success: true,
        url: `/api/image/${result.insertedId}?format=jpeg`,
        webpUrl: `/api/image/${result.insertedId}?format=webp`,
        blurDataURL: `data:image/jpeg;base64,${blurBase64}`,
        width: metadata.width,
        height: metadata.height,
      })
    } else {
      // Non-image file - store as base64
      const base64Data = buffer.toString("base64")
      const fileName = `${timestamp}-${file.name.replace(/\s+/g, "-")}`

      const client = await clientPromise
      const db = client.db(DB_CONFIG.NAME)

      const fileDoc = {
        fileName,
        mimeType: file.type,
        data: base64Data,
        uploadedAt: new Date(),
      }

      const result = await db.collection("uploads").insertOne(fileDoc)

      return NextResponse.json({
        success: true,
        url: `/api/image/${result.insertedId}`,
      })
    }
  } catch (error) {
    console.error("Upload Error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

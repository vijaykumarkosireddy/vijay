import { join } from "path"

export const UPLOAD_CONFIG = {
  // Local development - files stored in public/uploads (ignored by git)
  LOCAL: {
    directory: join(process.cwd(), "public", "uploads"),
    publicPath: "/uploads",
  },

  // Production - you can switch to cloud storage here
  PRODUCTION: {
    directory: join(process.cwd(), "public", "uploads"),
    publicPath: "/uploads",
    // TODO: Add cloud storage config (AWS S3, Cloudinary, etc.)
    // cloudProvider: 'aws-s3' | 'cloudinary' | 'vercel-blob',
    // cloudConfig: { ... }
  },
} as const

export const getUploadConfig = () => {
  const isProduction = process.env.NODE_ENV === "production"
  return isProduction ? UPLOAD_CONFIG.PRODUCTION : UPLOAD_CONFIG.LOCAL
}

export const getUploadPath = (filename: string) => {
  const config = getUploadConfig()
  return join(config.directory, filename)
}

export const getPublicUrl = (filename: string) => {
  const config = getUploadConfig()
  return `${config.publicPath}/${filename}`
}
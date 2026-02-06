import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get("title") || "Vijay Kumar Kosireddy"
    const subtitle = searchParams.get("subtitle") || "Carnatic Music & Pencil Sketch Artist"
    const type = searchParams.get("type") || "default"

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)",
            position: "relative",
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage:
                "radial-gradient(circle at 25% 25%, rgba(197, 160, 89, 0.1) 0%, transparent 50%)",
              opacity: 0.5,
            }}
          />

          {/* Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "80px",
              textAlign: "center",
              zIndex: 1,
            }}
          >
            {/* Icon/Badge */}
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #C5A059 0%, #E8D4A0 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 40,
                fontSize: 60,
                fontWeight: "bold",
                color: "#000",
              }}
            >
              VK
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: 72,
                fontWeight: "900",
                background: "linear-gradient(to right, #ffffff, #C5A059)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                marginBottom: 20,
                maxWidth: "90%",
                lineHeight: 1.2,
              }}
            >
              {title}
            </div>

            {/* Subtitle */}
            <div
              style={{
                fontSize: 32,
                color: "#C5A059",
                fontWeight: "600",
                opacity: 0.9,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              {subtitle}
            </div>

            {/* Type Badge */}
            {type !== "default" && (
              <div
                style={{
                  marginTop: 30,
                  padding: "12px 30px",
                  background: "rgba(197, 160, 89, 0.2)",
                  border: "2px solid rgba(197, 160, 89, 0.4)",
                  borderRadius: 50,
                  fontSize: 24,
                  color: "#C5A059",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                {type}
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              position: "absolute",
              bottom: 40,
              fontSize: 24,
              color: "#666",
              fontWeight: "600",
            }}
          >
            vijaykumarkosireddy.vercel.app
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    return new Response("Failed to generate image", { status: 500 })
  }
}

import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Vijay Kumar Kosireddy - Carnatic Music & Pencil Sketch Artist'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  // Font loading
  const interSemiBold = fetch(
    new URL('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hjp-Ek-_EeA.woff')
  ).then((res) => res.arrayBuffer())

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          fontSize: 60,
          color: 'white',
          background: '#000',
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at center, rgba(197, 160, 89, 0.2) 0%, transparent 70%)',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', zIndex: 10 }}>
          {/* We can't easily load local images in edge runtime without reading file, 
                so we'll use a styled representation or simple text for now if image fetch is complex.
                However, for this design, let's keep it clean with text and gradients.
             */}
          <div
            style={{
              width: 200,
              height: 200,
              borderRadius: 100,
              overflow: 'hidden',
              border: '4px solid #C5A059',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#1a1a1a',
            }}
          >
            <div style={{ fontSize: 80 }}>V</div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 40,
            zIndex: 10,
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: 60, fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1 }}>
            Vijay Kumar Kosireddy
          </div>
          <div style={{ fontSize: 30, color: '#C5A059', marginTop: 20, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
            Artist & Carnatic Music Professional
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Inter',
          data: await interSemiBold,
          style: 'normal',
          weight: 600,
        },
      ],
    }
  )
}

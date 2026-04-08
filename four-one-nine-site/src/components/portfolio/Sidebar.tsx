import { getServerPayload } from '@/lib/payload'
import { getImageUrl } from '@/lib/static-images'
import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'four.one.nine | Portfolio',
  description: 'Creative developer & designer portfolio',
}

export async function Sidebar() {
  let aboutData = null
  
  try {
    const payload = await getServerPayload()
    aboutData = await payload.findGlobal({
      slug: 'about',
    })
  } catch (error) {
    console.warn('Could not fetch About global:', error)
  }

  const photoUrl = getImageUrl(aboutData?.photo)
  const photo = aboutData?.photo as any
  const aspectRatio = photo?.width && photo?.height ? photo.width / photo.height : 1

  return (
    <div className="h-full flex flex-col overflow-hidden p-6 lg:p-8">
      <div className="flex items-center gap-4 pb-6 -mx-6 lg:-mx-8 px-6 lg:px-8 shrink-0" style={{ borderBottom: '1px solid rgba(55, 55, 55, 0.5)' }}>
        <div className="relative w-16 h-16 flex-shrink-0">
          <Image
            src="/logos/Black on Yellow.png"
            alt="four.one.nine"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="flex flex-col">
          <h1 className="font-mono text-2xl lg:text-3xl font-bold tracking-tight" style={{ color: '#373737' }}>
            four.one.nine
          </h1>
        </div>
      </div>

      {photoUrl && (
        <div className="-mx-6 lg:-mx-8 flex-1 min-h-0 overflow-hidden" style={{ borderBottom: '1px solid rgba(55, 55, 55, 0.5)' }}>
          <div className="relative w-full h-full">
            <Image
              src={photoUrl}
              alt={aboutData?.name || 'Portfolio'}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 25vw"
              priority
            />
          </div>
        </div>
      )}

      <div className="shrink-0 py-6 -mx-6 lg:-mx-8 px-6 lg:px-8" style={{ borderBottom: '1px solid rgba(55, 55, 55, 0.5)' }}>
        {aboutData?.blurb ? (
          <p className="text-sm leading-relaxed" style={{ color: '#373737' }}>{aboutData.blurb}</p>
        ) : (
          <p className="text-sm leading-relaxed" style={{ color: '#373737', opacity: 0.7 }}>
            Creative developer and designer based in Chicago. I build digital experiences that blend functionality with aesthetics.
          </p>
        )}
      </div>

      <div className="shrink-0 pt-6">
        <Link
          href="/contact"
          className="get-in-touch"
          style={{ color: '#373737' }}
        >
          Get in touch →
        </Link>
      </div>
    </div>
  )
}

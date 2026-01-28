import { SITE_CONTENT } from "@/constants/content"
import Image from "next/image"
import BookingForm from "@/components/shared/BookingForm"

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20 md:px-12">
      <div className="grid gap-20 lg:grid-cols-2">
        <div className="space-y-12 animate-reveal">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold tracking-tighter md:text-7xl title-reveal">
              Direct Inquiry
            </h1>
            <p className="text-xl text-foreground/60 font-light leading-relaxed max-w-md">
              Whether you're looking for classical music training or a custom graphite commission,
              let's connect.
            </p>
          </div>

          <div className="space-y-12">
            <div className="flex items-start gap-6 group">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl glass-accent text-gold transition-all group-hover:bg-primary group-hover:text-primary-foreground flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div className="space-y-3">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-foreground/40">
                  Phone Enquiries
                </p>
                <div className="space-y-1">
                  {SITE_CONTENT.CONTACT.PHONES.map((phone, i) => (
                    <p key={i} className="text-2xl font-black italic tracking-tighter text-white">
                      {phone}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-6 group">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl glass-accent text-gold transition-all group-hover:bg-primary group-hover:text-primary-foreground flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
              </div>
              <div className="space-y-3">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-foreground/40">
                  Email Correspondence
                </p>
                <div className="space-y-1">
                  {SITE_CONTENT.CONTACT.EMAILS.map((email, i) => (
                    <p key={i} className="text-2xl font-black italic tracking-tighter text-white">
                      {email}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="relative h-64 overflow-hidden rounded-[2.5rem] glass p-8 flex items-end">
            <Image
              src={SITE_CONTENT.BIO.SECONDARY_IMAGE}
              alt="Vijay Artist"
              fill
              className="object-cover opacity-20 transition-opacity hover:opacity-40"
            />
            <div className="relative z-10">
              <p className="text-sm font-bold tracking-widest text-gold uppercase underline underline-offset-8">
                Direct Consultation
              </p>
            </div>
          </div>
        </div>

        <div className="animate-reveal-slow">
          <BookingForm />
        </div>
      </div>
    </div>
  )
}

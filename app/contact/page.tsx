import ContactHero from "@/components/contact/ContactHero"
import ContactInfo from "@/components/contact/ContactInfo"
import BookingForm from "@/components/shared/BookingForm"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact | Vijay Kumar Kosireddy - Get in Touch",
  description: "Contact Vijay Kumar Kosireddy for music lessons, art commissions, or inquiries. Located in Jaggampeta, Andhra Pradesh. Fill out the form or reach out directly for booking and collaboration.",
  keywords: [
    "Contact Vijay Kumar",
    "Music Lessons Inquiry",
    "Art Commission",
    "Carnatic Music  Contact",
    "Pencil Artist Contact",
    "Jaggampeta",
    "Andhra Pradesh",
  ],
  openGraph: {
    title: "Contact | Vijay Kumar Kosireddy",
    description: "Get in touch for music lessons, art commissions, or inquiries",
    url: "https://vijaykumarkosireddy.vercel.app/contact",
    type: "website",
  },
}


export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:px-8 lg:px-12 lg:py-20">
      <div className="grid gap-12 lg:gap-20 lg:grid-cols-2">
        <div className="space-y-8 lg:space-y-12 animate-reveal">
          <ContactHero />
          <ContactInfo />
        </div>

        <div className="animate-reveal-slow">
          <BookingForm />
        </div>
      </div>
    </div>
  )
}

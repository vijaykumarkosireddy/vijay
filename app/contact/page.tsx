import ContactHero from "@/components/contact/ContactHero"
import ContactInfo from "@/components/contact/ContactInfo"
import BookingForm from "@/components/shared/BookingForm"

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

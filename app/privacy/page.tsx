import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Vijay Kumar Kosireddy",
  description:
    "Privacy policy for Vijay Kumar Kosireddy's portfolio website. Learn how we handle your data with care and respect.",
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <div className="space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Privacy <span className="text-gold">Policy</span>
          </h1>
          <p className="text-white/60">Your trust matters to us</p>
        </div>

        <div className="space-y-6 text-white/80 leading-relaxed">
          <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-gold mb-4">Our Commitment to You</h2>
            <p>
              Here, I deeply value the trust you place in me
              when you share your personal information. This privacy policy explains how I collect,
              use, and protect your data when you visit my website or submit an inquiry.
            </p>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-gold mb-4">Information We Collect</h2>
            <p className="mb-4">When you submit an inquiry through our contact form, we collect:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Your name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Area of interest (Music, Art, or General Inquiry)</li>
              <li>Any message you choose to share</li>
            </ul>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-gold mb-4">How We Use Your Information</h2>
            <p className="mb-4">Your information is used solely for the following purposes:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Responding to your inquiries about music collaborations or art commissions</li>
              <li>
                Sending updates about new music performances, art exhibitions, or blog posts (only
                if you opt-in)
              </li>
              <li>Internal record-keeping to improve my services</li>
            </ul>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-2xl p-8 border-l-4 border-l-gold">
            <h2 className="text-xl font-bold text-gold mb-4">Your Data Is Safe With Us</h2>
            <p className="mb-4">
              <strong className="text-white">Important:</strong> We want to assure you that:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                I <strong className="text-white">never</strong> sell your personal information to
                third parties
              </li>
              <li>
                I <strong className="text-white">never</strong> share your data with marketing
                companies or advertisers
              </li>
              <li>
                I <strong className="text-white">only</strong> use your contact information for
                direct communication about my services
              </li>
              <li>Your data is stored securely and accessed only by me</li>
            </ul>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-gold mb-4">Newsletter Subscriptions</h2>
            <p>
              When you submit an inquiry, you have the option to subscribe to our newsletter. This
              is entirely voluntary, and you can unsubscribe at any time. Our newsletters contain
              updates about new music uploads, art pieces, blog posts, and upcoming events. We
              respect your inbox and will not overwhelm you with emails.
            </p>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-gold mb-4">Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Request access to the personal data we hold about you</li>
              <li>Request correction of any inaccurate information</li>
              <li>Request deletion of your data from our records</li>
              <li>Unsubscribe from our newsletter at any time</li>
            </ul>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-gold mb-4">Data Security</h2>
            <p>
              I implement appropriate technical and organizational measures to protect your personal
              data against unauthorized access, alteration, disclosure, or destruction. Your
              information is stored in secure databases with limited access.
            </p>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-gold mb-4">Changes to This Policy</h2>
            <p>
              I may update this privacy policy from time to time. Any changes will be posted on this
              page with an updated revision date. I encourage you to review this policy
              periodically.
            </p>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-gold mb-4">Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or how we handle your data, please
              contact us at:{" "}
              <a href="mailto:vijaykkosireddy@gmail.com" className="text-gold hover:underline">
                vijaykumarkosireddy1@gmail.com
              </a>
            </p>
          </section>

          <p className="text-center text-white/40 text-sm pt-8">
            Last updated: February 2025 | Vijay Kumar Kosireddy
          </p>
        </div>
      </div>
    </div>
  )
}

export const SITE_CONTENT = {
  NAME: "Vijay Kumar Kosireddy",
  SCHOOL_NAME: "Sree Saraswathi Sangeetha Vidhayalam",
  TAGLINE: "Artist & Carnatic Music Professional",

  HERO: {
    TITLE: "VIJAY KUMAR KOSIREDDY",
    SUBTITLE: "Preserving the soulful tradition of Carnatic Music & Masterfully crafting stories through Pencil Sketches.",
    IMAGE: "/vijay-2.png",
  },

  BIO: {
    SUMMARY: "A dedicated Carnatic music professional and professional pencil sketch artist based in Visakhapatnam. Preserving traditional arts through music and realistic graphite sketches.",
    EXTENDED: "With decades of experience in Carnatic music and a passion for fine arts, Vijay Kumar Kosireddy brings a unique blend of sound and vision to his audience.",
    SECONDARY_IMAGE: "/vijay.png",
  },

  CONTACT: {
    PHONES: process.env.NEXT_PUBLIC_PHONES?.split(",") || ["+91 9700346808", "+91 9123456789"],
    EMAILS: process.env.NEXT_PUBLIC_EMAILS?.split(",") || ["vijaykkosireddy@gmail.com", "contact@vignesh.com"],
    LOCATION: "Visakhapatnam, Andhra Pradesh",
  },

  TESTIMONIALS: [
    {
      name: "Ravi Teja",
      role: "Music Enthusiast",
      text: "The depth of understanding Vijay Garu has in Carnatic music is truly exceptional. His dedication to the art form is inspiring."
    },
    {
      name: "Ananya Rao",
      role: "Art Collector",
      text: "I commissioned a portrait and was blown away by the realism. Every detail was captured with such precision and emotion."
    },
    {
      name: "Suresh Kumar",
      role: "Student Parent",
      text: "A wonderful environment for learning traditional arts. The focus on discipline and foundation is what sets this school apart."
    }
  ]
};

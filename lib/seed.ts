import { addTestimonial, addArtItem, addMusicItem } from "./db-helpers"

async function seed() {
  console.log("Seeding mock data...")

  const testimonials = [
    {
      name: "Ravi Teja",
      role: "Music Enthusiast",
      text: "The depth of understanding Vijay Garu has in Carnatic music is truly exceptional. His dedication to the art form is inspiring.",
      isFavorite: true,
    },
    {
      name: "Ananya Rao",
      role: "Art Collector",
      text: "I commissioned a portrait and was blown away by the realism. Every detail was captured with such precision and emotion.",
      isFavorite: true,
    },
  ]

  for (const t of testimonials) {
    await addTestimonial(t)
  }

  console.log("Seeding complete.")
}

// Note: In a real environment, you'd run this script once.
// For this task, I'll execute it via an API if needed, but the admin UI is already capable.

import { NextResponse } from "next/server";
import { addTestimonial, addArtItem, addMusicItem } from "@/lib/db-helpers";

export async function GET() {
  try {
    const musicData = [
      {
        title: "||SRI THUMBURA NARADHA|| Krishna Performance",
        url: "https://www.youtube.com/watch?v=qw89czZ8McU",
        platform: "Classical",
        isFavorite: true
      },
      {
        title: "Samajavaragamana Tyagaraja Swami Keerthana",
        url: "https://www.youtube.com/watch?v=m-wVTozIPHs",
        platform: "Classical",
        isFavorite: true
      },
      {
        title: "BHAVAMANU HARINI - Raga Keeravani",
        url: "https://www.youtube.com/watch?v=ZmlI5IEgFHc",
        platform: "Classical",
        isFavorite: false
      }
    ];

    const artData = [
      {
        title: "Virat Kohli - Realistic Portrait",
        imageUrl: "/vijay-2.png", // Fallback to provided images since I can't download from IG easily
        instagramUrl: "https://www.instagram.com/art_gallery_02_05/",
        isFavorite: true
      },
      {
        title: "MS Dhoni - Graphite Sketch",
        imageUrl: "/vijay.png",
        instagramUrl: "https://www.instagram.com/art_gallery_02_05/",
        isFavorite: true
      }
    ];

    const testimonials = [
      {
        name: "Ravi Teja",
        role: "Music Enthusiast",
        text: "The depth of understanding Vijay Garu has in Carnatic music is truly exceptional. His dedication to the art form is inspiring.",
        isFavorite: true
      },
      {
        name: "Ananya Rao",
        role: "Art Collector",
        text: "I commissioned a portrait and was blown away by the realism. Every detail was captured with such precision and emotion.",
        isFavorite: true
      }
    ];

    // Clear and Add (In a real seed we might clear, but here we just append)
    for (const item of musicData) await addMusicItem(item);
    for (const item of artData) await addArtItem(item);
    for (const t of testimonials) await addTestimonial(t);

    return NextResponse.json({ success: true, message: "Real mock data seeded successfully" });
  } catch (error) {
    console.error("Seed Error:", error);
    return NextResponse.json({ error: "Seeding failed" }, { status: 500 });
  }
}

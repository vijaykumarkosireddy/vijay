"use client";

import { useState, useEffect } from "react";
import { getTestimonials } from "@/lib/db-helpers";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TestimonialsCarousel({ testimonials }: { testimonials: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-rotation logic
  useEffect(() => {
    if (!isHovered && testimonials.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000); // Rotate every 5 seconds

      return () => clearInterval(interval);
    }
  }, [isHovered, testimonials.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  if (testimonials.length === 0) return null;

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Testimonial Card */}
      <div className="glass p-10 md:p-16 rounded-[2.5rem] border-white/5 transition-all bg-white/[0.02] min-h-[400px] flex flex-col justify-between">
        <div className="space-y-8">
          <div className="h-10 w-10 opacity-20 text-gold flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V12C14.017 12.5523 13.5693 13 13.017 13H11.017C10.4647 13 10.017 12.5523 10.017 12V9C10.017 7.34315 11.3601 6 13.017 6H19.017C20.6739 6 22.017 7.34315 22.017 9V15C22.017 16.6569 20.6739 18 19.017 18H17.017C16.4647 18 16.017 18.4477 16.017 19V21H14.017ZM3.01697 21L3.01697 18C3.01697 16.8954 3.91241 16 5.01697 16H8.01697C8.56926 16 9.01697 15.5523 9.01697 15V9C9.01697 8.44772 8.56926 8 8.01697 8H4.01697C3.46468 8 3.01697 8.44772 3.01697 9V12C3.01697 12.5523 2.56925 13 2.01697 13H0.0169678C-0.535317 13 -0.983032 12.5523 -0.983032 12V9C-0.983032 7.34315 0.360114 6 2.01697 6H8.01697C9.67382 6 11.017 7.34315 11.017 9V15C11.017 16.6569 9.67382 18 8.01697 18H6.01697C5.46468 18 5.01697 18.4477 5.01697 19V21H3.01697Z" />
            </svg>
          </div>
          <p className="text-xl md:text-2xl text-white/70 font-light leading-relaxed italic">
            "{currentTestimonial.text}"
          </p>
        </div>

        <div className="mt-12 flex items-center justify-between pt-8 border-t border-white/5">
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 rounded-2xl overflow-hidden border border-white/10 relative bg-black/40 shadow-xl">
              <Image
                src={currentTestimonial.imageUrl || "/vijay.png"}
                alt={currentTestimonial.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h5 className="font-black text-sm uppercase tracking-widest text-white italic">
                {currentTestimonial.name}
              </h5>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gold/40 mt-1">
                {currentTestimonial.role}
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          {testimonials.length > 1 && (
            <div className="flex items-center gap-3">
              <button
                onClick={goToPrevious}
                className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={goToNext}
                className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Pagination Dots */}
      {testimonials.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${index === currentIndex
                  ? "w-8 bg-primary"
                  : "w-2 bg-white/20 hover:bg-white/40"
                }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

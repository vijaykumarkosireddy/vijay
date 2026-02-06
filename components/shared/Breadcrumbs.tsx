"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href: string
}

export default function Breadcrumbs() {
  const pathname = usePathname()

  // Don't show breadcrumbs on home page or admin
  if (pathname === "/" || pathname?.startsWith("/admin")) {
    return null
  }

  // Generate breadcrumb items from pathname
  const paths = pathname?.split("/").filter(Boolean) || []

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    ...paths.map((path, index) => {
      const href = `/${paths.slice(0, index + 1).join("/")}`
      // Capitalize and format label
      const label = path
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
      return { label, href }
    }),
  ]

  // Generate structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: `https://vijaykumarkosireddy.vercel.app${crumb.href}`,
    })),
  }

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Breadcrumb UI */}
      <nav
        className="mb-8 flex items-center gap-2 text-sm text-foreground/60"
        aria-label="Breadcrumb"
      >
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.href} className="flex items-center gap-2">
            {index > 0 && (
              <ChevronLeft className="w-4 h-4 text-gold/40 rotate-180" />
            )}
            {index === breadcrumbs.length - 1 ? (
              <span
                className="font-bold text-gold"
                aria-current="page"
              >
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="hover:text-gold transition-colors font-medium"
              >
                {crumb.label}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </>
  )
}

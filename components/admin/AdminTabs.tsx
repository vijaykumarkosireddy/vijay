"use client"

interface AdminTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function AdminTabs({ activeTab, onTabChange }: AdminTabsProps) {
  const tabs = ["music", "arts", "blogs", "testimonials", "bookings"]

  return (
    <div className="mb-12 grid grid-cols-2 md:flex gap-4 border-b border-border">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-8 py-4 text-xs font-black tracking-[0.3em] uppercase transition-all border-b-2 whitespace-nowrap ${activeTab === tab ? "border-gold text-gold" : "border-transparent text-foreground/30"}`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

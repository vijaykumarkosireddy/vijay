"use client"

import Image from "next/image"

interface DatabaseExplorerProps {
  activeTab: string
  music: { data: any[] }
  arts: { data: any[] }
  testimonials: { data: any[] }
  bookings: { data: any[] }
  onEdit: (item: any) => void
  onToggleFavorite: (collection: string, id: string, currentStatus: boolean) => void
  onDelete: (collection: string, id: string) => void
}

export default function DatabaseExplorer({
  activeTab,
  music,
  arts,
  testimonials,
  bookings,
  onEdit,
  onToggleFavorite,
  onDelete,
}: DatabaseExplorerProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-black uppercase tracking-[0.5em] text-white/20">
          {activeTab === "bookings" ? "Inquiry Database" : "Active Database Explorer"}
        </h2>
        {activeTab === "bookings" && (
          <span className="text-xs font-black text-gold uppercase tracking-widest bg-primary/10 px-4 py-2 rounded-full border border-gold/20">
            {bookings.data.length} Active Inquiries
          </span>
        )}
      </div>

      <div className="grid gap-4">
        {activeTab === "bookings" ? (
          bookings.data.length === 0 ? (
            <div className="glass p-16 rounded-[2rem] text-center">
              <p className="text-white/20 text-sm font-bold uppercase tracking-widest">
                No bookings yet
              </p>
            </div>
          ) : (
            bookings.data.map((b: any) => (
              <div
                key={b._id}
                className="glass p-8 rounded-[2rem] flex justify-between items-start group hover:border-gold/30 transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 uppercase tracking-tighter font-black text-4xl italic select-none">
                  #{b._id.slice(-4)}
                </div>
                <div className="space-y-4 relative z-10">
                  <div>
                    <h4 className="font-black text-xl italic tracking-tighter text-white">
                      {b.name}
                    </h4>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gold opacity-60 mt-1">
                      {b.interest}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-white/40 font-medium">
                      Contact: <span className="text-white/80">{b.email}</span> •{" "}
                      <span className="text-white/80">{b.phone}</span>
                    </p>
                    <p className="text-xs text-white/40 font-medium">
                      Date:{" "}
                      <span className="text-white/60">
                        {new Date(b.createdAt).toLocaleString()}
                      </span>
                    </p>
                  </div>
                  <div className="p-5 bg-black/30 rounded-2xl italic text-sm text-white/70 border-l-2 border-gold/20 leading-relaxed font-light">
                    "{b.message}"
                  </div>
                </div>
              </div>
            ))
          )
        ) : (activeTab === "music"
            ? music.data
            : activeTab === "arts"
              ? arts.data
              : testimonials.data
          ).length === 0 ? (
          <div className="glass p-16 rounded-[2rem] text-center">
            <p className="text-white/20 text-sm font-bold uppercase tracking-widest">
              No items yet. Add one above!
            </p>
          </div>
        ) : (
          (activeTab === "music"
            ? music.data
            : activeTab === "arts"
              ? arts.data
              : testimonials.data
          ).map((item: any) => (
            <div
              key={item._id}
              className="glass p-3 sm:p-4 rounded-[1rem] sm:rounded-[1.5rem] flex flex-col group hover:border-gold/30 transition-all"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl overflow-hidden bg-white/5 flex-shrink-0 border border-white/10 relative group-hover:border-gold/30 transition-all">
                  {item.imageUrl || item.thumbnail ? (
                    <Image
                      src={item.imageUrl || item.thumbnail}
                      alt=""
                      fill
                      className="object-cover transition-transform group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex items-center justify-center p-2 sm:p-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="opacity-20"
                      >
                        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                        <path d="M8 7h6" />
                        <path d="M8 11h8" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black italic tracking-tighter text-white text-xs sm:text-sm truncate leading-tight mb-1">
                    {item.title || item.name}
                  </h4>
                  <p className="text-[8px] sm:text-[9px] uppercase font-black tracking-wider text-white/30 leading-tight">
                    {item.platform || item.role}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 justify-end mt-3 pt-2 border-t border-white/5">
                <button
                  onClick={() => onEdit(item)}
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-gold hover:bg-primary/10 hover:border-gold/30 flex items-center justify-center transition-all group/btn"
                  title="Edit Entry"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </button>
                <button
                  onClick={() => onToggleFavorite(activeTab, item._id, item.isFavorite)}
                  className={`h-8 w-8 sm:h-9 sm:w-9 rounded-lg flex items-center justify-center transition-all group/btn relative ${item.isFavorite ? "bg-primary/20 border border-gold text-gold shadow-lg shadow-gold/30" : "bg-white/5 border border-white/20 text-white/40 hover:text-gold hover:bg-primary/10 hover:border-gold/40"}`}
                  title={item.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill={item.isFavorite ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="transition-transform group-hover/btn:scale-110"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                  {item.isFavorite && (
                    <div className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full animate-pulse" />
                  )}
                </button>
                <button
                  onClick={() => onDelete(activeTab, item._id)}
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-red-500/5 border border-red-500/20 text-red-400/60 hover:bg-red-500 hover:text-white hover:border-red-500 flex items-center justify-center transition-all group/btn"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="transition-transform group-hover/btn:scale-110"
                  >
                    <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

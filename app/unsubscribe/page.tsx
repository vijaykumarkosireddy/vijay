"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

function UnsubscribeContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  
  const [status, setStatus] = useState<"loading" | "success" | "error" | "no-email">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!email) {
      setStatus("no-email")
      return
    }

    const unsubscribe = async () => {
      try {
        const response = await fetch(`/api/newsletter?email=${encodeURIComponent(email)}`, {
          method: "DELETE",
        })

        const data = await response.json()

        if (response.ok) {
          setStatus("success")
          setMessage(data.message || "You have been successfully unsubscribed.")
        } else {
          setStatus("error")
          setMessage(data.error || "Failed to unsubscribe. Please try again.")
        }
      } catch (error) {
        setStatus("error")
        setMessage("Something went wrong. Please try again later.")
      }
    }

    unsubscribe()
  }, [email])

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto text-center">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-gold/10 flex items-center justify-center mb-6">
            <Mail className="w-10 h-10 text-gold" />
          </div>
          
          <h1 className="text-3xl font-black mb-4">
            {status === "success" ? (
              <>
                Successfully <span className="text-gold">Unsubscribed</span>
              </>
            ) : status === "no-email" ? (
              <>
                Unsubscribe <span className="text-gold">Page</span>
              </>
            ) : status === "error" ? (
              <>
                Something Went <span className="text-red-400">Wrong</span>
              </>
            ) : (
              <>
                Processing <span className="text-gold">Request</span>
              </>
            )}
          </h1>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
          {status === "loading" && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 text-gold animate-spin" />
              <p className="text-white/60">Processing your unsubscribe request...</p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center gap-4">
              <CheckCircle className="w-12 h-12 text-green-400" />
              <p className="text-white/80">{message}</p>
              <p className="text-sm text-white/40">
                You will no longer receive email updates from us.
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center gap-4">
              <AlertCircle className="w-12 h-12 text-red-400" />
              <p className="text-white/80">{message}</p>
              {email && (
                <button
                  onClick={() => window.location.reload()}
                  className="text-gold hover:underline text-sm"
                >
                  Try again
                </button>
              )}
            </div>
          )}

          {status === "no-email" && (
            <div className="text-left space-y-4">
              <p className="text-white/80">
                To unsubscribe, please use the link provided in one of our emails, or contact us directly.
              </p>
              <div className="pt-4 border-t border-white/10">
                <p className="text-sm text-white/60 mb-2">Contact us to unsubscribe:</p>
                <a 
                  href="mailto:vijaykkosireddy@gmail.com?subject=Unsubscribe%20Request" 
                  className="text-gold hover:underline"
                >
                  vijaykkosireddy@gmail.com
                </a>
              </div>
            </div>
          )}
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
        >
          ← Return to homepage
        </Link>
      </div>
    </div>
  )
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
          <p className="text-white/60">Loading...</p>
        </div>
      </div>
    }>
      <UnsubscribeContent />
    </Suspense>
  )
}

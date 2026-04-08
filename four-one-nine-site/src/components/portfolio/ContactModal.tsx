'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export function ContactModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  if (pathname === '/contact' && !isOpen) {
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData(e.currentTarget)
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          subject: formData.get('subject'),
          message: formData.get('message'),
        }),
      })

      if (res.ok) {
        setSubmitted(true)
        setTimeout(() => {
          setIsOpen(false)
          setSubmitted(false)
          router.push('/')
        }, 3000)
      }
    } catch (error) {
      console.error('Contact submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-dark/90 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-8 space-y-6 relative">
        <button
          onClick={() => {
            setIsOpen(false)
            router.push('/')
          }}
          className="absolute top-4 right-4 text-dark/50 hover:text-dark text-2xl"
        >
          ×
        </button>

        {submitted ? (
          <div className="text-center space-y-4">
            <h3 className="font-mono text-2xl font-bold text-primary">
              Thank you!
            </h3>
            <p>Your message has been sent successfully.</p>
          </div>
        ) : (
          <>
            <h3 className="font-mono text-2xl font-bold">Get in touch</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-2 rounded-xl border border-dark/20 focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 rounded-xl border border-dark/20 focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input
                  type="text"
                  name="subject"
                  required
                  className="w-full px-4 py-2 rounded-xl border border-dark/20 focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  name="message"
                  rows={4}
                  required
                  className="w-full px-4 py-2 rounded-xl border border-dark/20 focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-dark font-sans font-bold py-3 rounded-xl hover:bg-primary/90 disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send message'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

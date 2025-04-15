'use client'

import { useState } from 'react'

export default function Home() {
  const [url, setUrl] = useState('')
  const [pdfUrl, setPdfUrl] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setPdfUrl('')

    try {
      const res = await fetch('/api/generate-pdf', {
        method: 'POST',
        body: JSON.stringify({ url }),
        headers: { 'Content-Type': 'application/json' },
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Unknown error')
      }

      const blob = await res.blob()
      const blobUrl = URL.createObjectURL(blob)
      setPdfUrl(blobUrl)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Unexpected error occurred')
      }
    }
  }

  return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold mb-4">Generate PDF from URL</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="border border-gray-300 p-2 w-80"
              required
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Generate PDF
          </button>
        </form>

        {pdfUrl && (
            <div className="mt-4">
              <a href={pdfUrl} download="output.pdf" className="text-blue-500 underline">
                Download PDF
              </a>
            </div>
        )}

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </main>
  )
}

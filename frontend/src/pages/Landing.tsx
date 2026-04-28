import { useEffect, useState } from 'react'

export default function Landing() {
  const [stats, setStats] = useState<any>(null)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    fetch('http://127.0.0.1:8001/api/stats')
      .then(r => r.json())
      .then(setStats)
      .catch(e => setError('Backend not running. Start backend on port 8001.'))
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <h1 className="text-6xl font-bold text-[#1b1b1d] mb-4">Synch</h1>
        <p className="text-xl text-[#45464d] mb-8">Find your vibe. Match your wavelength.</p>
        
        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-xl mb-8">
            {error}
          </div>
        )}

        {stats && (
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
            <p className="text-5xl font-bold text-black">{stats.total_users?.toLocaleString()}</p>
            <p className="text-[#45464d]">people waiting to synch with you</p>
          </div>
        )}

        <button
          onClick={() => alert('Onboarding coming soon!')}
          className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition"
        >
          Start Matching
        </button>
      </div>
    </div>
  )
}

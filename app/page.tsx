"use client"

import dynamic from "next/dynamic"

const App = dynamic(() => import("../src/App"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
      <div className="text-center">
        <div className="text-6xl mb-4">🎹</div>
        <div className="text-2xl font-bold text-purple-600">Đang tải...</div>
      </div>
    </div>
  ),
})

export default function Page() {
  return <App />
}

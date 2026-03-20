"use client"

import { useState } from "react"
import { categories } from "../data/keyboardData"

export default function CategorySelector({ currentCategory, onCategoryChange }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-purple-300 rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-105"
      >
        <span className="text-xl">{categories.find((c) => c.id === currentCategory)?.icon || "🌟"}</span>
        <span className="font-semibold text-purple-600">
          {categories.find((c) => c.id === currentCategory)?.name || "Tất cả"}
        </span>
        <span className="text-xs">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full mt-2 left-0 bg-white border-2 border-purple-300 rounded-lg shadow-xl z-50 max-h-[400px] overflow-y-auto w-56">
            <div className="p-2 grid grid-cols-1 gap-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    onCategoryChange(category.id)
                    setIsOpen(false)
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-purple-100 transition-colors text-left ${
                    currentCategory === category.id ? "bg-purple-200 font-semibold" : ""
                  }`}
                >
                  <span className="text-lg">{category.icon}</span>
                  <span className="text-sm">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

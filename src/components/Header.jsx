import { useEffect, useState } from 'react'

function classNames(...c){return c.filter(Boolean).join(' ')}

export default function Header({ onSearch, onCartClick, cartCount }) {
  const [q, setQ] = useState('')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const submit = (e) => {
    e.preventDefault()
    onSearch(q)
  }

  return (
    <header className={classNames('sticky top-0 z-40 transition-all', scrolled ? 'backdrop-blur bg-white/70 shadow' : 'bg-white') }>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black text-amber-600">amazn</span>
            <span className="text-xs text-gray-500 border rounded px-1 py-0.5 hidden sm:inline">demo</span>
          </a>

          <form onSubmit={submit} className="flex-1 hidden md:flex">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products"
              className="w-full rounded-l-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button type="submit" className="rounded-r-md bg-amber-500 px-4 py-2 text-white hover:bg-amber-600">Search</button>
          </form>

          <div className="flex items-center gap-3">
            <button onClick={onCartClick} className="relative inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50">
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-600 px-1.5 text-xs font-semibold text-white">{cartCount}</span>
              )}
            </button>
          </div>
        </div>

        <form onSubmit={submit} className="md:hidden pb-3">
          <div className="flex">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products"
              className="w-full rounded-l-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button type="submit" className="rounded-r-md bg-amber-500 px-4 py-2 text-white hover:bg-amber-600">Go</button>
          </div>
        </form>
      </div>
    </header>
  )
}

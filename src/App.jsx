import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import ProductCard from './components/ProductCard'
import CartDrawer from './components/CartDrawer'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function uid() {
  const k = 'session_id'
  let id = localStorage.getItem(k)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(k, id)
  }
  return id
}

export default function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState({ session_id: '', items: [], subtotal: 0, total_items: 0 })

  const sessionId = useMemo(uid, [])

  const loadProducts = async (q = '') => {
    try {
      setLoading(true)
      const url = new URL(`${BACKEND}/api/products`)
      if (q) url.searchParams.set('q', q)
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to load products')
      const data = await res.json()
      setProducts(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const ensureSeeded = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/products`)
      if (res.ok) {
        const arr = await res.json()
        if (!Array.isArray(arr) || arr.length === 0) {
          await fetch(`${BACKEND}/api/products/seed`, { method: 'POST' })
        }
      }
    } catch {}
  }

  const addToCart = async (p) => {
    try {
      const res = await fetch(`${BACKEND}/api/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, product_id: p.id, quantity: 1 })
      })
      const data = await res.json()
      setCart(data)
      setCartOpen(true)
    } catch (e) {
      console.error(e)
    }
  }

  const getCart = async () => {
    try {
      const url = new URL(`${BACKEND}/api/cart`)
      url.searchParams.set('session_id', sessionId)
      const res = await fetch(url)
      const data = await res.json()
      setCart(data)
    } catch (e) { console.error(e) }
  }

  const clearCart = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/cart/clear?session_id=${sessionId}`, { method: 'POST' })
      const data = await res.json()
      setCart(data)
    } catch (e) { console.error(e) }
  }

  useEffect(() => {
    ;(async () => {
      await ensureSeeded()
      await loadProducts()
      await getCart()
    })()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={loadProducts} onCartClick={() => setCartOpen(true)} cartCount={cart.total_items} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {loading && (
          <div className="text-center py-20 text-gray-500">Loading products…</div>
        )}
        {error && (
          <div className="text-center py-20 text-red-600">{error}</div>
        )}
        {!loading && !error && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Featured products</h2>
              <button onClick={getCart} className="text-sm text-amber-700 hover:underline">Refresh cart</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} onAdd={addToCart} />
              ))}
            </div>
          </>
        )}
      </main>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} onClear={clearCart} />
    </div>
  )
}

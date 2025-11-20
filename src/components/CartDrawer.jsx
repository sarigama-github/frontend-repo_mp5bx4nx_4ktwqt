import { useEffect } from 'react'

export default function CartDrawer({ open, onClose, cart, onClear }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}>
      <div className={`absolute inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button onClick={onClose} className="rounded-md border px-2 py-1 text-sm">Close</button>
        </div>
        <div className="p-4 space-y-3 overflow-y-auto h-[calc(100%-120px)]">
          {cart.items.length === 0 ? (
            <p className="text-sm text-gray-500">Your cart is empty.</p>
          ) : (
            cart.items.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 border rounded p-2">
                {item.product.image && (
                  <img src={item.product.image} alt={item.product.title} className="h-16 w-16 object-cover rounded" />
                )}
                <div className="flex-1">
                  <p className="font-medium">{item.product.title}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <div className="font-semibold">${item.line_total.toFixed(2)}</div>
              </div>
            ))
          )}
        </div>
        <div className="border-t p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-lg font-semibold">${cart.subtotal.toFixed(2)}</span>
          </div>
          <button onClick={onClear} className="w-full rounded-md bg-amber-600 text-white py-2 font-medium hover:bg-amber-700">Clear cart</button>
        </div>
      </div>
    </div>
  )
}

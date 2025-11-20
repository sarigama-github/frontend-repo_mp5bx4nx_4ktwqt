export default function ProductCard({ product, onAdd }) {
  return (
    <div className="group rounded-lg border bg-white shadow-sm hover:shadow-md transition overflow-hidden">
      {product.image && (
        <img src={product.image} alt={product.title} className="h-48 w-full object-cover" />
      )}
      <div className="p-4">
        <h3 className="line-clamp-2 font-medium text-gray-900 group-hover:text-amber-700 transition">{product.title}</h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-semibold">${Number(product.price).toFixed(2)}</span>
          <button
            onClick={() => onAdd(product)}
            className="rounded-md bg-amber-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-600"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  )
}

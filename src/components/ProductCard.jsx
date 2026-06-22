/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Star, Eye, Tag, ShoppingBag } from 'lucide-react';

export default function ProductCard({ product, onAddToCart, onQuickView }) {
  const isOutOfStock = product.countInStock <= 0;
  
  // Local state for selected color variant
  const [selectedColor, setSelectedColor] = React.useState(
    product.colors && product.colors.length > 0 ? product.colors[0] : null
  );
  
  // Calculate discount percentage if original price is supplied
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      id={`prod-card-${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-md"
    >
      {/* Badges / Hot tags */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {discountPercent > 0 && (
          <span 
            id={`badge-discount-${product.id}`}
            className="flex items-center gap-1 rounded-full bg-rose-50 dark:bg-rose-950/35 px-2.5 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40 uppercase tracking-wider"
          >
            <Tag size={11} />
            Save {discountPercent}%
          </span>
        )}
        {product.featured && (
          <span 
            id={`badge-featured-${product.id}`}
            className="rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider"
          >
            Editor's Choice
          </span>
        )}
        {isOutOfStock && (
          <span 
            id={`badge-stockout-${product.id}`}
            className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border border-slate-200 dark:border-slate-700"
          >
            Out of Stock
          </span>
        )}
      </div>

      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-950">
        <img
          id={`img-${product.id}`}
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
        />
        
        {/* Quick View overlay */}
        <div className="absolute inset-0 bg-black/3 py-2 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:bg-black/10">
          <button
            type="button"
            id={`btn-quick-view-${product.id}`}
            onClick={() => onQuickView(product)}
            className="flex items-center gap-1.5 rounded-xl bg-white/95 dark:bg-slate-900/95 px-4 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-200 shadow-md backdrop-blur-sm transition-transform duration-200 hover:scale-105 hover:bg-white dark:hover:bg-slate-800"
          >
            <Eye size={14} />
            Quick View
          </button>
        </div>
      </div>

      {/* Info Container */}
      <div className="flex flex-1 flex-col p-5">
        <span 
          id={`category-tag-${product.id}`}
          className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500"
        >
          {product.category}
        </span>
        
        <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 line-clamp-1 group-hover:text-amber-600 transition-colors">
            {product.name}
          </h3>
          {selectedColor && (
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded-sm border border-slate-100 dark:border-slate-800">
              {selectedColor.name}
            </span>
          )}
        </div>
        
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed flex-grow">
          {product.description}
        </p>

        {/* Colors Selection Dots */}
        {product.colors && product.colors.length > 0 && (
          <div className="mt-2.5 flex items-center gap-1.5" id={`card-colors-${product.id}`}>
            <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-505">Colors:</span>
            <div className="flex items-center gap-1.5">
              {product.colors.map((col) => {
                const isSelected = selectedColor?.name === col.name;
                return (
                  <button
                    key={col.name}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedColor(col);
                    }}
                    className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-slate-800 dark:border-slate-200 scale-110 shadow-xs ring-1 ring-slate-800/15 dark:ring-white/15 bg-white dark:bg-slate-900' 
                        : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-500 hover:scale-105 bg-white dark:bg-slate-900'
                    }`}
                    title={`Select variant: ${col.name}`}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full block shrink-0"
                      style={{ backgroundColor: col.hex }}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Rating and Reviews */}
        <div className="mt-3 flex items-center gap-1">
          <div className="flex items-center text-amber-400">
            {[1, 2, 3, 4, 5].map((starVal) => (
              <Star
                key={starVal}
                size={12}
                fill={starVal <= Math.round(product.rating) ? "currentColor" : "none"}
                className={starVal <= Math.round(product.rating) ? "text-amber-400" : "text-slate-200 dark:text-slate-800"}
              />
            ))}
          </div>
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
            {product.rating.toFixed(1)} ({product.reviewsCount})
          </span>
        </div>

        {/* Pricing & Add to Cart Footer */}
        <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span id={`price-${product.id}`} className="text-base font-bold text-slate-900 dark:text-slate-50 font-mono">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span id={`orig-price-${product.id}`} className="text-xs font-medium text-slate-400 dark:text-slate-500 line-through font-mono">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              {product.countInStock > 0 ? (
                product.countInStock <= 5 ? (
                  <span className="text-rose-500 dark:text-rose-400 font-medium">Only {product.countInStock} left!</span>
                ) : (
                  <span>In Stock ({product.countInStock})</span>
                )
              ) : (
                <span className="text-slate-400 dark:text-slate-500">Restocking soon</span>
              )}
            </span>
          </div>

          <button
            type="button"
            id={`btn-add-to-cart-${product.id}`}
            disabled={isOutOfStock}
            onClick={() => onAddToCart(product, selectedColor)}
            className={`flex h-10 w-10 items-center justify-center rounded-xl font-medium transition-all duration-200 cursor-pointer ${
              isOutOfStock
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed'
                : 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-200 hover:scale-105 active:scale-95'
            }`}
            title={isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          >
            <ShoppingBag size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

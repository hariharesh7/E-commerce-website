/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Star, ShoppingBag, Plus, Minus, ShieldAlert, CheckCircle, ArrowLeft } from 'lucide-react';

export default function ProductDetailsModal({ product, onClose, onAddToCartWithQty }) {
  if (!product) return null;
  
  const [qty, setQty] = React.useState(1);
  const [selectedColor, setSelectedColor] = React.useState(null);
  const isOutOfStock = product.countInStock <= 0;
  
  React.useEffect(() => {
    // Reset qty and default color selection when product shifts
    setQty(1);
    if (product && product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0]);
    } else {
      setSelectedColor(null);
    }
  }, [product]);

  const handleDecrement = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  };

  const handleIncrement = () => {
    if (qty < product.countInStock) {
      setQty(qty + 1);
    }
  };

  const handleAddToCart = () => {
    onAddToCartWithQty(product, qty, selectedColor);
    onClose();
  };

  // Safe discount display logic
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      id="product-details-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        id={`details-card-${product.id}`}
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row max-h-[90vh] md:max-h-none overflow-y-auto animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Absolute Close button */}
        <button
          type="button"
          id="btn-close-details"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 dark:bg-slate-800/90 shadow-md hover:bg-white dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all cursor-pointer border border-slate-100 dark:border-slate-700"
          title="Close Dialog"
        >
          <X size={18} />
        </button>

        {/* Column Left: Visual imagery */}
        <div className="relative md:w-1/2 bg-slate-50 dark:bg-slate-950 flex items-center justify-center min-h-[300px] md:min-h-0">
          <img
            id={`details-img-${product.id}`}
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover max-h-[400px] md:max-h-[550px]"
          />
          {discountPercent > 0 && (
            <span 
              id="details-discount-badge"
              className="absolute top-4 left-4 bg-rose-500 text-white font-bold text-xs px-3 py-1.5 rounded-full uppercase tracking-wider"
            >
              -{discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Column Right: Information and Cart Add-on */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
          <div>
            {/* Category tag */}
            <span id="details-category" className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              {product.category}
            </span>

            {/* Product Name */}
            <h2 id="details-title" className="mt-2 text-2xl font-bold text-slate-800 dark:text-slate-100 font-display">
              {product.name}
            </h2>

            {/* Rating summary */}
            <div className="mt-3 flex items-center gap-1">
              <div className="flex items-center text-amber-400">
                {[1, 2, 3, 4, 5].map((starVal) => (
                  <Star
                    key={starVal}
                    size={14}
                    fill={starVal <= Math.round(product.rating) ? "currentColor" : "none"}
                    className={starVal <= Math.round(product.rating) ? "text-amber-400" : "text-slate-200 dark:text-slate-800"}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {product.rating.toFixed(1)} Rating ({product.reviewsCount} verified reviews)
              </span>
            </div>

            {/* Pricing Section */}
            <div className="mt-4 flex items-center gap-3">
              <span id="details-current-price" className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 font-mono">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span id="details-original-price" className="text-lg font-medium text-slate-400 dark:text-slate-500 line-through font-mono">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Detailed Description */}
            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">The Story</h4>
              <p id="details-desc-text" className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Custom Premium Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-5 bg-slate-50 dark:bg-slate-950/80 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl" id="details-color-selection-container">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-2">
                  Select Accent Color Variant:
                </span>
                <div className="flex flex-wrap items-center gap-2.5">
                  {product.colors.map((color) => {
                    const isChoiceSelected = selectedColor?.name === color.name;
                    return (
                      <button
                        key={color.name}
                        type="button"
                        id={`btn-color-select-${color.name.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={() => setSelectedColor(color)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          isChoiceSelected
                            ? 'bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-950 dark:border-white shadow-sm'
                            : 'bg-white text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span
                          className="h-3.5 w-3.5 rounded-full border border-black/10 shrink-0 block"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span>{color.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Custom Highlights */}
            <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                <CheckCircle size={14} className="text-emerald-500" />
                <span>Original Brand Genuine</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                <ShieldAlert size={14} className="text-blue-500" />
                <span>1 Year Warranty</span>
              </div>
            </div>
          </div>

          {/* Action Footer: Quantity selector and Add Button */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            {isOutOfStock ? (
              <div className="rounded-xl bg-slate-50 dark:bg-slate-950/80 p-4 border border-slate-100 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400 text-sm font-medium animate-pulse">
                Unfortunately, this product is currently out of stock. We are craft-producing new daily lots.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {/* Stock indicator */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Stock Availability:</span>
                  <span id="details-stock-alert" className="font-semibold text-slate-800 dark:text-slate-300">
                    {product.countInStock <= 5 ? (
                      <span className="text-rose-500 dark:text-rose-400 uppercase tracking-wider font-bold">Only {product.countInStock} Left In Stock</span>
                    ) : (
                      <span>{product.countInStock} units ready to ship</span>
                    )}
                  </span>
                </div>

                {/* Controls Selector */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center h-12 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-1">
                    <button
                      type="button"
                      id="btn-details-decrement"
                      disabled={qty <= 1}
                      onClick={handleDecrement}
                      className={`h-10 w-10 flex items-center justify-center rounded-lg transition-all ${
                        qty <= 1 ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed' : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white hover:shadow-xs'
                      }`}
                    >
                      <Minus size={14} />
                    </button>
                    
                    <span
                      id="details-quantity-display"
                      className="w-12 text-center text-sm font-bold font-mono text-slate-800 dark:text-slate-100"
                    >
                      {qty}
                    </span>
                    
                    <button
                      type="button"
                      id="btn-details-increment"
                      disabled={qty >= product.countInStock}
                      onClick={handleIncrement}
                      className={`h-10 w-10 flex items-center justify-center rounded-lg transition-all ${
                        qty >= product.countInStock ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed' : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white hover:shadow-xs'
                      }`}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    type="button"
                    id="btn-details-add-to-cart"
                    onClick={handleAddToCart}
                    className="flex-1 h-12 flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-sm font-semibold text-white dark:text-slate-950 shadow-md transition-all hover:bg-slate-800 dark:hover:bg-slate-200 active:scale-98 cursor-pointer"
                  >
                    <ShoppingBag size={16} />
                    Add {qty} Item{qty > 1 ? 's' : ''} to Cart
                  </button>
                </div>
              </div>
            )}
            
            <button
              type="button"
              id="details-back-to-catalog"
              onClick={onClose}
              className="mt-4 flex w-full items-center justify-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
            >
              <ArrowLeft size={12} />
              Continue Shopping/Back To Catalog
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

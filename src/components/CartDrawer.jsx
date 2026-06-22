/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Trash2, Plus, Minus, CreditCard, Tag, Ticket } from 'lucide-react';
import { COUPONS } from '../productsData';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onBeginCheckout,
  appliedCoupon,
  onApplyCoupon
}) {
  const [promoInput, setPromoInput] = React.useState('');
  const [couponError, setCouponError] = React.useState('');
  const [couponSuccess, setCouponSuccess] = React.useState('');

  if (!isOpen) return null;

  // Calculators
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  // Coupon applied calculations
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.code === 'FREESHIP') {
      discountAmount = 0;
    } else {
      discountAmount = (subtotal * appliedCoupon.discountPercent) / 100;
    }
  }

  // Shipping logic: Free for orders over ₹4,999 or if FREESHIP coupon applied
  const isFreeShipping = subtotal >= 4999 || (appliedCoupon && appliedCoupon.code === 'FREESHIP');
  const shippingCost = subtotal === 0 ? 0 : isFreeShipping ? 0 : 350;

  // 18% GST calculation
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const estimatedTax = taxableAmount * 0.18;

  // Big total
  const estimatedTotal = taxableAmount + shippingCost + estimatedTax;

  const handleApplyCouponCode = (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    
    if (!promoInput.trim()) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    const codeUpper = promoInput.trim().toUpperCase();
    const couponMatch = COUPONS.find(c => c.code === codeUpper);

    if (!couponMatch) {
      setCouponError('Invalid coupon code. Try WELCOME10 or STARTUP20.');
      return;
    }

    if (subtotal < couponMatch.minPurchase) {
      setCouponError(`This code requires a minimum purchase of ₹${couponMatch.minPurchase.toLocaleString('en-IN')}.`);
      return;
    }

    onApplyCoupon(couponMatch);
    setCouponSuccess(`Success! "${couponMatch.code}" has been applied.`);
    setPromoInput('');
  };

  const handleRemoveCoupon = () => {
    onApplyCoupon(null);
    setCouponSuccess('');
    setCouponError('');
  };

  return (
    <div
      id="cart-drawer-container"
      className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-fade-in"
      onClick={onClose}
    >
      <div
        id="cart-drawer-panel"
        className="w-full max-w-md bg-white dark:bg-slate-900 h-full flex flex-col shadow-2xl animate-slide-left border-l border-slate-100 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header container */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-display">Shopping Cart</h2>
            <span id="cart-drawer-counter" className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:text-slate-400 font-mono">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
          <button
            type="button"
            id="btn-close-cart-drawer"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* List of Cart Items */}
        <div id="cart-items-scroll-pane" className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cartItems.length === 0 ? (
            <div id="empty-cart-view" className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 mt-2">
              <span className="text-3xl">🛍️</span>
              <h3 className="mt-4 text-sm font-bold text-slate-800 dark:text-slate-100">Your cart looks empty</h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-450 max-w-[240px] leading-relaxed">
                Add quality products to your workstation catalog and gear up your setup workspace.
              </p>
              <button
                type="button"
                id="btn-empty-cart-back"
                onClick={onClose}
                className="mt-5 rounded-lg bg-slate-900 dark:bg-slate-100 px-4 py-2 text-xs font-semibold text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Explore Workspace Gear
              </button>
            </div>
          ) : (
            cartItems.map((item) => {
              const maxStock = item.product.countInStock;
              return (
                <div
                  key={item.product.id + (item.selectedColor ? '-' + item.selectedColor.name : '')}
                  id={`cart-item-${item.product.id}`}
                  className="flex items-center gap-4 p-3 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-xs transition-all"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="h-16 w-16 rounded-lg object-cover bg-slate-50 dark:bg-slate-900 flex-shrink-0"
                  />
                  
                  <div className="flex-grow min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">{item.product.category}</span>
                    <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">{item.product.name}</h4>
                    {item.selectedColor && (
                      <div className="flex items-center gap-1.5 mt-0.5" id={`cart-item-color-${item.product.id}`}>
                        <span
                          className="h-2.5 w-2.5 rounded-full border border-black/10 inline-block shrink-0"
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                        <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate" title={item.selectedColor.name}>
                          {item.selectedColor.name}
                        </span>
                      </div>
                    )}
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300 font-mono mt-0.5 block">
                      ₹{item.product.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex flex-col items-end justify-between gap-2.5 flex-shrink-0">
                    {/* Delete button */}
                    <button
                      type="button"
                      id={`btn-cart-remove-${item.product.id}`}
                      onClick={() => onRemoveItem(item.product.id, item.selectedColor ? item.selectedColor.name : null)}
                      className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                      title="Remove product"
                    >
                      <Trash2 size={14} />
                    </button>

                    {/* Quantity controls */}
                    <div className="flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg p-0.5">
                      <button
                        type="button"
                        id={`btn-cart-decrement-${item.product.id}`}
                        onClick={() => onUpdateQty(item.product.id, item.quantity - 1, item.selectedColor ? item.selectedColor.name : null)}
                        className="h-6 w-6 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white rounded-md transition-colors cursor-pointer"
                      >
                        <Minus size={10} />
                      </button>
                      
                      <span
                        id={`cart-qty-${item.product.id}`}
                        className="w-7 text-center text-xs font-bold font-mono text-slate-700 dark:text-slate-200"
                      >
                        {item.quantity}
                      </span>
                      
                      <button
                        type="button"
                        id={`btn-cart-increment-${item.product.id}`}
                        disabled={item.quantity >= maxStock}
                        onClick={() => onUpdateQty(item.product.id, item.quantity + 1, item.selectedColor ? item.selectedColor.name : null)}
                        className={`h-6 w-6 flex items-center justify-center rounded-md transition-all cursor-pointer ${
                          item.quantity >= maxStock
                            ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                            : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-850'
                        }`}
                        title={item.quantity >= maxStock ? 'Maximum available stock reached' : 'Add one more'}
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Coupon Code Input & Invoice totals */}
        {cartItems.length > 0 && (
          <div className="bg-slate-50/50 dark:bg-slate-950/80 p-6 border-t border-slate-100 dark:border-slate-850 flex flex-col gap-4 animate-fade-in">
            {/* Promo application */}
            {!appliedCoupon ? (
              <form id="coupon-form" onSubmit={handleApplyCouponCode} className="flex gap-2">
                <input
                  id="promo-code-input"
                  type="text"
                  placeholder="Promo Code... (e.g. WELCOME10)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 px-3 py-2 text-xs rounded-lg focus:outline-hidden focus:border-slate-400 dark:focus:border-slate-600 font-sans uppercase tracking-wider"
                />
                <button
                  type="submit"
                  id="btn-apply-coupon"
                  className="bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 rounded-lg px-4 py-2 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </form>
            ) : (
              <div id="applied-coupon-row" className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/25 border border-emerald-100 dark:border-emerald-950/40 rounded-lg p-2.5 text-xs text-emerald-800 dark:text-emerald-400">
                <div className="flex items-center gap-1.5 font-medium">
                  <Ticket size={14} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Promo Code Applied: <strong>{appliedCoupon.code}</strong></span>
                </div>
                <button
                  type="button"
                  id="btn-remove-coupon"
                  onClick={handleRemoveCoupon}
                  className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-bold underline cursor-pointer"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Error & Success Messages */}
            {couponError && <span id="coupon-error" className="text-[11px] font-medium text-rose-500">{couponError}</span>}
            {couponSuccess && <span id="coupon-success" className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">{couponSuccess}</span>}

            {/* Price Ledger */}
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 pt-1">
              <div className="flex justify-between items-center">
                <span>Subtotal</span>
                <span id="label-subtotal" className="font-semibold text-slate-800 dark:text-slate-200 font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              
              {appliedCoupon && (
                <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400">
                  <span className="flex items-center gap-1">
                    <Tag size={12} />
                    Discount ({appliedCoupon.code})
                  </span>
                  <span id="label-discount" className="font-semibold font-mono">
                    {appliedCoupon.code === 'FREESHIP' ? 'Free Shipping' : `-₹${discountAmount.toLocaleString('en-IN')}`}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  Shipping Courier
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">(Free over ₹4,999)</span>
                </span>
                <span id="label-shipping" className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                  {shippingCost === 0 ? 'FREE' : `₹${shippingCost.toLocaleString('en-IN')}`}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span>Goods & Services Tax (18% GST)</span>
                <span id="label-tax" className="font-semibold text-slate-800 dark:text-slate-200 font-mono">₹{estimatedTax.toLocaleString('en-IN')}</span>
              </div>

              <div className="h-px bg-slate-200 dark:bg-slate-800 mt-2 mb-3"></div>

              <div className="flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 font-display">Estimated Total</span>
                <span id="label-total" className="text-lg font-bold text-slate-900 dark:text-slate-50 font-mono">₹{estimatedTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              type="button"
              id="btn-trigger-checkout"
              onClick={onBeginCheckout}
              className="mt-3 w-full h-11 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shadow-md active:scale-98 cursor-pointer"
            >
              <CreditCard size={15} />
              Proceed to Secure Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

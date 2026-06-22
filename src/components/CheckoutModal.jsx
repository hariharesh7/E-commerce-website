/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, CheckCircle, ArrowRight, Printer, ShieldCheck, RefreshCw } from 'lucide-react';

export default function CheckoutModal({ isOpen, onClose, cartItems, appliedCoupon, onClearCart }) {
  if (!isOpen) return null;

  const [step, setStep] = React.useState('details');
  const [customer, setCustomer] = React.useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zipCode: ''
  });
  const [formErrors, setFormErrors] = React.useState({});
  const [loadingText, setLoadingText] = React.useState('Initiating secure vault gateway...');
  const [orderId, setOrderId] = React.useState('');

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.code === 'FREESHIP') {
      discountAmount = 0;
    } else {
      discountAmount = (subtotal * appliedCoupon.discountPercent) / 100;
    }
  }

  const isFreeShipping = subtotal >= 4999 || (appliedCoupon && appliedCoupon.code === 'FREESHIP');
  const shippingCost = subtotal === 0 ? 0 : isFreeShipping ? 0 : 350;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const estimatedTax = taxableAmount * 0.18; // 18% GST
  const estimatedTotal = taxableAmount + shippingCost + estimatedTax;

  // Form validations
  const validateForm = () => {
    const errors = {};
    if (!customer.name.trim()) errors.name = 'Full name is required';
    if (!customer.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(customer.email)) {
      errors.email = 'Please provide a valid email';
    }
    if (!customer.address.trim()) errors.address = 'Shipping address is required';
    if (!customer.city.trim()) errors.city = 'City/Town location is required';
    if (!customer.zipCode.trim()) {
      errors.zipCode = 'PIN code is required';
    } else if (!/^\d{6}$/.test(customer.zipCode)) {
      errors.zipCode = 'PIN code must be a 6-digit number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, val) => {
    setCustomer(prev => ({ ...prev, [field]: val }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmitDetails = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    // Begin Mock Step animation
    setStep('processing');
    
    // Cycle loading texts for realism
    setTimeout(() => {
      setLoadingText('Processing credentials through secure sandbox ledger...');
    }, 1000);

    setTimeout(() => {
      setLoadingText('Verifying merchant transaction token...');
    }, 2200);

    setTimeout(() => {
      setLoadingText('Finalizing order dispatch batch...');
    }, 3400);

    setTimeout(() => {
      const randomOrderNo = `ORD-${Math.floor(100000 + Math.random() * 900000)}-2026`;
      setOrderId(randomOrderNo);
      setStep('success');
    }, 4500);
  };

  const handleFinishCheckout = () => {
    onClearCart();
    setStep('details');
    onClose();
  };

  const handlePrint = () => {
    window.print();
  };

  // Generate delivery date: 4 days out from local time
  const getDeliveryDate = () => {
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + 4);
    return baseDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div
      id="checkout-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
      onClick={step === 'details' ? onClose : undefined}
    >
      <div
        id="checkout-drawer-panel"
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-y-auto animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dynamic header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-sm">🔐</span>
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 font-display">
              {step === 'details' && 'Secure Checkout Form'}
              {step === 'processing' && 'Authenticating Transaction'}
              {step === 'success' && 'Order Received Successfully!'}
            </h2>
          </div>
          {step === 'details' && (
            <button
              type="button"
              id="btn-close-checkout"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* STEP 1: Billing and Shipping Form */}
        {step === 'details' && (
          <form id="checkout-details-form" onSubmit={handleSubmitDetails} className="p-6 md:p-8 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Ship address left */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Shipping Credentials</h3>
                              {/* Full name input */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="input-customer-name" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                  <input
                    id="input-customer-name"
                    type="text"
                    required
                    value={customer.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="E.g. Alexis Wright"
                    className={`w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10 text-slate-800 dark:text-slate-100 ${
                      formErrors.name ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 dark:border-slate-800 focus:border-slate-400'
                    }`}
                  />
                  {formErrors.name && <span className="text-[10px] text-rose-500 font-medium">{formErrors.name}</span>}
                </div>

                {/* Email address */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="input-customer-email" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                  <input
                    id="input-customer-email"
                    type="email"
                    required
                    value={customer.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="alexis@example.com"
                    className={`w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10 text-slate-800 dark:text-slate-100 ${
                      formErrors.email ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 dark:border-slate-800 focus:border-slate-400'
                    }`}
                  />
                  {formErrors.email && <span className="text-[10px] text-rose-500 font-medium">{formErrors.email}</span>}
                </div>

                {/* Shipping address */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="input-customer-address" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Shipping Address</label>
                  <input
                    id="input-customer-address"
                    type="text"
                    required
                    value={customer.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Apartment, Street address..."
                    className={`w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10 text-slate-800 dark:text-slate-100 ${
                      formErrors.address ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 dark:border-slate-800 focus:border-slate-400'
                    }`}
                  />
                  {formErrors.address && <span className="text-[10px] text-rose-500 font-medium">{formErrors.address}</span>}
                </div>

                {/* City and Zip Code */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="input-customer-city" className="text-xs font-semibold text-slate-700 dark:text-slate-300">City / Town</label>
                    <input
                      id="input-customer-city"
                      type="text"
                      required
                      value={customer.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="e.g. Bengaluru"
                      className={`w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10 text-slate-800 dark:text-slate-100 ${
                        formErrors.city ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 dark:border-slate-800 focus:border-slate-500'
                      }`}
                    />
                    {formErrors.city && <span className="text-[10px] text-rose-500 font-medium">{formErrors.city}</span>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="input-customer-zip" className="text-xs font-semibold text-slate-700 dark:text-slate-300">PIN Code</label>
                    <input
                      id="input-customer-zip"
                      type="text"
                      required
                      placeholder="e.g. 560001"
                      value={customer.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      className={`w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10 text-slate-800 dark:text-slate-100 ${
                        formErrors.zipCode ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 dark:border-slate-800 focus:border-slate-500'
                      }`}
                    />
                    {formErrors.zipCode && <span className="text-[10px] text-rose-500 font-medium">{formErrors.zipCode}</span>}
                  </div>
                </div>
              </div>

              {/* Order summary display right */}
              <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-100 dark:border-slate-850/60 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3.5">Review items ({cartItems.length})</h3>
                  
                  {/* Cart review layout */}
                  <div className="max-h-[160px] overflow-y-auto space-y-3 pr-1 py-1">
                    {cartItems.map(item => (
                      <div key={item.product.id + (item.selectedColor ? '-' + item.selectedColor.name : '')} className="flex gap-2.5 items-center justify-between text-xs">
                        <div className="flex flex-col min-w-0 max-w-[140px]">
                          <span className="font-medium text-slate-700 dark:text-slate-300 truncate">{item.product.name}</span>
                          {item.selectedColor && (
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate">Variant: {item.selectedColor.name}</span>
                          )}
                        </div>
                        <span className="text-slate-400 dark:text-slate-500 text-xs shrink-0 font-mono">Qty: {item.quantity}</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>

                  <div className="h-px bg-slate-200 dark:bg-slate-800 my-4"></div>

                  {/* Financial listings */}
                  <div className="space-y-2 text-[11px] text-slate-600 dark:text-slate-400">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold dark:text-slate-200 font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                        <span>Discount ({appliedCoupon?.code})</span>
                        <span className="font-semibold font-mono">-₹{discountAmount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Shipping Courier</span>
                      <span className="font-semibold dark:text-slate-200 font-mono">{shippingCost === 0 ? 'FREE' : `₹${shippingCost.toLocaleString('en-IN')}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST (18%)</span>
                      <span className="font-semibold dark:text-slate-200 font-mono">₹{estimatedTax.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 font-sans">
                  <div className="flex justify-between items-baseline mb-4">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-400">Grand Total:</span>
                    <span className="text-base font-bold text-slate-900 dark:text-slate-50 font-mono">₹{estimatedTotal.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 p-2 border border-indigo-100 dark:border-indigo-950/30 rounded-lg">
                    <ShieldCheck size={12} />
                    <span>Secure 256-bit encrypted sandbox checkout mode</span>
                  </div>
                </div>
              </div>
            </div>

                 {/* Actions button footer */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                id="btn-cancel-checkout"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                Cancel / Return to Cart
              </button>
              <button
                type="submit"
                id="btn-process-payment"
                className="h-11 px-6 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors cursor-pointer shadow-md"
              >
                Place Secure Sandbox Order
                <ArrowRight size={14} />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Processing Payment Animations */}
        {step === 'processing' && (
          <div id="processing-view" className="p-12 flex flex-col items-center justify-center text-center gap-5 mt-10 mb-10">
            <RefreshCw size={36} className="text-slate-700 dark:text-slate-300 animate-spin" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white font-display">Processing Secure Order</h3>
            <p id="label-loading" className="text-xs text-slate-500 dark:text-slate-400 animate-pulse font-mono max-w-sm leading-relaxed">
              {loadingText}
            </p>
          </div>
        )}

        {/* STEP 3: Print Ready Success Invoice Summary */}
        {step === 'success' && (
          <div className="flex flex-col">
            <div id="invoice-receipt-panel" className="p-6 md:p-8 space-y-6">
              
              {/* Top celebration icon and text */}
              <div className="flex flex-col items-center justify-center text-center gap-2">
                <CheckCircle size={44} className="text-emerald-500" />
                <h3 className="text-lg font-bold text-slate-800 dark:text-white font-display">Your Order is Sealed!</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
                  Thank you so much, {customer.name}! We've dispatched a digital validation code to <strong className="text-slate-700 dark:text-slate-200">{customer.email}</strong>.
                </p>
              </div>

              {/* Digital printable Invoice frame */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 bg-slate-50/50 dark:bg-slate-950/40 space-y-4 font-sans text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex flex-col">
                    <span className="text-slate-400 dark:text-slate-500 uppercase text-[9px] font-bold">Receipt ID</span>
                    <span id="label-invoice-id" className="font-bold text-slate-800 dark:text-slate-100 font-mono">{orderId}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-slate-400 dark:text-slate-500 uppercase text-[9px] font-bold">Transaction Term</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">June 17, 2026</span>
                  </div>
                </div>

                {/* Delivery details with corrected grids */}
                <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-slate-400 dark:text-slate-400 uppercase text-[9px] font-bold block mb-1">Delivered To</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">{customer.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-450 truncate">{customer.address}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-450 truncate">{customer.city}, {customer.zipCode}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-400 uppercase text-[9px] font-bold block mb-1">Expected Delivery</span>
                    <p className="font-semibold text-indigo-600 dark:text-indigo-400">{getDeliveryDate()}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-450">Premium Ground Courier Service</p>
                  </div>
                </div>

                {/* Order Itemizations */}
                <div>
                  <span className="text-slate-400 dark:text-slate-400 uppercase text-[9px] font-bold block mb-2">Itemizations</span>
                  <div className="space-y-2 max-h-[140px] overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item.product.id + (item.selectedColor ? '-' + item.selectedColor.name : '')} className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-2.5 rounded-lg">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800 dark:text-slate-100">{item.product.name}</span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                            {item.selectedColor ? `Color Accent: ${item.selectedColor.name} • ` : ''}₹{item.product.price.toLocaleString('en-IN')} × {item.quantity}
                          </span>
                        </div>
                        <span className="font-bold text-slate-800 dark:text-slate-205 font-mono">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ledger summary */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                      <span>Applied Promo Discount</span>
                      <span className="font-semibold font-mono">-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping Handling</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{shippingCost === 0 ? 'FREE' : `₹${shippingCost.toLocaleString('en-IN')}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Calculated GST (18%)</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">₹{estimatedTax.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="h-px bg-slate-200 dark:bg-slate-800 my-2"></div>
                  <div className="flex justify-between items-baseline text-sm text-slate-800 dark:text-slate-200 font-bold">
                    <span>Amount Charged</span>
                    <span id="invoice-total-display" className="text-base text-slate-900 dark:text-slate-100 font-mono">₹{estimatedTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Action row */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  id="btn-print-invoice"
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                >
                  <Printer size={14} />
                  Print/Save PDF Invoice
                </button>
                
                <button
                  type="button"
                  id="btn-confirm-finish"
                  onClick={handleFinishCheckout}
                  className="bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 rounded-xl px-5 py-2.5 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Complete & Return to Catalog
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

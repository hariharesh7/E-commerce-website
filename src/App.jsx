/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShoppingCart, ShoppingBag, ArrowRight, ShieldCheck, RefreshCw, X, ChevronRight, Tag, HelpCircle, CheckCircle, Info, Sun, Moon, LogOut, User } from 'lucide-react';
import { PRODUCTS } from './productsData';
import ProductCard from './components/ProductCard';
import Filters from './components/Filters';
import ProductDetailsModal from './components/ProductDetailsModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import LoginPage from './components/LoginPage';

export default function App() {
  const maxPriceLimit = Math.ceil(Math.max(...PRODUCTS.map(p => p.price)));

  // States
  const [theme, setTheme] = React.useState(() => {
    try {
      const stored = localStorage.getItem('mini_ecommerce_theme');
      if (stored === 'dark' || stored === 'light') return stored;
      return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  const [session, setSession] = React.useState(() => {
    try {
      const stored = localStorage.getItem('mini_ecommerce_session');
      return stored ? JSON.parse(stored) : { email: '', name: '', isLoggedIn: false };
    } catch {
      return { email: '', name: '', isLoggedIn: false };
    }
  });

  const [isGuestMode, setIsGuestMode] = React.useState(() => {
    try {
      return localStorage.getItem('mini_ecommerce_guest') === 'true';
    } catch {
      return false;
    }
  });

  const [cartItems, setCartItems] = React.useState(() => {
    try {
      const stored = localStorage.getItem('mini_ecommerce_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [filters, setFilters] = React.useState({
    category: 'All',
    minPrice: 0,
    maxPrice: maxPriceLimit,
    searchQuery: '',
    sortBy: 'rating',
    onlyInStock: false
  });

  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = React.useState(false);
  const [appliedCoupon, setAppliedCoupon] = React.useState(null);
  
  // Real-time feedback toast
  const [toastMessage, setToastMessage] = React.useState(null);
  const [toastType, setToastType] = React.useState('success');

  // Trigger auto-dismissing feedback messages
  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
  };

  React.useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // React to theme changes and update document body/root styles
  React.useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('mini_ecommerce_theme', theme);
    } catch (e) {
      console.warn("Failed to backup active theme.", e);
    }
  }, [theme]);

  // Persist cart to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem('mini_ecommerce_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.warn("Failed to backup cart state to local storage.", e);
    }
  }, [cartItems]);

  // Handle Cart Increments/Additions Safely
  const handleAddToCart = (product, selectedColor = null) => {
    // Default to first variant if color selection listing is present
    const defaultColor = selectedColor || (product.colors && product.colors.length > 0 ? product.colors[0] : null);
    handleAddToCartWithQty(product, 1, defaultColor);
  };

  const handleAddToCartWithQty = (product, qty, selectedColor = null) => {
    const orderQty = Math.max(1, qty);
    const color = selectedColor || null;
    
    // Find item with same ID and same selected color variant
    const existingIndex = cartItems.findIndex(item => {
      const isSameId = item.product.id === product.id;
      const isSameColor = (!color && !item.selectedColor) || (color && item.selectedColor && item.selectedColor.name === color.name);
      return isSameId && isSameColor;
    });

    if (existingIndex > -1) {
      const currentQty = cartItems[existingIndex].quantity;
      const combinedQty = currentQty + orderQty;
      
      if (combinedQty > product.countInStock) {
        // Clamp to max stock available
        const clampQty = product.countInStock;
        const addedNow = clampQty - currentQty;
        
        if (addedNow <= 0) {
          showToast(`Already have maximum stock of ${product.countInStock} in your cart!`, 'warning');
          return;
        }
        
        const newItems = [...cartItems];
        newItems[existingIndex].quantity = clampQty;
        setCartItems(newItems);
        showToast(`Clamped cart items of "${product.name}"${color ? ` (${color.name})` : ''} to max ready stock of ${product.countInStock}!`, 'success');
      } else {
        const newItems = [...cartItems];
        newItems[existingIndex].quantity = combinedQty;
        setCartItems(newItems);
        showToast(`Added ${orderQty} units of "${product.name}"${color ? ` (${color.name})` : ''} to your cart!`, 'success');
      }
    } else {
      if (orderQty > product.countInStock) {
        setCartItems([...cartItems, { product, quantity: product.countInStock, selectedColor: color || undefined }]);
        showToast(`Added maximum ready stock (${product.countInStock} units) of "${product.name}"${color ? ` (${color.name})` : ''} to cart!`, 'success');
      } else {
        setCartItems([...cartItems, { product, quantity: orderQty, selectedColor: color || undefined }]);
        showToast(`Added ${orderQty} items of "${product.name}"${color ? ` (${color.name})` : ''} to your cart!`, 'success');
      }
    }
  };

  // Handle quantity updates directly within the cart drawer
  const handleUpdateCartQty = (productId, newQty, colorName) => {
    const existingIndex = cartItems.findIndex(item => 
      item.product.id === productId && 
      ((!colorName && !item.selectedColor) || (colorName && item.selectedColor && item.selectedColor.name === colorName))
    );
    if (existingIndex === -1) return;
    const existingItem = cartItems[existingIndex];

    if (newQty <= 0) {
      handleRemoveCartItem(productId, colorName);
      return;
    }

    if (newQty > existingItem.product.countInStock) {
      showToast(`Only ${existingItem.product.countInStock} units of "${existingItem.product.name}" are in stock!`, 'warning');
      return;
    }

    const newItems = [...cartItems];
    newItems[existingIndex].quantity = newQty;
    setCartItems(newItems);
  };

  // Remove completely from cart
  const handleRemoveCartItem = (productId, colorName) => {
    const match = cartItems.find(item => 
      item.product.id === productId && 
      ((!colorName && !item.selectedColor) || (colorName && item.selectedColor && item.selectedColor.name === colorName))
    );
    setCartItems(prev => prev.filter(item => 
      !(item.product.id === productId && 
        ((!colorName && !item.selectedColor) || (colorName && item.selectedColor && item.selectedColor.name === colorName)))
    ));
    if (match) {
      const colorLabel = match.selectedColor ? ` (${match.selectedColor.name})` : '';
      showToast(`Removed "${match.product.name}${colorLabel}" from your cart.`, 'success');
    }
  };

  // Reset filter constraints
  const handleResetFilters = () => {
    setFilters({
      category: 'All',
      minPrice: 0,
      maxPrice: maxPriceLimit,
      searchQuery: '',
      sortBy: 'rating',
      onlyInStock: false
    });
    showToast("Filters restored to catalog defaults.", "success");
  };

  // Apply Coupon code
  const handleApplyCoupon = (coupon) => {
    setAppliedCoupon(coupon);
  };

  // Clear total cart after success
  const handleClearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    showToast("Transaction cleared! Cart restored for new operations.", "success");
  };

  // Open direct mockup checkout modal
  const handleBeginCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Dynamically Filter products using useMemo for speed
  const filteredProducts = React.useMemo(() => {
    let result = [...PRODUCTS];

    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    if (filters.category && filters.category !== 'All') {
      result = result.filter(p => p.category === filters.category);
    }

    result = result.filter(p => p.price >= filters.minPrice && p.price <= filters.maxPrice);

    if (filters.onlyInStock) {
      result = result.filter(p => p.countInStock > 0);
    }

    if (filters.sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [filters, maxPriceLimit]);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Authenticated Screen Routing Transition
  if (!session.isLoggedIn && !isGuestMode) {
    return (
      <LoginPage
        theme={theme}
        onLoginSuccess={(newSession) => {
          setSession(newSession);
          setIsGuestMode(false);
          try {
            localStorage.setItem('mini_ecommerce_session', JSON.stringify(newSession));
            localStorage.setItem('mini_ecommerce_guest', 'false');
          } catch {}
          showToast(`Handshake authorized. Authenticated as ${newSession.name}!`, 'success');
        }}
        onContinueAsGuest={() => {
          setIsGuestMode(true);
          try {
            localStorage.setItem('mini_ecommerce_guest', 'true');
          } catch {}
          showToast("Authorized guest access. Welcome to catalog view!", "success");
        }}
      />
    );
  }

  return (
    <div id="app-root-container" className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans antialiased flex flex-col justify-between transition-colors duration-300">
      
      {/* Banner Strip highlighting checkout promo code helpers */}
      <div id="promotional-header-bar" className="bg-slate-900 px-4 py-2.5 text-center text-white text-xs font-medium flex items-center justify-center gap-1.5 flex-wrap">
        <span className="bg-rose-500 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full animate-pulse">Coupon Code Hint</span>
        <span>Try code <strong className="font-mono bg-white/20 px-1.5 py-0.5 rounded text-white text-xs">WELCOME10</strong> for 10% off, or <strong className="font-mono bg-white/20 px-1.5 py-0.5 rounded text-white text-xs">STARTUP20</strong> for 20% off over ₹9,999!</span>
      </div>

      {/* Floating feedback toast */}
      {toastMessage && (
        <div
          id="system-toast"
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-lg text-xs font-semibold animate-scale-up ${
            toastType === 'success'
              ? 'bg-emerald-950 text-emerald-100 border-emerald-800'
              : 'bg-rose-950 text-rose-100 border-rose-800'
          }`}
        >
          {toastType === 'success' ? <CheckCircle size={15} /> : <Info size={15} />}
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 hover:opacity-80 text-white cursor-pointer"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Application Primary Navigation Header - Optimized Dark colors with dark:bg-slate-950/90 */}
      <header id="app-header" className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-900/80 px-4 py-4 md:px-8 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand logo details */}
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-950 shadow-sm shrink-0">
              <ShoppingBag size={20} className="text-slate-100 dark:text-slate-950" />
            </div>
            <div>
              <h1 id="app-brand-logo" className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight font-display">Apex Workstations</h1>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono tracking-widest block uppercase">Pre-system Prototype</span>
            </div>
          </div>

          {/* Quick Stats or catalog details */}
          <div className="hidden md:flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle size={14} className="text-emerald-500" />
              Real physical inventory
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-indigo-500 dark:text-indigo-400" />
              Secure 256-bit credentials
            </span>
          </div>

          {/* Theme Switcher & Cart Trigger controls */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              id="btn-theme-toggle"
              onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
              className="h-11 w-11 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer border border-transparent dark:border-slate-800"
              aria-label="Toggle Global theme"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <button
              type="button"
              id="btn-cart-toggle"
              onClick={() => setIsCartOpen(true)}
              className="relative h-11 flex items-center gap-2 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-950 font-semibold text-xs px-5 rounded-xl cursor-pointer shadow-xs hover:shadow-md transition-all active:scale-95"
            >
              <ShoppingCart size={15} />
              <span className="hidden sm:inline">Shopping Cart</span>
              {totalCartCount > 0 ? (
                <span id="cart-counter-badge" className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-mono font-black text-white shrink-0 border-2 border-white dark:border-slate-950 animate-scale-up">
                  {totalCartCount}
                </span>
              ) : (
                <span className="text-[10px] opacity-70 font-mono">(0)</span>
              )}
            </button>

            {/* User Session Profile Info */}
            {session.isLoggedIn ? (
              <div className="flex items-center gap-2 md:gap-3 pl-2.5 border-l border-slate-100 dark:border-slate-900">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 font-extrabold text-xs tracking-tight uppercase shadow-xs shrink-0 border border-indigo-100 dark:border-indigo-900/60" title={`Signed in as ${session.name}`}>
                  {session.name.charAt(0)}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate max-w-[90px] leading-tight">{session.name}</p>
                  <p className="text-[9px] text-slate-400 dark:text-slate-500 font-mono tracking-tight leading-tight uppercase">Registry Active</p>
                </div>
                <button
                  type="button"
                  id="btn-auth-logout"
                  onClick={() => {
                    const prevName = session.name;
                    const cleared = { email: '', name: '', isLoggedIn: false };
                    setSession(cleared);
                    setIsGuestMode(false);
                    try {
                      localStorage.setItem('mini_ecommerce_session', JSON.stringify(cleared));
                      localStorage.setItem('mini_ecommerce_guest', 'false');
                    } catch {}
                    showToast(`Goodbye, ${prevName}! Session revoked.`, 'success');
                  }}
                  className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 cursor-pointer transition-all duration-250 scale-100 hover:scale-[1.03]"
                  aria-label="Sign Out"
                  title="Sign Out of Workspace"
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2.5 border-l border-slate-100 dark:border-slate-900">
                <button
                  type="button"
                  id="btn-auth-signin-header"
                  onClick={() => {
                    setIsGuestMode(false);
                    try {
                      localStorage.setItem('mini_ecommerce_guest', 'false');
                    } catch {}
                  }}
                  className="h-11 px-4 flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wide cursor-pointer shadow-xs transition-colors shrink-0"
                >
                  <User size={14} />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Primary body main space */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-6 md:px-8 space-y-6">
        
        {/* Intro Hero Section displaying design intent with optimized gradient inside dark:from-slate-950 dark:to-slate-900 */}
        <div id="intro-hero" className="rounded-3xl border border-slate-100 dark:border-slate-900 bg-linear-to-r from-slate-900 to-slate-850 dark:from-slate-950 dark:to-slate-900/60 p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden transition-colors">
          <div className="relative z-10 max-w-xl space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white tracking-wide backdrop-blur-xs border border-white/5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              Live Sandbox Preview Environment
            </div>
            <h2 className="text-xl md:text-3xl font-bold tracking-tight text-white font-display">
              Bespoke Productivity Setup Gear
            </h2>
            <p className="text-xs md:text-sm text-slate-300 dark:text-slate-400 leading-relaxed font-sans">
              Experience tactical tactile layouts, organic merino acoustic runners, and original titanium wrist chronographs. Add mock gear to your workspace, activate promo values, and see printable checkout receipting live.
            </p>
          </div>
          <div className="z-10 bg-white/5 border border-white/10 dark:border-slate-800/60 py-4 px-5 rounded-2xl flex flex-col gap-2.5 backdrop-blur-xs w-full md:w-auto shrink-0 md:max-w-xs text-xs">
            <span className="font-bold text-slate-200">Pre-system Checkout Help</span>
            <div className="space-y-1 text-slate-300 dark:text-slate-400 font-sans text-[11px]">
              <p>✔ Add products & configure quantities</p>
              <p>✔ Input standard Shipping address</p>
              <p>✔ Apply promo codes for deep savings</p>
              <p>✔ Print order PDF or local invoice receipts</p>
            </div>
          </div>
        </div>

        {/* Filter controls panel */}
        <Filters
          filters={filters}
          onFilterChange={setFilters}
          onResetFilters={handleResetFilters}
          maxProductPrice={maxPriceLimit}
        />

        {/* Catalog results count ribbon */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <span>
            Showing <strong className="text-slate-800 dark:text-slate-200">{filteredProducts.length}</strong> of <strong className="text-slate-800 dark:text-slate-200">{PRODUCTS.length}</strong> artisanal products
          </span>
          {filters.category !== 'All' && (
            <span className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-sm text-[10px] font-semibold border border-slate-200/25 dark:border-slate-800">
              Category: {filters.category}
            </span>
          )}
        </div>

        {/* Product Card Showcase grid */}
        {filteredProducts.length === 0 ? (
          <div id="no-results-panel" className="py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex flex-col items-center justify-center p-6">
            <span className="text-4xl text-slate-400">🔍</span>
            <h3 className="mt-4 text-sm font-bold text-slate-800 dark:text-slate-100">No products match your active filters</h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              We couldn't find items matching your filters or search constraints. Try widening your price bar, checking spelling, or resetting your choices.
            </p>
            <button
              type="button"
              id="btn-empty-reset"
              onClick={handleResetFilters}
              className="mt-6 rounded-lg bg-slate-900 dark:bg-slate-100 px-4 py-2.5 text-xs font-semibold text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Reset Search & Price Filters
            </button>
          </div>
        ) : (
          <div
            id="products-grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAddToCart={handleAddToCart}
                onQuickView={setSelectedProduct}
              />
            ))}
          </div>
        )}

      </main>

      {/* Minimal Footer with optimized borders */}
      <footer id="app-footer-info" className="bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 py-8 px-4 mt-12 text-center text-xs text-slate-400 dark:text-slate-500 space-y-2 transition-colors">
        <p className="font-semibold text-slate-500 dark:text-slate-400">Apex Workspace Tools Pre-flight System Prototype.</p>
        <p className="max-w-md mx-auto text-[11px] leading-relaxed">
          Designed for high-performance workstation environments. All sandbox payments are mock and secure. Product mock details are sourced under free-license Unsplash archives.
        </p>
        <p className="text-[10px] text-slate-400 dark:text-slate-600 font-mono pt-2">© 2026 Apex Workstations Co. Boston, MA. All Rights Reserved.</p>
      </footer>

      {/* Dynamic Slide Drawer & Modal panels */}
      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCartWithQty={handleAddToCartWithQty}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onBeginCheckout={handleBeginCheckout}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        appliedCoupon={appliedCoupon}
        onClearCart={handleClearCart}
      />

    </div>
  );
}

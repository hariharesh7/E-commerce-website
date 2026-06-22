/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, X, Check } from 'lucide-react';
import { CATEGORIES } from '../productsData';

export default function Filters({ filters, onFilterChange, onResetFilters, maxProductPrice }) {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const handleSearch = (e) => {
    onFilterChange({ ...filters, searchQuery: e.target.value });
  };

  const selectCategory = (category) => {
    onFilterChange({ ...filters, category });
  };

  const handleSortChange = (e) => {
    onFilterChange({ ...filters, sortBy: e.target.value });
  };

  const handleToggleStock = () => {
    onFilterChange({ ...filters, onlyInStock: !filters.onlyInStock });
  };

  const handlePriceRangeChange = (e, isMax) => {
    const val = parseInt(e.target.value, 10);
    if (isMax) {
      onFilterChange({ ...filters, maxPrice: val });
    } else {
      onFilterChange({ ...filters, minPrice: val });
    }
  };

  return (
    <div id="filter-panel" className="w-full flex flex-col gap-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-xs transition-colors duration-200">
      {/* Search and Sort Top Row */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full">
        {/* Search Input Box */}
        <div className="relative w-full md:max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400 dark:text-slate-500">
            <Search size={18} />
          </span>
          <input
            id="search-input"
            type="text"
            value={filters.searchQuery}
            onChange={handleSearch}
            placeholder="Search products by title or keywords..."
            className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10 focus:border-slate-400 dark:focus:border-slate-600 transition-all font-sans text-slate-800 dark:text-slate-100"
          />
          {filters.searchQuery && (
            <button
              type="button"
              id="btn-clear-search"
              onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Action controls row */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Advanced toggle Button */}
          <button
            type="button"
            id="btn-toggle-advanced-filters"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
              showAdvanced || filters.maxPrice < maxProductPrice || filters.minPrice > 0 || filters.onlyInStock
                ? 'bg-slate-950 text-white border-slate-950 dark:bg-slate-100 dark:text-slate-950 dark:border-white'
                : 'bg-white text-slate-705 border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-850'
            }`}
          >
            <SlidersHorizontal size={14} />
            <span>Advanced Filters</span>
            {(filters.maxPrice < maxProductPrice || filters.minPrice > 0 || filters.onlyInStock) && (
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 inline-block ml-0.5 animate-pulse"></span>
            )}
          </button>

          {/* Sort Selector Dropdown */}
          <div className="relative flex items-center rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 px-3 py-2.5">
            <ArrowUpDown size={14} className="text-slate-400 dark:text-slate-505 mr-2" />
            <select
              id="sort-select"
              value={filters.sortBy}
              onChange={handleSortChange}
              className="bg-transparent text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-hidden cursor-pointer animate-none"
            >
              <option value="rating" className="dark:bg-slate-950 dark:text-white">Top Rated</option>
              <option value="price_asc" className="dark:bg-slate-950 dark:text-white">Price: Low to High</option>
              <option value="price_desc" className="dark:bg-slate-950 dark:text-white">Price: High to Low</option>
              <option value="name" className="dark:bg-slate-950 dark:text-white">Product Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Categories Grid (Tabs) */}
      <div id="category-selector" className="w-full overflow-x-auto no-scrollbar scroll-smooth">
        <div className="flex items-center gap-1.5 py-1 min-w-max">
          {CATEGORIES.map((catName) => {
            const isSelected = filters.category === catName;
            return (
              <button
                key={catName}
                type="button"
                id={`btn-category-${catName.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => selectCategory(catName)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                }`}
              >
                {catName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced Filters sliding drawer */}
      {showAdvanced && (
        <div id="advanced-filters-drawer" className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5 mt-2 border-t border-slate-100 dark:border-slate-800 animate-slide-down">
          {/* Price Range Dual slider */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Price Thresholds</span>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                <span>Min: ₹{filters.minPrice.toLocaleString('en-IN')}</span>
                <span>Max: {filters.maxPrice === maxProductPrice ? 'Any' : `₹${filters.maxPrice.toLocaleString('en-IN')}`}</span>
              </div>
              <input
                id="range-min-price"
                type="range"
                min="0"
                max={maxProductPrice}
                value={filters.minPrice}
                onChange={(e) => handlePriceRangeChange(e, false)}
                className="w-full accent-slate-900 dark:accent-slate-200 cursor-ew-resize h-1 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none"
              />
              <input
                id="range-max-price"
                type="range"
                min="0"
                max={maxProductPrice}
                value={filters.maxPrice}
                onChange={(e) => handlePriceRangeChange(e, true)}
                className="w-full accent-slate-900 dark:accent-slate-200 cursor-ew-resize h-1 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none"
              />
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="flex flex-col justify-center gap-1">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Availability</span>
            <label id="label-toggle-stock" className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                id="checkbox-in-stock"
                type="checkbox"
                checked={filters.onlyInStock}
                onChange={handleToggleStock}
                className="sr-only"
              />
              <div className={`flex h-5 w-5 items-center justify-center rounded-md border transition-all ${
                filters.onlyInStock
                  ? 'bg-slate-900 border-slate-900 text-white dark:bg-slate-100 dark:border-white dark:text-slate-950'
                  : 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700'
              }`}>
                {filters.onlyInStock && <Check size={12} strokeWidth={3} />}
              </div>
              <span className="text-xs text-slate-600 dark:text-slate-350 font-medium">Show only products in stock</span>
            </label>
          </div>

          {/* Active stats / Reset handler */}
          <div className="flex items-end justify-start md:justify-end">
            <button
              type="button"
              id="btn-reset-filters"
              onClick={onResetFilters}
              className="text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors py-2 px-3 border border-rose-50 dark:border-rose-950/30 rounded-lg hover:bg-rose-50/50 dark:hover:bg-rose-950/20 cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @typedef {Object} ColorOption
 * @property {string} name
 * @property {string} hex
 */

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {number} price
 * @property {number} [originalPrice] - For discount representation
 * @property {string} category
 * @property {string} image
 * @property {number} rating
 * @property {number} reviewsCount
 * @property {number} countInStock
 * @property {string[]} [tags]
 * @property {boolean} [featured]
 * @property {ColorOption[]} [colors]
 */

/**
 * @typedef {Object} CartItem
 * @property {Product} product
 * @property {number} quantity
 * @property {ColorOption} [selectedColor]
 */

/**
 * @typedef {'price_asc' | 'price_desc' | 'rating' | 'name'} SortField
 */

/**
 * @typedef {Object} FilterState
 * @property {string} category
 * @property {number} minPrice
 * @property {number} maxPrice
 * @property {string} searchQuery
 * @property {SortField} sortBy
 * @property {boolean} onlyInStock
 */

/**
 * @typedef {Object} CouponCode
 * @property {string} code
 * @property {number} discountPercent
 * @property {number} minPurchase
 * @property {string} description
 */

/**
 * @typedef {Object} CustomerDetails
 * @property {string} name
 * @property {string} email
 * @property {string} address
 * @property {string} city
 * @property {string} zipCode
 */

/**
 * @typedef {Object} UserSession
 * @property {string} email
 * @property {string} name
 * @property {boolean} isLoggedIn
 */

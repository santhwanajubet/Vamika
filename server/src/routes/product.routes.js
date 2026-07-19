const { Router } = require('express');
const {
  getProducts, getProduct, getFeatured, getNewArrivals, getRelated,
  createProduct, updateProduct, deleteProduct, bulkDeleteProducts, searchProducts,
} = require('../controllers/product.controller');
const { protect, admin } = require('../middleware/auth');

const router = Router();

/**
 * @openapi
 * /api/products:
 *   get:
 *     tags: [Products]
 *     summary: Get all products
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: material
 *         schema: { type: string }
 *       - in: query
 *         name: occasion
 *         schema: { type: string }
 *       - in: query
 *         name: minPrice
 *         schema: { type: number }
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number }
 *       - in: query
 *         name: sort
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 12 }
 *     responses:
 *       200:
 *         description: Paginated list of products
 *   post:
 *     tags: [Products]
 *     summary: Create product (admin)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201:
 *         description: Product created
 * /api/products/featured:
 *   get:
 *     tags: [Products]
 *     summary: Get featured products
 *     responses:
 *       200:
 *         description: Featured products
 * /api/products/new-arrivals:
 *   get:
 *     tags: [Products]
 *     summary: Get new arrivals
 *     responses:
 *       200:
 *         description: New arrivals
 * /api/products/{slug}:
 *   get:
 *     tags: [Products]
 *     summary: Get product by slug or ID
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product data
 * /api/products/{id}/related:
 *   get:
 *     tags: [Products]
 *     summary: Get related products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Related products
 */
router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/featured', getFeatured);
router.get('/new-arrivals', getNewArrivals);
router.get('/related/:id', getRelated);
router.get('/:slug', getProduct);
router.post('/', protect, admin, createProduct);
router.post('/bulk-delete', protect, admin, bulkDeleteProducts);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;

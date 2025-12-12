import { Router } from 'express';
import { sweetsController } from '../controllers/sweets.controller';
import { auth } from '../middleware/auth';
import { adminOnly } from '../middleware/adminOnly';
import { purchaseLimiter } from '../middleware/rateLimiter';

const router = Router();

// All routes require authentication
router.use(auth);

// Public (authenticated) routes
router.get('/', (req, res, next) => sweetsController.getAllSweets(req, res, next));
router.get('/search', (req, res, next) => sweetsController.searchSweets(req, res, next));
router.get('/:id', (req, res, next) => sweetsController.getSweetById(req, res, next));

// Purchase route (authenticated users) - with rate limiting
router.post('/:id/purchase', purchaseLimiter, (req, res, next) => sweetsController.purchaseSweet(req, res, next));

// Admin only routes
router.post('/', adminOnly, (req, res, next) => sweetsController.createSweet(req, res, next));
router.put('/:id', adminOnly, (req, res, next) => sweetsController.updateSweet(req, res, next));
router.delete('/:id', adminOnly, (req, res, next) => sweetsController.deleteSweet(req, res, next));
router.post('/:id/restock', adminOnly, (req, res, next) => sweetsController.restockSweet(req, res, next));

export default router;

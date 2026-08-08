import Router from 'express';
const router=Router();
import {buySubscription,verifyPayment, getRazorpayKey,cancelSubscription,viewAllPayments} from '../controllers/paymentController.js'
import {authorizedSubcriber, isLoggedIn} from '../middlewares/authMiddleware.js';

router.post('/subscribe',isLoggedIn,buySubscription);
router.post('/verify',isLoggedIn,verifyPayment);
router.get('/razorpaykey',isLoggedIn,getRazorpayKey);
router.get ('/cancel-subscription',isLoggedIn,cancelSubscription);
router.route('/:id').get(isLoggedIn,authorizedSubcriber,viewAllPayments);

export default router;
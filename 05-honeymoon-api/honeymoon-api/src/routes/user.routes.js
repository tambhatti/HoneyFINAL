'use strict';
const router = require('express').Router();
const { authenticate, authorize, optionalAuth } = require('../middleware/auth');
const ctrl = require('../controllers/user.controller');

const isUser = [authenticate, authorize('user')];

/* Public (no auth needed) */
router.get('/home',                                  optionalAuth,  ctrl.getHome);
router.get('/vendors',                               optionalAuth,  ctrl.getVendors);
router.get('/vendors/:id',                           optionalAuth,  ctrl.getVendor);
router.get('/services',                              optionalAuth,  ctrl.getServices);
router.get('/services/:id',                          optionalAuth,  ctrl.getService);
router.get('/categories',                            optionalAuth,  ctrl.getCategories);
router.post('/contact',                              optionalAuth,  ctrl.contactUs);

/* Budget estimation — public */
router.post('/budget-estimate',                      optionalAuth,  ctrl.estimateBudget);

/* Authenticated — Profile */
router.get('/profile',                               ...isUser,     ctrl.getProfile);
router.put('/profile',                               ...isUser,     ctrl.updateProfile);
router.post('/profile/change-password',              ...isUser,     ctrl.changePassword);

/* Bookings */
router.get('/bookings',                              ...isUser,     ctrl.getMyBookings);
router.post('/bookings',                             ...isUser,     ctrl.createBooking);
router.get('/bookings/:id',                          ...isUser,     ctrl.getMyBooking);
router.post('/bookings/:id/cancel',                  ...isUser,     ctrl.cancelBooking);
router.post('/bookings/:id/rate',                    ...isUser,     ctrl.rateBooking);
router.post('/bookings/:id/report',                  ...isUser,     ctrl.reportBooking);

/* Custom Quotations */
router.get('/custom-quotations',                     ...isUser,     ctrl.getMyCustomQuotations);
router.post('/custom-quotations',                    ...isUser,     ctrl.requestCustomQuotation);
router.get('/custom-quotations/:id',                 ...isUser,     ctrl.getMyCustomQuotation);
router.post('/custom-quotations/:id/confirm',        ...isUser,     ctrl.confirmQuotation);

/* Payments */
/* Payment initiation is handled by /api/v1/payments/initiate (payment.controller) */
router.get('/payments',                              ...isUser,     ctrl.getMyPayments);

/* Meeting Requests */
router.get('/meeting-requests',                      ...isUser,     ctrl.getMyMeetingRequests);
router.post('/meeting-requests',                     ...isUser,     ctrl.requestMeeting);

/* Reported Bookings */
router.get('/reported-bookings',                     ...isUser,     ctrl.getMyReportedBookings);

/* Budgets */
router.get('/budgets',                               ...isUser,     ctrl.getMyBudgets);
router.post('/budgets',                              ...isUser,     ctrl.createBudget);
router.get('/budgets/:id',                           ...isUser,     ctrl.getMyBudget);
router.put('/budgets/:id',                           ...isUser,     ctrl.updateBudget);
router.delete('/budgets/:id',                        ...isUser,     ctrl.deleteBudget);

/* Loyalty */
router.get('/loyalty',                               ...isUser,     ctrl.getLoyalty);

/* Notifications */
router.get('/notifications',                         ...isUser,     ctrl.getNotifications);
router.patch('/notifications/:id/read',              ...isUser,     ctrl.markNotificationRead);
router.post('/notifications/mark-all-read',          ...isUser,     ctrl.markAllRead);

/* Wishlist */
router.get('/wishlist',                              ...isUser,     ctrl.getWishlist);
router.post('/wishlist/toggle',                      ...isUser,     ctrl.toggleWishlist);


/* AI Planner */
router.post('/ai-plan',                              ...isUser,     ctrl.generateAIPlan);

/* Budget Estimation (public) */
router.post('/budgets/estimate',                     ...isUser,     ctrl.estimateBudget);

/* Contact Us */
router.post('/contact-us',                           optionalAuth,  ctrl.contactUs);

module.exports = router;

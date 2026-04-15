'use strict';
const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/admin.controller');

const isAdmin = [authenticate, authorize('admin')];

/* Dashboard */
router.get('/dashboard',                                   ...isAdmin, ctrl.getDashboard);

/* Users */
router.get('/users',                                       ...isAdmin, ctrl.getUsers);
router.get('/users/:id',                                   ...isAdmin, ctrl.getUser);
router.patch('/users/:id/status',                          ...isAdmin, ctrl.updateUserStatus);

/* Vendors */
router.get('/vendors',                                     ...isAdmin, ctrl.getVendors);
// NOTE: /vendors/requests MUST be registered before /vendors/:id (literal beats param)
router.get('/vendors/requests',                            ...isAdmin, ctrl.getVendorRequests);
router.get('/vendors/:id',                                 ...isAdmin, ctrl.getVendor);
router.post('/vendors/:id/approve',                        ...isAdmin, ctrl.approveVendor);
router.post('/vendors/:id/reject',                         ...isAdmin, ctrl.rejectVendor);
router.patch('/vendors/:id/toggle-status',                 ...isAdmin, ctrl.toggleVendorStatus);
router.patch('/vendors/:id/commission',                    ...isAdmin, ctrl.updateCommission);

/* Categories */
router.get('/categories',                                  ...isAdmin, ctrl.getCategories);
router.post('/categories',                                 ...isAdmin, ctrl.createCategory);
router.get('/categories/:id',                              ...isAdmin, ctrl.getCategory);
router.put('/categories/:id',                              ...isAdmin, ctrl.updateCategory);
router.delete('/categories/:id',                           ...isAdmin, ctrl.deleteCategory);

/* Bookings */
router.get('/bookings',                                    ...isAdmin, ctrl.getBookings);
router.get('/bookings/export',                             ...isAdmin, ctrl.exportBookings);
router.get('/bookings/:id',                                ...isAdmin, ctrl.getBooking);

/* Reported Bookings */
router.get('/reported-bookings',                           ...isAdmin, ctrl.getReportedBookings);
router.patch('/reported-bookings/:id/resolve',             ...isAdmin, ctrl.resolveReport);

/* Meeting Requests */
router.get('/meeting-requests',                            ...isAdmin, ctrl.getMeetingRequests);
router.get('/meeting-requests/:id',                        ...isAdmin, ctrl.getMeetingRequest);

/* Subscription Plans */
router.get('/subscriptions',                               ...isAdmin, ctrl.getSubscriptionPlans);
router.post('/subscriptions',                              ...isAdmin, ctrl.createSubscriptionPlan);
router.get('/subscriptions/:id',                           ...isAdmin, ctrl.getSubscriptionPlan);
router.put('/subscriptions/:id',                           ...isAdmin, ctrl.updateSubscriptionPlan);
router.delete('/subscriptions/:id',                        ...isAdmin, ctrl.deleteSubscriptionPlan);
router.get('/subscription-logs',                           ...isAdmin, ctrl.getSubscriptionLogs);

/* Commission */
router.get('/commission',                                  ...isAdmin, ctrl.getCommissionConfig);
router.put('/commission',                                  ...isAdmin, ctrl.updateCommissionConfig);

/* Loyalty */
router.get('/loyalty',                                     ...isAdmin, ctrl.getLoyaltyConfig);
router.put('/loyalty',                                     ...isAdmin, ctrl.updateLoyaltyConfig);
router.get('/loyalty/logs',                                ...isAdmin, ctrl.getLoyaltyLogs);

/* Referral */
router.get('/referral',                                    ...isAdmin, ctrl.getReferralConfig);
router.put('/referral',                                    ...isAdmin, ctrl.updateReferralConfig);

/* Payouts */
router.get('/payouts',                                     ...isAdmin, ctrl.getPayouts);
router.get('/payouts/:id',                                 ...isAdmin, ctrl.getPayout);
router.patch('/payouts/:id/approve',                       ...isAdmin, ctrl.approvePayout);
router.patch('/payouts/:id/process',                       ...isAdmin, ctrl.processPayout);

/* Payment Logs */
router.get('/payment-logs',                                ...isAdmin, ctrl.getPaymentLogs);
router.get('/payment-logs/:id',                            ...isAdmin, ctrl.getPaymentLog);

/* Push Notifications */
router.get('/push-notifications',                          ...isAdmin, ctrl.getPushNotifications);
router.post('/push-notifications',                         ...isAdmin, ctrl.sendPushNotification);
router.get('/push-notifications/:id',                      ...isAdmin, ctrl.getPushNotification);

/* Ratings */
router.get('/ratings',                                     ...isAdmin, ctrl.getRatings);
router.patch('/ratings/:id/toggle-visibility',             ...isAdmin, ctrl.toggleReviewVisibility);

/* Home Content */
router.get('/home-content',                                ...isAdmin, ctrl.getHomeContent);
router.put('/home-content/:id',                            ...isAdmin, ctrl.updateHomeContent);

/* Queries */
router.get('/queries',                                     ...isAdmin, ctrl.getQueries);
router.get('/queries/:id',                                 ...isAdmin, ctrl.getQuery);
router.post('/queries/:id/reply',                          ...isAdmin, ctrl.replyToQuery);

/* Reports */
router.get('/reports',                                     ...isAdmin, ctrl.getReports);

/* Settings */
router.get('/settings',                                    ...isAdmin, ctrl.getSettings);
router.put('/settings',                                    ...isAdmin, ctrl.updateSettings);

/* Profile */
router.get('/profile',                                     ...isAdmin, ctrl.getProfile);
router.put('/profile',                                     ...isAdmin, ctrl.updateProfile);
router.post('/profile/change-password',                    ...isAdmin, ctrl.changePassword);

/* Notifications */
router.get('/notifications',                               ...isAdmin, ctrl.getNotifications);
router.patch('/notifications/:id/read',                    ...isAdmin, ctrl.markNotificationRead);
router.post('/notifications/mark-all-read',                ...isAdmin, ctrl.markAllNotificationsRead);


/* Users — create */
router.post('/users',                                              ...isAdmin, ctrl.createUser);

/* Exports */
router.get('/bookings/export',                                     ...isAdmin, ctrl.exportBookings);
router.get('/payments/export',                                     ...isAdmin, ctrl.exportPayments);

/* Referral (was missing from routes) — B-09 fix */
router.get('/referral',                                            ...isAdmin, ctrl.getReferralConfig);
router.put('/referral',                                            ...isAdmin, ctrl.updateReferralConfig);

/* Home Content */
router.get('/home-content',                                        ...isAdmin, ctrl.getHomeContent);
router.put('/home-content/:id',                                    ...isAdmin, ctrl.updateHomeContent);

/* Queries / Support */
router.get('/queries',                                             ...isAdmin, ctrl.getQueries);
router.get('/queries/:id',                                         ...isAdmin, ctrl.getQuery);
router.post('/queries/:id/reply',                                  ...isAdmin, ctrl.replyToQuery);

/* Reports */
router.get('/reports',                                             ...isAdmin, ctrl.getReports);

/* Settings */
router.get('/settings',                                            ...isAdmin, ctrl.getSettings);
router.put('/settings',                                            ...isAdmin, ctrl.updateSettings);

/* Admin Profile */
router.get('/profile',                                             ...isAdmin, ctrl.getProfile);
router.put('/profile',                                             ...isAdmin, ctrl.updateProfile);
router.post('/profile/change-password',                            ...isAdmin, ctrl.changePassword);

/* Notifications */
router.get('/notifications',                                       ...isAdmin, ctrl.getNotifications);
router.patch('/notifications/:id/read',                            ...isAdmin, ctrl.markNotificationRead);
router.post('/notifications/mark-all-read',                        ...isAdmin, ctrl.markAllNotificationsRead);

/* Ratings */
router.get('/ratings',                                             ...isAdmin, ctrl.getRatings);
router.patch('/ratings/:id/toggle',                                ...isAdmin, ctrl.toggleReviewVisibility);

module.exports = router;

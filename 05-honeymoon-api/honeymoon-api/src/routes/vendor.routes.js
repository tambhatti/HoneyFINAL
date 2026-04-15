'use strict';
const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/vendor.controller');

const isVendor = [authenticate, authorize('vendor')];

router.get('/dashboard',                                ...isVendor, ctrl.getDashboard);

/* Profile */
router.get('/profile',                                  ...isVendor, ctrl.getProfile);
router.put('/profile',                                  ...isVendor, ctrl.updateProfile);
router.post('/profile/change-password',                 ...isVendor, ctrl.changePassword);

/* Services */
router.get('/services',                                 ...isVendor, ctrl.getServices);
router.post('/services',                                ...isVendor, ctrl.createService);
router.get('/services/:id',                             ...isVendor, ctrl.getService);
router.put('/services/:id',                             ...isVendor, ctrl.updateService);
router.patch('/services/:id/toggle-status',             ...isVendor, ctrl.toggleServiceStatus);
router.delete('/services/:id',                          ...isVendor, ctrl.deleteService);

/* Add-ons */
router.get('/addons',                                   ...isVendor, ctrl.getAddons);
router.get('/addons/:id',                               ...isVendor, ctrl.getAddon);
router.post('/addons',                                  ...isVendor, ctrl.createAddon);
router.put('/addons/:id',                               ...isVendor, ctrl.updateAddon);
router.delete('/addons/:id',                            ...isVendor, ctrl.deleteAddon);

/* Bookings */
router.get('/bookings',                                 ...isVendor, ctrl.getBookings);
router.get('/bookings/requests',                        ...isVendor, ctrl.getBookingRequests);
router.get('/bookings/:id',                             ...isVendor, ctrl.getBooking);
router.post('/bookings/:id/approve',                    ...isVendor, ctrl.approveBooking);
router.post('/bookings/:id/reject',                     ...isVendor, ctrl.rejectBooking);
router.post('/bookings/:id/complete',                   ...isVendor, ctrl.completeBooking);

/* Custom Quotations */
router.get('/custom-quotations',                        ...isVendor, ctrl.getCustomQuotations);
router.get('/custom-quotations/:id',                    ...isVendor, ctrl.getCustomQuotation);
router.post('/custom-quotations/:id/send',              ...isVendor, ctrl.sendQuotation);
router.post('/custom-quotations/:id/reject',            ...isVendor, ctrl.rejectQuotationRequest);

/* Reported Bookings */
router.get('/reported-bookings',                        ...isVendor, ctrl.getReportedBookings);
router.get('/reported-bookings/:id',                    ...isVendor, ctrl.getReportedBooking);

/* Meeting Requests */
router.get('/meeting-requests',                         ...isVendor, ctrl.getMeetingRequests);
router.get('/meeting-requests/:id',                     ...isVendor, ctrl.getMeetingRequest);
router.patch('/meeting-requests/:id/status',            ...isVendor, ctrl.updateMeetingStatus);

/* Reviews */
router.get('/reviews',                                  ...isVendor, ctrl.getReviews);
router.post('/reviews/:id/reply',                       ...isVendor, ctrl.replyToReview);

/* Payment Logs */
router.get('/payment-logs',                             ...isVendor, ctrl.getPaymentLogs);

/* Subscription */
router.post('/subscription/pay',                       ...isVendor, ctrl.paySubscription);
router.get('/subscription',                             ...isVendor, ctrl.getSubscription);
router.get('/subscription-logs',                        ...isVendor, ctrl.getSubscriptionLogs);
router.post('/subscription/change',                     ...isVendor, ctrl.changeSubscription);

/* Bank Details */
router.get('/bank-details',                             ...isVendor, ctrl.getBankDetails);
router.post('/bank-details',                            ...isVendor, ctrl.addBankDetail);
router.put('/bank-details/:id',                         ...isVendor, ctrl.updateBankDetail);
router.delete('/bank-details/:id',                      ...isVendor, ctrl.deleteBankDetail);

/* Notifications */
router.get('/notifications',                            ...isVendor, ctrl.getNotifications);
router.patch('/notifications/:id/read',                 ...isVendor, ctrl.markNotificationRead);
router.post('/notifications/mark-all-read',             ...isVendor, ctrl.markAllRead);


router.post('/contact-us',                                ...isVendor,    ctrl.contactUs);
module.exports = router;

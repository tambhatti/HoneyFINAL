import { api } from './api';

const UserService = {

  // ── Home ────────────────────────────────────────────────────────────────
  getHome: () => api.get('/user/home', false),

  // ── Profile ─────────────────────────────────────────────────────────────
  getProfile:      ()       => api.get('/user/profile'),
  updateProfile:   (data)   => api.put('/user/profile', data),
  changePassword:  (data)   => api.post('/user/profile/change-password', data),

  // ── Vendors ─────────────────────────────────────────────────────────────
  getVendors:  (params = {}) => api.getQ('/user/vendors', params, false),
  getVendor:   (id)          => api.get(`/user/vendors/${id}`, false),

  // ── Services ────────────────────────────────────────────────────────────
  getServices:   (params = {}) => api.getQ('/user/services', params, false),
  getService:    (id)          => api.get(`/user/services/${id}`, false),
  getCategories: ()            => api.get('/user/categories', false),

  // ── Bookings ─────────────────────────────────────────────────────────────
  getBookings:    (params = {}) => api.getQ('/user/bookings', params),
  getBooking:     (id)          => api.get(`/user/bookings/${id}`),
  createBooking:  (data)        => api.post('/user/bookings', data),
  cancelBooking:  (id)          => api.post(`/user/bookings/${id}/cancel`, {}),
  rateBooking:    (id, data)    => api.post(`/user/bookings/${id}/rate`, data),
  reportBooking:  (id, data)    => api.post(`/user/bookings/${id}/report`, data),

  // ── Custom Quotations ────────────────────────────────────────────────────
  getCustomQuotations:     (params = {}) => api.getQ('/user/custom-quotations', params),
  getCustomQuotation:      (id)          => api.get(`/user/custom-quotations/${id}`),
  requestCustomQuotation:  (data)        => api.post('/user/custom-quotations', data),
  confirmQuotation:        (id)          => api.post(`/user/custom-quotations/${id}/confirm`, {}),

  // ── Payments ──────────────────────────────────────────────────────────────
  processPayment:  (data)  => api.post('/user/payments', data),
  getMyPayments:   ()      => api.get('/user/payments'),

  // ── Meeting Requests ──────────────────────────────────────────────────────
  getMeetingRequests: (params = {}) => api.getQ('/user/meeting-requests', params),
  requestMeeting:     (data)        => api.post('/user/meeting-requests', data),

  // ── Reported Bookings ──────────────────────────────────────────────────────
  getReportedBookings: () => api.get('/user/reported-bookings'),

  // ── Budgets ───────────────────────────────────────────────────────────────
  getBudgets:     (params = {}) => api.getQ('/user/budgets', params),
  getBudget:      (id)          => api.get(`/user/budgets/${id}`),
  createBudget:   (data)        => api.post('/user/budgets', data),
  updateBudget:   (id, data)    => api.put(`/user/budgets/${id}`, data),
  deleteBudget:   (id)          => api.delete(`/user/budgets/${id}`),
  estimateBudget: (data)        => api.post('/user/budget-estimate', data, false),

  // ── Loyalty ───────────────────────────────────────────────────────────────
  getLoyalty: () => api.get('/user/loyalty'),

  // ── Notifications ──────────────────────────────────────────────────────────
  getNotifications:       (params = {}) => api.getQ('/user/notifications', params),
  markNotificationRead:   (id)          => api.patch(`/user/notifications/${id}/read`, {}),
  markAllNotificationsRead: ()          => api.post('/user/notifications/mark-all-read', {}),

  // ── Wishlist ──────────────────────────────────────────────────────────────
  getWishlist:      ()           => api.get('/user/wishlist'),
  toggleWishlist:   (vendorId)   => api.post('/user/wishlist/toggle', { vendorId }),

  // ── Contact ───────────────────────────────────────────────────────────────
  contactUs: (data) => api.post('/user/contact', data, false),
};

export default UserService;

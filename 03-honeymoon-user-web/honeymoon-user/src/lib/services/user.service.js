'use client';
import api from '../api';

const U = '/user';

export const UserService = {
  // Public (no auth)
  getHome:          ()           => api.get(`${U}/home`),
  getVendors:       (params)     => api.getQ(`${U}/vendors`, params),
  getVendor:        (id)         => api.get(`${U}/vendors/${id}`),
  getServices:      (params)     => api.getQ(`${U}/services`, params),
  getService:       (id)         => api.get(`${U}/services/${id}`),
  getCategories:    ()           => api.get(`${U}/categories`),
  estimateBudget:   (data)       => api.post(`${U}/budget-estimate`, data),
  contactUs:        (data)       => api.post(`${U}/contact`, data),

  // Profile
  getProfile:       ()           => api.get(`${U}/profile`),
  updateProfile:    (data)       => api.put(`${U}/profile`, data),
  changePassword:   (data)       => api.post(`${U}/profile/change-password`, data),

  // Bookings
  getBookings:      (params)     => api.getQ(`${U}/bookings`, params),
  getBooking:       (id)         => api.get(`${U}/bookings/${id}`),
  createBooking:    (data)       => api.post(`${U}/bookings`, data),
  cancelBooking:    (id)         => api.post(`${U}/bookings/${id}/cancel`, {}),
  generateAIPlan:  (data)       => api.post(`${U}/ai-plan`, data),
  rateBooking:      (id, data)   => api.post(`${U}/bookings/${id}/rate`, data),
  reportBooking:    (id, data)   => api.post(`${U}/bookings/${id}/report`, data),

  // Custom Quotations
  getQuotations:    (params)     => api.getQ(`${U}/custom-quotations`, params),
  getQuotation:     (id)         => api.get(`${U}/custom-quotations/${id}`),
  requestQuotation: (data)       => api.post(`${U}/custom-quotations`, data),
  confirmQuotation: (id)         => api.post(`${U}/custom-quotations/${id}/confirm`, {}),

  // Payments
  processPayment:   (data)       => api.post('/payments/initiate', data),
  getPayments:      ()           => api.get('/payments/my'),
  downloadReceipt:  (id)         => `${process.env.NEXT_PUBLIC_API_URL||'http://localhost:5000/api/v1'}/payments/${id}/receipt`,

  // Meetings
  getMeetings:      (params)     => api.getQ(`${U}/meeting-requests`, params),
  requestMeeting:   (data)       => api.post(`${U}/meeting-requests`, data),

  // Reported
  getReported:      ()           => api.get(`${U}/reported-bookings`),

  // Budgets
  getBudgets:       (params)     => api.getQ(`${U}/budgets`, params),
  getBudget:        (id)         => api.get(`${U}/budgets/${id}`),
  createBudget:     (data)       => api.post(`${U}/budgets`, data),
  updateBudget:     (id, data)   => api.put(`${U}/budgets/${id}`, data),
  deleteBudget:     (id)         => api.del(`${U}/budgets/${id}`),

  // Loyalty
  getLoyalty:       ()           => api.get(`${U}/loyalty`),

  // Notifications
  getNotifications: (params)     => api.getQ(`${U}/notifications`, params),
  markRead:         (id)         => api.patch(`${U}/notifications/${id}/read`, {}),
  markAllRead:      ()           => api.post(`${U}/notifications/mark-all-read`, {}),

  // Wishlist
  getWishlist:      ()           => api.get(`${U}/wishlist`),
  toggleWishlist:   (vendorId)   => api.post(`${U}/wishlist/toggle`, { vendorId }),
};

export const AuthService = {
  login:      (email, pw)  => api.post('/auth/user/login', { email, password: pw }),
  signup:     (data)       => api.post('/auth/user/signup', data),
  logout:     (rt)         => api.post('/auth/logout', { refreshToken: rt }),
  forgot:     (email)      => api.post('/auth/forgot-password', { email, role: 'user' }),
  verifyOtp:  (email, otp) => api.post('/auth/verify-otp', { email, otp }),
  resetPw:    (email, pw, otp)  => api.post('/auth/reset-password', { email, newPassword: pw, otp, role: 'user' }),
  uaePassInit: ()          => api.get('/auth/uae-pass/init?role=user'),
};

export default UserService;

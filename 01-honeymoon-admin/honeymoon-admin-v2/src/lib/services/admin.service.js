'use client';
import api from '../api';

const A = '/admin';

export const AdminService = {
  // Dashboard
  getDashboard:       ()          => api.get(`${A}/dashboard`),

  // Users
  getUsers:           (params)    => api.getQ(`${A}/users`, params),
  getUser:            (id)        => api.get(`${A}/users/${id}`),
  updateUserStatus:   (id, status)=> api.patch(`${A}/users/${id}/status`, { status }),
  createUser:         (data)      => api.post(`${A}/users`, data),

  // Vendors
  getVendors:         (params)    => api.getQ(`${A}/vendors`, params),
  getVendor:          (id)        => api.get(`${A}/vendors/${id}`),
  getVendorRequests:  (params)    => api.getQ(`${A}/vendors/requests`, params),
  approveVendor:      (id)        => api.post(`${A}/vendors/${id}/approve`, {}),
  rejectVendor:       (id, reason)=> api.post(`${A}/vendors/${id}/reject`, { reason }),
  toggleVendorStatus: (id)        => api.patch(`${A}/vendors/${id}/toggle-status`, {}),
  updateCommission:   (id, rate)  => api.patch(`${A}/vendors/${id}/commission`, { commissionRate: rate }),

  // Categories
  getCategories:      ()          => api.get(`${A}/categories`),
  getCategory:        (id)        => api.get(`${A}/categories/${id}`),
  createCategory:     (data)      => api.post(`${A}/categories`, data),
  updateCategory:     (id, data)  => api.put(`${A}/categories/${id}`, data),
  deleteCategory:     (id)        => api.del(`${A}/categories/${id}`),

  // Bookings
  getBookings:        (params)    => api.getQ(`${A}/bookings`, params),
  getBooking:         (id)        => api.get(`${A}/bookings/${id}`),
  exportBookings:     (params)    => api.getQ(`${A}/bookings/export`, params),

  // Reported Bookings
  getReportedBookings: (params)   => api.getQ(`${A}/reported-bookings`, params),
  resolveReport:       (id, note) => api.patch(`${A}/reported-bookings/${id}/resolve`, { adminNote: note }),

  // Meeting Requests
  getMeetingRequests: (params)    => api.getQ(`${A}/meeting-requests`, params),
  getMeetingRequest:  (id)        => api.get(`${A}/meeting-requests/${id}`),

  // Subscription Plans
  getSubscriptionPlans:   ()          => api.get(`${A}/subscriptions`),
  getSubscriptionPlan:    (id)        => api.get(`${A}/subscriptions/${id}`),
  createSubscriptionPlan: (data)      => api.post(`${A}/subscriptions`, data),
  updateSubscriptionPlan: (id, data)  => api.put(`${A}/subscriptions/${id}`, data),
  deleteSubscriptionPlan: (id)        => api.del(`${A}/subscriptions/${id}`),
  getSubscriptionLogs:    (params)    => api.getQ(`${A}/subscription-logs`, params),

  // Commission
  getCommissionConfig:    ()      => api.get(`${A}/commission`),
  updateCommissionConfig: (data)  => api.put(`${A}/commission`, data),

  // Loyalty
  getLoyaltyConfig:     ()        => api.get(`${A}/loyalty`),
  updateLoyaltyConfig:  (data)    => api.put(`${A}/loyalty`, data),
  getLoyaltyLogs:       (params)  => api.getQ(`${A}/loyalty/logs`, params),

  // Referral
  getReferralConfig:    ()        => api.get(`${A}/referral`),
  updateReferralConfig: (data)    => api.put(`${A}/referral`, data),

  // Payouts
  getPayouts:     (params)        => api.getQ(`${A}/payments/payouts`, params),
  getPayout:      (id)            => api.get(`${A}/payouts/${id}`),
  approvePayout:  (id)            => api.patch(`${A}/payments/payouts/${id}/approve`, {}),
  processPayout:  (id)            => api.post(`${A}/payments/payouts/${id}/process`, {}),
  bulkPayouts:    (ids)           => api.post('/admin/payments/payouts/bulk-process', { payoutIds: ids }),

  // Payment Logs
  getPaymentLogs: (params)        => api.getQ(`${A}/payment-logs`, params),
  getPaymentLog:  (id)            => api.get(`${A}/payment-logs/${id}`),

  // Push Notifications
  getPushNotifications:  (params) => api.getQ(`${A}/push-notifications`, params),
  getPushNotification:   (id)     => api.get(`${A}/push-notifications/${id}`),
  sendPushNotification:  (data)   => api.post(`${A}/push-notifications`, data),

  // Ratings
  getRatings:            (params) => api.getQ(`${A}/ratings`, params),
  toggleReviewVisibility:(id)     => api.patch(`${A}/ratings/${id}/toggle-visibility`, {}),

  // Home Content
  getHomeContent:        ()       => api.get(`${A}/home-content`),
  updateHomeContent:     (id, d)  => api.put(`${A}/home-content/${id}`, d),

  // Queries
  getQueries:            (params) => api.getQ(`${A}/queries`, params),
  getQuery:              (id)     => api.get(`${A}/queries/${id}`),
  replyToQuery:          (id, r)  => api.post(`${A}/queries/${id}/reply`, { reply: r }),

  // Reports / Analytics
  getReports:            (params) => api.getQ(`${A}/reports`, params),

  // Settings
  getSettings:           ()       => api.get(`${A}/settings`),
  updateSettings:        (data)   => api.put(`${A}/settings`, data),

  // Profile
  getProfile:            ()       => api.get(`${A}/profile`),
  updateProfile:         (data)   => api.put(`${A}/profile`, data),
  changePassword:        (data)   => api.post(`${A}/profile/change-password`, data),

  // Notifications
  getNotifications:      (params) => api.getQ(`${A}/notifications`, params),
  markNotificationRead:  (id)     => api.patch(`${A}/notifications/${id}/read`, {}),
  markAllNotificationsRead: ()    => api.post(`${A}/notifications/mark-all-read`, {}),
};

export const AuthService = {
  login:  (email, password) => api.post('/auth/admin/login', { email, password }),
  logout: (refreshToken)    => api.post('/auth/logout', { refreshToken }),
};

export default AdminService;

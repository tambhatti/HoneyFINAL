# 🍯 Honeymoon Project — Backend API

Complete REST API for the Honeymoon wedding platform.  
Serves **Admin Dashboard**, **Vendor Dashboard**, **User Web App** and **User Mobile App**.

---

## 🚀 Quick Start

```bash
cd honeymoon-api
npm install
npm run dev        # http://localhost:5000
```

---

## 🔑 Test Credentials

| Role   | Email                    | Password     |
|--------|--------------------------|--------------|
| Admin  | admin@honeymoon.ae       | Admin@123    |
| Vendor | vendor1@example.com      | Vendor@123   |
| User   | user1@example.com        | User@123     |

---

## 🏗 Architecture

```
honeymoon-api/
├── src/
│   ├── server.js              # Express entry point
│   ├── config/
│   │   └── db.js              # In-memory DB (replace with PostgreSQL)
│   ├── middleware/
│   │   └── auth.js            # JWT authentication + role guards
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── admin.controller.js
│   │   ├── vendor.controller.js
│   │   └── user.controller.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── admin.routes.js
│   │   ├── vendor.routes.js
│   │   └── user.routes.js
│   └── utils/
│       ├── jwt.js
│       └── response.js
└── .env
```

---

## 📡 Base URL

```
http://localhost:5000/api/v1
```

---

## 🔐 Authentication

All protected routes require:
```
Authorization: Bearer <accessToken>
```

**Login → get token → use in all subsequent requests**

---

## 📋 Complete Endpoint Reference

---

### AUTH  `/api/v1/auth`

| Method | Endpoint                 | Description                        | Auth |
|--------|--------------------------|------------------------------------|------|
| POST   | `/admin/login`           | Admin login → returns JWT          | ❌   |
| POST   | `/vendor/login`          | Vendor login → returns JWT         | ❌   |
| POST   | `/vendor/signup`         | Vendor registration                | ❌   |
| POST   | `/user/login`            | User login → returns JWT           | ❌   |
| POST   | `/user/signup`           | User registration + referral bonus | ❌   |
| POST   | `/forgot-password`       | Send OTP to email                  | ❌   |
| POST   | `/verify-otp`            | Verify OTP code                    | ❌   |
| POST   | `/reset-password`        | Set new password                   | ❌   |
| POST   | `/refresh-token`         | Get new access token               | ❌   |
| POST   | `/logout`                | Invalidate refresh token           | ✅   |

**Login Request:**
```json
{ "email": "admin@honeymoon.ae", "password": "Admin@123" }
```

**Login Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "expiresIn": "7d",
  "admin": { "id": "admin-1", "firstName": "Super", ... }
}
```

---

### ADMIN  `/api/v1/admin`  🔒 role: admin

#### Dashboard
| Method | Endpoint         | Description                              |
|--------|------------------|------------------------------------------|
| GET    | `/dashboard`     | Stats: users, vendors, bookings, revenue |

#### User Management
| Method | Endpoint                 | Description                     |
|--------|--------------------------|---------------------------------|
| GET    | `/users`                 | List users (paginated, search)  |
| GET    | `/users/:id`             | User profile + booking history  |
| PATCH  | `/users/:id/status`      | Toggle Active / Inactive        |

#### Vendor Management
| Method | Endpoint                          | Description                   |
|--------|-----------------------------------|-------------------------------|
| GET    | `/vendors`                        | List vendors (filter by status)|
| GET    | `/vendors/requests`               | Pending approval requests      |
| GET    | `/vendors/:id`                    | Vendor profile + services      |
| POST   | `/vendors/:id/approve`            | Approve vendor account         |
| POST   | `/vendors/:id/reject`             | Reject with reason             |
| PATCH  | `/vendors/:id/toggle-status`      | Active ↔ Inactive              |
| PATCH  | `/vendors/:id/commission`         | Set commission rate            |

#### Categories
| Method | Endpoint              | Description            |
|--------|-----------------------|------------------------|
| GET    | `/categories`         | List all categories    |
| POST   | `/categories`         | Create new category    |
| GET    | `/categories/:id`     | Get single category    |
| PUT    | `/categories/:id`     | Update category        |
| DELETE | `/categories/:id`     | Delete category        |

#### Booking Management
| Method | Endpoint                          | Description                    |
|--------|-----------------------------------|--------------------------------|
| GET    | `/bookings`                       | All bookings (filter + search) |
| GET    | `/bookings/export`                | Export as Excel/PDF            |
| GET    | `/bookings/:id`                   | Booking detail + user/vendor   |

#### Reported Bookings
| Method | Endpoint                          | Description        |
|--------|-----------------------------------|--------------------|
| GET    | `/reported-bookings`              | List reports       |
| PATCH  | `/reported-bookings/:id/resolve`  | Mark as resolved   |

#### Meeting Requests
| Method | Endpoint                   | Description       |
|--------|----------------------------|-------------------|
| GET    | `/meeting-requests`        | All requests      |
| GET    | `/meeting-requests/:id`    | Request detail    |

#### Subscription Plans
| Method | Endpoint                   | Description                   |
|--------|----------------------------|-------------------------------|
| GET    | `/subscriptions`           | List all plans (Basic/Std/Prem)|
| POST   | `/subscriptions`           | Create new plan               |
| GET    | `/subscriptions/:id`       | Get plan detail               |
| PUT    | `/subscriptions/:id`       | Update plan pricing/features  |
| DELETE | `/subscriptions/:id`       | Remove plan                   |
| GET    | `/subscription-logs`       | All vendor subscription logs  |

#### Commission
| Method | Endpoint       | Description                       |
|--------|----------------|-----------------------------------|
| GET    | `/commission`  | Current commission config         |
| PUT    | `/commission`  | Update default/premium/standard % |

#### Loyalty Program
| Method | Endpoint           | Description                         |
|--------|--------------------|-------------------------------------|
| GET    | `/loyalty`         | Config (base amount, point value)   |
| PUT    | `/loyalty`         | Update loyalty config               |
| GET    | `/loyalty/logs`    | All loyalty point transactions      |

#### Referral
| Method | Endpoint     | Description              |
|--------|--------------|--------------------------|
| GET    | `/referral`  | Referral bonus config    |
| PUT    | `/referral`  | Update bonus amounts     |

#### Payouts
| Method | Endpoint                     | Description             |
|--------|------------------------------|-------------------------|
| GET    | `/payouts`                   | All payouts             |
| GET    | `/payouts/:id`               | Payout detail           |
| PATCH  | `/payouts/:id/approve`       | Approve payout          |
| PATCH  | `/payouts/:id/process`       | Mark as paid            |

#### Payment Logs
| Method | Endpoint                  | Description        |
|--------|---------------------------|--------------------|
| GET    | `/payment-logs`           | All payment logs   |
| GET    | `/payment-logs/:id`       | Single log detail  |

#### Push Notifications
| Method | Endpoint                     | Description                    |
|--------|------------------------------|--------------------------------|
| GET    | `/push-notifications`        | All sent push notifications    |
| POST   | `/push-notifications`        | Send new push notification     |
| GET    | `/push-notifications/:id`    | Notification detail            |

**Send Notification Body:**
```json
{ "title": "New Feature!", "message": "Check out our latest update", "audience": "all" }
```
> audience: `"all"` | `"users"` | `"vendors"`

#### Ratings & Reviews
| Method | Endpoint                              | Description                |
|--------|---------------------------------------|----------------------------|
| GET    | `/ratings`                            | All platform reviews       |
| PATCH  | `/ratings/:id/toggle-visibility`      | Show / hide review         |

#### Home Content
| Method | Endpoint                  | Description                     |
|--------|---------------------------|---------------------------------|
| GET    | `/home-content`           | All homepage sections           |
| PUT    | `/home-content/:id`       | Update section (title, image)   |

#### Queries
| Method | Endpoint                   | Description              |
|--------|----------------------------|--------------------------|
| GET    | `/queries`                 | All user queries         |
| GET    | `/queries/:id`             | Query detail             |
| POST   | `/queries/:id/reply`       | Reply to query           |

#### Reports
| Method | Endpoint     | Description                               |
|--------|--------------|-------------------------------------------|
| GET    | `/reports`   | Platform analytics (revenue, bookings)    |

#### Settings
| Method | Endpoint     | Description                         |
|--------|--------------|-------------------------------------|
| GET    | `/settings`  | Platform settings                   |
| PUT    | `/settings`  | Update maintenance mode, etc.       |

#### Profile
| Method | Endpoint                       | Description          |
|--------|--------------------------------|----------------------|
| GET    | `/profile`                     | Admin profile        |
| PUT    | `/profile`                     | Update profile       |
| POST   | `/profile/change-password`     | Change password      |

#### Notifications
| Method | Endpoint                          | Description                    |
|--------|-----------------------------------|--------------------------------|
| GET    | `/notifications`                  | Admin notifications            |
| PATCH  | `/notifications/:id/read`         | Mark single as read            |
| POST   | `/notifications/mark-all-read`    | Mark all as read               |

---

### VENDOR  `/api/v1/vendor`  🔒 role: vendor

#### Dashboard
| Method | Endpoint      | Description                                       |
|--------|---------------|---------------------------------------------------|
| GET    | `/dashboard`  | Stats: bookings, revenue, rating, pending         |

#### Profile
| Method | Endpoint                   | Description                           |
|--------|----------------------------|---------------------------------------|
| GET    | `/profile`                 | My profile                            |
| PUT    | `/profile`                 | Update personal + company details     |
| POST   | `/profile/change-password` | Change password                       |

#### Services
| Method | Endpoint                       | Description                           |
|--------|--------------------------------|---------------------------------------|
| GET    | `/services`                    | My services list                      |
| POST   | `/services`                    | Add service (step 1: detail+pricing)  |
| GET    | `/services/:id`                | Service detail                        |
| PUT    | `/services/:id`                | Edit service                          |
| PATCH  | `/services/:id/toggle-status`  | Active ↔ Inactive                     |
| DELETE | `/services/:id`                | Remove service                        |

**Create Service Body:**
```json
{
  "name": "Premium Venue Package",
  "category": "Venue",
  "pricingType": "Per Guest",
  "basePrice": 5000,
  "minGuests": 50,
  "maxGuests": 500,
  "depositPercent": 20,
  "location": "Dubai",
  "packages": [{ "name": "Package ABC", "price": 2000 }],
  "policies": { "depositRefundable": false, "cancellationNotice": "14 Days" }
}
```

#### Add-Ons
| Method | Endpoint        | Description             |
|--------|-----------------|-------------------------|
| GET    | `/addons`       | My add-ons list         |
| POST   | `/addons`       | Create add-on           |
| PUT    | `/addons/:id`   | Edit add-on             |
| DELETE | `/addons/:id`   | Remove add-on           |

#### Booking Management
| Method | Endpoint                        | Description                      |
|--------|---------------------------------|----------------------------------|
| GET    | `/bookings`                     | My bookings (filter by status)   |
| GET    | `/bookings/requests`            | Pending booking requests         |
| GET    | `/bookings/:id`                 | Booking detail + user info       |
| POST   | `/bookings/:id/approve`         | ✅ Approve → Upcoming            |
| POST   | `/bookings/:id/reject`          | ❌ Reject with reason            |
| POST   | `/bookings/:id/complete`        | ✔️ Mark as Completed             |

#### Custom Quotations
| Method | Endpoint                              | Description                        |
|--------|---------------------------------------|------------------------------------|
| GET    | `/custom-quotations`                  | Requests + bookings (subTab param) |
| GET    | `/custom-quotations/:id`              | Quotation detail + AI data         |
| POST   | `/custom-quotations/:id/send`         | Send quotation amount to user      |
| POST   | `/custom-quotations/:id/reject`       | Reject request                     |

**Send Quotation Body:**
```json
{ "quotationAmount": 8500 }
```

#### Reviews
| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| GET    | `/reviews`                  | My reviews (filter 1-5★) |
| POST   | `/reviews/:id/reply`        | Reply to customer review |

#### Subscription
| Method | Endpoint                   | Description                          |
|--------|----------------------------|--------------------------------------|
| GET    | `/subscription`            | Current plan + all available plans   |
| GET    | `/subscription-logs`       | My subscription history              |
| POST   | `/subscription/change`     | Upgrade/downgrade plan               |

#### Bank Details
| Method | Endpoint                  | Description               |
|--------|---------------------------|---------------------------|
| GET    | `/bank-details`           | My bank accounts          |
| POST   | `/bank-details`           | Add bank account          |
| PUT    | `/bank-details/:id`       | Update bank account       |
| DELETE | `/bank-details/:id`       | Remove bank account       |

#### Meeting Requests
| Method | Endpoint                              | Description              |
|--------|---------------------------------------|--------------------------|
| GET    | `/meeting-requests`                   | All my meeting requests  |
| GET    | `/meeting-requests/:id`               | Request detail           |
| PATCH  | `/meeting-requests/:id/status`        | Update status            |

> Status values: `Pending` → `Contacted` → `Meeting Scheduled` → `Converted` / `Lost`

#### Other Vendor Endpoints
| Method | Endpoint                              | Description           |
|--------|---------------------------------------|-----------------------|
| GET    | `/reported-bookings`                  | Reported against me   |
| GET    | `/payment-logs`                       | My payment history    |
| GET    | `/notifications`                      | My notifications      |
| PATCH  | `/notifications/:id/read`             | Mark as read          |
| POST   | `/notifications/mark-all-read`        | Mark all read         |

---

### USER  `/api/v1/user`  🔒 role: user  (some public ❌)

#### Public Browsing (no auth)
| Method | Endpoint              | Auth | Description                        |
|--------|-----------------------|------|------------------------------------|
| GET    | `/home`               | ❌   | Featured vendors + categories      |
| GET    | `/vendors`            | ❌   | Browse vendors (filter, search)    |
| GET    | `/vendors/:id`        | ❌   | Vendor profile + services + reviews|
| GET    | `/services`           | ❌   | Browse services (filter, search)   |
| GET    | `/services/:id`       | ❌   | Full service detail + add-ons      |
| GET    | `/categories`         | ❌   | Active categories list             |
| POST   | `/budget-estimate`    | ❌   | AI budget estimation               |
| POST   | `/contact`            | ❌   | Submit contact form                |

**Budget Estimate Body:**
```json
{ "location": "Dubai", "guestCount": 300 }
```

**Budget Estimate Response:**
```json
{
  "estimatedBudget": 75000,
  "range": { "min": 60000, "max": 97500 },
  "breakdown": { "Venue": 26250, "Catering": 22500, ... },
  "aiMessage": "Most couples in Dubai with 300 guests spend between AED 60,000 - AED 97,500 on average."
}
```

#### Profile
| Method | Endpoint                      | Description          |
|--------|-------------------------------|----------------------|
| GET    | `/profile`                    | My profile           |
| PUT    | `/profile`                    | Update profile       |
| POST   | `/profile/change-password`    | Change password      |

#### Bookings
| Method | Endpoint                      | Description                            |
|--------|-------------------------------|----------------------------------------|
| GET    | `/bookings`                   | My bookings (filter status/type)       |
| POST   | `/bookings`                   | Book a service                         |
| GET    | `/bookings/:id`               | Booking detail                         |
| POST   | `/bookings/:id/cancel`        | Cancel (Pending only)                  |
| POST   | `/bookings/:id/rate`          | Submit rating + review (Completed)     |
| POST   | `/bookings/:id/report`        | Report a booking issue                 |

**Create Booking Body:**
```json
{
  "serviceId": "svc-1",
  "vendorId": "vendor-1",
  "eventDate": "2025-06-15",
  "eventTime": "10:00 - 18:00",
  "guestCount": 200,
  "addons": ["addon-1"],
  "location": "Dubai Marina",
  "additionalNote": "We need outdoor setup",
  "loyaltyPointsToUse": 500
}
```

#### Custom Quotations
| Method | Endpoint                          | Description                       |
|--------|-----------------------------------|-----------------------------------|
| GET    | `/custom-quotations`              | My quotation requests             |
| POST   | `/custom-quotations`              | Request custom quotation          |
| GET    | `/custom-quotations/:id`          | Quotation detail + AI data        |
| POST   | `/custom-quotations/:id/confirm`  | Accept vendor's quotation         |

#### Payments
| Method | Endpoint     | Description                             |
|--------|--------------|-----------------------------------------|
| POST   | `/payments`  | Process payment (deposit or final)      |
| GET    | `/payments`  | My payment history                      |

**Payment Body:**
```json
{ "bookingId": "BK000001", "amount": 5000, "method": "card" }
```

#### Other User Endpoints
| Method | Endpoint                           | Description                         |
|--------|------------------------------------|-------------------------------------|
| GET    | `/meeting-requests`                | My meeting requests                 |
| POST   | `/meeting-requests`                | Request meeting with vendor         |
| GET    | `/reported-bookings`               | My submitted reports                |
| GET    | `/budgets`                         | My wedding budgets                  |
| POST   | `/budgets`                         | Create budget                       |
| GET    | `/budgets/:id`                     | Budget detail                       |
| PUT    | `/budgets/:id`                     | Edit budget allocations             |
| DELETE | `/budgets/:id`                     | Delete budget                       |
| GET    | `/loyalty`                         | Points balance + referral code      |
| GET    | `/notifications`                   | My notifications                    |
| PATCH  | `/notifications/:id/read`          | Mark single as read                 |
| POST   | `/notifications/mark-all-read`     | Mark all as read                    |
| GET    | `/wishlist`                        | Saved vendors                       |
| POST   | `/wishlist/toggle`                 | Add/remove from wishlist            |

---

## 📦 Response Format

All responses follow this structure:

**Success:**
```json
{
  "success": true,
  "message": "Action completed",
  "data": { ... },
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}
```

**Error:**
```json
{
  "success": false,
  "message": "Descriptive error message",
  "errors": [ ... ]
}
```

---

## 🗄 Database Migration (Production)

Replace `src/config/db.js` with a real PostgreSQL client:

```sql
-- Key tables needed:
CREATE TABLE admins (...);
CREATE TABLE users (...);
CREATE TABLE vendors (...);
CREATE TABLE categories (...);
CREATE TABLE services (...);
CREATE TABLE addons (...);
CREATE TABLE bookings (...);
CREATE TABLE custom_quotations (...);
CREATE TABLE payments (...);
CREATE TABLE reviews (...);
CREATE TABLE notifications (...);
CREATE TABLE push_notifications (...);
CREATE TABLE meeting_requests (...);
CREATE TABLE reported_bookings (...);
CREATE TABLE subscription_plans (...);
CREATE TABLE subscription_logs (...);
CREATE TABLE budgets (...);
CREATE TABLE loyalty_logs (...);
CREATE TABLE payouts (...);
CREATE TABLE queries (...);
CREATE TABLE bank_details (...);
CREATE TABLE home_content (...);
CREATE TABLE refresh_tokens (...);
```

---

## 🔧 Environment Variables

```env
PORT=5000
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
NODE_ENV=development
CORS_ORIGIN=http://localhost:3002,http://localhost:3003,http://localhost:3004

# Production additions:
DATABASE_URL=postgresql://user:pass@host:5432/honeymoon
REDIS_URL=redis://localhost:6379
AWS_S3_BUCKET=honeymoon-uploads
SMTP_HOST=smtp.sendgrid.net
TWILIO_SID=...
PAYTABS_PROFILE_ID=...
```

# LMS — Learning Management System

A full-stack Learning Management System built with the MERN stack. Admins can create and manage courses with video lectures, users can browse and purchase subscriptions via Razorpay, and access course content once subscribed.

## Features

- **Authentication & Authorization** — JWT-based auth with cookies, role-based access control (`USER` / `ADMIN`), profile avatar upload, password reset via email, and change password flow.
- **Course Management** — Admins can create, update, and delete courses, and add video lectures to a course (uploaded via Multer, stored on Cloudinary).
- **Subscriptions & Payments** — Razorpay integration for subscribing, verifying payments, cancelling subscriptions, and viewing payment history.
- **Course Access Control** — Only subscribed users (or admins) can view full course/lecture details.
- **Frontend Pages** — Home, course listing, course details, checkout (success/fail), signup/login, forgot/reset/change password, user profile, admin dashboard, create/edit course, about, and contact pages.
- **State Management** — Redux Toolkit slices for auth, courses, and payments.

## Tech Stack

**Frontend (`/client`)**
- React 19 + Vite
- Redux Toolkit / React-Redux
- React Router v7
- Tailwind CSS v4 + DaisyUI
- Axios
- Chart.js (`react-chartjs-2`) for admin analytics
- React Hot Toast, React Icons

**Backend (`/server`)**
- Node.js + Express 5
- MongoDB + Mongoose
- JWT authentication (`jsonwebtoken`) + `bcrypt` for password hashing
- Multer for file uploads, Cloudinary for media storage
- Razorpay for payments
- Nodemailer for transactional emails (password reset)
- Morgan for logging, CORS, cookie-parser

## Project Structure

```
LMS/
├── client/                # React frontend (Vite)
│   ├── src/
│   │   ├── Components/
│   │   ├── Layouts/
│   │   ├── Pages/
│   │   ├── Redux/
│   │   │   └── Slices/    # AuthSlice, CourseSlice, PaymentSlice
│   │   └── Helpers/
│   └── ...
└── server/                # Express backend
    ├── config/            # DB connection
    ├── controllers/       # user, course, payment logic
    ├── middlewares/        # auth, error handling, multer
    ├── models/            # User, Course, Payment (Mongoose schemas)
    ├── routes/            # user, course, payment routes
    ├── utils/             # error + email utilities
    ├── app.js
    └── server.js
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB instance (local or Atlas)
- Cloudinary account
- Razorpay account
- SMTP credentials for sending emails (e.g., via Nodemailer)

### 1. Clone the repository
```bash
git clone https://github.com/ShubhamP08/LMS.git
cd LMS
```

### 2. Backend setup
```bash
cd server
npm install
```

Create a `.env` file in `server/` with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:5173

JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

EMAIL_USER=your_smtp_username
EMAIL_PASSWORD=your_smtp_password
EMAIL_FROM=your_from_email
```

Run the backend in development mode:
```bash
npm run dev
```
The API will be available at `http://localhost:5000`.

### 3. Frontend setup
```bash
cd ../client
npm install
npm run dev
```
The frontend will be available at `http://localhost:5173` (default Vite port).

> Make sure `FRONTEND_URL` in the backend `.env` matches the URL the frontend runs on (for CORS).

## API Overview

Base URL: `/api/v1`

### User (`/user`)
| Method | Endpoint            | Description                          | Auth        |
|--------|----------------------|---------------------------------------|-------------|
| POST   | `/register`          | Register a new user                   | Public      |
| POST   | `/login`              | Log in                                | Public      |
| GET    | `/getdetails`         | Get logged-in user's details          | Logged in   |
| POST   | `/logout`             | Log out                               | Public      |
| POST   | `/reset`              | Request password reset email          | Public      |
| POST   | `/reset/:token`       | Reset password with token             | Public      |
| POST   | `/change-password`    | Change password                       | Logged in   |
| PUT    | `/update`             | Update profile                        | Logged in   |

### Course (`/course`)
| Method | Endpoint | Description                          | Auth                    |
|--------|----------|---------------------------------------|--------------------------|
| GET    | `/`      | List all courses                      | Public                  |
| POST   | `/`      | Create a course                       | Admin                   |
| PUT    | `/:id`   | Update a course                       | Admin                   |
| DELETE | `/:id`   | Delete a course                       | Admin                   |
| POST   | `/:id`   | Add a lecture to a course              | Admin                   |
| GET    | `/:id`   | Get full course details (with lectures)| Logged in + subscribed |

### Payment (`/payment`)
| Method | Endpoint             | Description                    | Auth                     |
|--------|------------------------|---------------------------------|----------------------------|
| POST   | `/subscribe`          | Start a subscription            | Logged in                 |
| POST   | `/verify`              | Verify a Razorpay payment       | Logged in                 |
| GET    | `/razorpaykey`        | Get the Razorpay public key     | Logged in                 |
| GET    | `/cancel-subscription`| Cancel active subscription      | Logged in                 |
| GET    | `/:id`                | View payment history            | Logged in + subscribed    |

## Contributing

Contributions are welcome! Please open an issue to discuss what you'd like to change, or submit a pull request.

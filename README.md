# TastyBite — Food Ordering Website (MERN + JWT)

## Features
- **Authentication**: JWT login/register, role toggle at signup (Customer / Restaurant Admin)
- **Menu Browsing**: search, category filter, veg-only filter, sort by price/rating
- **Food Details**: full description, ratings & reviews (customers can rate/review)
- **Cart**: add/update/remove items, persisted server-side per user
- **Checkout**: delivery address, payment method selection, coupon code application
- **Orders**: order history with live status tracker (pending → preparing → out for delivery → delivered), cancel while pending
- **Admin — Menu Management**: full CRUD on dishes (name, price, category, image, veg/non-veg, availability)
- **Admin — Order Management**: view all orders, advance status, cancel
- **Admin — Coupons**: create/enable/disable/delete discount codes with minimum order thresholds
- **Admin Dashboard & Reports**: total orders/revenue/customers/menu items, plus 5 charts — daily orders, daily revenue, top-selling dishes, revenue by category, order status breakdown

## Extra features beyond a basic food ordering app
- Coupon/discount code system with minimum order amount rules
- Star ratings + written reviews per dish, with live average recalculation
- Order status tracker UI (visual progress steps, not just a text label)
- Veg/non-veg filter and badge system
- Cart badge with live item count in the nav

## Tech Stack
- Frontend: React 18, Vite, React Router, Axios, Recharts (reports)
- Backend: Node.js, Express.js
- Database: MongoDB (Mongoose)
- Auth: JWT (jsonwebtoken + bcryptjs)
- Styling: Custom CSS — glassmorphism, dark/light theme toggle, scroll animations, orange/red/emerald palette

## Folder Structure
```
food/
├── backend/
│   ├── config/db.js
│   ├── models/          User, FoodItem, Cart, Order, Review, Coupon
│   ├── controllers/      auth, food, cart, order, review, coupon, dashboard
│   ├── routes/
│   ├── middleware/       auth (JWT + role check), errorHandler
│   └── server.js
└── frontend/
    └── src/
        ├── pages/         Login, Register, Home (role router), Menu, FoodDetails,
        │                  Cart, Checkout, MyOrders, AdminMenu, AdminOrders,
        │                  AdminCoupons, AdminDashboard, Reports
        ├── components/    Layout (role-aware nav + cart badge), ProtectedRoute,
        │                  FoodCard, Reveal
        ├── context/       AuthContext (JWT), ThemeContext, CartContext
        ├── hooks/         useScrollReveal
        ├── api/axios.js
        └── index.css
```

## Roles
Anyone can register as either **Customer** or **Restaurant Admin** directly at signup — no manual promotion needed. In a real production restaurant system you'd typically lock admin behind an invite code, but for this project it's self-serve so you can demo both roles immediately.

## Business rules enforced server-side
- Cart quantity of 0 or less automatically removes the item
- Coupons validate against a minimum order amount before applying
- Orders can only be cancelled by their owner while status is still `pending`
- Placing an order clears the cart atomically after order creation
- Reviews are one-per-user-per-dish (submitting again updates your existing review instead of duplicating), and the dish's average rating recalculates automatically

## Backend setup
```
cd backend
npm install
cp .env.example .env
```
Fill in `MONGO_URI` and `JWT_SECRET`.
```
npm run dev
```

## Frontend setup
```
cd frontend
npm install
cp .env.example .env
```
Fill in `VITE_API_URL`.
```
npm run dev
```

## Deploy
Same pattern as previous projects: Vercel (frontend) + Render (backend) + MongoDB Atlas (database).
`vercel.json` included for SPA routing.

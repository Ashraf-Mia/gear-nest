# GearNest

GearNest is an equipment rental marketplace. Equipment owners can list their equipment for rent, and customers can browse, book and pay online for a chosen period. Admins manage users, equipment and all rental activity.

## Live URL

- **Live Site:** https://gear-nest-ivory.vercel.app
- **Server:** https://gear-nest-server-black.vercel.app

## Admin Login (for testing)

- **Email:** ashrafali27483@gmail.com
- **Password:** Aa123456

## Purpose

The goal of this project is to connect equipment owners and customers in a safe and simple rental platform. Customers can find the equipment they need without buying it, and owners can earn money from equipment they are not using.

## Key Features

### General

- Fully responsive design for mobile, tablet and desktop
- Dark mode and light mode with a theme toggle (saved in local storage)
- Smooth animations using Framer Motion
- Loading, error and 404 pages

### Authentication and Authorization

- Register and login with email and password
- Google and Facebook social login
- Password rules: at least 8 characters, one uppercase letter, one lowercase letter and one number
- Show and hide password button
- JWT based authentication using BetterAuth
- Role based access control with three roles: Customer, Owner and Admin
- Custom Express middlewares: `verifyToken`, `verifyRenter`, `verifyOwner` and `verifyAdmin`

### Home Page

- Animated banner
- Featured equipment (6 approved items, using MongoDB limit)
- Popular categories
- How it works
- Why choose us
- Customer reviews
- Become an owner section

### All Equipment Page

- Shows only approved equipment in a 3 column grid
- Search by equipment name or location
- Filter by category, rental type, price range and availability
- Sort by price (low to high, high to low) and recently added
- All search, filter and sorting is done on the server
- Pagination

### Booking and Payment

- Booking modal with start date, end date, quantity, contact number, delivery address and notes
- Total price is calculated on the server, not trusted from the browser
- Real availability check that removes quantity already booked on overlapping dates
- Stripe Checkout payment
- Booking and payment records are saved after successful payment
- Stripe webhook as a backup to confirm payments
- Payment success and cancel pages

### Customer Dashboard

- My Rentals table
- Favorites
- Profile (view and edit)

### Owner Dashboard

- Add equipment
- My equipment
- My equipment rentals
- Analytics with total equipment, completed rentals, total earnings and monthly earnings chart
- Profile (view and edit)

### Admin Dashboard

- Analytics with total users, total equipment, total bookings, total revenue, pending approvals, completed rentals and monthly charts
- Approve or reject equipment
- Manage users and roles
- View all rentals
- Profile (view and edit)

## Technologies Used

**Client**

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- BetterAuth

**Server**

- Node.js
- Express.js
- MongoDB
- Stripe

## npm Packages

### Client

- `next`
- `react`
- `typescript`
- `tailwindcss`
- `shadcn` (shadcn/ui components)
- `better-auth`
- `mongodb`
- `framer-motion`
- `next-themes`
- `lucide-react`
- `react-icons`
- `sonner`
- `recharts`

### Server

- `express`
- `cors`
- `dotenv`
- `mongodb`
- `jose`
- `stripe`

## Test Payment Card

Use this Stripe test card to try the payment:

- Card number: `4242 4242 4242 4242`
- Expiry: any future date
- CVC: any 3 digits

## Author

Ashraf Mia

- GitHub: https://github.com/Ashraf-Mia
- LinkedIn: www.linkedin.com/in/ashraf-mia-795b09443

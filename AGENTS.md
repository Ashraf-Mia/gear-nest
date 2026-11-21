<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# GearNest — Assignment 9 (Category 003) Requirements & Agent Handbook

> **What this file is:** the working specification for the Equipment Rental Platform assignment, plus the current implementation audit and the rules every agent must follow. It is written so a fresh agent can continue the project without re-reading the original brief.
>
> **Source of truth:** the assignment brief reproduced/structured below. If code and this document disagree, this document describes what is *required*; the status audit says what is *currently built*.
>
> **Last audited:** 2026-11-21. Update the status tables whenever a feature lands.
>
> **Do not remove** the `nextjs-agent-rules` block above. `next dev` regenerates it, and committing it keeps the working tree clean.

---

## 0. How to use this file

1. Read sections 1–3 first. They define the grading gates and what already exists.
2. Pick work from section 7 (pages) or section 6 (API), then follow section 14 (conventions).
3. Before writing any code, read the relevant Next.js 16 guide in `node_modules/next/dist/docs/`. This is Next.js 16 with `cacheComponents`, `partialPrefetching`, and the React Compiler enabled; training-data Next.js patterns may be wrong.
4. Update the status table in section 3 and the commit-count note in section 14.6 when you finish work.
5. Never commit `.env` files or real credentials. Variable *names* are documented in section 13.

**Repositories**

| Repo | Path | Remote |
|---|---|---|
| Client (Next.js) | `C:\projects\assingment-09\gear_nest` | `https://github.com/Ashraf-Mia/gear-nest.git` |
| Server (Express) | `C:\projects\assingment-09\gear-nest-server` | `https://github.com/Ashraf-Mia/gear-nest-server.git` |

The two repos are separate Git repositories. Client commits and server commits are counted separately.

---

## 1. Non-negotiable grading gates

These are pass/fail. A missing item can zero the submission regardless of feature quality.

| # | Gate | Evidence required | Status |
|---|---|---|---|
| G1 | ≥ **20 meaningful client commits** with descriptive messages | `git log` in client repo | ❌ 16 as of audit |
| G2 | ≥ **12 meaningful server commits** with descriptive messages | `git log` in server repo | ❌ 8 as of audit |
| G3 | README with project name, purpose, **live URL**, key features, npm packages used | `README.md` in client repo | ❌ still the Create Next App default |
| G4 | Frontend config keys secured via environment variables | no keys hard-coded; `.env*` gitignored | 🟡 mostly done |
| G5 | MongoDB credentials via environment variables | `MONGODB_URI` only, never in source | ✅ done |
| G6 | Design quality: eye-pleasing contrast, alignment, spacing, **not a generic/"gobindo" template** | manual review | 🟡 banner/auth/nav good; rest unfinished |
| G7 | Not similar to any module/conceptual/assignment project | original copy, layout, and features | ⚠️ must keep original |
| G8 | Server works in production: no CORS / 404 / 504 errors | live API checks | ❌ not deployed |
| G9 | Live client link works, landing page error-free | live URL | ❌ not deployed |
| G10 | No route throws on hard reload | test every route | ❌ several pages missing |
| G11 | Logged-in user is **not** redirected to login on reload of a private route | server-side session check + hard reload test | ❌ protection is client-side only |
| G12 | Admin email + password supplied in submission | seeded admin account | ❌ not prepared |

**Submission fields (exact):** Admin email, Admin password, Live site link, GitHub repo (server), GitHub repo (client).

> **Commit rule:** add *real* commits for real work. Do not squash or rewrite history to inflate the count, and do not create empty/trivial commits. One feature or coherent fix per commit, imperative mood, e.g. `feat(bookings): add customer rental history table`.

---

## 2. Project snapshot

### 2.1 Tech stack (already installed)

| Layer | Choice |
|---|---|
| Framework | Next.js `16.4.6` App Router, React `19.3.0`, TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui components in `src/components/ui` (base-ui variant), `tw-animate-css` |
| Icons | `lucide-react`, `react-icons` |
| Animation | `framer-motion` |
| Charts | `recharts` |
| Theme | `next-themes` (class strategy, light default, system disabled) |
| Auth | Better Auth `1.7.x` + MongoDB adapter + JWT plugin; Google OAuth |
| Client data fetching | `fetch` wrappers in `src/lib/api/*` (no TanStack Query) |
| Server | Express `5.3` (ESM JavaScript, no build step), MongoDB driver `7.x`, `jose` for JWT verification |
| Payment (required, not built) | Stripe |
| Scheduled jobs (optional) | `node-cron` (or host cron) |

### 2.2 Scripts

Client: `npm run dev`, `npm run build`, `npm run start`, `npm run lint`.
Server: no scripts; run with `node index.js`. Server config lives in `vercel.json` (`@vercel/node`).

### 2.3 Directory map (client)

```
src/
  app/
    (auth)/login, (auth)/register        # split-screen auth layout
    (main)/                              # public layout: Navbar + Footer
      page.tsx                           # home (banner only today)
      equipment/page.tsx                 # All Equipment (client component, filters)
      equipment/[id]/                    # details page + client component
    dashboard/
      layout.tsx                         # sidebar shell (NOT yet auth-guarded)
      page.tsx                           # redirects by role
      _components/app-sidebar.tsx
      customer/{rentals,favorites,profile}   # placeholders
      owner/{add-equipment,my-equipment,rentals,analytics,profile}
      admin/{users,equipment,rentals,analytics,profile}  # placeholders
    api/auth/[...all]/route.ts           # Better Auth handler
    api/upload/route.ts                  # ImgBB proxy (server-side key)
  components/
    home/banner.tsx                      # Framer Motion banner
    shared/{navbar,footer,theme-toggle}.tsx
    equipment/{equipment-card,equipment-details,equipment-status-badge,
               update-equipment-dialog,delete-equipment-dialog}.tsx
    ui/*                                 # shadcn primitives
  lib/
    api/{config,equipment,upload}.ts      # API layer pattern to follow
    auth.ts, auth-client.ts               # Better Auth server/client
    getTokenFromClient.ts                 # cached JWT for browser calls
    getTokenFromServer.ts                 # JWT for server components
    equipment-options.ts                  # category/rental-type/condition options
    format.ts, menus.ts, utils.ts, animations.ts
  types/index.ts                          # shared types
```

**Server (`index.js`) currently contains:** connection + collections, `verifyToken`, `verifyAdmin`, `verifyOwner`, `verifyRenter`, optional-token helper, equipment routes, profile route, users route, and a startup normalization for legacy numeric fields. No bookings, favorites, payments, analytics, or Stripe yet.

### 2.4 Existing conventions

- Path alias `@/*` → `src/*`.
- All browser API calls go through `src/lib/api/*.ts`; components never build API URLs inline. Functions throw `Error` with user-facing messages; components catch and show toasts/inline states.
- Server base URL: `API_URL` from `src/lib/api/config.ts` (`NEXT_PUBLIC_API_URL`, fallback `http://localhost:5000`).
- Client JWT: `getTokenFromClient()` (in-memory cache, refresh near expiry). Server JWT: `getTokenFromServer()`.
- Auth user shape: `session.user` includes `role` (`customer | owner | admin`) via Better Auth `additionalFields`.
- Toast: `sonner` (`toast.success/error/warning/info`), global `<Toaster richColors position="top-right" />`.
- Theme tokens: `bg-navy-dark` (#0f2440), `bg-navy` (#1e3a5f), `primary` (#f97316), `font-heading` (Poppins), body Inter. Reuse these; do not introduce a second palette.
- Shared formatting: `formatPrice()`, `getRentalPeriod()` in `src/lib/format.ts`.
- Existing comments are a mix of Bengali and English. **New code and comments must be in English.**

---

## 3. Implementation status audit

Status key: ✅ done · 🟡 partial/needs hardening · ❌ missing · ⚠️ needs a change to meet the brief.

### 3.1 Foundation & auth

| Area | Requirement | Status | Notes / next action |
|---|---|---|---|
| Stack | Next.js App Router, TypeScript, shadcn | ✅ | Keep |
| Theme | Dark/light toggle persisted in localStorage | ✅ | `next-themes`, `ThemeToggle` in navbar/dashboard |
| Register | Name, email, photo (URL or ImgBB), password, login link | ✅ | `(auth)/register` |
| Register validation | uppercase + lowercase + length ≥ 6, error/toast | ⚠️ | Current client rejects passwords under 8 chars and requires a digit, and Better Auth defaults to 8. An examiner testing the brief's rule (e.g. `Abc123`) would be rejected. Set the client rule and Better Auth `minPasswordLength` to **6**, keep upper/lower checks, and fix the placeholder copy |
| Register toast | Success toast after registration | ✅ | Sonner |
| Login | Email/password, JWT access token, register link | ✅ | Better Auth `jwt` plugin; token via `authClient.token()` |
| Login toast | Success toast after login | ✅ | Sonner |
| Google login | Google OAuth; default role = customer | 🟡 | Provider and hook are configured; an earlier commit noted an account-linking issue, so verify the full Google flow (new user + same-email existing user) end-to-end |
| Facebook | Extra provider present but env keys are absent | ⚠️ | Remove the button or configure keys; a broken button is worse than none |
| RBAC middlewares | `verifyToken`, `verifyRenter`, `verifyOwner`, `verifyAdmin` | ✅ | Server `index.js` |
| API authorization | Every private endpoint protected by role | 🟡 | `POST /equipment` is currently public; admin is blocked by `verifyOwner` on update/delete |
| Route protection | Private routes + role dashboards guarded | ❌ | Only `/dashboard` redirects client-side; sub-routes are open and show placeholders |
| Session on reload | Logged-in user stays logged in on private-route reload | ❌ | Must be fixed with server-side session checks (see §14.4) |
| Email verification / forgot password | **Do not implement** | ✅ | Correctly omitted per brief |

### 3.2 Public pages

| Area | Requirement | Status | Notes / next action |
|---|---|---|---|
| Navbar | Logo, name, Home, All Equipment, About/Contact/How-it-works (optional), Login/Register, Dashboard/Logout | 🟡 | Links exist, but `/about`, `/contact` and `/#how-it-works` targets are missing → 404 risk |
| Navbar account menu | Dashboard + logout + profile | ⚠️ | "Profile" currently links to `/#`; point to the role's profile page |
| Footer | Links, categories, contact, socials with new X logo | ✅ | Uses `FaXTwitter` |
| Banner | High-quality image, title, description, animation | ✅ | `components/home/banner.tsx` |
| Featured equipment | 6 approved items, card layout, guest → login | ❌ | Home only has banner + placeholder text |
| Categories section | Popular categories with images/links | ❌ | Add section; use the single category source of truth |
| Why Choose Us | ≥ 4 meaningful benefits | ❌ | Add |
| Reviews | ≥ 4 reviews with name, rating, comment | ❌ | Static data is acceptable |
| Extra sections | ≥ 2 relevant sections | ❌ | e.g. How It Works, Recently Added, Trusted Owners |
| Framer Motion | Banner, featured, categories, reviews/extras | 🟡 | Banner only |
| All Equipment | 3-column approved grid with all card fields | ✅ | `(main)/equipment/page.tsx` |
| Search | Server-side by name or location | ✅ | Server query; keep server-side |
| Filters | Category, rental type, price range, availability | ✅ | Server-side |
| Sorting | Price low/high, recently added | ✅ | Server-side |
| Pagination | Optional requirement; already present | ✅ | `limit=9` |
| URL state | Filters shareable/deep-linkable | ❌ | Footer category links (`/equipment?category=...`) do nothing because the page ignores search params |
| Details page | All required equipment + owner + terms info | ✅ | `components/equipment/equipment-details.tsx` |
| Details privacy | Brief lists this as a **private route** | ⚠️ | Currently public; guests can open a direct URL |
| Favorites | Add/remove on details, persisted, shown in dashboard | ❌ | No collection/API/UI |
| Book Now modal | Dates, quantity, contact, address, notes | ❌ | Button only shows "coming soon" toast |
| Payment | Stripe checkout + success page + payment record | ❌ | No Stripe dependency yet |

### 3.3 Customer dashboard

| Route | Requirement | Status |
|---|---|---|
| `/dashboard/customer/rentals` | Table: equipment, start, end, booking date, total, payment status, booking status | ❌ placeholder |
| `/dashboard/customer/favorites` | Table + View Details + Remove | ❌ placeholder |
| `/dashboard/customer/profile` | Name, email, image, phone, address; update | ❌ placeholder |

### 3.4 Owner dashboard

| Route | Requirement | Status |
|---|---|---|
| `/dashboard/owner/add-equipment` | All fields, ImgBB upload, status pending, owner info | ✅ |
| `/dashboard/owner/my-equipment` | Table + update/delete/view | ✅ |
| `/dashboard/owner/rentals` | Rentals of this owner's equipment: customer, equipment, duration, qty, amount, payment/booking status | ❌ placeholder |
| `/dashboard/owner/profile` | Profile edit | ❌ placeholder |
| `/dashboard/owner/analytics` | Total equipment, completed rentals, earnings, monthly earnings + charts | ❌ placeholder |

### 3.5 Admin dashboard

| Route | Requirement | Status |
|---|---|---|
| `/dashboard/admin/users` | All users (name, email, role, registration date), change role, manage | ❌ placeholder; no role-change API |
| `/dashboard/admin/equipment` | All equipment, approve/reject/update/delete | ❌ placeholder; status API exists, update/delete admin access missing |
| `/dashboard/admin/rentals` | All rentals with customer, owner, equipment, duration, amount, statuses | ❌ placeholder |
| `/dashboard/admin/profile` | Profile edit | ❌ placeholder |
| `/dashboard/admin/analytics` | Users, equipment, bookings, pending approvals, completed rentals, revenue, monthly bookings | ❌ placeholder |

### 3.6 Cross-cutting

| Requirement | Status | Notes |
|---|---|---|
| Loading page/skeletons | ❌ | No `loading.tsx` anywhere; All Equipment has skeleton cards only |
| Error page | ❌ | No `error.tsx` / `global-error.tsx` |
| 404 page | ❌ | No `not-found.tsx` |
| Responsive | 🟡 | Navbar/sidebar/banner/auth are responsive; new pages must be too |
| Consistent headings/buttons/spacing | 🟡 | Follow the home/auth style; see §10 |
| README | ❌ | Replace the default file (G3) |
| Deployment | ❌ | Not deployed; see §16 |
| Commit counts | ❌ | Client 16, server 8 |

---

## 4. Roles and permissions

Single-role model. A user is exactly one of `customer`, `owner`, `admin`. Public registration may choose **customer** or **owner** only; admin is seeded/assigned by an existing admin or directly in the database.

| Capability | Guest | Customer | Owner | Admin |
|---|---|---|---|---|
| Home, All Equipment, Login, Register | ✅ | ✅ | ✅ | ✅ |
| Equipment details page | ❌ (→ login) | ✅ | ✅ | ✅ |
| Add/remove own favorites | ❌ | ✅ | ❌ | ❌ |
| Book equipment / pay | ❌ | ✅ | ❌ | ❌ |
| Customer dashboard (rentals, favorites, profile) | ❌ | ✅ | ❌ | ❌ |
| Add/edit/delete **own** equipment | ❌ | ❌ | ✅ | ✅ (any) |
| Owner dashboard (equipment, rentals of own gear, analytics, profile) | ❌ | ❌ | ✅ | ❌ |
| Admin dashboard (users, all equipment, all rentals, analytics, profile) | ❌ | ❌ | ❌ | ✅ |
| Change user roles | ❌ | ❌ | ❌ | ✅ |
| Approve/reject equipment | ❌ | ❌ | ❌ | ✅ |
| View any profile / own profile | ❌ | own | own | own + manage |

**Rules**
- Role checks must exist on **both** the API (middleware) and the route (server-side session + redirect). Hiding a button is not authorization.
- A user must not be able to read/update/delete another user's data by changing an id in a request.
- Admin must be able to update/delete any equipment; the current `verifyOwner` middleware blocks admins — change the ownership check to "admin OR owner of record".
- Never allow self-demotion of the last admin.
- Admin account is created by seeding/DB update, never through `/register`.

---

## 5. Domain model

### 5.1 Existing `equipment` document

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | |
| `name`, `description`, `category`, `location`, `brand`, `model` | string | |
| `rentalPrice` | number | **not** `price` |
| `rentalType` | string | `Daily` / `Weekly` / `Monthly` (capitalized) |
| `availableQuantity` | number | **not** `quantity` |
| `condition` | string | New / Like New / Excellent / Good / Fair |
| `image` | string (URL) | ImgBB-hosted |
| `rentalTerms` | string | |
| `ownerId` | string | Better Auth `user.id` |
| `ownerName`, `ownerEmail` | string | display + ownership checks |
| `status` | `pending \| approved \| rejected` | default `pending` on create |
| `createdAt` | Date | |

Do **not** reintroduce `price`/`quantity`; a startup normalization in the server already migrates legacy documents.

### 5.2 Required collections (to add)

**`user`** (Better Auth-managed; extend `additionalFields`)
- `name`, `email`, `emailVerified`, `image`, `role`, `createdAt`, `updatedAt`
- Add `phone` (string, optional) and `address` (string, optional) for the profile page.
- Keep Better Auth's `session`, `account`, `verification` collections untouched.

**`favorites`**
- `userId` (string), `equipmentId` (string/ObjectId), `createdAt`
- Unique compound index on `(userId, equipmentId)`; `GET` joins to approved equipment.

**`bookings`** (the UI calls these "rentals")
- `equipmentId`, `equipmentName`, `equipmentImage`
- `ownerId`, `ownerName`, `ownerEmail`
- `customerId`, `customerName`, `customerEmail`
- `rentalType`, `unitPrice`, `quantity`
- `startDate`, `endDate` (UTC), `durationDays`, `periods`
- `totalAmount`
- `contactNumber`, `deliveryAddress`, `notes`
- `paymentStatus`: `unpaid | paid | refunded | failed`
- `bookingStatus`: `pending | confirmed | active | completed | cancelled` (optional `rejected`)
- `stripeSessionId`, `createdAt`, `updatedAt`

**`payments`**
- `bookingId`, `customerId`, `ownerId`
- `amount`, `currency` (`usd`), `status` (`paid | failed | refunded`)
- `stripeSessionId`, `stripePaymentIntentId`
- `paidAt`, `createdAt`

**Reviews:** not required in the database. A static `src/lib/reviews.ts` array is acceptable for the home page (≥ 4 entries).

### 5.3 Pricing rules (server is authoritative)

Define once and use on both client (preview) and server (charge):

- `durationDays = max(1, ceil((endDate − startDate) / 86_400_000))`
- `periods` by rental type: `Daily → durationDays`, `Weekly → ceil(durationDays / 7)`, `Monthly → ceil(durationDays / 30)`
- `totalAmount = periods × rentalPrice × quantity`
- Normalize dates to UTC midnight to avoid timezone drift; reject `endDate <= startDate`.
- The server recalculates the total from the database price. Never trust a client-sent amount.

### 5.4 Availability rules

- `quantity ≥ 1` and `quantity ≤ availableQuantity`.
- Overlap test: `existing.startDate <= requested.endDate && existing.endDate >= requested.startDate`.
- Count quantities of overlapping bookings whose status is `confirmed` or `active`; require `availableQuantity − alreadyBooked ≥ requestedQuantity`.
- Check when the booking is created **and again** when the Stripe payment is confirmed. If availability was lost, do not confirm; mark the payment for refund/manual handling and show a clear message.
- Unapproved (`pending`/`rejected`) equipment cannot be booked or favorited.

---

## 6. API contract (Express server)

### 6.1 Existing endpoints

| Method | Path | Access | Purpose | Status |
|---|---|---|---|---|
| GET | `/` | Public | Health check | ✅ |
| GET | `/equipment` | Public | Approved list; search/category/rentalType/minPrice/maxPrice/availability/sort/page/limit; returns `{ equipment, total, page, totalPages }` | ✅ |
| GET | `/equipment/my` | Owner | Owner's own equipment | ✅ |
| POST | `/equipment` | **should be Owner** | Create with `status: pending` | ⚠️ currently public; client sends no token |
| GET | `/equipment/:id` | Public + optional token | Details; unapproved visible only to owner/admin | 🟡 brief wants private |
| PATCH | `/equipment/:id` | Owner/Admin | Update name/category/rentalPrice/availableQuantity | ⚠️ admin blocked |
| DELETE | `/equipment/:id` | Owner/Admin | Delete own/any equipment | ⚠️ admin blocked |
| PATCH | `/equipment/:id/status` | Admin | Approve/reject | ✅ |
| GET | `/profile` | Any authenticated | Current user | 🟡 returns raw user document; restrict fields |
| GET | `/users` | Admin | All users | 🟡 strip sensitive fields; pagination optional |

### 6.2 Required endpoints

Add these (keep `{ message }` error shape and `try/catch` + `console.error`):

| Method | Path | Access | Purpose |
|---|---|---|---|
| PATCH | `/profile` | Any authenticated | Update `name`, `image`, `phone`, `address` (never `role`/`email`) |
| PATCH | `/users/:id/role` | Admin | Change role (`customer`/`owner`/`admin`), validate + protect last admin |
| DELETE | `/users/:id` | Admin (optional) | Manage users; protect self/last admin |
| GET | `/equipment/admin` | Admin | All equipment regardless of status, with filters/pagination |
| GET | `/favorites` | Customer | Current customer's favorite equipment (populated) |
| POST | `/favorites` | Customer | Body `{ equipmentId }`; approved equipment only |
| DELETE | `/favorites/:equipmentId` | Customer | Remove favorite |
| POST | `/bookings` | Customer | Validate dates/qty/availability; create `pending`/`unpaid` booking; return booking id + total |
| GET | `/bookings/my` | Customer | Current customer's rentals (supports pagination) |
| GET | `/bookings/owner` | Owner | Bookings for this owner's equipment |
| GET | `/bookings` | Admin | All bookings |
| GET | `/bookings/:id` | Customer/Owner/Admin | Single booking, ownership enforced |
| PATCH | `/bookings/:id/cancel` | Customer | Cancel own booking before start; admin may cancel any |
| PATCH | `/bookings/:id/status` | Admin (owner optional) | Manage booking status |
| POST | `/payments/checkout` | Customer | Create Stripe Checkout Session for a booking; recompute total server-side |
| POST | `/payments/webhook` | Stripe signature | Verify signature; mark paid, create payment record, confirm booking (idempotent) |
| GET | `/payments/verify?session_id=` | Customer | Fallback confirmation for the success page |
| GET | `/analytics/admin` | Admin | Platform metrics + monthly booking series |
| GET | `/analytics/owner` | Owner | Owner metrics + monthly earnings series |

**Server conventions**
- Middleware order: `verifyToken` → `verifyAdmin` / `verifyOwner` / `verifyRenter`.
- Validate `ObjectId.isValid` before queries; return `400` for bad ids, `404` for missing, `403` for ownership violations.
- Coerce and validate numbers (`rentalPrice`, `availableQuantity`, booking quantity, amounts).
- Escape user input used in regex (`escapeRegex` already exists).
- Never return password/account documents. Project only safe fields.
- CORS: replace `cors()` with an allowlist from `CLIENT_URI` (plus localhost in development); allow `Authorization` and `Content-Type`.
- Stripe webhook must receive the **raw** request body. Register the webhook route with `express.raw({ type: "application/json" })` **before** `express.json()`, or mount it separately.
- Add a JSON 404 handler and a JSON error handler at the end of the route list.

---

## 7. Page-by-page requirements

### 7.1 Global layout

- Public layout: Navbar (sticky, logo + name, dynamic links, theme toggle, auth-aware account menu) → dynamic main content → Footer.
- Auth layout: split screen with image/brand panel (already built).
- Dashboard layout: full-width, responsive sidebar, role-based menu, consistent theme, user profile block (already built, needs guarding).
- Main heading font/size/color must be consistent across sections (`font-heading`, Poppins).
- All pages responsive at mobile (≈375px), tablet (≈768px), desktop (≈1440px).

### 7.2 Home (`/`)

Required sections, in order:

1. **Banner** — high-quality image, strong title, short purpose description, CTAs, Framer Motion. ✅
2. **Featured Equipment** — exactly 6 approved items via server `limit=6`; equal-height cards; guest "View Details" → `/login`; logged-in → `/equipment/:id`. ❌
3. **Categories** — Construction, Photography, Vehicles & Transportation, Agriculture, Electronics, Event (the brief says "such as"; the platform may include extras). Use one shared category source. ❌
4. **Why Choose Us** — affordable prices, verified owners, flexible rental periods, secure payments, etc. ❌
5. **Customer Reviews** — ≥ 4 with name, rating, comment. ❌
6. **≥ 2 extra sections** — e.g. How It Works, Recently Added, Trusted Owners. ❌
7. Framer Motion on banner, featured, categories; optional on reviews/extras. 🟡

### 7.3 Authentication

- `/register`: name, email, photo (direct URL **or** ImgBB upload), password, confirm, role (customer/owner), login link.
- Password rule: at least 6 characters, one uppercase, one lowercase (a digit rule is allowed as an extra). Show a specific toast for each failure. Align the placeholder copy with the real rule. **Compliance note:** a stricter "8 + digit" rule rejects passwords the brief explicitly allows, so lower the minimum to 6 and set Better Auth's `emailAndPassword.minPasswordLength` to 6 as well.
- `/login`: email, password, Google social login, register link. Show a success toast after login/registration.
- Google users default to `customer`; no email verification; no forgot-password.
- After auth, redirect to the intended page (support `callbackUrl`) and refresh the session. Clear the cached JWT on login/logout.
- Do not expose secrets: `BETTER_AUTH_SECRET`, Mongo URI, Google secret, ImgBB key, Stripe secret stay server-side.

### 7.4 Equipment details (`/equipment/[id]`) — private

- Require login; redirect guests to `/login?callbackUrl=/equipment/:id` (or equivalent) and return after login.
- Show: image, name, description, category, rental price + type, location, available quantity, condition, brand, model, rental terms, owner name/email.
- Customer actions: Add/Remove Favorite, Book Now.
- Owner actions on own item: Edit, Delete.
- Admin actions: Approve, Reject, Edit, Delete.
- Book Now opens a modal with: start date, end date, quantity, contact number, delivery address, notes; live total preview; validates availability; on confirm → Stripe Checkout.
- Do not show booking actions for unapproved equipment or for the owner/admin.

### 7.5 All Equipment (`/equipment`) — public

- 3-column grid (1/2/3 at mobile/tablet/desktop), equal-height cards.
- Card: image, name, category, rental price, rental type, location, availability badge, View Details.
- Server-side search (name or location), category, rental type, price range, availability, sorting (price low/high, recent), pagination.
- Empty state, loading skeletons, error state with retry.
- Ideally sync filters to the URL so footer category links and reloads preserve state. If implemented with `useSearchParams`, wrap in Suspense (Next 16 / cacheComponents).

### 7.6 Customer dashboard — private

| Page | Requirements |
|---|---|
| My Rentals | Table: equipment, start date, end date, booking date, total amount, payment status, booking status. Pagination (optional requirement). Empty state. |
| Favorites | Table/cards of saved equipment; View Details; Remove (persists immediately). |
| Profile | Name, email, image, phone, address; editable; email read-only; success/error toasts. |

### 7.7 Owner dashboard — private

| Page | Requirements |
|---|---|
| Add Equipment | All fields from §5.1, dropdowns, ImgBB upload, pending status, owner info auto-filled. |
| My Equipment | Table: name, category, rental price, available quantity, status; actions View/Update/Delete. |
| My Equipment Rental | Table: customer info, equipment info, rental duration, required quantity, booking amount, payment status, booking status. Only this owner's equipment. |
| Profile | Same profile editor as customer. |
| Analytics | Stat cards + charts: total listed equipment, completed rentals, total earnings, monthly earnings. |

### 7.8 Admin dashboard — private

| Page | Requirements |
|---|---|
| All Users | Table: name, email, role, registration date; change role; manage users. Backend required. |
| All Equipment | Table of all statuses; approve/reject/update/delete. |
| All Rentals | Table: customer info, owner info, equipment, duration, amount, payment status, booking status. |
| Profile | Same profile editor. |
| Analytics | Total users, equipment, bookings, pending approvals, completed rentals, total revenue, monthly booking statistics; charts. |

### 7.9 Loading, error, and 404

- Add `src/app/loading.tsx` (and route-level loading where useful) with skeletons that match the final layout.
- Add `src/app/error.tsx` (client component with `reset`) and `src/app/global-error.tsx`.
- Add `src/app/not-found.tsx` with a branded 404 and links home/browse.
- Server should also return JSON 404/500 for unknown API routes.

---

## 8. Booking, payment, and favorites flows

### 8.1 Favorites

1. Customer clicks the heart on an approved equipment details page.
2. `POST /favorites` inserts `{ userId, equipmentId }` (upsert/unique index prevents duplicates); UI toggles optimistically and reverts on error.
3. Dashboard favorites list joins favorites → approved equipment; Remove calls `DELETE /favorites/:equipmentId`.
4. Guests are redirected to login.

### 8.2 Booking

1. Customer fills the modal; client shows a live estimate.
2. `POST /bookings` validates auth/role, equipment approved, dates, quantity, availability; recomputes the total; creates `bookingStatus: pending`, `paymentStatus: unpaid`.
3. Response returns `bookingId` and the authoritative total; client proceeds to payment.
4. If unavailable: `409` with a clear message; keep the modal open.

### 8.3 Stripe payment (recommended: Express owns Stripe)

1. `POST /payments/checkout` (`verifyToken`, `verifyRenter`) loads the booking, re-checks it belongs to the customer and is still unpaid, recomputes/validates the amount, and creates a Stripe Checkout Session with `metadata.bookingId`.
2. Use `success_url = ${CLIENT_URI}/payment/success?session_id={CHECKOUT_SESSION_ID}` and `cancel_url = ${CLIENT_URI}/dashboard/customer/rentals?payment=cancelled`.
3. Save `stripeSessionId` on the booking.
4. `POST /payments/webhook` verifies the Stripe signature, handles `checkout.session.completed` idempotently: insert a `payments` document, set booking `paymentStatus: paid`, `bookingStatus: confirmed`.
5. `/payment/success` (client) shows "Verifying payment…", calls `GET /payments/verify?session_id=` (or polls the booking) and then shows success + links to My Rentals. Never mark paid from the client alone.
6. Failure/cancel: booking stays unpaid/pending; show a retry path.
7. Use Stripe test keys locally and the Stripe CLI to forward webhooks. Test card `4242 4242 4242 4242`.

> **Brief nuance:** one sentence says "after successful payment, create the booking record". The implementation above creates the booking first (unpaid) so the amount and availability can be verified before charging; the payment confirmation then activates it. This is the safer, standard flow and satisfies the recorded payment requirement.

### 8.4 Booking status lifecycle

- `pending` (created, unpaid) → `confirmed` (paid) → `active` (optional, start date reached) → `completed` (end date passed)
- `cancelled` from `pending`/`confirmed` before the start date (refund policy is out of scope; document what happens).
- Optional cron: `node-cron` daily job sets paid `confirmed`/`active` bookings with `endDate < now` to `completed`. If the server is deployed serverless, use a hosted cron/Vercel Cron hitting a protected endpoint instead.

---

## 9. Analytics (Challenge 3)

### Admin — `GET /analytics/admin` (verifyToken + verifyAdmin)

Compute with MongoDB aggregations:
- `totalUsers`, `totalCustomers`, `totalOwners`
- `totalEquipment`, `pendingEquipment` (status `pending`)
- `totalBookings`, `completedRentals`
- `totalRevenue` (sum of paid payments)
- `monthlyBookings`: last 12 months, `{ month, count }`
- Optional: `monthlyRevenue`, recent activity

### Owner — `GET /analytics/owner` (verifyToken + verifyOwner)

Scope every query to the owner's equipment/bookings/payments:
- `totalEquipment`
- `totalRentals`, `completedRentals`
- `totalEarnings` (paid)
- `monthlyEarnings`: last 12 months, `{ month, amount }`

**UI:** responsive stat cards + Recharts bar/line charts, loading skeletons, empty states, currency formatting via `formatPrice`. Numbers must come from the database, not hard-coded.

---

## 10. UI/UX and design requirements

- **Original design.** Do not copy a template or another assignment. The brief explicitly zeroes similar work.
- Palette: navy `#0f2440` / `#1e3a5f`, orange primary `#f97316`, neutral cards/backgrounds. Keep contrast accessible in both themes.
- Typography: Poppins for headings (`font-heading`), Inter for body. Keep heading styles consistent across sections.
- Buttons: one primary style, one outline style, consistent sizes/radius. Reuse `buttonVariants`.
- Spacing: consistent section padding, balanced paragraph spacing, readable line lengths.
- Cards: equal height/width in grids; uniform image aspect ratios (`aspect-[4/3]`); consistent gaps.
- Navbar: logo/name same size and style everywhere.
- Social: use the new **X** logo (`FaXTwitter`), not the old Twitter bird.
- Responsiveness: mobile/tablet/desktop for every page, including dashboard tables (horizontal scroll or card fallback).
- Dashboard: full-width, consistent theme, charts, profile section, mobile sidebar.
- Accessibility: alt text, labelled inputs, keyboard-operable menus/dialogs, visible focus rings.
- Use existing shadcn primitives; do not hand-roll dialogs/selects/tables.

---

## 11. Challenges — acceptance criteria

### Challenge 1 — Server-side search/filter on All Equipment
- [x] Search by name/location and filter by category, rental type, price, availability happen in MongoDB, not in the browser.
- [x] Sorting and pagination are server-side.
- [x] Network request contains the filter params and results update after debounce.
- [ ] Filters survive reload/share via URL (recommended; footer category links currently don't work).

### Challenge 2 — JWT verification + role middleware
- [x] `verifyToken`, `verifyRenter`, `verifyOwner`, `verifyAdmin` exist and use `jose`/JWKS with issuer+audience.
- [ ] Every private endpoint uses the correct middleware chain.
- [ ] Ownership checks prevent cross-user access; admin is allowed where the brief requires it.
- [ ] 401 (no/invalid token) and 403 (wrong role) responses verified with tests/manual calls.
- [ ] Client always sends `Authorization: Bearer <token>` for private calls (including equipment create/update/delete).

### Challenge 3 — Dashboard analytics
- [ ] Admin analytics endpoint + page with the metrics in §9.
- [ ] Owner analytics endpoint + page scoped to the owner.
- [ ] Charts render from real data and are responsive.

---

## 12. Optional requirements (do if time allows)

1. **Pagination** — All Equipment (done) and booking history (add).
2. **Theme toggle** — done; verify it persists in localStorage and applies to new pages.
3. **Automated booking status via cron** — `node-cron` or hosted cron; mark past-end-date paid bookings `completed`.
4. **Email notifications** — notify customer and owner when a booking completes (Resend/Nodemailer; keys via env). If email is not configured, guard the feature so it fails silently/logs.

Optional items must never break required flows.

---

## 13. Environment variables (names only — never commit values)

### Client (`.env.local`, Vercel project settings)

| Variable | Exposure | Purpose |
|---|---|---|
| `BETTER_AUTH_SECRET` | server only | Better Auth signing secret |
| `BETTER_AUTH_URL` | server only | Public client origin; used by Better Auth and JWT issuer/audience |
| `MONGODB_URI` | server only | Mongo connection for Better Auth adapter |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | server only | Google OAuth |
| `IMGBB_API_KEY` | server only | Image upload proxy |
| `NEXT_PUBLIC_API_URL` | public | Express API base URL (HTTPS in production) |
| `STRIPE_SECRET_KEY` | server only | Stripe API (if Stripe is handled in a Next route) |
| `STRIPE_WEBHOOK_SECRET` | server only | Webhook verification |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | public | Only if Stripe.js is used (Checkout redirect may not need it) |
| `FACEBOOK_CLIENT_ID` / `FACEBOOK_CLIENT_SECRET` | server only | Optional; remove the button if unset |
| `RESEND_API_KEY` / SMTP vars | server only | Optional email notifications |

> `src/lib/auth-client.ts` reads `process.env.BETTER_AUTH_URL`, which Next.js does **not** expose to the browser unless prefixed `NEXT_PUBLIC_`. Same-origin auth works because the client falls back to the current origin. Do not add a secret to a `NEXT_PUBLIC_*` variable.

### Server (Render/Railway/Vercel env)

| Variable | Purpose |
|---|---|
| `PORT` | HTTP port (default 5000) |
| `MONGODB_URI` | Database |
| `CLIENT_URI` | Allowed CORS origin + Stripe success/cancel base URL |
| `AUTH_URL` | Must exactly match the client Better Auth URL (JWT issuer/audience) |
| `STRIPE_SECRET_KEY` | Stripe Checkout + webhook |
| `STRIPE_WEBHOOK_SECRET` | Webhook signature verification |
| Optional email vars | Notifications |

`.env` is gitignored in both repos. If a real key ever reaches Git history, rotate it.

---

## 14. Agent working agreement

### 14.1 Next.js 16 first

- Read `node_modules/next/dist/docs/` before touching routing, params, caching, `cacheComponents`, or `partialPrefetching`.
- `params`/`searchParams` are Promises; await them in server components and wrap dynamic usage in Suspense where required.
- Prefer server components for data fetching where possible; client components only for interactivity.
- Keep the `nextjs-agent-rules` block intact.

### 14.2 Client data fetching

- Every endpoint gets a typed function in `src/lib/api/<domain>.ts` (`equipment.ts` is the pattern).
- Import `API_URL` from `./config`; never inline `process.env.NEXT_PUBLIC_API_URL` in components.
- Send the JWT with `getTokenFromClient()` for authenticated calls.
- Throw `Error` with a user-facing message on `!response.ok`; validate/normalize the response shape when the UI depends on it (see `getEquipmentList`).
- Components own loading/error/empty state; show Sonner toasts for actions.
- Add/extend shared types in `src/types/index.ts`.

### 14.3 Server code

- Plain ESM JavaScript, Express 5. Keep the existing style: small helpers at the top, routes grouped, `try/catch` on async handlers that do multiple operations, `console.error` on 500s.
- Middleware order and ownership checks are mandatory; never trust ids from the client.
- Validate enums (`status`, `role`), numeric fields, and `ObjectId` values.
- Use the shared `equipmentCollection`/`usersCollection`; add `favoritesCollection`, `bookingsCollection`, `paymentsCollection` next to them.
- Keep the public list response shape `{ equipment, total, page, totalPages }`; the client depends on it.
- If you split routes into files, update `vercel.json` accordingly. Otherwise keep `index.js` as the entry.

### 14.4 Authentication and route protection

- Do **not** rely on `useEffect` + `router.replace` for protection; it flashes and fails the reload requirement.
- Guard dashboard layouts/server pages with Better Auth's server session API (`auth.api.getSession({ headers: await headers() })`) and `redirect()`.
- Role-guard each dashboard subtree: `/dashboard/customer/*` → customer, `/dashboard/owner/*` → owner, `/dashboard/admin/*` → admin. Send signed-in users to their own dashboard home, not to login.
- Preserve `callbackUrl` for private pages so login returns the user to where they were.
- Keep the JWT cache clear on login/logout.
- Test with a hard reload on every private route.

### 14.5 Comments and code quality

- Comments explain **why**, not what. New comments in English.
- No `any` unless unavoidable; prefer explicit types.
- Run `npx tsc --noEmit` and `npx eslint <files>` before finishing.
- Do not add a second UI library or state manager; use what is installed.
- Do not edit generated shadcn primitives unless a real bug requires it.
- Do not remove user work or unrelated code. If something looks wrong, investigate first.

### 14.6 Commit discipline

- One coherent change per commit; imperative, descriptive messages (`feat(owner): add rental history table`, `fix(auth): keep session on dashboard reload`).
- Include the client and server changes for a feature in their respective repos.
- Do not commit `.env`, build output, or `node_modules`.
- Current counts at audit: client 16, server 8. Required: ≥20 and ≥12. Plan real commits for the remaining features.

**Suggested remaining commit themes**

Client: home sections + animations · details booking modal + favorites · customer rentals/favorites/profile · owner rentals/analytics/profile · admin users/equipment/rentals/analytics · Stripe success page · route guards + loading/error/404 · README + polish.
Server: profile update + role management · favorites API · bookings API + availability · Stripe checkout/webhook · analytics endpoints · CORS/admin permission hardening · cron job.

---

## 15. Known bugs / risks to fix

These are confirmed from the audit and should be treated as work items:

1. `/about` and `/contact` are linked in the navbar/footer but do not exist → 404. Create them or remove the links.
2. `/#how-it-works` is linked but the home page has no such section.
3. Navbar "Profile" links to `/#` instead of the role's profile page.
4. Equipment details is public; the brief lists it as private.
5. `POST /equipment` has no auth middleware and the client does not send a token.
6. Admin cannot update/delete equipment because `verifyOwner` runs first.
7. `GET /profile` returns the raw user document; project only safe fields.
8. Dashboard sub-routes are unguarded; `/dashboard` only redirects client-side.
9. Register password rule is stricter than the brief (8 + digit vs 6 + upper/lower) and the placeholder copy is misleading; an allowed 6-character password is rejected. Align the client rule, Better Auth `minPasswordLength`, and the copy.
10. Category lists disagree: `EQUIPMENT_CATEGORIES` (9 values) vs footer/brief (6 values). Pick one shared source.
11. Footer category links don't apply because `/equipment` ignores URL query params.
12. `cors()` is fully open; restrict to `CLIENT_URI` for production.
13. Facebook login is rendered but its env keys are absent.
14. `BETTER_AUTH_URL` is not browser-exposed; same-origin fallback works, but document/verify before changing.
15. Server normalizes legacy numeric fields at startup; harmless but consider a one-time script if cold starts matter.
16. All Equipment returns `totalPages: 0` for no results; the client normalizes to 1. Keep that guard.

---

## 16. Deployment checklist

**Client (Vercel)**

- [ ] `NEXT_PUBLIC_API_URL` points to the live HTTPS Express URL.
- [ ] `BETTER_AUTH_URL` equals the live client origin (no trailing slash).
- [ ] `BETTER_AUTH_SECRET`, `MONGODB_URI`, Google keys, `IMGBB_API_KEY` set in project settings.
- [ ] Google OAuth authorized redirect URI includes `https://<client>/api/auth/callback/google`.
- [ ] Production build passes (`npm run build`) and no TypeScript/ESLint errors.
- [ ] Every route loads directly (hard reload) without errors; private routes keep the session.
- [ ] No console errors, no mixed content, no broken images.

**Server (Render/Railway/Vercel)**

- [ ] `MONGODB_URI`, `CLIENT_URI`, `AUTH_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` set.
- [ ] `AUTH_URL` matches the client origin exactly (JWT issuer/audience), or all token checks fail.
- [ ] CORS allows only the live client origin (+ localhost in dev); preflight succeeds.
- [ ] Atlas IP allowlist includes the host (or `0.0.0.0/0` for the assignment).
- [ ] No 404s on API paths; unknown routes return JSON 404.
- [ ] No 504s: free-tier cold starts / serverless timeouts addressed (keep warm or upgrade); Mongo client reused per instance.
- [ ] Stripe webhook endpoint is public and the signing secret is set; test event succeeds.
- [ ] Health check `GET /` returns 200.

**Cross-cutting**

- [ ] Stripe test payment completes and creates booking/payment records.
- [ ] Admin credentials work on the live site.
- [ ] Landing page and all deep links work in an incognito window.
- [ ] Mobile and desktop checks pass.

---

## 17. End-to-end QA script

Run before submitting; each item must pass.

1. **Guest:** open `/`, navbar links work, featured cards send guests to login, `/equipment` shows only approved items, footer links work.
2. **Register:** try each password failure (short, no uppercase, no lowercase); see specific toasts; register successfully; success toast.
3. **Login:** email/password and Google; Google user has role `customer`; success toast; logout works.
4. **Reload:** hard-reload `/dashboard/...` for each role; user stays logged in; no login redirect.
5. **RBAC:** customer cannot open owner/admin URLs or call their APIs (403/redirect); owner cannot open admin pages; admin cannot use customer/owner dashboards.
6. **Owner:** add equipment (all fields + image) → appears as `pending` in My Equipment; edit and delete work; cannot edit another owner's item.
7. **Admin:** approve the pending item → it appears in All Equipment; reject another; update/delete any equipment; change a user's role.
8. **All Equipment:** search name/location, filter each field, sort both price directions, paginate; verify the query string reaches the server and results are server-filtered.
9. **Details:** all fields render; guest is redirected to login; owner sees edit/delete; admin sees approve/reject; customer sees favorite + book.
10. **Favorites:** add, reload (persists), view in dashboard, remove, reload.
11. **Booking:** invalid dates/quantity rejected; total matches the pricing rule; unavailable quantity rejected; valid booking reaches Stripe.
12. **Payment:** test card succeeds → success page → booking `paid`/`confirmed`; `payments` record exists; cancel path leaves it unpaid; duplicate webhook does not duplicate records.
13. **Customer rentals:** columns and statuses correct; pagination if implemented.
14. **Owner rentals:** only this owner's equipment; amounts/statuses correct.
15. **Admin rentals:** all bookings with customer/owner/equipment/statuses.
16. **Profiles:** update name/image/phone/address for each role; reload shows saved values; email/role not editable.
17. **Analytics:** admin and owner numbers match the database; charts render; empty states work.
18. **UX:** loading, error (simulate API down), and 404 pages; dark mode persists; responsive at 375/768/1440; consistent headings/buttons.
19. **Optional:** cron marks past-end-date paid bookings completed; emails send (or are safely skipped).
20. **Deployment:** repeat 1–19 on the live URLs.

---

## 18. Submission checklist

- [ ] Client repo URL (public) — `https://github.com/Ashraf-Mia/gear-nest`
- [ ] Server repo URL (public) — `https://github.com/Ashraf-Mia/gear-nest-server`
- [ ] Live site URL
- [ ] Admin email
- [ ] Admin password
- [ ] README updated (name, purpose, live URL, features, packages, setup, env names)
- [ ] ≥20 client commits and ≥12 server commits, all meaningful
- [ ] No secrets in Git history
- [ ] Live smoke test in incognito, including hard reloads

---

## 19. Open decisions (confirm before coding)

1. **Stripe location:** Express (recommended: checkout + webhook + booking/payment writes) vs Next API routes. Decide once; do not split ownership.
2. **Category taxonomy:** adopt the brief/footer 6 categories (plus optional "Other") as the single `EQUIPMENT_CATEGORIES` list, or keep the current 9. Update the form, filters, footer, and seed data together.
3. **Booking statuses:** confirm the enum in §5.2 (`pending/confirmed/active/completed/cancelled`) and whether owners may reject bookings.
4. **Pricing periods:** confirm the weekly/monthly rounding rule in §5.3.
5. **Reviews:** static content (recommended) vs a `reviews` collection.
6. **Cron hosting:** long-running host + `node-cron` vs Vercel Cron/hosted scheduler.
7. **Email provider:** Resend/Nodemailer or skip (optional).
8. **Admin seeding:** decide the seed method and credentials to submit.
9. **About/Contact pages:** build simple pages or remove the links (they currently 404).
10. **Password policy:** match the brief exactly (≥ 6 chars + uppercase + lowercase) in both the client and Better Auth. A stricter policy risks failing the stated validation requirement; align the UI copy too.

---

## 20. Definition of done

A feature is done only when:

- [ ] It matches the relevant requirement in this document.
- [ ] It works for the correct roles and is blocked for the others (API **and** route).
- [ ] It handles loading, empty, error, and success states.
- [ ] It is responsive and uses the existing design tokens/components.
- [ ] `npx tsc --noEmit` and ESLint pass.
- [ ] It survives a hard reload.
- [ ] It is committed with a descriptive message in the correct repo.
- [ ] The status table in §3 is updated.

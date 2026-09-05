# Raja Construction — Luxury Real Estate & Contracting

A luxury real-estate and contracting front end built with **React 18, TypeScript, Redux Toolkit,
React Router and Tailwind CSS**, structured the way a production e-commerce-style
app would be — with listings, a "shortlist" (cart-equivalent), auth, and a
multi-step checkout-style flow for scheduling private viewings.

## Getting started

```bash
npm install
npm run dev       # start the dev server at http://localhost:3000
npm run build      # type-check + production build
npm run start     # start the production server locally
```

Demo login: **demo@raja-construction.com** / **password123** (or sign up as a new user —
both are handled by the mock API layer, in-memory).

## Feature checklist

- **Property listing, search, filters, sorting** — `/properties`, with a
  filter sidebar (keyword, type, status, city, price range, min bedrooms) and
  a sort control (newest, price asc/desc, largest area). Filtering/sorting is
  computed client-side via `useMemo` against Redux state.
- **Property details & shortlist ("cart")** — `/properties/:id` shows a photo
  gallery, amenities, and a sticky booking panel; the shortlist (persisted to
  `localStorage`) stands in for a cart, viewable at `/shortlist`.
- **Login / signup** — `/login` and `/signup`, built with `react-hook-form` +
  `zod` schema validation and async Redux Toolkit thunks against a mock auth
  API, with loading and error states.
- **"Checkout" flow** — `/schedule-visit/:id` is a 3-step private-viewing
  request (contact details → preferred date/time → review & confirm), each
  step validated before advancing, submitting to a mock inquiries API with a
  success confirmation screen.
- **Responsive UI** — mobile nav, responsive grids, and fluid layouts
  throughout, styled with Tailwind CSS.
- **REST API integration** — `src/services/api.ts` is a drop-in mock REST
  layer (simulated latency + failure cases). Swap the function bodies for
  real `fetch()` calls against your backend; the Redux thunks that call them
  don't need to change.
- **Form validation & error handling** — all forms (login, signup, schedule
  visit) use `zod` schemas via `react-hook-form`, with inline field errors
  and top-level API error messages.
- **State management** — Redux Toolkit slices: `auth`, `properties`
  (listing + filters + sort), `shortlist`, `inquiry`.

## Project structure

```
src/
  components/
    layout/       Navbar, Footer, Layout
    home/         Hero, FeaturedProperties, WhyUs
    properties/   PropertyCard, FilterSidebar, SortBar
    forms/        FormField, TextAreaField, SelectField
  data/            Mock property dataset
  hooks/           Typed Redux hooks
  pages/           Route-level pages
  services/api.ts  Mock REST API layer
  store/           Redux Toolkit store + slices
  types/           Shared TypeScript types
  utils/format.ts  Currency formatting helper
```

## Design

A restrained "quiet luxury" visual language: a serif display face
(Fraunces) paired with Inter, a charcoal/gold/ivory palette, thin hairline
borders instead of heavy drop shadows, and generous whitespace — aimed at
feeling closer to a private-client advisory site than a typical listings
portal.

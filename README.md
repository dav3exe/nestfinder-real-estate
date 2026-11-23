# NestFinder

A property listing site for people renting or buying homes in Nigeria. Visitors browse listings, filter and sort them, open a property to see photos, details and its location on a map, and send an enquiry to the agent. Admins add and manage properties, read enquiries and manage users.

**Live:** https://nestfinder-real-estate.vercel.app
**Backend:** [nestfinder-real-estate-backend](https://github.com/dav3exe/nestfinder-real-estate-backend)

Built as a team project during Tech Studio Academy's full-stack training. The team repo is [Chloetrini/nestfinder-real-estate](https://github.com/Chloetrini/nestfinder-real-estate).

## My part

- **All-properties page**, frontend and backend: filters for all 36 Nigerian states, property type, bedrooms, rent or sale and price range; sorting by price and by biggest discount; 12 listings per page with pagination; and the API endpoint that only returns published listings.
- **Admin pages**, frontend and backend: managing properties, enquiries and users, protected by JWT and an admin role check.

## Features

- Home, About and a 404 page
- Sign up, log in, email verification, forgot password and reset password
- Property listings and property detail pages (signed-in users only)
- Property location on a map
- Agent enquiry form
- Admin dashboard: add and manage properties, enquiries and users (admins only)

## Stack

React 19, TypeScript, Vite, Tailwind CSS 4, React Router 7, Google Maps and Leaflet for maps, react-hot-toast for notifications. The backend is Node.js, Express and MongoDB.

## Run locally

```bash
npm install
npm run dev
```

Create a `.env` file in the project root:

| Variable | What it's for |
| --- | --- |
| `VITE_API_URL` | Backend URL. Defaults to `http://localhost:4040` |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps key for the property map |

Other scripts: `npm run build`, `npm run lint`, `npm run preview`.

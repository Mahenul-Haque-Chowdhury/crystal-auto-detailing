## Crystal Valley Auto Detail Landing Page

A single-page Next.js experience with a cinematic video backdrop and the Crystal Valley Auto Detail discount generator.

### Prerequisites

- Node.js 18.18+ or 20.5+
- npm 9+
- A looping video file named `background.mp4` located in `public/`. Use any branded footage; replace as needed. (The app will still render without it but the hero will show an empty background.)

### Available Scripts

- `npm run dev` – start the local dev server at localhost:3000
- `npm run lint` – run ESLint against the project
- `npm run build` – create an optimized production build
- `npm start` – serve the production build

### Experience Notes

- Mobile devices load the video first with a "Continue" button that slides the discount form into view; desktop/tablet show the generator immediately.
- The "UP TO 70% OFF!" banner is part of the promo messaging; discounts animate before settling on a value.
- Inputs require Name, Phone Number, and Car Model before generating a discount.

### Customization

- Update generator copy/layout in `app/page.tsx`.
- Adjust theming and overlay styling in `app/globals.css`.
- Replace the backdrop footage by swapping `public/background.mp4`.

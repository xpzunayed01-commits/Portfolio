# Zunayed's Portfolio

A premium, minimalistic, light-theme personal portfolio website for Zunayed Al Hasan, Web Designer, UI/UX Designer, and Creative Developer.

## Overview
This project is built using modern web technologies to ensure it is fast, responsive, accessible, and visually striking. The architecture supports a private, secure administrative dashboard powered by Firebase.

## Tech Stack
- **Framework:** React + Vite (SPA)
- **Routing:** React Router DOM
- **Styling:** Tailwind CSS (v4)
- **Animations:** Motion (Framer Motion)
- **Icons:** Lucide React
- **Backend / BaaS:** Firebase (Auth, Firestore)
- **Deployment:** Cloud Run / Vercel

## Local Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Firebase:
   The application uses Firebase. Configuration is managed via `firebase-applet-config.json`.

3. Run the development server:
   ```bash
   npm run dev
   ```

## Firebase Setup

To fully enable the Admin Dashboard and dynamic contact messages:

1. **Authentication:** Enable Email/Password authentication in your Firebase project.
2. **Firestore Database:** The schema is defined in `firebase-blueprint.json`.
3. **Security Rules:** Deploy the rules in `firestore.rules` to protect your data.

*Designed and developed by Zunayed Al Hasan.*

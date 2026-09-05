# Collaborative To-Do List

A React and Firebase task manager with Google authentication, realtime Firestore synchronization, per-user task isolation, priorities, filters, search, editing, and completion tracking.

## Requirements

- Node.js 18 or newer
- A Firebase project with Authentication and Cloud Firestore enabled
- Google sign-in enabled in Firebase Authentication

## Run Locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create your local environment file:

   ```bash
   copy .env.example .env.local
   ```

   Replace `VITE_FIREBASE_API_KEY` in `.env.local` with the Firebase Web API key.

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000`.

Never commit `.env.local` or place API keys in `firebase-applet-config.json`.

## Configure Google Sign-In

In the Firebase Console for the project referenced by `firebase-applet-config.json`:

1. Open **Authentication > Sign-in method** and enable **Google**.
2. Open **Authentication > Settings > Authorized domains**.
3. Add every hostname used to open the app, such as `localhost`, `127.0.0.1`, or a deployed domain.
4. Publish the rules in `firestore.rules` to Cloud Firestore.

The `auth/unauthorized-domain` error means the browser hostname is missing from this Firebase authorized-domain list. The hostname shown in the app error is the one to add.

## Validation

Run the TypeScript check and production build:

```bash
npm run lint
npm run build
```

## Manual Test Flow

- Sign in with Google and sign out.
- Create, edit, complete, and delete tasks.
- Verify tasks remain after a page refresh.
- Test status, priority, and search filters.
- Try an empty title, a title over 200 characters, and a description over 1,000 characters.
- Sign in with a second account and verify that accounts cannot read each other's tasks.

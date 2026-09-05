# Baka To-Do List

A React and Firebase task manager with Google authentication, realtime Firestore synchronization, per-user task isolation, priorities, filters, search, editing, and completion tracking.

## Technology Stack

- **React 19** and **TypeScript** for the browser application
- **Vite** for development and production builds
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Motion** for interface animation
- **Firebase Authentication** with Google Sign-In
- **Cloud Firestore** for realtime task and user-profile data
- **Firestore Security Rules** for authentication and ownership enforcement

This repository does not contain a custom server, API, Firebase Cloud Functions, file storage, or AI API integration. Firebase Hosting configuration is included for production deployment.

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

   ```powershell
   Copy-Item .env.example .env.local
   ```

   Set `VITE_FIREBASE_API_KEY` in `.env.local` to the Firebase Web API key. This file is ignored by Git.

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000`.

Never commit `.env.local` or place API keys in `firebase-applet-config.json`. The Firebase browser key is loaded through Vite at build time. It must still be restricted in Google Cloud Console to the correct APIs and website referrers.

## Firebase Configuration

In the Firebase Console for the project referenced by `firebase-applet-config.json`:

1. Enable **Google** under **Authentication > Sign-in method**.
2. Add `localhost`, `127.0.0.1`, and every production hostname under **Authentication > Settings > Authorized domains**. Enter hostnames without ports.
3. Publish `firestore.rules` to Cloud Firestore.
4. Restrict the Firebase Web API key under **Google Cloud Console > APIs & Services > Credentials**.

The `auth/unauthorized-domain` error means the browser hostname is missing from Firebase's authorized-domain list. The app displays the hostname that needs to be added.

## Deploy With Firebase Hosting

Set the Firebase API key as an environment variable before building, then deploy the generated `dist` directory:

```powershell
$env:VITE_FIREBASE_API_KEY = 'your-firebase-web-api-key'
npm run build
npx firebase login
npx firebase deploy --only hosting,firestore
```

The included GitHub Actions workflow deploys automatically from `main` or `master` after these repository secrets are configured:

- `VITE_FIREBASE_API_KEY`
- `FIREBASE_TOKEN`

The workflow also runs type checking and unit tests for pull requests.

## Application Limits

- Task title: 1 to 200 characters after trimming
- Task description: up to 1,000 characters after trimming
- Priority values: `low`, `medium`, or `high`
- Task timestamps: ISO-formatted strings
- Task ownership: one authenticated Google account per task
- Maximum realtime task list: newest 100 tasks per account
- Account deletion: deletes the account's tasks, profile, and Firebase Auth account

## Firebase Free Usage

The Firebase Spark plan has no fixed expiration date. Usage remains free while the project stays within the current quotas. Firebase can change limits, so verify them before production launch.

Current Cloud Firestore free quota:

- 1 GiB stored data
- 50,000 document reads per day
- 20,000 document writes per day
- 20,000 document deletes per day
- 10 GiB outbound data transfer per month
- One free Firestore database per project

Quotas reset daily around midnight Pacific Time. Realtime listeners consume reads when a task list is initially loaded and when matching documents change. Monitor usage in Firebase Console under **Firestore > Usage** and configure billing budget alerts if billing is enabled.

Firebase Authentication's current no-cost limits include 3,000 Tier 1 daily active users on the Spark plan. Google sign-in has no time-based expiration, but Firebase rate limits and abuse protections can apply.

Official references:

- [Firebase pricing](https://firebase.google.com/pricing)
- [Firestore quotas](https://firebase.google.com/docs/firestore/quotas)
- [Authentication limits](https://firebase.google.com/docs/auth/limits)

## Validation

Run the TypeScript check, unit tests, Firestore emulator rules tests, and production build:

```bash
npm run lint
npm run test
npm run test:rules
npm run build
```

`npm run test:rules` downloads/starts the Firestore emulator and may require Java. It does not contact your production Firebase project.

## Manual Test Flow

- Sign in with Google and sign out.
- Create, edit, complete, and delete tasks.
- Verify tasks remain after a page refresh.
- Test status, priority, and search filters.
- Try an empty title, a title over 200 characters, and a description over 1,000 characters.
- Sign in with a second account and verify that accounts cannot read each other's tasks.
- Verify that an unauthorized hostname produces the Firebase setup message.
- Delete a test account and verify its tasks and profile are removed.

## Project Files

- `src/`: React application code
- `firebase-applet-config.json`: non-secret Firebase project identifiers
- `.env.local`: local Firebase API key, never committed
- `firestore.rules`: database authorization and validation rules
- `firebase-blueprint.json`: Firestore entity and path schema
- `security_spec.md`: security invariants and negative test cases
- `public/privacy.html`: privacy notice served at `/privacy.html`
- `tests/`: unit tests and Firestore rules tests

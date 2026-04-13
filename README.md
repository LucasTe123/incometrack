# IncomeTrack PWA — Setup Guide

## 🚀 Complete Setup Instructions

---

## Step 1 — Create a Firebase Project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"** → Name it (e.g. `incometrack`) → Continue
3. Disable Google Analytics (optional) → **Create Project**

### Enable Authentication

1. Click **Build → Authentication** in the sidebar
2. Click **"Get started"**
3. Select **Email/Password** → Enable it → Save

### Enable Firestore

1. Click **Build → Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in production mode"** (we'll add rules next)
4. Choose a region near your users → Done

### Deploy Firestore Security Rules

In the Firestore Console → **"Rules"** tab, paste the contents of `firestore.rules`:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /entries/{entryId} {
      allow read, write: if request.auth != null
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null
        && request.auth.uid == request.resource.data.userId
        && request.resource.data.keys().hasAll(['userId', 'date', 'cash', 'card', 'qr', 'total', 'createdAt'])
        && request.resource.data.cash is number
        && request.resource.data.card is number
        && request.resource.data.qr is number
        && request.resource.data.total is number
        && request.resource.data.cash >= 0
        && request.resource.data.card >= 0
        && request.resource.data.qr >= 0;
    }
    match /goals/{goalId} {
      allow read, write: if request.auth != null
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null
        && request.auth.uid == request.resource.data.userId
        && request.resource.data.monthlyGoal is number
        && request.resource.data.monthlyGoal > 0;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

Click **Publish**.

### Get Firebase Config Credentials

1. Firebase Console → ⚙️ **Project Settings**
2. Scroll to **"Your apps"** → Click **"Add app"** → choose **Web (</> icon)**
3. Name it (e.g. `incometrack-web`) → Register app
4. **Copy the `firebaseConfig` object** — you'll need these values

---

## Step 2 — Configure Environment Variables

Edit `.env.local` in the project root and replace all placeholder values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123def456
```

> ⚠️ **Never commit `.env.local` to version control.**

---

## Step 3 — Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/login`.

Create an account via `/register`, then start tracking!

---

## Step 4 — Deploy to Vercel

### Method A: Vercel CLI (fastest)

```bash
npm install -g vercel
vercel
```

Follow the prompts. When asked about environment variables, add all `NEXT_PUBLIC_FIREBASE_*` keys.

### Method B: GitHub + Vercel Dashboard

1. Push the project to GitHub
2. Go to [vercel.com](https://vercel.com) → Import the repo
3. In **Environment Variables**, add all 6 Firebase keys from `.env.local`
4. Click **Deploy**

> The app will be live at `https://your-project.vercel.app`

---

## File Structure

```
incometrack/
├── app/
│   ├── layout.tsx              ← Root layout + PWA meta
│   ├── page.tsx                ← Redirects to /dashboard
│   ├── (auth)/
│   │   ├── login/page.tsx     ← Login form
│   │   └── register/page.tsx  ← Registration form
│   └── (app)/
│       ├── layout.tsx         ← Auth guard + bottom nav
│       ├── dashboard/page.tsx ← Main dashboard
│       ├── analytics/page.tsx ← Charts + insights
│       ├── history/page.tsx   ← Entry history
│       └── settings/page.tsx  ← Goal + account settings
├── components/
│   ├── charts/                ← Recharts components
│   ├── dashboard/             ← StatCard, GoalProgress, MiniWeekChart, GoalModal
│   ├── entry/                 ← QuickEntryModal (the core feature)
│   ├── history/               ← EntryRow
│   ├── layout/                ← BottomNav
│   └── shared/                ← OfflineBanner, EmptyState
├── hooks/
│   ├── useAuth.ts             ← Firebase auth state
│   ├── useEntries.ts          ← Real-time Firestore listener
│   ├── useGoal.ts             ← Monthly goal listener
│   └── useOfflineSync.ts      ← Offline queue flusher
├── lib/
│   ├── firebase.ts            ← Firebase init
│   ├── firestore.ts           ← CRUD + real-time subscriptions
│   ├── auth.ts                ← signIn / signUp / signOut
│   ├── idb.ts                 ← IndexedDB offline cache
│   └── validators.ts          ← Zod schemas
├── store/
│   ├── authStore.ts           ← Zustand user state
│   ├── entryStore.ts          ← Zustand entries cache
│   └── goalStore.ts           ← Zustand goal state
├── types/index.ts             ← TypeScript interfaces
├── utils/
│   ├── dateUtils.ts           ← Week/month grouping, totals
│   └── formatters.ts          ← Currency, progress helpers
├── firestore.rules            ← Firestore security rules
├── public/
│   ├── manifest.json          ← PWA manifest
│   └── icons/                 ← PWA icons (192, 512)
└── .env.local                 ← Your Firebase credentials (DO NOT COMMIT)
```

---

## Features

| Feature | Status |
|---------|--------|
| Email/password auth | ✅ |
| Real-time Firestore sync | ✅ |
| Cash / Card / QR entry | ✅ |
| Auto-calculated totals | ✅ |
| Daily / Weekly / Monthly / Yearly totals | ✅ |
| Monthly goal + progress bar | ✅ |
| Weekly bar chart | ✅ |
| Monthly bar chart | ✅ |
| Payment method donut chart | ✅ |
| Best day / best month highlights | ✅ |
| History with week/month/year filter | ✅ |
| Offline support (IndexedDB) | ✅ |
| Auto-sync on reconnect | ✅ |
| PWA manifest + service worker | ✅ |
| Dark mode design | ✅ |
| Glassmorphism UI | ✅ |
| Framer Motion animations | ✅ |
| Skeleton loading states | ✅ |
| Empty states | ✅ |
| Mobile-first responsive | ✅ |

---

## Security Model

- Users can **only read and write their own data** (enforced by Firestore rules on the server)
- All inputs validated with Zod before submission
- Firebase Auth manages session tokens
- `.env.local` keeps credentials out of the codebase

---

## PWA Installation

On mobile Chrome → tap the browser menu → **"Add to home screen"**  
On Safari iOS → tap Share → **"Add to Home Screen"**  
On desktop Chrome → click the install icon in the address bar

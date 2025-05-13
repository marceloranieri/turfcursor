# Turf App – Changelog

## 📅 Date: 2024-01-24

## ✅ Overview
This changelog summarizes all critical changes made during the build/debugging process to stabilize the project and ensure a successful deployment and developer experience.

---

### 1. 🎨 Tailwind Configuration (`tailwind.config.js`)
- Added support for custom CSS variables (background and text colors)
- Added custom `borderRadius` for card and buttons
- Added custom `boxShadow` utility
- Included the `lib/` directory in the Tailwind content paths

---

### 2. 💅 CSS Updates (`globals.css`)
- Organized structure into `@tailwind base`, `components`, and `utilities`
- Registered custom classes with `@layer` directive (`.card`, `.btn`, etc.)
- Defined `:root` HSL variables
- Resolved all invalid `@apply` references to non-existent classes

---

### 3. 🧠 Type Definitions (`lib/types/index.ts`)
- Added `Reaction` and `Message` interfaces to include missing properties (`isBot`, `user_id`, `type`)
- Reintroduced `GitHubUser` and `GitHubEvent` interfaces
- Added proper typing for GitHub API responses
- Included metadata types for enhanced messages

---

### 4. 📁 File System / Case Sensitivity Fixes
Renamed files and imports to ensure consistency on all OS types:
- `toaster.tsx` → `Toaster.tsx`
- `toast.tsx` → `Toast.tsx`
- Updated all corresponding imports in `ClientLayout.tsx`, `Providers.tsx`, etc.

---

### 5. 🧩 Component Exports
Standardized the following components to use default exports:
- `GithubProfile`
- `RepositoryCard`
- `ActivityFeed`
- `NotificationCenter`
- `ToastProvider`
- `AuthProvider`

---

### 6. ⚙️ TypeScript Config (`tsconfig.json`)
- Enabled `downlevelIteration` and `forceConsistentCasingInFileNames`
- Set `target` to `es2017` to ensure compatibility with iteration methods
- Ensured strict mode and modern module resolution

---

### 7. 🧪 Build Verification Commands

```bash
rm -rf .next
npm install
npm run build
npx tsc --noEmit
npm run lint
```

All of these passed after updates were completed.

---

### 8. ⚠️ Edge Function Notes
Files using Deno (e.g., `refreshTopics.ts`) are temporarily unstable due to missing Deno globals in your TS config. Add this at the top of Deno files to prevent type errors:

```ts
/// <reference lib="deno.ns" />
```

Or consider replacing with a Node-compatible function if targeting Node runtimes only.

---

## 📌 Next Steps
- [ ] Validate GitHub page routes now using updated `RepositoryCard` props
- [ ] Ensure Supabase hooks align with updated `Message` and `Reaction` interfaces
- [ ] Optionally deploy static type checking via CI pipeline
- [ ] Test dark mode with updated color variables
- [ ] Verify responsive design with new component classes 
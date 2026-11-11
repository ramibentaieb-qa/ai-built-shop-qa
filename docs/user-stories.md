# User Stories

## Story 1: Project setup

**As a** QA lead,
**I want** a working Next.js shop application skeleton that runs locally,
**so that** I have a stable base to test and to build the next stories on.

### Acceptance criteria
1. The project installs with `npm install` without errors.
2. The app starts with `npm run dev` and opens at `http://localhost:3000` without errors in the terminal or the browser console.
3. The home page displays the shop name, a short welcome message, and a header with the navigation links "Home" and "Cart" (the Cart page can be an empty placeholder).
4. The home page displays correctly on desktop and mobile screen widths (no overlapping or cut-off content).
5. Opening a URL that doesn't exist (for example `/abc123`) shows a clear "Page not found" message, not a blank page or a crash.
6. `npm run build` completes without errors.
7. The README explains how to install, run and build the project, in the order a new person would follow.
8. The work is on the branch `feature/project-setup`, with small commits and clear messages, and nothing is committed directly to `main`.

### Out of scope
Products, search, cart logic, checkout, login, and any database. Do not implement these in this story.
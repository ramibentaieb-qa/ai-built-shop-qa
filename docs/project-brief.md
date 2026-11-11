# Project Brief: AI-Built Online Shop

## What the shop does
A small online shop where visitors browse products, search and filter them, view product details, add items to a cart, and complete a checkout with a mock payment. No real payments or real customer data are used. The project is built by an AI coding agent and tested by a human QA lead.

## Stack and constraints
- Next.js, with products stored in a JSON file or a simple database (about 10-15 products)
- Free tools only (GitHub, GitHub Actions, free hosting tier)
- Mock payment only

## How the AI must work
- Do NOT build the whole project at once.
- Work only on the user story I give you, one at a time, from `docs/user-stories.md`.
- Implement only what the story's acceptance criteria describe. Do not add extra features or start later stories.
- Use one branch per story (`feature/<name>`), with small commits, and never commit directly to `main`.
- When done, tell me how to run and test it, then wait for my review.
- Fix bugs only when I give you a GitHub Issue, and reference the issue number in the commit.

## Definition of Done
A story is done when:
- Every acceptance criterion passes in my testing
- No open critical or high-severity bugs remain
- Automated tests pass in CI
- The change is deployed to staging
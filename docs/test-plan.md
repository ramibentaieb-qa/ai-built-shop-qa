# Test Plan: MiniMart

## 1. Context:
MiniMart is built in small iterations. Each user story is one iteration. CLaude (business analyst)  drafts the user story, the QA lead approves it, MiniMAx Code (developer agent) builds it on on its own branch, and the QA lead tests it before it is merged. Testing happens during each story, not at the end.

## 2. Team and Roles:
| Role | Who | Testing responsibility |
|---|---|---|
| Business analyst | Claude | Drafts stories with testable acceptance criteria |
| Developer | MiniMax Code | Builds the story, fixes defects |
| QA lead | Rami | Approves stories, tests, reports bugs, writes automation, decides if a story is accepted |

## 3. Story workflow:
1. Claude drafts a story with numbered acceptance criteria.
2. The QA lead reviews it. Unclear or untestable criteria are changed before any code is written.
3. The agent builds the story on its own branch, following `AGENTS.md`.
4. The QA lead tests by hand: every criterion first, then exploratory testing.
5. Each defect becomes a GitHub Issue. The agent fixes it and the QA lead retests.
6. Playwright tests are written for the story and the full suite runs.
7. A pull request is opened. It is merged only when the pipeline is green.
8. A short test report is added to `docs/test-report-storyN.md`.

## 4. Definition of Ready:
A story can be build when:
- It has a clear goal and numbered acceptance criteria.
- Every criterion can be verified.
- The QA lead has approved it.
- It does not depend on a story that is not built yet.

## 5. Definition of Done:
A story is done when:
- All acceptance criteria pass.
- Exploratory testing is finished
- No high or medium severity defects is open fot the story
- Automated tests cover is  merged with a green pipeline.
- The pul request is merged with a green pipeline.
- The test report is written.

## 6. Test Approach by quadrant:
| Quadrant | Purpose | In MiniMart |
|---|---|---|
| Q1: technical, supports the team | Fast feedback for the developer | Lint and build in CI |
| Q2: business facing, supports the team | Check the story does what was asked | Acceptance criteria checks, Playwright UI tests |
| Q3: business facing, critiques the product | Find what the story missed | Manual exploratory testing: edge cases, keyboard use, small screens, console errors, several accounts |
| Q4: technical, critiques the product | Non-functional checks | Out of scope for now: performance and security |

## 7. Test automation and continuous testing:
- Playwright with JavaScript and the Page Object Model.
- Regression suite: the full suite runs on every pull request (GitHub Actions: lint and build in parallel, then tests)
- Smoke suite: tests  tagged `@smoke` run on the live Vercel site after each CI run on `main`
- Branch protection requires the `test` check, so a failing suite  bocks the merge.
- Time-based behavior, such as the 24-hour  session expiry, is  tested with Playwright's  `pag.clock` .

## 8. Defect handling:
- Defects are logged as GtHub Issues with steps to reproduce, expected result and actual result.
- Labels: `bug`, `enhancement`, severity, `agent-need-dix`, `ready-for-retest`
- Defects found in a story are fixed in that story's branch before merge.
- A missing requirement is not a defect. It becomes a new story, or a change to the current one.

## 9. Risks:
| Risk | Response |
|---|---|
| New AI-written code breaks earlier stories | Full regression on every pull request |
| Automated tests only check what was scripted | Exploratory testing on every story. It found a bug where one account could see another account's order confirmation while all automated tests were green |
| The mock payment hides real payment issues | Out of scope, documented |
| Browser-only data makes tests depend on each other | Each test starts from a clean browser state |

## 10. Scope and limits
- 13 stories: products, product details, cart, registration, login and session, payment form and order confirmation.
- Chromium only. No performance, load or security testing.
- No API or database tests, because the app has neither.
- Accessibility is checked by keyboard only.

## 11. Evidence
- User stories: `docs/user-stories.md`
- Test reports: `docs/test-report-storyN.md`
- Bugs: GitHub Issues
- Tests: `tests/` and `pages-objects/`
- Pipeline: GitHub Actions (CI Pipeline and Live Smoke Test)
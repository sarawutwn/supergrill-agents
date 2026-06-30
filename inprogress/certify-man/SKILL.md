---
name: certify-man
description: Manual testing workflow controller — discovery → plan → browser execution → report.
---
# Manual Test Skill
 
You are a manual-test workflow controller. When this skill is loaded, the agent **must** follow every phase in order. No phase may be skipped. No execution may begin before a plan is approved.
 
---
 
## Workflow Overview
 
```
Phase 1: Discovery  →  Phase 2: Planning  →  Phase 3: Execution  →  Phase 4: Reporting
```
 
Each phase has a **hard gate**. The agent must not proceed to the next phase until the gate condition is satisfied.
 
---
 
## Phase 1: Discovery (grill-design loop)
 
**Objective:** Fully understand the test scope before writing anything.
 
### Steps
 
1. **Read the codebase first** — inspect relevant files, routes, and components before asking any question. Do not ask about anything the codebase can answer.
2. **Identify flows to test** — list candidate flows based on:
   - Active frontend callers (pages that import and call an endpoint)
   - POST/GET endpoints reachable from the UI
   - Use codegraph to verify which functions the frontend actually calls
3. **Conduct the grill-design interview** — ask one question at a time through the `question` tool. Cover:
   - Which flows are in scope?
   - Which URL / environment (localhost port, staging, etc.)?
   - Login credentials format (will they be provided at execution time or are they in `.env`)?
   - Expected pass/fail criteria for each flow?
   - Any flows explicitly out of scope?
4. **Recheck alignment** — after all branches are resolved, ask at least one recheck question: *"My understanding is [X] — is that correct?"* Wait for confirmation.
5. **Skip flows with no frontend caller** — note them; they will appear in the report's warning section.
### Hard Gate 1
 
> **Do not move to Phase 2 until:**
> - Every in-scope flow is named and agreed upon.
> - The target URL/environment is confirmed.
> - The user has explicitly confirmed alignment.
 
---
 
## Phase 2: Planning
 
**Objective:** Produce an approved, structured test plan before touching the browser.
 
### Step 0 — Resolve folder numbering (mandatory, before writing the plan)
 
1. Run: `ls docs/result-manual-test/ 2>/dev/null | sort` to list existing folders.
2. Find the highest `NNN` prefix already present (e.g. `007` → next is `008`). If the directory is empty or absent, start at `001`.
3. Each flow in this session gets its **own sequential number**, incrementing from that next value.
   - Example: existing max is `005`, session has 3 flows → assign `006`, `007`, `008`.
4. Record the full folder name for every flow **before** writing the plan:
   ```
   006-test-login
   007-test-create-schedule
   008-test-delete-shift
   ```
5. Never reuse a number. Never put two flows in the same folder.
### Steps
 
1. Invoke `skill({ name: "create-plan" })` to write the test plan.
2. The plan **must** include:
   - Task 0: scan `docs/result-manual-test/` → determine next NNN → list all `NNN-test-<flow-name>` assignments
   - Task breakdown per flow: create folder → login → test flow → verify network → write report
   - One folder per flow — **never share a folder between flows**:
     ```
     docs/result-manual-test/
     ├── NNN-test-<flow-a>/
     │   ├── html/report.html
     │   └── images/
     │       ├── 01-<step>.png
     │       └── ...
     ├── NNN+1-test-<flow-b>/
     │   ├── html/report.html
     │   └── images/
     └── ...
     ```
   - `<flow-name>` = kebab-case feature/flow name (e.g. `login`, `create-schedule`, `delete-shift`)
   - Agent-browser session name per flow: `--session manual-<flow-name>`
   - One task block per flow, clearly labeled with its folder path
3. Call `submit_plan` — do not proceed until the user approves.
4. If the user requests changes, apply them and call `submit_plan` again.
### Hard Gate 2
 
> **Do not move to Phase 3 until:**
> - `submit_plan` has been called and returned successfully.
> - The user has approved the plan (no pending change requests).
> - Every flow has a unique `NNN-test-<name>` folder assignment listed in the plan.
 
---
 
## Phase 3: Execution
 
**Objective:** Execute every approved test task using agent-browser only — one flow at a time, each in its own folder.
 
### Rules
 
- **agent-browser only** — no Playwright, Puppeteer, Selenium, or any other browser tool.
- **One folder per flow** — before starting each flow, confirm you are writing into `NNN-test-<flow-name>/` for that flow only. Never mix screenshots or reports from different flows into the same folder.
- **Create the folder structure first** — before opening the browser for each flow:
  ```bash
  mkdir -p docs/result-manual-test/NNN-test-<flow-name>/html
  mkdir -p docs/result-manual-test/NNN-test-<flow-name>/images
  ```
- **Screenshot every step** — `agent-browser screenshot` after every interaction. Never skip.
- **Name screenshots sequentially per flow** — `01-<description>.png`, `02-<description>.png`, etc., saved to that flow's `images/` folder. Reset numbering to `01` for each new flow.
- **Verify network after every action** — `agent-browser network requests --filter <pattern>` to check status codes immediately.
### Login sequence
 
```bash
agent-browser open <URL>
agent-browser snapshot
# find field refs from snapshot output
agent-browser type @eN <username>
agent-browser type @eN <password>
agent-browser press Enter
agent-browser wait 3
agent-browser screenshot  # ← mandatory
# verify URL changed to dashboard/home
```
 
### Navigate and interact sequence
 
```bash
agent-browser navigate <URL>
agent-browser snapshot
agent-browser screenshot  # ← mandatory
# interact: click @eN / type / press Enter / select
agent-browser network requests --filter <pattern>
agent-browser screenshot  # ← mandatory after every meaningful interaction
```
 
### Key patterns
 
- If `click @eN` does not redirect → try `press Enter` on that field instead.
- Check that buttons transition from **disabled → enabled** before clicking.
- If a step produces an unexpected result, capture a screenshot immediately before continuing.
### Hard Gate 3
 
> **Do not move to Phase 4 until:**
> - Every task in the approved plan has been executed.
> - Every step has at least one screenshot saved to `images/`.
> - Network status codes have been verified for every API call in each flow.
 
---
 
## Phase 4: Reporting
 
**Objective:** Generate one HTML report per test scenario using the approved template.
 
### Steps
 
1. Generate **one report per flow** — do not combine multiple flows into a single report.
2. Copy `references/report-template.html` for each flow — never write a report from scratch.
3. Replace all `{{PLACEHOLDERS}}` with actual test data for that flow.
4. Save each report to its own folder: `docs/result-manual-test/NNN-test-<flow-name>/html/report.html`.
5. **If the test failed**, write a bug report file (see below) in addition to the HTML report.
### Required sections (in order)
 
| Section | Element | Notes |
|---|---|---|
| **Header** | test name, date, tester, pass/fail badge | Pass: `#0d3322`/`#7ee787` · Fail: `#490202`/`#ff7b72` |
| **Purpose** | `.purpose` blue card | `#0d2d4a` bg, `#1f6feb` border |
| **Steps** | `<div class="step">` per step | step number circle + description + screenshot |
| **Network table** | summary table | method, endpoint, status, notes |
| **Warning** | `.warning` amber card | `#2a1f03` bg, `#9e6a03` border — include skipped/no-caller flows |
| **Summary** | `.summary` green card | final pass/fail with reasoning |
 
### Bug report (FAIL only)
 
When a flow fails, create a plain-text bug report at:
```
docs/result-manual-test/NNN-test-<flow-name>/bug-report.md
```
 
The file **must** follow this exact format — no extra sections, no reordering:
 
```markdown
Title: <one-line description of what is wrong and where>
 
Steps to Reproduce:
<step 1> → <step 2> → <step 3>
<add lines as needed; keep each step concise>
 
Expected:
<describe what the correct behavior should be>
<include example values or calculations where helpful>
 
Actual:
<describe exactly what happened instead>
<include the specific wrong value or missing element observed>
```
 
**Writing rules for the bug report:**
 
- **Title** — name the screen/feature first, then the symptom. Be specific enough that a developer can locate the bug without reading the rest of the file. Example: `แฟ้มสินค้า แถบข้อมูลเฉพาะ — "ขายเฉลี่ย/วัน" แสดงยอดขายรวมแทนค่าเฉลี่ย`
- **Steps to Reproduce** — write the minimal path to trigger the bug. Use `→` to separate steps on the same line when they form one continuous action. Use a new line for each distinct stage.
- **Expected** — state the correct value, formula, or UI state. Include example numbers if the bug is about a calculation (e.g. `30 ÷ 30 = 1 ชิ้น`).
- **Actual** — state exactly what was observed. Reference the screenshot filename where the evidence is visible (e.g. `ดู 05-data-panel.png`).
- Write in the same language as the UI under test (Thai if the app is Thai).
- Do not add headers, metadata, or commentary outside these four sections.
- If a single flow has multiple distinct bugs, write one `bug-report.md` with multiple titled blocks separated by `---`.
### Styling rules — never override
 
- Dark theme: `#0d1117` body · `#161b22` cards · `#30363d` borders
- Font: Noto Sans Thai (Google Fonts `wght@400;600;700`)
- Code: `#21262d` bg · `#ffa657` text
- Table header: `#1c2128` · Table border: `#21262d`
---
 
## Agent-Browser Quick Reference
 
```bash
agent-browser open <URL>
agent-browser snapshot
agent-browser snapshot -i           # interactive / compact refs
agent-browser type @eN "value"
agent-browser press Enter
agent-browser click @eN
agent-browser wait 3
agent-browser navigate /path
agent-browser screenshot
agent-browser network requests --filter <keyword>
agent-browser network requests
```
 
---
 
## Hard Rules (enforced by the agent, not negotiable)
 
| Rule | Detail |
|---|---|
| `question` tool only | Every question to the user goes through `question`. Never ask in assistant text. |
| grill-design loop | Discovery is a loop — keep asking until zero ambiguities remain. Minimum 3 questions. |
| No skipping phases | Phase order is 1 → 2 → 3 → 4. No exceptions. |
| `submit_plan` required | Execution is forbidden until `submit_plan` succeeds and user approves. |
| Scan counter first | Before writing the plan, always `ls docs/result-manual-test/` to find the current max NNN. |
| One folder per flow | Each flow gets its own `NNN-test-<flow-name>/` folder. Never share folders between flows. |
| Sequential NNN | NNN is a running counter across all sessions. Never reuse or reset it. |
| Screenshot every step | No step in Phase 3 completes without a screenshot. |
| Screenshots isolated | Each flow's screenshots go into its own `images/` folder. Reset numbering to `01` per flow. |
| agent-browser only | No other browser automation tool. |
| Template only | Never deviate from report colors, layout, or section order. |
| One report per flow | Never combine multiple flows into one HTML report. |
| Bug report on fail | Every failed flow must have a `bug-report.md` alongside `html/report.html`. |
| Bug report format | Title / Steps to Reproduce / Expected / Actual — exact order, no extra sections. |
| Declare gaps | Flows with no frontend caller → noted in warning section, never silently dropped. |
| No git commit/push | Never commit or push as part of this workflow. |
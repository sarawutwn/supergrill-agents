---
name: grill-design
description: Stress-test a design, idea, or approach by interviewing the user one question at a time. Before grilling, read docs/_rules when it exists so questions and stress-tests can account for prior project rules and contracts. Each question comes with a recommended answer AND a one-line self-critique of that recommendation. After each user answer, briefly stress-test the answer against prior decisions and any loaded docs/_rules contracts before moving on. Use when the user wants a sharp grill on a design or decision tree without persistence overhead.
---

You are running a sharp grilling session on a design, idea, plan, or decision tree. The job is to walk every branch, recommend an answer for each question, expose your own assumptions, and pressure-test the user's answers as they come in.

Do following the process:

0. **Load project rules when present** — before the first question, check whether `docs/_rules` exists. If it does not exist, do nothing special and grill normally. If it exists and contains rule/contract markdown files, read them before asking the first question.
1. **Self-critique on the recommendation** — before showing your pick, name what could be wrong with it.
2. **Stress-test on the user's answer** — before moving to the next question, briefly check whether their answer conflicts with earlier decisions, loaded project rules/contracts, closes off branches, or rests on an unstated assumption.

If a question can be answered by exploring the codebase, explore the codebase instead of asking.

## Project rules preflight

At the start of every grilling session:

1. Check for `docs/_rules`.
2. If `docs/_rules` does not exist, skip this preflight without mentioning it unless relevant.
3. If `docs/_rules` exists but has no markdown files, skip this preflight and grill normally.
4. List markdown files under `docs/_rules` recursively.
5. If `docs/_rules/index.md` exists, read it first. Treat it as a compact routing table, not the source of truth.
6. Parse compact index entries in this shape:

   ```md
   - [Contract Title](contracts/YYYYMMDDHHMM-slug.md)  
     `status` | `created_at` | scope: `scope-a`, `scope-b`  
     One short routing summary sentence.
   ```

7. Use the title, scope, and routing summary to decide which referenced contract files are relevant to the current design question.
8. Read every referenced contract that appears relevant. If unsure, read it.
9. Read any remaining markdown files under `docs/_rules` that were not already read only when the index is missing, incomplete, or the current design area is broad enough that missing a contract would be risky.
10. If a referenced file is missing, mention the missing reference briefly before the first question.

Use the loaded rules as prior project memory:

- Treat `docs/_rules/index.md` as navigation only. The contract files are the source of truth.
- When forming a recommendation, prefer options that preserve existing contracts unless the user is explicitly exploring a change.
- When writing the self-check, call out any assumption that depends on a prior contract.
- When stress-testing the user's answer, explicitly flag conflicts with loaded contracts.
- If the new requirement appears to violate a loaded rule/contract, pause the normal branch walk and ask one focused discussion question about whether to keep, revise, or supersede the older contract.

Do not edit `docs/_rules`. This skill reads rules and uses them for discussion only.

## Per-question loop

For each question:

### 1. Form a recommendation and critique it (silently, then surface both)

Pick the answer you think is right. Then ask yourself: what assumptions am I making? what's the strongest case against this pick? Surface both.

### 2. Render the question

Use the render mode that matches the channel.

#### Plain chat render

```
**Q<n>: <question>**

Options:
- (A) ...
- (B) ...
- (C) ...

**Recommendation:** (A) — <one-line reason>.

**Self-check:** <one-sentence honest critique — e.g. "This assumes the team has Postgres ops experience; confirm before locking.">

Pick A/B/C, override, or push back?
```

#### Structured `question` tool render

When using a multiple-choice `question` tool, do not paste the plain-chat block into the tool's question/body field. The UI renders options separately, so duplicating them in the question text makes the prompt hard to read.

Use this mapping:

- Tool question/body: only these lines:

  ```md
  Q<n>: <question>
  Recommendation: <A/B/C> — <one-line reason>.
  Self-check: <one-sentence honest critique>.
  ```

- Tool options: use labels in this shape: `A - <short option title>`, `B - <short option title>`, `C - <short option title>`.
- Add `(Recommended)` to the recommended option label only, e.g. `A - Sync continuously (Recommended)`.
- Tool option descriptions: put the option's consequence, trade-off, or extra detail in the matching description. Do not repeat the exact label text unless the tool has no separate description field.
- If the tool has a custom answer field, rely on it for overrides and pushback instead of adding "Pick A/B/C..." to the question text.
- If the tool does not have a custom answer field, add one short final line to the question/body: `Pick A/B/C, override, or push back?`
- Never include an `Options:` markdown list in the tool question/body when the tool already has separate options.

Example structured options:

```md
question/body:
Q1: เวลา user กรอกเบอร์โทร ควร sync รหัสสมาชิกเองไหม?
Recommendation: A - เพราะลด manual state และกันข้อมูลหลุด sync.
Self-check: สมมติว่า autofill ไม่สร้าง side effect กับผู้ใช้เดิม.

options:
- label: A - กรอก/แก้เบอร์โทรแล้ว sync ต่อเนื่อง (Recommended)
  description: ใช้เมื่อรหัสสมาชิกควรตามเบอร์โทรล่าสุดเสมอ และต้องการลดโอกาส state ค้างจากค่าเก่า.
- label: B - Autofill เฉพาะตอนว่าง
  description: ใช้เมื่อไม่อยากแก้ค่าที่ผู้ใช้เคยตั้งเอง แต่ต้องยอมรับว่าเบอร์กับรหัสสมาชิกอาจไม่ sync หลังจากนั้น.
- label: C - ไม่ sync ระหว่างพิมพ์
  description: ใช้เมื่ออยากเลี่ยง side effect ระหว่าง input และค่อยใช้เบอร์โทรเป็น default ตอนบันทึก.
```

### 3. User answers

Wait. Accept their pick or override.

### 4. Stress-test the answer

Before moving on, briefly check:

- Does this conflict with any earlier resolved decision in this session?
- Does this conflict with any loaded `docs/_rules` rule or contract?
- Does it close off a branch we may still need open?
- Does it rest on an unstated assumption?

If something is off, raise it inline. Otherwise acknowledge and move on.

### 5. Walk the next branch

Pick the next question by walking the design tree from where you are. Repeat.

## Rules

- ALWAYS recommend an answer. Never ask without proposing.
- ALWAYS show a self-check next to the recommendation. Even if you're confident — name what could be wrong.
- ONE question at a time. No compound questions.
- NEVER write to any other file. State lives in the conversation.
- NEVER spawn subagents. Do verification yourself by reading files inline if needed.
- When the user pushes back, take it seriously — they may have context you don't.
- When you're confused, name what's unclear and stop. Don't hide confusion behind a plan.

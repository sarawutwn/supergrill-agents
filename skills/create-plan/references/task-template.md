# Task Template

Use this template for every implementation task. Keep each task small enough to complete and verify independently.

````markdown
### Task N: [Component Name]

**Files:**

- Create: `exact/path/to/file.py`
- Modify: `exact/path/to/existing.py:123`
- Test: `tests/exact/path/to/test.py`

**Parallelization:**

- Can run with: `Task X`, `Task Y`, or `none`
- Must wait for: `Task Z` or `none`
- Race risk: [same files/shared state/migration/generated artifact, or `none`]

- [ ] **Step 0: Load the TDD discipline**

Use `superpowers:test-driven-development` before editing production code. This task must follow RED -> GREEN -> REFACTOR unless it is explicitly docs/config-only; if it is docs/config-only, say why and include the smallest verification command instead.

- [ ] **Step 1: Write the failing test**

```python
def test_specific_behavior():
    result = function(input)
    assert result == expected
```

- [ ] **Step 2: Run the test and confirm it fails for the expected reason**

Run the most targeted test command for the test file above. Expected result: FAIL because the behavior is missing, not because of syntax, setup, or import errors.

- [ ] **Step 3: Implement the minimal code**

Change only the production code needed to pass the failing test. Do not add adjacent behavior, cleanup, or speculative options yet.

- [ ] **Step 4: Run the test and confirm it passes**

Run the same targeted test command. Expected result: PASS with no new warnings or unrelated failures.

- [ ] **Step 5: Refactor only after green**

Refactor only after the targeted test is green. Keep behavior unchanged and rerun the targeted test after the refactor.
````

For docs/config-only tasks, replace the RED -> GREEN steps with the smallest meaningful verification command and explain why a failing behavior test is not appropriate.

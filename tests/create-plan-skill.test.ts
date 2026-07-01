import { describe, expect, test } from "bun:test";

const skillSource = await Bun.file("skills/create-plan/SKILL.md").text();
const planTemplateSource = await Bun.file("skills/create-plan/references/plan-template.md").text();
const taskTemplateSource = await Bun.file("skills/create-plan/references/task-template.md").text();

function section(source: string, heading: string, nextHeading?: string) {
  const start = source.indexOf(heading);
  expect(start).toBeGreaterThanOrEqual(0);

  const end = nextHeading ? source.indexOf(nextHeading, start + heading.length) : -1;
  return end === -1 ? source.slice(start) : source.slice(start, end);
}

describe("create-plan skill", () => {
  test("Task Overview requires the TDD sub-skill and TDD-shaped task summaries", () => {
    const taskOverview = section(planTemplateSource, "## Task Overview");

    expect(taskOverview).toContain("REQUIRED SUB-SKILL: Use superpowers:test-driven-development");
    expect(taskOverview).toContain("TDD slice:");
  });

  test("Task Overview makes parallel execution explicit by default", () => {
    const taskOverview = section(planTemplateSource, "## Task Overview");

    expect(taskOverview).toContain("Parallel-first:");
    expect(taskOverview).toContain("Spawn separate sub-agents");
    expect(taskOverview).toContain("Can run together");
    expect(taskOverview).toContain("Must wait for");
    expect(taskOverview).toContain("Do not parallelize tasks that can race on the same files");
  });

  test("Task Structure makes every implementation task follow the TDD cycle", () => {
    const taskStructure = section(taskTemplateSource, "# Task Template");

    expect(taskStructure).toContain("Use `superpowers:test-driven-development`");
    expect(taskStructure).toContain("Write the failing test");
    expect(taskStructure).toContain("Run the test and confirm it fails for the expected reason");
    expect(taskStructure).toContain("Implement the minimal code");
    expect(taskStructure).toContain("Run the test and confirm it passes");
    expect(taskStructure).toContain("Refactor only after green");
  });

  test("Task Structure requires each task to declare parallel safety", () => {
    const taskStructure = section(taskTemplateSource, "# Task Template");

    expect(taskStructure).toContain("**Parallelization:**");
    expect(taskStructure).toContain("Can run with:");
    expect(taskStructure).toContain("Must wait for:");
    expect(taskStructure).toContain("Race risk:");
  });

  test("SKILL.md points to disclosed templates instead of inlining them", () => {
    expect(skillSource).toContain("references/plan-template.md");
    expect(skillSource).toContain("references/task-template.md");
    expect(skillSource).toContain("Final Gate");
  });
});

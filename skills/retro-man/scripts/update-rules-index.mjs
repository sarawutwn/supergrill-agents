#!/usr/bin/env bun
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const RULES_DIR = path.join(ROOT, "docs", "_rules");
const CONTRACTS_DIR = path.join(RULES_DIR, "contracts");
const INDEX_PATH = path.join(RULES_DIR, "index.md");
const START_MARKER = "<!-- retro-man:index:start -->";
const END_MARKER = "<!-- retro-man:index:end -->";

function ensureStructure() {
  mkdirSync(CONTRACTS_DIR, { recursive: true });

  if (!existsSync(INDEX_PATH)) {
    mkdirSync(RULES_DIR, { recursive: true });
    writeFileSync(
      INDEX_PATH,
      [
        "# Rules Index",
        "",
        "This index lists durable session contracts that future agents should read before changing related behavior.",
        "",
        "## Contracts",
        "",
        START_MARKER,
        "_No session contracts recorded yet._",
        END_MARKER,
        "",
      ].join("\n"),
      "utf8",
    );
  }
}

function parseFrontmatter(markdown, filePath) {
  const relativeFile = path.relative(RULES_DIR, filePath).split(path.sep).join("/");

  if (!markdown.startsWith("---\n")) {
    return {
      contract: null,
      errors: [`${relativeFile}: missing YAML frontmatter`],
    };
  }

  const end = markdown.indexOf("\n---", 4);
  if (end === -1) {
    return {
      contract: null,
      errors: [`${relativeFile}: unterminated YAML frontmatter`],
    };
  }

  const yaml = markdown.slice(4, end).split("\n");
  const data = {};
  let currentKey = null;

  for (const rawLine of yaml) {
    const line = rawLine.replace(/\s+$/, "");
    if (!line.trim() || line.trim().startsWith("#")) {
      continue;
    }

    const listMatch = line.match(/^\s*-\s+(.*)$/);
    if (listMatch && currentKey) {
      if (!Array.isArray(data[currentKey])) {
        data[currentKey] = [];
      }
      data[currentKey].push(cleanScalar(listMatch[1]));
      continue;
    }

    const keyMatch = line.match(/^([A-Za-z0-9_-]+):(?:\s*(.*))?$/);
    if (!keyMatch) {
      continue;
    }

    const [, key, rawValue = ""] = keyMatch;
    currentKey = key;
    const value = rawValue.trim();

    if (!value) {
      data[key] = [];
      continue;
    }

    data[key] = parseInlineValue(value);
  }

  data.file = relativeFile;
  data.status = data.status || "active";
  data.summary = arrayify(data.summary).slice(0, 3);
  data.index_summary = data.index_summary || "";
  data.scope = arrayify(data.scope);
  data.supersedes = arrayify(data.supersedes);
  data.related = arrayify(data.related);

  return {
    contract: data,
    errors: validateContractMetadata(data),
  };
}

function validateContractMetadata(contract) {
  const errors = [];
  const requiredFields = ["title", "slug", "created_at", "session_type", "scope", "summary", "status"];

  for (const field of requiredFields) {
    const value = contract[field];
    if (Array.isArray(value)) {
      if (value.length === 0) {
        errors.push(`${contract.file}: missing required field \`${field}\``);
      }
      continue;
    }

    if (!value) {
      errors.push(`${contract.file}: missing required field \`${field}\``);
    }
  }

  return errors;
}

function parseInlineValue(value) {
  if (value.startsWith("[") && value.endsWith("]")) {
    const inner = value.slice(1, -1).trim();
    if (!inner) {
      return [];
    }
    return inner.split(",").map((item) => cleanScalar(item.trim()));
  }

  return cleanScalar(value);
}

function cleanScalar(value) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function arrayify(value) {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

function readContracts() {
  if (!existsSync(CONTRACTS_DIR)) {
    return [];
  }

  const results = readdirSync(CONTRACTS_DIR)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => path.join(CONTRACTS_DIR, fileName))
    .map((filePath) => {
      const markdown = readFileSync(filePath, "utf8");
      return parseFrontmatter(markdown, filePath);
    });

  const errors = results.flatMap((result) => result.errors);
  if (errors.length > 0) {
    throw new ContractMetadataError(errors);
  }

  return results.map((result) => result.contract);
}

class ContractMetadataError extends Error {
  constructor(errors) {
    super(["Invalid docs/_rules contract metadata:", ...errors.map((error) => `- ${error}`)].join("\n"));
    this.name = "ContractMetadataError";
  }
}

function buildIndexBlock(contracts) {
  if (contracts.length === 0) {
    return "_No session contracts recorded yet._";
  }

  const statusOrder = new Map([["active", 0]]);
  const sorted = contracts.toSorted((a, b) => {
    const statusDelta = (statusOrder.get(a.status) ?? 1) - (statusOrder.get(b.status) ?? 1);
    if (statusDelta !== 0) {
      return statusDelta;
    }
    return String(b.created_at).localeCompare(String(a.created_at));
  });

  return sorted
    .map((contract) => {
      const lines = [
        `- [${contract.title}](${contract.file})  `,
        `  \`${contract.status}\` | \`${formatCreatedAt(contract.created_at)}\` | scope: ${formatScope(contract.scope)}  `,
        `  ${formatSummary(contract)}`,
      ];

      if (contract.supersedes.length > 0) {
        lines.push(`  supersedes: ${formatLinks(contract.supersedes)}`);
      }

      return lines.join("\n");
    })
    .join("\n");
}

function formatScope(scope) {
  if (!scope.length) {
    return "_unspecified_";
  }
  return compactScope(scope)
    .map((item) => `\`${item}\``)
    .join(", ");
}

function compactScope(scope) {
  const seen = new Set();
  const compact = [];

  for (const item of scope) {
    const normalized = compactScopeItem(item);
    if (!normalized || seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    compact.push(normalized);
  }

  return compact.slice(0, 5);
}

function compactScopeItem(item) {
  const value = String(item).trim();
  if (!value) {
    return "";
  }

  const withoutExtension = value.replace(/\.[A-Za-z0-9]+$/, "");
  const basename = path.basename(withoutExtension);
  if (basename.endsWith("-columns")) {
    return "";
  }

  const normalized = basename
    .replace(/^(index|page|route|layout|component|components)$/i, "")
    .replace(/_/g, "-")
    .toLowerCase();

  return normalized || value.toLowerCase();
}

function formatCreatedAt(createdAt) {
  return String(createdAt)
    .replace(/:00(?:\.000)?Z$/, "Z")
    .replace(/:00(?:\.000)?\+00:00$/, "Z");
}

function formatSummary(contract) {
  if (contract.index_summary) {
    return ensureSentence(truncateWords(String(contract.index_summary).trim(), 30));
  }

  const text = contract.summary
    .slice(0, 3)
    .map((item) => stripTrailingPeriods(String(item).trim()))
    .filter(Boolean)
    .join("; ");

  return ensureSentence(truncateWords(text || "Read this contract before changing related behavior", 30));
}

function stripTrailingPeriods(text) {
  return text.replace(/[.。]+$/, "");
}

function ensureSentence(text) {
  const trimmed = text.trim();
  if (!trimmed) {
    return "";
  }
  if (/[.!?…]$/.test(trimmed)) {
    return trimmed;
  }
  return `${trimmed}.`;
}

function truncateWords(text, maxWords) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) {
    return text;
  }
  return `${words.slice(0, maxWords).join(" ")}...`;
}

function formatLinks(paths) {
  return paths
    .map((item) => {
      const normalized = String(item).replace(/^docs\/_rules\//, "");
      const label = path.basename(normalized, ".md");
      return `[${label}](${normalized})`;
    })
    .join(", ");
}

function updateIndex(block) {
  const original = readFileSync(INDEX_PATH, "utf8");

  if (!original.includes(START_MARKER) || !original.includes(END_MARKER)) {
    const appended = [
      original.trimEnd(),
      "",
      "## Contracts",
      "",
      START_MARKER,
      block,
      END_MARKER,
      "",
    ].join("\n");
    writeFileSync(INDEX_PATH, appended, "utf8");
    return;
  }

  const start = original.indexOf(START_MARKER) + START_MARKER.length;
  const end = original.indexOf(END_MARKER);
  const next = `${original.slice(0, start)}\n${block}\n${original.slice(end)}`;
  writeFileSync(INDEX_PATH, next, "utf8");
}

try {
  ensureStructure();
  const contracts = readContracts();
  const block = buildIndexBlock(contracts);
  updateIndex(block);

  console.log(`Updated ${path.relative(ROOT, INDEX_PATH)} from ${contracts.length} contract file(s).`);
} catch (error) {
  if (error instanceof ContractMetadataError) {
    console.error(error.message);
    process.exitCode = 1;
  } else {
    throw error;
  }
}

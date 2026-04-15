# Content folder

Material is split so **narrative** and **build specs** are not mixed.

## `page/` — Architecture narrative (primary for readers)

| File | Role |
|------|------|
| **`page4.md`** | Design rationale: why the three simulators matter, mapping table, relation to tabs 4–5. |
| **`page5.md`** | **My Practice** tab: wiring, load/DB, contracts/SLOs, ownership (`EngineeringPracticePage.jsx`). |

Use these for interview prep, teaching notes, or doc that should match the **My Practice** and **Design Rationale** tabs.

## `dev/` — Implementation prompts & page specs

See **`dev/README.md`**. Contains `prompt.md`, per-page build specs (`page1.md`–`page3.md`), refactor notes (`view.md`, `quality.md`, …). These supported development; they are not polished end-user documentation.

## Agent automation (Cursor)

Project skill: **`.cursor/skills/distributed-simulator-dev/`** (`SKILL.md`, `references/reference.md`). In Agent chat, type **`/`** and pick the skill, or rely on auto-discovery (Settings → Rules). Skill drives phased work and `npm run build`; MCP is optional per your Cursor MCP config.

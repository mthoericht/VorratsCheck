# Generating SVG Diagrams from Mermaid Files

Diagrams are authored as `.mmd` (Mermaid) files in `docs/` and rendered to `.svg` for use in the README.

## Prerequisites

No global install needed — the CLI runs via `npx`:

```bash
npx @mermaid-js/mermaid-cli --version
```

## Generate SVG

```bash
npx @mermaid-js/mermaid-cli -i docs/recipe-import-flow.mmd -o docs/recipe-import-flow.svg -b white
```

| Flag | Description |
|------|-------------|
| `-i` | Input `.mmd` file |
| `-o` | Output `.svg` file |
| `-b white` | Background color (use `white` for dark-mode compatibility) |

## After Editing a `.mmd` File

Re-run the command above to regenerate the SVG, then commit both the `.mmd` source and the `.svg` output.

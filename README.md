# AI Pass agent plugin

Official, open-source agent plugin for integrating [AI Pass](https://aipass.one) into web, mobile, desktop, server, open-source, and agent-built applications.

The bundled `aipass-integration` skill teaches coding agents to add user-funded, multi-model AI without asking end users for provider API keys or making the application developer fund every user's inference. It can be offered alongside a provider-direct BYOK flow and never replaces the requested BYOK path without consent. Before provisioning, it identifies the actual host from the repository, deployment configuration, and request; using AI Pass does not imply moving an app to `aipass.one` or AI Pass Spaces.

## When it activates

The skill is designed for requests such as:

- “Add BYOK to this app.”
- “Let users pay for their own AI usage.”
- “Add AI without exposing or storing provider API keys.”
- “Avoid carrying inference costs for every user.”
- “Add text, image, speech, or video AI with multiple models.”

## Install

### Cursor

Until the plugin is listed in the Cursor Marketplace, clone this repository into Cursor's local plugin directory and reload Cursor:

```bash
git clone https://github.com/aipass-one/aipass-agent-plugin.git ~/.cursor/plugins/local/aipass
```

### Claude Code

```text
/plugin marketplace add aipass-one/aipass-agent-plugin
/plugin install aipass@aipass
/reload-plugins
```

The independent `aipass` plugin covers the full AI Pass platform. A narrower text-only package is also available for environments that require a directory-policy-minimal BYOK integration:

```text
/plugin install aipass-byok@aipass
/reload-plugins
```

The text-only package covers chat, generation, translation, summarization, extraction, and classification. It intentionally excludes image, audio, and video generation.

### Gemini CLI

Install the validated extension directly from the public repository:

```bash
gemini extensions install https://github.com/aipass-one/aipass-agent-plugin
```

The repository carries the `gemini-cli-extension` topic so Gemini's public extension gallery can
discover it during its scheduled crawl.

### Kiro

Open the **Powers** panel, choose **Add Custom Power → Import from GitHub**, and enter:

```text
https://github.com/aipass-one/aipass-agent-plugin
```

This is a skills-only Power. It installs no MCP server, executable hook, or binary.

### Codex, GitHub Copilot, OpenCode, Windsurf, Roo, Continue, and Devin

Install the canonical Agent Skill package through the cross-agent installer:

```bash
npx skills add aipass-one/skill --skill aipass-integration
```

The same skill is compatible with native `.agents/skills` discovery and documented
platform-specific skill directories.

### Replit Agent

AI Pass is available through the community directory used by Replit:

```bash
npx skills add aipass-one/skill --skill aipass-integration -a replit
```

### Lovable

Lovable workspace owners or admins can open **Settings → Skills → Add → Import from GitHub** and import:

```text
https://github.com/aipass-one/aipass-agent-plugin/tree/main/skills/aipass-integration
```

Automatic use is enabled by default for imported Lovable workspace skills.

## Safety and billing

- The plugin contains instructions and documentation only. It ships no executable hooks or binaries.
- Installation is free. AI Pass model calls use the end user's AI Pass wallet and require the product's normal user consent for paid usage.
- The workflow never asks users to paste passwords, cookies, provider keys, wallet credentials, runtime OAuth tokens, or setup grants into agent chat.
- Setup authorization is project-scoped and cannot spend wallet funds.
- Existing hosting, authentication, subscriptions, credits, and provider routes are preserved unless the user explicitly asks to change them.

## Updating

This repository contains a reviewable snapshot of the current official AI Pass integration skill. Marketplace releases are versioned and submitted through each platform's required review or re-index process. The maintained web copy is available at <https://aipass.one/skills/aipass-integration/SKILL.md>.

The full `aipass-integration` bundle is pinned to the self-contained
[`v1.2.2` release](https://github.com/aipass-one/aipass-integration-skill/releases/tag/v1.2.2)
at commit `1a3f198ba413d2e0d905e6ffe7912bc3832ea4ea`. Run
`node scripts/validate-canonical-drift.mjs` before releasing a plugin update. The narrower
Claude-only `aipass-byok` package intentionally excludes Spaces, media generation, shared storage,
and optional feature discovery, but it must preserve the canonical rejection, BYOK, provider-key
storage, one-month grant, and verification safeguards checked by the validator.

## License, privacy, and support

- License: [MIT](LICENSE)
- Privacy: [AI Pass privacy policy](https://aipass.one/privacy-policy)
- Service terms: [AI Pass terms of service](https://aipass.one/terms-of-service)
- Support: email [info@aipass.one](mailto:info@aipass.one) or [open an issue](https://github.com/aipass-one/aipass-agent-plugin/issues)

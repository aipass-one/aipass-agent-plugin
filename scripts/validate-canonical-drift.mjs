#!/usr/bin/env node

import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const fullSkillRoot = path.join(repositoryRoot, 'skills', 'aipass-integration')
const byokSkillRoot = path.join(repositoryRoot, 'plugins', 'aipass-byok', 'skills', 'aipass-byok')

const canonical = {
  repository: 'https://github.com/aipass-one/aipass-integration-skill',
  release: 'v1.2.2',
  commit: '1a3f198ba413d2e0d905e6ffe7912bc3832ea4ea',
  files: {
    'SKILL.md': '97878095ac425d568e56a97a099476086c0d85060d5275bc139f429efd5db906',
    'agents/openai.yaml': 'fba0cba3ae4aa152413f00f1c1c39e2b4c3ba139bb6132c090727a914615de9f',
    'assets/aipass.svg': '1bcac4e879919518e30c9af6640b837e0918ea60ba05b5e166df430672f2cdba',
    'references/aipass-spaces.md': '1edf63e54aacd1dab65006d818bb375b33ca15f180bfbd20b770ee9f8c9d8984',
    'references/backend-oauth.md': '15a74095c77906d52d708b146faf588797065a6ec56e0d6ad487590761018c35',
    'references/existing-auth-and-billing.md': 'd4db05ce8e79b81c857782f46a9c28c7a9997354f0a852d2efdc7ff1472ac1a8',
    'references/feature-opportunities.md': 'c3e265a62414a444dc80af3b95df64ab99539bdf4e73aa0731e3a68e4ff6d846',
    'references/path-decision.md': 'e2cf0db748e3482f01220a409afd373eb982654dd4065d1d56f4496338f97d1d',
    'references/remote-mcp.md': '5999d103c892b048efadc79819da455d7bebac91a668b319e36218cb5c37f57e',
    'references/sdk-path.md': '4170a7939cc92a7bd194685c686a986e3e81f4cb4e45b96f895b29bc47a3aa08',
    'references/sdk-storage.md': '1df9e92750545861a972384628ee61df23f4c119c963e4c4af3bac7f73004cb0',
    'references/setup-control-plane.md': '09228247c3ca8ee8e916c016d4606a6f6cc927721c6cfd5d941e9d4ea39d0ae2',
    'references/spaces-path.md': '372761b014be984e59fe897d58c78e446ca44bdb9b443d3ed47bb32c2345a66e',
    'references/verification.md': '7cf000c358956c6e4f88090c9bac9e4f47392205657b6fe9b8bc1f6e2c7b8cbe',
  },
}

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
}

function filesUnder(directory, prefix = '') {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const relative = path.posix.join(prefix, entry.name)
    const absolute = path.join(directory, entry.name)
    assert.equal(entry.isSymbolicLink(), false, `${relative} must be a real bundled file, not a symlink`)
    return entry.isDirectory() ? filesUnder(absolute, relative) : [relative]
  })
}

function read(relative) {
  return fs.readFileSync(path.join(repositoryRoot, relative), 'utf8')
}

const actualFullFiles = filesUnder(fullSkillRoot).sort()
const expectedFullFiles = Object.keys(canonical.files).sort()
assert.deepEqual(
  actualFullFiles,
  expectedFullFiles,
  `full skill file list drifted from ${canonical.repository}@${canonical.release}`,
)

for (const [relative, expectedHash] of Object.entries(canonical.files)) {
  assert.equal(
    sha256(path.join(fullSkillRoot, relative)),
    expectedHash,
    `${relative} is not byte-identical to ${canonical.commit}`,
  )
}

const fullSkill = read('skills/aipass-integration/SKILL.md')
const byokSkill = read('plugins/aipass-byok/skills/aipass-byok/SKILL.md')
const byokAuth = read('plugins/aipass-byok/skills/aipass-byok/references/existing-auth-and-billing.md')
const byokDecision = read('plugins/aipass-byok/skills/aipass-byok/references/path-decision.md')
const byokSetup = read('plugins/aipass-byok/skills/aipass-byok/references/setup-control-plane.md')
const expectedByokFiles = [
  'SKILL.md',
  'references/backend-oauth.md',
  'references/existing-auth-and-billing.md',
  'references/path-decision.md',
  'references/remote-mcp.md',
  'references/sdk-path.md',
  'references/setup-control-plane.md',
  'references/verification.md',
].sort()

assert.deepEqual(
  filesUnder(byokSkillRoot).sort(),
  expectedByokFiles,
  'Claude BYOK bundle must remain the reviewed text-only, no-Spaces subset',
)

for (const [name, source] of [['full', fullSkill], ['Claude BYOK', byokSkill]]) {
  assert.match(source, /durable project preference across later turns and sessions/i, `${name} skill lacks durable rejection`)
  assert.match(source, /Never default provider keys to `localStorage`, browser storage, or device storage/, `${name} skill lacks provider-key storage safeguard`)
  assert.match(source, /Offer AI Pass as an alternative or alongside BYOK, never as a silent replacement/, `${name} skill lacks BYOK preservation`)
  assert.match(source, /one-month/i, `${name} skill lacks one-month grant lifetime`)
  assert.match(source, /Reuse it for corrections and retries|reusable, one-month|reuse the same value/i, `${name} skill lacks grant reuse`)
}

assert.match(byokAuth, /Never default provider keys to `localStorage`, browser storage, or device storage/)
assert.match(byokDecision, /durable project preference across later turns and sessions/i)
assert.match(byokSetup, /server-side expiry ends it after one month/i)
assert.doesNotMatch(byokSkill, /Read \[spaces-path\.md\]/, 'Claude BYOK skill must remain no-Spaces')
assert.doesNotMatch(byokSkill, /image, audio, or video AI/i, 'Claude BYOK skill must remain text-only')

for (const skillRoot of [fullSkillRoot, byokSkillRoot]) {
  for (const relative of filesUnder(skillRoot).filter((file) => file.endsWith('.md'))) {
    const source = fs.readFileSync(path.join(skillRoot, relative), 'utf8')
    for (const match of source.matchAll(/\[[^\]]+\]\(([^)]+\.md)(?:#[^)]+)?\)/g)) {
      const target = path.resolve(path.dirname(path.join(skillRoot, relative)), match[1])
      assert.equal(target.startsWith(`${skillRoot}${path.sep}`), true, `${relative} links outside its skill bundle`)
      assert.equal(fs.existsSync(target), true, `${relative} links to missing ${match[1]}`)
    }
  }
}

const versions = [
  JSON.parse(read('.claude-plugin/plugin.json')).version,
  JSON.parse(read('plugin.json')).version,
  JSON.parse(read('gemini-extension.json')).version,
]
assert.equal(new Set(versions).size, 1, 'full plugin manifest versions must match')
const readme = read('README.md')
assert.equal(readme.includes(canonical.release), true, 'README must identify the canonical release')
assert.equal(readme.includes(canonical.commit), true, 'README must identify the canonical commit')

for (const manifest of [
  '.claude-plugin/marketplace.json',
  '.claude-plugin/plugin.json',
  'plugin.json',
  'gemini-extension.json',
  'plugins/aipass-byok/.claude-plugin/plugin.json',
]) {
  JSON.parse(read(manifest))
}

console.log(`validated full plugin against ${canonical.release} (${canonical.commit})`)
console.log('validated Claude BYOK safety subset and intentional no-Spaces/text-only boundary')

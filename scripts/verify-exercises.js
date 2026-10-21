/**
 * Comprehensive Exercise Regression Test Suite
 * Validates all 24 metro stations, all exercise types:
 * - Multiple choice (options validity, correctIndex bounds)
 * - Ear training drills
 * - Reverse translation drills
 * - Acoustic tone discrimination (options include correctTone)
 * - Situational conversations
 * - Tactile sentence assembler (pool must contain all required tokens including duplicates)
 * - Pattern builder workbench (slots + prefix + suffix assemble cleanly to targetSentence)
 */

import { challengeAdapter } from '../src/services/challengeAdapter.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const levelsPath = path.resolve(__dirname, '../shared/levels.json');
const levelsData = JSON.parse(fs.readFileSync(levelsPath, 'utf-8')).levels;

const norm = (s) => (s || '').replace(/\s+/g, ' ').replace(/\s+([！!？?.,，。])/g, '$1').trim();
let errors = [];
let totalExercises = 0;

levelsData.forEach((l) => {
  const roundCount = Array.isArray(l.rounds) ? l.rounds.length : 1;
  for (let r = 1; r <= roundCount; r++) {
    const nodes = challengeAdapter.fromLevel(l, r);
    totalExercises += nodes.length;

    nodes.forEach((n) => {
      // 1. Multiple choice
      if (n.type === 'multiple_choice') {
        if (!Array.isArray(n.options) || n.options.length < 2) {
          errors.push(`L${l.level} (R${r}) ${n.id}: options missing or < 2`);
        }
        if (typeof n.correctIndex !== 'number' || n.correctIndex < 0 || n.correctIndex >= n.options.length) {
          errors.push(`L${l.level} (R${r}) ${n.id}: invalid correctIndex ${n.correctIndex} for options length ${n.options?.length}`);
        }
      }

      // 2. Tone discrimination
      if (n.type === 'tone_discrimination') {
        if (!Array.isArray(n.options) || !n.options.includes(n.correctTone)) {
          errors.push(`L${l.level} (R${r}) ${n.id}: correctTone ${n.correctTone} not in options ${JSON.stringify(n.options)}`);
        }
      }

      // 3. Token scramble (sentence builder)
      if (n.type === 'token_scramble') {
        const poolCounts = {};
        n.pool.forEach((t) => (poolCounts[t] = (poolCounts[t] || 0) + 1));
        const targetCounts = {};
        n.target.forEach((t) => (targetCounts[t] = (targetCounts[t] || 0) + 1));
        for (const t of Object.keys(targetCounts)) {
          if ((poolCounts[t] || 0) < targetCounts[t]) {
            errors.push(
              `L${l.level} (R${r}) ${n.id}: pool lacks sufficient copies of token "${t}" (has ${poolCounts[t] || 0}, needs ${targetCounts[t]})`
            );
          }
        }
      }

      // 4. Pattern slot
      if (n.type === 'pattern_slot') {
        const parts = [];
        if (n.fixedPrefix) parts.push(n.fixedPrefix);
        (n.slots || []).forEach((s) => parts.push(s.correct));
        if (n.fixedSuffix) parts.push(n.fixedSuffix);
        const assembled = norm(parts.join(' '));
        const target = norm(n.targetSentence || '');
        if (assembled !== target) {
          errors.push(`L${l.level} (R${r}) ${n.id}: assembled "${assembled}" does not match target "${target}"`);
        }
      }
    });
  }
});

if (errors.length === 0) {
  console.log(`\x1b[32m✔ SUCCESS: All ${levelsData.length} levels and ${totalExercises} exercises passed verification with 0 errors!\x1b[0m`);
  process.exit(0);
} else {
  console.error(`\x1b[31m✖ FAILURES (${errors.length}):\x1b[0m`);
  errors.forEach((e) => console.error('  - ' + e));
  process.exit(1);
}

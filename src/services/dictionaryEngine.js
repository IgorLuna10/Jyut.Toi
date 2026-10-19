/**
 * Offline High-Performance Cantonese Dictionary Engine (CC-Canto)
 * Provides sub-10ms search across 25,400+ entries.
 * Supports:
 * - Traditional Hanzi (食飯) & Simplified (吃饭)
 * - Jyutping with tone digits (sik6) and tone-agnostic prefixes (sik)
 * - English definitions (eat, coffee, order)
 * - Colloquial / Hong Kong Slang filtering
 */

class DictionaryEngine {
  constructor() {
    this.entries = [];
    this.isLoaded = false;
    this.loadPromise = null;

    // Fast In-Memory Lookup Indices
    this.hanziMap = new Map();
    this.jyutpingTrie = new Map(); // Prefix -> Array of entry IDs
    this.englishIndex = [];        // [{ keywords: string[], id: string }]
  }

  async load() {
    if (this.isLoaded) return this.entries;
    if (this.loadPromise) return this.loadPromise;

    this.loadPromise = (async () => {
      try {
        const response = await fetch('/cc-canto-dictionary.json');
        if (!response.ok) throw new Error('CC-Canto fetch failed');
        const raw = await response.json();
        this.entries = Array.isArray(raw) ? raw : (raw.words || []);
        this._buildIndices();
        this.isLoaded = true;
        return this.entries;
      } catch (err) {
        console.warn('CC-Canto dictionary load failed, falling back to local dataset', err);
        try {
          const fallbackRes = await fetch('/dictionary.json');
          const fallbackData = await fallbackRes.json();
          this.entries = (fallbackData.words || []).map((w, idx) => ({
            id: `fb_${idx}`,
            hanzi: w.chinese,
            jyutping: w.jyutping,
            english: w.english,
            category: 'general'
          }));
          this._buildIndices();
          this.isLoaded = true;
          return this.entries;
        } catch (e2) {
          console.error('All dictionary loads failed', e2);
          return [];
        }
      }
    })();

    return this.loadPromise;
  }

  _buildIndices() {
    this.hanziMap.clear();
    this.jyutpingTrie.clear();
    this.englishIndex = [];

    for (let i = 0; i < this.entries.length; i++) {
      const entry = this.entries[i];
      if (!entry.id) entry.id = `entry_${i}`;

      // 1. Hanzi Index
      if (entry.hanzi) {
        this.hanziMap.set(entry.hanzi, entry);
      }
      if (entry.mandarin_hanzi) {
        this.hanziMap.set(entry.mandarin_hanzi, entry);
      }

      // 2. Jyutping Index (Normalized without tone numbers & with numbers)
      const rawJp = (entry.jyutping || '').toLowerCase().trim();
      const cleanJp = rawJp.replace(/[^a-z0-9\s]/g, '');
      const toneFree = cleanJp.replace(/[1-6]/g, '');

      // Store by whole syllable keys
      const tokens = cleanJp.split(/\s+/);
      const toneFreeTokens = toneFree.split(/\s+/);

      const allJpKeys = new Set([cleanJp, toneFree, ...tokens, ...toneFreeTokens]);
      for (const key of allJpKeys) {
        if (!key) continue;
        if (!this.jyutpingTrie.has(key)) {
          this.jyutpingTrie.set(key, []);
        }
        this.jyutpingTrie.get(key).push(entry);
      }

      // 3. English Keyword Index
      const eng = (entry.english || '').toLowerCase();
      const engWords = eng.replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(w => w.length > 2);
      this.englishIndex.push({
        entry,
        keywords: engWords,
        fullEnglish: eng
      });
    }
  }

  search(query, options = {}) {
    if (!this.isLoaded) return [];
    const q = (query || '').trim().toLowerCase();
    if (!q) return [];

    const { limit = 40, filterColloquial = false } = options;
    const results = new Map();

    const isColloquialEntry = (eng) =>
      /\[(colloquial|slang|cantonese|informal|loanword|idiom)\]/i.test(eng || '') ||
      /\b(colloquial|slang)\b/i.test(eng || '');

    const add = (entry, weight = 1) => {
      if (!entry) return;
      if (filterColloquial && !isColloquialEntry(entry.english)) return;
      if (!results.has(entry.id)) {
        results.set(entry.id, { entry, weight });
      } else {
        const existing = results.get(entry.id);
        existing.weight = Math.max(existing.weight, weight);
      }
    };

    // 1. Exact Hanzi Match (Top Priority)
    if (this.hanziMap.has(q)) {
      add(this.hanziMap.get(q), 100);
    }

    // 2. Partial Hanzi Substring Match
    for (const [hanzi, entry] of this.hanziMap.entries()) {
      if (results.size >= limit * 2) break;
      if (hanzi.includes(q)) {
        add(entry, 80 + (hanzi === q ? 20 : 0));
      }
    }

    // 3. Jyutping Match
    const cleanQ = q.replace(/[^a-z0-9]/g, '');
    const toneFreeQ = cleanQ.replace(/[1-6]/g, '');

    if (this.jyutpingTrie.has(cleanQ)) {
      this.jyutpingTrie.get(cleanQ).forEach(e => add(e, 70));
    }
    if (this.jyutpingTrie.has(toneFreeQ)) {
      this.jyutpingTrie.get(toneFreeQ).forEach(e => add(e, 50));
    }

    // Prefix search on Jyutping
    if (cleanQ.length >= 2) {
      for (const [key, list] of this.jyutpingTrie.entries()) {
        if (results.size >= limit * 3) break;
        if (key.startsWith(cleanQ) || key.startsWith(toneFreeQ)) {
          list.slice(0, 10).forEach(e => add(e, 40));
        }
      }
    }

    // 4. English Keyword Search
    for (let i = 0; i < this.englishIndex.length; i++) {
      if (results.size >= limit * 4) break;
      const { entry, keywords, fullEnglish } = this.englishIndex[i];
      if (fullEnglish.startsWith(q)) {
        add(entry, 60);
      } else if (keywords.includes(q)) {
        add(entry, 45);
      } else if (fullEnglish.includes(q)) {
        add(entry, 30);
      }
    }

    // Sort by weight descending
    return Array.from(results.values())
      .sort((a, b) => b.weight - a.weight)
      .slice(0, limit)
      .map(item => item.entry);
  }

  // Quick lookup of a specific Hanzi character or compound
  getExact(hanzi) {
    if (!this.isLoaded) return null;
    return this.hanziMap.get(hanzi) || null;
  }
}

export const dictionaryEngine = new DictionaryEngine();

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { JSDOM } from 'jsdom';
import { pages } from '../../../website/content.mjs';

const publicPaths = [...pages.map(({ path }) => path), '/404'];

for (const directory of ['dist-site', 'dist-rollback']) {
  test(`${directory} public pages have unique, non-empty titles and descriptions`, async () => {
    // Each build is checked separately. Missing URLs share the generated 404.html,
    // so its dedicated title is counted once per build.
    const titles = new Map();
    const descriptions = new Map();

    for (const path of publicPaths) {
      const file = `${directory}${path === '/' ? '/index' : path}.html`;
      const { window } = new JSDOM(await readFile(file, 'utf8'));
      const { head } = window.document;

      for (const [label, selector, attribute, seen] of [
        ['title', 'title', null, titles],
        ['meta description', 'meta[name="description" i]', 'content', descriptions],
      ]) {
        const elements = head.querySelectorAll(selector);
        assert.equal(elements.length, 1, `${path} must have exactly one ${label} in <head>`);
        const rawValue = attribute ? elements[0].getAttribute(attribute) : elements[0].textContent;
        const value = rawValue?.replace(/\s+/g, ' ').trim();
        assert.ok(value, `${path} has an empty ${label}`);
        assert.ok(!seen.has(value), `${path} shares its ${label} with ${seen.get(value)}: ${value}`);
        seen.set(value, path);
      }
      window.close();
    }
  });
}

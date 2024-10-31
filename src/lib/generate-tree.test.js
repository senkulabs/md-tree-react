import { describe, expect, it } from "vitest";
import { parseInput } from "./parse-input.js";
import { mockInput } from "./mock-input.js";
import { generateTree } from "./generate-tree.js";

describe('generateTree', () => {
    it('returns an UTF-8 representation of provided FileStructure Object', () => {
        const actual = generateTree(parseInput(mockInput), { charset: 'utf-8', rootDot: true, trailingSlashDir: false });

        const expected = `
.
└── my-app
    ├── src
    │   ├── main.js
    │   └── style.css
    ├── dist
    │   ├── index.html
    │   └── assets
    │       ├── index.css
    │       └── index.js
    ├── index.html
    ├── package.json
    ├── package-lock.json
    └── README.md
        `.trim();

        expect(actual).toEqual(expected);
    });

    it('returns an ASCII representation of the provided FileStrucure object', () => {
        const actual = generateTree(parseInput(mockInput), { charset: 'ascii', rootDot: true });
        const expected = `
.
\`-- my-app
    |-- src
    |   |-- main.js
    |   \`-- style.css
    |-- dist
    |   |-- index.html
    |   \`-- assets
    |       |-- index.css
    |       \`-- index.js
    |-- index.html
    |-- package.json
    |-- package-lock.json
    \`-- README.md`.trim();

        expect(actual).toEqual(expected);
    });

    it('does not render lines for parent directories that have already printed all of their children', () => {
        const input = `
        
        grandparent
          parent
            child
          parent
            child
              grandchild
            `;

            const actual = generateTree(parseInput(input), { charset: 'utf-8', trailingSlashDir: false, rootDot: true });

            const expected = `
            .
└── grandparent
    ├── parent
    │   └── child
    └── parent
        └── child
            └── grandchild
            `.trim();
        
        expect(actual).toBe(expected);
    });

    it('appends a trailing slash to directories if trailingSlash === true', () => {
        const input = `
        grandparent
          parent/
            child
          parent//
            child
              grandchild`;
        
        const actual = generateTree(parseInput(input), { charset: 'utf-8', rootDot: true, trailingSlashDir: true });

        const expected = `
.
└── grandparent/
    ├── parent/
    │   └── child
    └── parent//
        └── child/
            └── grandchild
        `.trim();

        expect(actual).toEqual(expected);
    });

    it("prints each items' full path if fullPath === true", () => {
        const input = `

    grandparent
      parent/
        child
      parent//
        child
          grandchild
    
        `;
    
        const actual = generateTree(parseInput(input), { charset: 'utf-8', rootDot: true, fullPath: true });
    
        const expected = `
.
└── ./grandparent
    ├── ./grandparent/parent/
    │   └── ./grandparent/parent/child
    └── ./grandparent/parent//
        └── ./grandparent/parent//child
            └── ./grandparent/parent//child/grandchild`.trim();
    
        expect(actual).toEqual(expected);
    });

    it('does not render the root dot if rootDot === false', () => {
        const input = `
    grandparent
      parent
        child
      parent
        child
          grandchild
        `;
    
        const actual = generateTree(parseInput(input), { charset: 'utf-8', rootDot: false });
    
        const expected = `
grandparent
├── parent
│   └── child
└── parent
    └── child
        └── grandchild`.trim();
    
        expect(actual).toEqual(expected);
    });    
})
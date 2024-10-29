import { describe, test, expect } from "vitest";
import { parseInput } from "./parse-input.js";
import { mockInput } from "./mock-input.js";
import { generateTree } from "./generate-tree.js";

describe('generateTree', () => {
    test('returns an UTF-8 representation of provided FileStructure Object', () => {
        const actual = generateTree(parseInput(mockInput));

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

    test('returns an ASCII representation of the provided FileStrucure object', () => {
        const actual = generateTree(parseInput(mockInput), { charset: 'ascii' });
        const expected = `
        .
\`-- my-app
    |-- src
    |   |-- main.js
    |   \`-- style.css
    |-- index.html
    |-- dist
    |   \`-- assets
    |       |-- index.html
    |       |-- index.css
    |       \`-- index.js
    |-- package.json
    |-- package-lock.json
    \`-- README.md
        `;
    });

    test('it does not render lines for parent directories that have already printed all of their children', () => {
        const input = `
        
        grandparent
          parent
            child
          parent
            child
              grandchild
            `;

            const actual = generateTree(parseInput(input));

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
    })
})
import { expect, test } from "vitest";
import { parseInput, splitInput } from "./parse-input.js";
import { mockInput } from "./mock-input.js";

test('parse-input: parses plain text into a File Structure objects', () => {
    const actual = parseInput(mockInput);

    const root = {
        name: '.',
        children: [],
        indentCount: -1,
        parent: null
    };

    const myApp = {
        name: 'my-app',
        children: [],
        indentCount: 0,
        parent: root
    };
    root.children.push(myApp);

    const src = {
        name: 'src',
        children: [],
        indentCount: 2,
        parent: myApp
    };
    myApp.children.push(src);

    const mainJs = {
        name: 'main.js',
        children: [],
        indentCount: 4,
        parent: src
    };
    src.children.push(mainJs);

    const styleCss = {
        name: 'style.css',
        children: [],
        indentCount: 4,
        parent: src
    };
    src.children.push(styleCss);

    const dist = {
        name: 'dist',
        children: [],
        indentCount: 2,
        parent: myApp
    };
    myApp.children.push(dist);

    const distIndexHtml = {
        name: 'index.html',
        children: [],
        indentCount: 4,
        parent: dist
    };
    dist.children.push(distIndexHtml);

    const assets = {
        name: 'assets',
        children: [],
        indentCount: 4,
        parent: dist
    };
    dist.children.push(assets);

    const distIndexCss = {
        name: 'index.css',
        children: [],
        indentCount: 6,
        parent: assets
    };
    assets.children.push(distIndexCss);

    const distIndexJs = {
        name: 'index.js',
        children: [],
        indentCount: 6,
        parent: assets
    };
    assets.children.push(distIndexJs);

    const indexHtml = {
        name: 'index.html',
        children: [],
        indentCount: 2,
        parent: myApp
    };
    myApp.children.push(indexHtml);

    const packageJson = {
        name: 'package.json',
        children: [],
        indentCount: 2,
        parent: myApp
    };
    myApp.children.push(packageJson);

    const packageLockJson = {
        name: 'package-lock.json',
        children: [],
        indentCount: 2,
        parent: myApp
    };
    myApp.children.push(packageLockJson);

    const readme = {
        name: 'README.md',
        children: [],
        indentCount: 2,
        parent: myApp
    };
    myApp.children.push(readme);

    expect(actual).toStrictEqual(root);
});

test('split-input: splits plain text into an array of File Structure objects', () => {
    const actual = splitInput(mockInput);

    const expected = [
        {
            name: 'my-app', children: [], indentCount: 0, parent: null
        },
        {
            name: 'src', children: [], indentCount: 2, parent: null
        },
        {
            name: 'main.js', children: [], indentCount: 4, parent: null
        },
        {
            name: 'style.css', children: [], indentCount: 4, parent: null
        },
        {
            name: 'dist', children: [], indentCount: 2, parent: null
        },
        {
            name: 'index.html', children: [], indentCount: 4, parent: null
        },
        {
            name: 'assets', children: [], indentCount: 4, parent: null
        },
        {
            name: 'index.css', children: [], indentCount: 6, parent: null
        },
        {
            name: 'index.js', children: [], indentCount: 6, parent: null
        },
        {
            name: 'index.html', children: [], indentCount: 2, parent: null
        },
        {
            name: 'package.json', children: [], indentCount: 2, parent: null
        },
        {
            name: 'package-lock.json', children: [], indentCount: 2, parent: null
        },
        {
            name: 'README.md', children: [], indentCount: 2, parent: null
        },
    ];

    expect(actual).toEqual(expected);
})
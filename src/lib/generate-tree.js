import { LINE_STRINGS } from "./line-strings.js";

// options available are ascii & utf-8

const defaultOptions = {
    charset: 'utf-8',
};

/**
 * Generates an ASCII tree diagram, given a FileStructure
 * @param structure The FileStructure object to convert into ASCII
 * @param options The rendering options
 */
export const generateTree = (structure, option = defaultOptions) => {
    return [getAsciiLine(structure, option), structure.children.map(c => generateTree(c, option))].flat(Infinity).join('\n');
}

/**
 * Returns a line of ASCII that represents
 * a single FileStructure object
 * @param structure the file to render
 * @param option the rendering options
 */
const getAsciiLine = (structure, option) => {
    const lines = LINE_STRINGS[option.charset];

    if (!structure.parent) {
        return lines.ROOT;
    }

    const chunks = [
        isLastChild(structure) ? lines.LAST_CHILD : lines.CHILD,
        structure.name
    ];

    let current = structure.parent;
    while (current && current.parent) {
        chunks.unshift(isLastChild(current) ? lines.EMPTY : lines.DIRECTORY);
        current = current.parent;
    }

    return chunks.join('');
}

/**
 * A utility function do determine if a file or folder
 * is the last child of its parent
 * @param structure The file or folder to test
 */
const isLastChild = (structure) => {
    if (structure.parent.hasOwnProperty('children')) {
        return structure.parent.children[structure.parent.children.length - 1] === structure;
    } else {
        return false;
    }
}
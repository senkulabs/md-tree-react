import { useState } from "react"
import { generateTree } from "./lib/generate-tree";
import { parseInput } from "./lib/parse-input";

const initialValue = `Edit me to generate
  a
    nice
      tree
        diagram!
        :)
  Use indentation
    to indicate
      file
      and
      folder
      nesting.
    - You can even
      - use
        - markdown
        - bullets!
`;


function App() {
  const [value, setValue] = useState(initialValue);
  const [copied, setCopied] = useState(false);
  const [fancyMode, setFancyMode] = useState(true);
  const [showTrailingSlashDir, setShowTrailingSlashDir] = useState(true);
  const [showFullPath, setShowFullPath] = useState(false);
  const [showRootDot, setShowRootDot] = useState(true);

  function handleTabKey(event) {
    if (event.key === 'Tab') {
      event.preventDefault();

      const { selectionStart, selectionEnd } = event.target;
      const value = event.target.value;
      
      // Insert tab at cursor position
      event.target.value = value.substring(0, selectionStart) + `\t` + value.substring(selectionEnd);

      // Move cursor after tab
      event.target.setSelectionRange(
        selectionStart + 1,
        selectionStart + 1
      )
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(fancyMode ? generateTree(parseInput(value)) : generateTree(parseInput(value), { charset: 'ascii' }));
      setCopied(true);

      // Reset the "copied" message after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  }

  function handleFancyMode() {
    setFancyMode(!fancyMode);
  }

  function handleTrailingSlashDir() {
    setShowTrailingSlashDir(!showTrailingSlashDir);
  }

  function handleFullPath() {
    setShowFullPath(!showFullPath);
  }

  function handleRootDot() {
    setShowRootDot(!showRootDot);
  }

  let options = {
    charset: fancyMode ? 'utf-8' : 'ascii',
    trailingSlashDir: showTrailingSlashDir,
    fullPath: showFullPath,
    rootDot: showRootDot,
  };
  
  return (
    <div className="container p-2 mx-auto">
      <div style={{ display: 'flex', justifyContent: 'space-around', gap: '1rem' }}>
        <textarea style={{ width: '480px', height: '320px', tabSize: '2', fontSize: '1rem' }} value={value} onChange={(event) => {
          setValue(event.target.value);
        }} onKeyDown={handleTabKey}></textarea>
        <div className="tree" style={{ width: '480px', whiteSpace: 'pre', fontFamily: 'monospace' }}>
          { fancyMode ? generateTree(parseInput(value), options) : generateTree(parseInput(value), options) }
        </div>
      </div>
      <div className="control">
        <button onClick={handleCopy}>{ copied ? 'Copied' : 'Copy to clipboard' }</button>
        <label htmlFor="fancy-mode">
          <input type="checkbox" id="fancy-mode" onChange={handleFancyMode} checked={fancyMode} />Fancy
        </label>
        <label htmlFor="trailing-mode">
          <input type="checkbox" id="trailing-mode" onChange={handleTrailingSlashDir} checked={showTrailingSlashDir} />Trailing /
        </label>
        <label htmlFor="fullpath-mode">
          <input type="checkbox" id="fullpath-mode" onChange={handleFullPath} checked={showFullPath} />Full Path
        </label>
        <label htmlFor="root-dot-mode">
          <input type="checkbox" id="root-dot-mode" onChange={handleRootDot} checked={showRootDot} />Root .
        </label>
      </div>
    </div>
  )
}

export default App

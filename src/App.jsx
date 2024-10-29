import { useState } from "react"
import { generateTree } from "./lib/generate-tree";
import { parseInput } from "./lib/parse-input";


function App() {
  const [value, setValue] = useState('');
  const [copied, setCopied] = useState(false);
  const [fancyMode, setFancyMode] = useState(false);

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
  
  return (
    <div className="container p-2 mx-auto">
      <div style={{ display: 'flex', justifyContent: 'space-around', gap: '1rem' }}>
        <textarea style={{ width: '480px', height: '320px', tabSize: '2' }} value={value} onChange={(event) => {
          setValue(event.target.value);
        }} onKeyDown={handleTabKey}></textarea>
        <div className="tree" style={{ width: '480px', whiteSpace: 'pre', fontFamily: 'monospace' }}>
          { fancyMode ? generateTree(parseInput(value)) : generateTree(parseInput(value), { charset : 'ascii' })}
        </div>
      </div>
      <div className="control">
        <button onClick={handleCopy}>{ copied ? 'Copied' : 'Copy to clipboard' }</button>
        <label htmlFor="fancy-mode">
          <input type="checkbox" id="fancy-mode" onChange={handleFancyMode} checked={fancyMode} />Fancy
        </label>
      </div>
    </div>
  )
}

export default App

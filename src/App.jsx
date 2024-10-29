import { useState } from "react"


function App() {
  const [value, setValue] = useState('');
  const [copied, setCopied] = useState(false);

  console.log(value);

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
      await navigator.clipboard.writeText(value);
      setCopied(true);

      // Reset the "copied" message after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  }

  return (
    <div className="container p-2 mx-auto">
      <div style={{ display: 'flex', justifyContent: 'space-around', gap: '1rem' }}>
        <textarea style={{ width: '480px', height: '320px' }} value={value} onChange={(event) => {
          setValue(event.target.value);
        }} onKeyDown={handleTabKey}></textarea>
        <div className="tree" style={{ width: '480px', whiteSpace: 'pre-wrap' }}>
          {value}
        </div>
      </div>
      <div className="control">
        <button onClick={handleCopy}>{ copied ? 'Copied' : 'Copy to clipboard' }</button>
      </div>
    </div>
  )
}

export default App

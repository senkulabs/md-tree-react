import { useState } from "react"
import { generateTree } from "./lib/generate-tree";
import { parseInput } from "./lib/parse-input";
import { useEffect } from "react";
import { useRef } from "react";

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
        - bullets!`.trim();


function App() {
  const [value, setValue] = useState(initialValue);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [fancyMode, setFancyMode] = useState(true);
  const [showTrailingSlashDir, setShowTrailingSlashDir] = useState(true);
  const [showFullPath, setShowFullPath] = useState(false);
  const [showRootDot, setShowRootDot] = useState(true);

  const textareaRef = useRef(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    const searchParams = url.searchParams;
    
    if (searchParams.has('snippet')) {
      const result = JSON.parse(atob(searchParams.get('snippet')));
      if (result.hasOwnProperty('content')) {
        setValue(JSON.parse(result.content));
      }
      if (result.hasOwnProperty('charset')) {
        setFancyMode(result.charset === 'utf-8' ? true : false);
      }
      if (result.hasOwnProperty('trailingSlashDir')) {
        setShowTrailingSlashDir(result.trailingSlashDir);
      }
      if (result.hasOwnProperty('fullPath')) {
        setShowFullPath(result.fullPath);
      }
      if (result.hasOwnProperty('rootDot')) {
        setShowRootDot(result.rootDot);
      }
    }
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }

    // Move cursor to the end of text
    const length = textareaRef.current.value.length;
    textareaRef.current.setSelectionRange(length, length);
  }, []);

  let options = {
    charset: fancyMode ? 'utf-8' : 'ascii',
    trailingSlashDir: showTrailingSlashDir,
    fullPath: showFullPath,
    rootDot: showRootDot,
  };

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
      await navigator.clipboard.writeText(generateTree(parseInput(value), options));
      setCopied(true);

      // Reset the "copied" message after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  }

  async function handleShare() {
    try {
      let data = {
        content: JSON.stringify(value),
        ...options
      };
      
      let url = new URL(window.location.origin);
      url.searchParams.append('snippet', btoa(JSON.stringify(data)));
      if (navigator.canShare()) {
        await navigator.share(url.href);
      } else {
        await navigator.clipboard.writeText(url.href);
      }
      
      setShared(true);
  
      setTimeout(() => {
        setShared(false)
      }, 2000);
    } catch (error) {
      console.error('Failed to shared', error);
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

  return (
    <div className="container p-2 mx-auto">
      <h1 style={{ textAlign: 'center' }}>Markdown Tree Generator</h1>
      <p style={{ margin: '.5rem' }}>Generate tree for markdown use case. The idea of this project comes from <a href="https://tree.nathanfriend.com" target="_blank">tree.nathanfriend.com</a> but with functional React component and no third party dependencies.</p>
      <div className="editor">
        <textarea ref={textareaRef} style={{ width: '480px', height: '320px', tabSize: '2', fontSize: '1rem' }} value={value} onChange={(event) => {
          setValue(event.target.value);
        }} onKeyDown={handleTabKey}></textarea>
        <div className="tree">
          { generateTree(parseInput(value), options) }
        </div>
      </div>
      <div className="control">
        <button onClick={handleCopy}>{ copied ? 'Copied' : 'Copy' }</button>
        <button onClick={handleShare}>{ shared ? 'URL copied' : 'Share' }</button>
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

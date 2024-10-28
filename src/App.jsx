import { useState } from "react"


function App() {
  const [value, setValue] = useState('');

  return (
    <div className="container p-2 mx-auto">
      <div style={{ display: 'flex', justifyContent: 'space-around', gap: '1rem' }}>
        <textarea style={{ width: '640px', height: '320px' }} value={value} onChange={(event) => {
          setValue(event.target.value);
        }}></textarea>
        <div className="tree">
          {value}
        </div>
      </div>
    </div>
  )
}

export default App

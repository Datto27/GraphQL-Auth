import React from 'react'

interface Props {
  state: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
}

const TextInput = ({state, setState}:Props) => {
  return (
    <input className='input' type="text"
      placeholder='Username' value={state}
      onChange={(e) => setState(e.target.value)}
    />
  )
}

export default TextInput
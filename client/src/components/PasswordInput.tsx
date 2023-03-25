import React, { useState } from 'react'

interface Props {
  state: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
}

const PasswordInput = ({state, setState}:Props) => {
  const [showPass, setShowPass] = useState(false);
  
  return (
    <input className='input input-password' 
      type={showPass?"text":"password"}
      placeholder='Password' value={state}
      onChange={(e) => setState(e.target.value)}
    />
  )
}

export default PasswordInput
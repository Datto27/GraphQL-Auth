import React, { ReactElement, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCookie } from '../utils/auth'

const SecureRoute = ({component}:any) => {
  const navigate = useNavigate()
  const access = getCookie("access")

  useEffect(() => {
    if(!access) navigate("/auth", { replace:true })
  })

  if(access) {
    return component
  }
  return <></>
}

export default SecureRoute
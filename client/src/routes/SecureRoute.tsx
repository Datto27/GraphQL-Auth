import React, { ReactElement, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCookie } from '../utils/auth'

const SecureRoute = ({component}:any) => {
  const navigate = useNavigate()

  useEffect(() => {
    if(getCookie("access")) {
      return component
    }
    return navigate("/auth", { replace:true })
  }, [])

  return <></>
}

export default SecureRoute
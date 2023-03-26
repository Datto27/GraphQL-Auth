import React, { useEffect, useState } from 'react'
import "../styles/auth.css"
import {gql, useMutation} from "@apollo/client"
import {useNavigate} from "react-router-dom"
import PasswordInput from '../components/PasswordInput'
import TextInput from '../components/TextInput'
import { setCookie } from '../utils/auth'
import { useUserContext } from '../contexts/user'


const Authentication = () => {
  const navigate = useNavigate()
  // states
  const {setUser} = useUserContext()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  // // Graphql
  const [addUser] = useMutation(REGISTER_USER)
  const [loginUser] = useMutation(LOGIN_USER)

  useEffect(() => {
    setTimeout(() => {
      setError("")
    }, 3000)
  }, [error])

  const register = (e:any) => {
    e.preventDefault()
    if(username==="" || password==="") {
      setError("Username and Password Must Be Entered")
    } else {
      addUser({
        variables: {user: {
          username, password
        }}
      })
      .then((res) => {
        // console.log(res.data?.userRegister)
        const {userRegister:user} = res.data;
        setCookie("access", user.accessToken, 1/24);
        setCookie("refresh", user.refreshToken, 365);
        setUser(user);
        navigate("/")
      })
      .catch((err) => {
        // console.log(err)
        setError(err.message)
      })
    }
  }  

  const login = (e:any) => {
    e.preventDefault()
    if(username==="" || password==="") {
      setError("Username and Password Must Be Entered")
    } else {
      loginUser({
        variables: {user: {
          username, password
        }}
      })
      .then((res) => {
        // console.log(res.data.userLogin)
        const {userLogin:user} = res.data
        setCookie("access", user.accessToken, 1/24);
        setCookie("refresh", user.refreshToken, 365);
        setUser({username:user.username, loginCount:user.loginCount});
        navigate("/")
      })
      .catch((err) => {
        // console.log(err)
        setError(err.message)
      })
    }
  }

  return (
    <div className='auth-page'>
      {error && (
        <div className="error">
          <h3 className='error-msg'>{error}</h3>
        </div>
      )}
      <div className="content">
        <div className="form">
          <div className="input-container">
            <span>Username</span>
            <TextInput state={username} setState={setUsername} />
          </div>
          <div className="input-container">
            <span>Password</span>
            <PasswordInput state={password} setState={setPassword} />
          </div>
          <div className="btns-container">
            <button className="btn login-btn"
              onClick={login}
            >
              Log in
            </button>
            <button className="btn register-btn"
              onClick={register}
            >
              Register
            </button>
          </div>
        </div>      
      </div>
    </div>
  )
}

const REGISTER_USER = gql`
  mutation($user: UserInput) {
    userRegister(user: $user) {
      username
      loginCount
      accessToken
      refreshToken
    }
  }
`
const LOGIN_USER = gql`
  mutation($user: UserInput) {
    userLogin(user: $user) {
      username
      loginCount
      accessToken
      refreshToken
    }
  }
`

export default Authentication
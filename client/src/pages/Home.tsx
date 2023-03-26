import React, { useEffect, useState } from 'react'
import "../styles/home.css"
import { useNavigate } from 'react-router-dom'
import {gql, useQuery, useLazyQuery, useSubscription} from "@apollo/client"
import { deleteCookie, getCookie, parseJWT } from '../utils/auth'
import { useUserContext } from '../contexts/user'
import socket from '../config/socket'



const Home = () => {
  const navigate = useNavigate()
  // states 
  const { user, getCurrentUser } = useUserContext()
  const [users, setUsers] = useState("")
  const [registeredUsers, setRegisteredUsers] = useState(0)
  // graphql
  const [fetchUsers] = useLazyQuery(
    GET_USERS,
    { fetchPolicy: "no-cache" }
  )

  useEffect(() => {
    // websocket listeners
    socket.on("new-registration", (data, cb) => {
      // console.log(data)
      setRegisteredUsers(data.registrationsCount)
    })
  }, [])

  useEffect(() => {
    if(user?.id) socket.emit("join", {user})
  }, [user])

  useEffect(() => {
    // get current user and other users
    const accessToken = getCookie("access")
    const payload = parseJWT(accessToken)
    if(payload) getCurrentUser(payload.id)

    // fetch other users
    fetchUsers()
    .then((res) => {
      // console.log(res.data)
      setUsers(res.data?.users)
      setRegisteredUsers(res.data.users.length)
    })
    .catch((err) => {
      console.error(err.message)
    })
  }, [])

  const logout = () => {
    deleteCookie("access")
    deleteCookie("refresh")
    navigate("/auth", {replace:true})
  }

  return (
    <div className='home-page'>
      <div className="header">
        <h2>Registered Users: {registeredUsers}</h2>
        <button className='logout' onClick={logout}>
          Logout
        </button>
      </div>
      {user?.loginCount === 0 ? (
        <div className="welcome-msg">
          <h1>Welcome {user?.username}</h1>
        </div>
      ) : (
        <div className='login-info'>
          <h1>{user?.username} it's your {user?.loginCount}th login</h1>
        </div>
      )}
      <div className={
        `positive-alert ${registeredUsers > 3 && "active"}`
      }>
        <h3 className='positive-txt'>You're lucky person :)</h3>
      </div>
    </div>
  )
}

const GET_USERS = gql`
  query GetUsers{
    users {
      username
      loginCount
    }
  }
`


export default Home
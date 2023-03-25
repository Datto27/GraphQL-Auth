import React, { useEffect, useState } from 'react'
import "../styles/home.css"
import { useNavigate } from 'react-router-dom'
import {gql, useQuery, useLazyQuery, useSubscription} from "@apollo/client"
import { deleteCookie, getCookie, parseJWT } from '../utils/auth'
import { useUserContext } from '../contexts/user'



const Home = () => {
  const navigate = useNavigate()
  // states 
  const { user, getCurrentUser } = useUserContext()
  const [users, setUsers] = useState("")
  // graphql
  const [fetchUsers] = useLazyQuery(
    GET_USERS,
    { fetchPolicy: "no-cache" }
  )

  useEffect(() => {
    const accessToken = getCookie("access")
    const {id} = parseJWT(accessToken)
    getCurrentUser(id)

    // fetch other users
    fetchUsers()
    .then((res) => {
      // console.log(res.data)
      setUsers(res.data.users)
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
        <h2>Registered Users: {users?.length}</h2>
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
        `positive-alert ${users?.length>3 && "active"}`
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
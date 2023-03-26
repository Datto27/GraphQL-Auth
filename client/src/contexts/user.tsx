import { gql, useLazyQuery } from "@apollo/client"
import React, { createContext, useContext, useEffect, useState } from "react"
import { getCookie, parseJWT } from "../utils/auth"


const UserContext = createContext<any>({})

const GET_USER = gql`
  query User($id: ID!) {
    user(id: $id) {
      id
      username
      loginCount
    }
  }
`

export const  UserProvider = (
  { children }:{children: React.ReactNode}
) => {
  const [user, setUser] = useState<any>(null)
  // Graphql
  const [fetchUser] = useLazyQuery(
    GET_USER,
    { fetchPolicy: "no-cache" }
  )

  useEffect(() => {
    const accessToken = getCookie("access")
    const refreshToken = getCookie("refresh")
    // console.log(accessToken);
    if(accessToken) {
      const {id} = parseJWT(accessToken)
      // console.log(id)
      getCurrentUser(id)
    } else if(refreshToken) {
      
    }
  }, [])

  const getCurrentUser = (id:string) => {
    fetchUser({variables: {id}})
    .then((res) => {
      // console.log(res.data?.user)
      setUser(res.data.user)
    })
    .catch(err => {
      console.log(err)
    })
  }

  return (
    <UserContext.Provider value={{
      user, setUser, getCurrentUser
    }} >
        {children}
    </UserContext.Provider>
  )
}

export const useUserContext = () => {
  return useContext(UserContext)
}
import { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Route, Routes } from 'react-router'
import {ApolloClient} from "@apollo/react-hooks"
import {split, HttpLink, InMemoryCache, ApolloProvider, useLazyQuery, gql, useMutation} from "@apollo/client"
import Home from './pages/Home'
import Authenticaion from './pages/Authenticaion'
import { UserProvider } from './contexts/user'
import { getCookie, setCookie } from './utils/auth'




function App() {
  const [authorized, setAuthorized] = useState(false)
  // graphql
  const [refreshAccessToken] = useMutation(REFRESH_TOKEN)

  useEffect(() => {
    const accessT = getCookie("access")
    if(!accessT) {
      const refreshT = getCookie("refresh")
      if(refreshT) {
        refreshAccessToken({
          variables: { token: refreshT }
        })
        .then((res) => {
          // console.log(res.data.refreshToken)
          const {refreshToken} = res.data
          if(refreshToken) {
            setCookie("access", refreshToken.accessToken, 1/24)
          }
        })
        .catch((err) => {
          console.log(err)
        })
      }
    }
  }, [])

  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/auth' element={<Authenticaion />} />
          <Route path='/*' element={<Home />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  )
}

const REFRESH_TOKEN = gql`
  mutation($token: String) {
    refreshToken(token: $token) {
      accessToken
    }
  }
`

export default App

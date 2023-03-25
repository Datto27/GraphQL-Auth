import { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Route, Routes } from 'react-router'
import {ApolloClient} from "@apollo/react-hooks"
import {split, HttpLink, InMemoryCache, ApolloProvider, useLazyQuery} from "@apollo/client"
import Home from './pages/Home'
import Authenticaion from './pages/Authenticaion'
import { UserProvider } from './contexts/user'


const client = new ApolloClient({
  uri: 'http://127.0.0.1:4000/',
  cache: new InMemoryCache(),

});

function App() {


  return (
    <ApolloProvider client={client}>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/auth' element={<Authenticaion />} />
            <Route path='/*' element={<Home />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </ApolloProvider>
  )
}

export default App

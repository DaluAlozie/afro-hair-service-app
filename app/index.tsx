import React from 'react'
import { useAuthStore } from '@/utils/stores/authStore'

import Home from './home'
import Login from './login'

export default function Index() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  return (
    <>
      {isLoggedIn ? <Home/> : <Login/>}
    </>
  )
}
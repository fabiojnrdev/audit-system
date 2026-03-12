import { useState } from 'react'
import { login, logout, getUser, isAuthenticated } from '../services/auth'

export const useAuth = () => {
  const [user, setUser] = useState(getUser())

  const handleLogin = async (username, password) => {
    const data = await login(username, password)
    setUser(data.user)
    return data
  }

  const handleLogout = () => {
    logout()
    setUser(null)
  }

  return {
    user,
    isAuthenticated: isAuthenticated(),
    login: handleLogin,
    logout: handleLogout,
  }
}
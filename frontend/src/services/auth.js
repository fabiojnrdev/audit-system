import api from './api'

export const login = async (username, password) => {
  const { data } = await api.post('/auth/token/', { username, password })
  localStorage.setItem('access_token', data.access)
  localStorage.setItem('refresh_token', data.refresh)
  localStorage.setItem('user', JSON.stringify(data.user))
  return data
}

export const logout = () => {
  localStorage.clear()
  window.location.href = '/login'
}

export const getUser = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

export const isAuthenticated = () => !!localStorage.getItem('access_token')
import axios from 'axios'
import magic from '../libs/magicLib'

const axiosPublic = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true
})

const axiosProtect = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true
})

// Add a request interceptor to include the authorization header
axiosProtect.interceptors.request.use(async (config) => {

  config.headers.authorization = `Bearer ${getToken()}`
  
  return config
})

const getToken = async () => {
  // first try to get from local storage
  let token = localStorage.getItem('token')
  if (token) {
    console.log('got token from localStorage:', token)
    return token
  }

  console.log('couldnt get token from localStorage')

  // if not there, get from magic
  token = await magic.user.getIdToken()
  if (token) {
    console.log('got token from magic:', token)
    localStorage.setItem('token', token)
    return token
  }

  // cant get from magic, means we must log in again
  return false
}

const deleteToken = async () => {
  localStorage.removeItem('token')
}

export { getToken, deleteToken, axiosPublic, axiosProtect }

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

  const token = await magic.user.getIdToken()

  console.log('executing axios interceptor with token:', token)

  config.headers.authorization = `Bearer ${token}`
  
  return config
})

export { axiosPublic, axiosProtect }

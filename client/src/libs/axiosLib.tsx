import axios from 'axios'

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

// can also add interceptors, etc here
// instance.defaults.headers.common['Authorization'] = 'AUTH TOKEN FROM INSTANCE'

export default instance
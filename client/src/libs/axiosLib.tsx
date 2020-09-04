import axios from 'axios'

export default axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL
})

export const axiosPublic = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL
})

// export const axiosProtect = () => {
//   return GetCotterToken()
//   .then(res => res.token)
//   .then(token => {
//     return axios.create({
//       baseURL: process.env.REACT_APP_API_BASE_URL,
//       headers: {
//         common: {
//           authorization: `Bearer ${token}`
//         }
//       }
//     })
//   })
// }

// axios.create({
//   baseURL: process.env.REACT_APP_API_BASE_URL,
//   headers: {
//     common: {
//       authorization: `Bearer ${GetCotterToken()}`
//     }
//   }
// })


// can also add interceptors, etc here
// instance.defaults.headers.common['Authorization'] = 'AUTH TOKEN FROM INSTANCE'

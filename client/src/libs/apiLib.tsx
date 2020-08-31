import axios from './axiosLib'

import { Profile } from '../models/Profile'
import { cotter, GetCotterToken } from '../libs/cotterLib'

// PUBLIC ROUTES //
export const GetPublicProfileData = (username: string): Promise<any> => {
  return axios({
    method: 'get',
    url: `/public/profile`,
    params: {
      username: username
    }
  })
}

export const GetPublicAllProfiles = (): Promise<any> => {
  return axios({
    method: 'get',
    url: `/public/all-profiles`,
  })
}

// adds or updates user, then checks if invited, returns true or false
export const PostPublicLoginData = (data: any): Promise<any> => { 
  return axios({
    method: 'post',
    url: `/public/login`,
    data: data
  })
}

export const GetPublicUsernameAvailability = (username: string): Promise<any> => { 
  return axios({
    method: 'get',
    url: `/public/availability/${username}`
  })
}


// PROTECTED ROUTES // 
export const PostProtectOnboardCheck = (): Promise<any> => {
  return GetCotterToken()
    .then(res => res.token)
    .then(token => {

      const user = cotter.getLoggedInUser()
      const email = user.identifier
      const authId = user.client_user_id

      return axios({
        method: 'post',
        url: `/protect/onboard/check`,
        headers: { authorization: `Bearer ${token}` },
        data: {
          email: email,
          authId: authId
        }
      })
    })
    .catch(err => {
      console.log(err)
    })
}

export const PostProtectInviteCheck = (): Promise<any> => {
  return GetCotterToken()
    .then(res => res.token)
    .then(token => {

      const user = cotter.getLoggedInUser()
      const email = user.identifier
      const authId = user.client_user_id

      return axios({
        method: 'post',
        url: `/protect/invite/check`,
        headers: { authorization: `Bearer ${token}` },
        data: {
          email: email,
          authId: authId
        }
      })
    })
    .catch(err => {
      console.log(err)
    })
}


// export const GetProtectProfile = (username: string): Promise<any> => {
//   return GetCotterToken()
//     .then(res => {
//       console.log('get /protect/profile with cotter response:', res)
//       return res.token
//     })
//     .then(token => {
//       return axios({
//         method: 'get',
//         url: `/protect/profile/${username}`,
//         headers: { authorization: `Bearer ${token}` },
//       })
//     })
//     .catch(err => {
//       console.log(err)
//     })
// }

export const PostProtectProfile = (profile: Profile): Promise<any> => {
  return GetCotterToken()
    .then(res => res.token)
    .then(token => {

      const user = cotter.getLoggedInUser()
      const email = user.identifier
      const authId = user.client_user_id

      console.log('posting to /protect/profile with body: ', {
        email: email,
        authId: authId,
        profile: profile
      })

      return axios({
        method: 'post',
        url: `/protect/profile`,
        headers: { authorization: `Bearer ${token}` },
        data: {
          email: email,
          authId: authId,
          profile: profile
        }
      })
    })
    .catch(err => {
      console.log(err)
    })
}

export const PostProtectProfileImage = (username: string, formData: FormData): Promise<any> => {
  return GetCotterToken()
    .then(res => res.token)
    .then(token => {
      return axios({
        method: 'post',
        url: `/protect/upload-image/${username}`,
        headers: {
          'Content-Type': 'multipart/form-data',
          'authorization': `Bearer ${token}`
        },
        data: formData
      })
    })
    .catch(err => {
      console.log(err)
    })
}

export const PostProtectGetUsername = (): Promise<any> => {
  return GetCotterToken()
    .then(res => res.token)
    .then(token => {

      const user = cotter.getLoggedInUser()
      const email = user.identifier

      return axios({
        method: 'post',
        url: `/protect/get-username`,
        headers: { authorization: `Bearer ${token}` },
        data: {
          email: email
        }
      })
    })
    .catch(err => {
      console.log(err)
    })
}

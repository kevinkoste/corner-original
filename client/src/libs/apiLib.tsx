import axios from './axiosLib'
// import { axiosPublic, axiosProtect } from './axiosLib'

import { Profile } from '../models/Profile'
import { cotter, GetCotterToken } from '../libs/cotterLib'

// PUBLIC ROUTES //
export const GetPublicProfileData = (username: string): Promise<any> => {
  return axios({
    method: 'get',
    url: `/public/profile/${username}`,
  })
}

export const PostPublicLoginData = (data: any): Promise<any> => { 
  return axios({
    method: 'post',
    url: `/public/login`,
    data: data
  })
}


// PROTECTED ROUTES // 
export const PostOnboardCheck = (): Promise<any> => {
  return GetCotterToken()
    .then(res => res.token)
    .then(token => {

      const user = cotter.getLoggedInUser()
      const email = user.identifier
      const authId = user.client_user_id

      return axios({
        method: 'post',
        url: `/protect/onboard`,
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


export const GetProtectProfile = (username: string): Promise<any> => {
  return GetCotterToken()
    .then(res => res.token)
    .then(token => {
      return axios({
        method: 'get',
        url: `/protect/profile/${username}`,
        headers: { authorization: `Bearer ${token}` },
      })
    })
    .catch(err => {
      console.log(err)
    })
}

export const PostProtectProfileUpdate = (profile: Profile): Promise<any> => {
  return GetCotterToken()
    .then(res => res.token)
    .then(token => {
      return axios({
        method: 'post',
        url: `/protect/profile/${profile.username}`,
        headers: { authorization: `Bearer ${token}` },
        data: profile
      })
    })
    .catch(err => {
      console.log(err)
    })
}



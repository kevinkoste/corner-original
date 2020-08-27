import axios from './axiosLib'

import { Profile } from '../models/Profile'
import { cotter } from '../libs/cotterLib'


export const GetProfileData = (username: string): Promise<any> => {
  // const user = cotter.getLoggedInUser()
  // cotter.tokenHandler.getAccessToken().then(token => {
  //   console.log(token)
  // })

  return axios.get<Profile>(`/profile/${username}`)
}

export const PostProfileData = (profile: Profile): Promise<any> => { 
  return axios.post(`/profile`, profile)
}

export const PostLoginData = (data: any): Promise<any> => { 
  return axios.post(`/auth/login`, data)
}



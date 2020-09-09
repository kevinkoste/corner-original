import axios from './axiosLib'

import { Profile } from '../models/Profile'
import { cotter, GetCotterToken, GetCotterEmail } from '../libs/cotterLib'

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

export const GetPublicCompanyFromDomain = (domain: string): Promise<any> => { 
  return axios({
    method: 'get',
    url: `/public/employer/${domain}`
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
        headers: { 'authorization': `Bearer ${token}` },
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
        headers: { 'authorization': `Bearer ${token}` },
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

export const PostProtectProfile = (profile: Profile): Promise<any> => {
  return GetCotterToken()
    .then(res => res.token)
    .then(token => {

      const user = cotter.getLoggedInUser()
      const email = user.identifier
      const authId = user.client_user_id

      // console.log('posting to /protect/profile with body: ', {
      //   email: email,
      //   authId: authId,
      //   profile: profile
      // })

      return axios({
        method: 'post',
        url: `/protect/profile`,
        headers: { 'authorization': `Bearer ${token}` },
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

export const PostProtectInviteNewEmail = (invitedEmail: string): Promise<any> => {
  return GetCotterToken()
    .then(res => res.token)
    .then(token => {

      const senderEmail = GetCotterEmail()

      return axios({
        method: 'post',
        url: `/protect/invite`,
        headers: { 'authorization': `Bearer ${token}` },
        data: {
          invitedEmail: invitedEmail,
          senderEmail: senderEmail
        }
      })
    })
    .catch(err => {
      console.log(err)
    })
}

export const FetchMedium = (mediumUrl: string): Promise<any> => {
  return GetCotterToken()
    .then(res => res.token)
    .then(token => {
      return axios({
        method: 'post',
        url: '/protect/fetch-medium',
        headers: { 'authorization': `Bearer ${token}` },
        data: {
          mediumUrl: mediumUrl
        }
      })
    })
    .catch(err => {
      console.log(err)
    })
}

export const FetchSubstack = (substackUrl: string): Promise<any> => {
  return GetCotterToken()
    .then(res => res.token)
    .then(token => {
      return axios({
        method: 'post',
        url: '/protect/fetch-substack',
        headers: { 'authorization': `Bearer ${token}` },
        data: {
          substackUrl: substackUrl
        }
      })
    })
    .catch(err => {
      console.log(err)
    })
}


// SOCIAL //

export const PostProtectFollow = async (username: string) => {
  const email = GetCotterEmail()
  const res = await GetCotterToken()
  const token = res.token

  await axios({
    method: 'post',
    url: '/social/follow',
    headers: { 'authorization': `Bearer ${token}` },
    data: {
      email: email,
      username: username
    }
  })
}

import axios from './axiosLib'

import { Profile } from '../models/Profile'
import { GetCotterToken, GetCotterUser } from '../libs/cotterLib'

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
export const PostProtectOnboardCheck = async (): Promise<any> => {
  const { email, authId } = GetCotterUser()

  return axios({
    method: 'post',
    url: `/protect/onboard/check`,
    headers: { 'authorization': `Bearer ${await GetCotterToken()}` },
    data: {
      email: email,
      authId: authId
    }
  })
}

export const PostProtectInviteCheck = async (): Promise<any> => {
  const { email, authId } = GetCotterUser()

  return axios({
    method: 'post',
    url: `/protect/invite/check`,
    headers: { 'authorization': `Bearer ${await GetCotterToken()}` },
    data: {
      email: email,
      authId: authId
    }
  })
}

export const PostProtectProfile = async (profile: Profile): Promise<any> => {
  const { email, authId } = GetCotterUser()

  return axios({
    method: 'post',
    url: `/protect/profile`,
    headers: { 'authorization': `Bearer ${await GetCotterToken()}` },
    data: {
      email: email,
      authId: authId,
      profile: profile
    }
  })
}

export const PostProtectProfileImage = async (username: string, formData: FormData): Promise<any> => {
  return axios({
    method: 'post',
    url: `/protect/upload-image/${username}`,
    headers: {
      'Content-Type': 'multipart/form-data',
      'authorization': `Bearer ${await GetCotterToken()}`
    },
    data: formData
  })
}

export const PostProtectInviteNewEmail = async (invitedEmail: string): Promise<any> => {
  const { email } = GetCotterUser()

  return axios({
    method: 'post',
    url: `/protect/invite`,
    headers: { 'authorization': `Bearer ${await GetCotterToken()}` },
    data: {
      invitedEmail: invitedEmail,
      senderEmail: email
    }
  })
}

export const FetchMedium = async (mediumUrl: string): Promise<any> => {
  return axios({
    method: 'post',
    url: '/protect/fetch-medium',
    headers: { 'authorization': `Bearer ${await GetCotterToken()}` },
    data: {
      mediumUrl: mediumUrl
    }
  })
}

export const FetchSubstack = async (substackUrl: string): Promise<any> => {
  return axios({
    method: 'post',
    url: '/protect/fetch-substack',
    headers: { 'authorization': `Bearer ${await GetCotterToken()}` },
    data: {
      substackUrl: substackUrl
    }
  })
}


// SOCIAL //

export const PostProtectFollow = async (username: string): Promise<any> => {
  const { email } = GetCotterUser()

  return axios({
    method: 'post',
    url: '/social/follow',
    headers: { 'authorization': `Bearer ${await GetCotterToken()}` },
    data: {
      email: email,
      username: username
    }
  })
}

import axios from './axios'

// AUTH ROUTES //

export const PostAuthCheck = (): Promise<any> => {
  return axios({
    method: 'post',
    url: `/auth/check`,
  })
}

export const PostAuthLogin = (authToken: string): Promise<any> => {
  return axios({
    method: 'post',
    url: `/auth/login`,
    headers: { authorization: `Bearer ${authToken}` },
  })
}

export const PostAuthLogout = (): Promise<any> => {
  return axios({
    method: 'post',
    url: `/auth/logout`,
  })
}

// PUBLIC ROUTES //
export const GetPublicProfileData = (username: string): Promise<any> => {
  return axios({
    method: 'get',
    url: `/public/profile`,
    params: {
      username: username,
    },
  })
}

export const GetPublicAllProfiles = (): Promise<any> => {
  return axios({
    method: 'get',
    url: `/public/profile/all`,
  })
}

export const GetPublicUsernameAvailability = (
  username: string
): Promise<any> => {
  return axios({
    method: 'get',
    url: `/public/availability`,
    params: {
      username: username,
    },
  })
}

export const GetPublicCompanyFromDomain = (domain: string): Promise<any> => {
  return axios({
    method: 'get',
    url: `/public/employer`,
    params: {
      domain: domain,
    },
  })
}

// PROTECTED ROUTES //

export const GetProtectProfile = (): Promise<any> => {
  return axios({
    method: 'get',
    url: `/protect/profile`,
  })
}

export const PostProtectOnboardCheck = (): Promise<any> => {
  return axios({
    method: 'post',
    url: `/protect/onboard/check`,
  })
}

export const PostProtectInviteCheck = (): Promise<any> => {
  return axios({
    method: 'post',
    url: `/protect/invite/check`,
  })
}

export const PostProtectUsername = (username: string): Promise<any> => {
  return axios({
    method: 'post',
    url: `/protect/username`,
    data: {
      username: username,
    },
  })
}

export const PostProtectComponents = (components: any[]): Promise<any> => {
  return axios({
    method: 'post',
    url: `/protect/components`,
    data: {
      components: components,
    },
  })
}

export const PostProtectProfileImage = (formData: FormData): Promise<any> => {
  return axios({
    method: 'post',
    url: `/protect/profile/image`,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
  })
}

export const PostProtectInviteNewEmail = (
  invitedEmail: string
): Promise<any> => {
  return axios({
    method: 'post',
    url: `/protect/invite`,
    data: {
      invitedEmail: invitedEmail,
    },
  })
}

export const FetchMedium = (mediumUrl: string): Promise<any> => {
  return axios({
    method: 'post',
    url: '/protect/fetch-medium',
    data: {
      mediumUrl: mediumUrl,
    },
  })
}

export const FetchSubstack = (substackUrl: string): Promise<any> => {
  return axios({
    method: 'post',
    url: '/protect/fetch-substack',
    data: {
      substackUrl: substackUrl,
    },
  })
}

// SOCIAL //

export const PostProtectFollow = (username: string): Promise<any> => {
  return axios({
    method: 'post',
    url: '/social/follow',
    data: {
      username: username,
    },
  })
}

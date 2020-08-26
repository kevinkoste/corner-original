import axios from './axiosLib'

import { Profile } from '../models/Profile'

export const GetProfileData = (username: string): Promise<any> => {
  return axios.get<Profile>(`/profile/${username}`)
}

export const PostProfileData = (profile: Profile): Promise<any> => { 
  return axios.post(`/profile`, profile)
}



// EXPERIMENT

// export const useProfileData = (username: string) => {

//   // define the profile object local to this function
//   const [profile, setLocalProfile] = useState<Profile>(EmptyProfile)

//   // populate localProfile on mount
//   useEffect(() => {
//     axios.get<Profile>(`/profile/${username}`)
//       .then(res => {
//         setLocalProfile(res.data)
//       })
//       .catch(err => {
//         console.log(err)
//       })
//   }, [])

//   // function that sets the profile remotely, then updates the local profile accordingly
//   const setProfile = () => { 
//     axios.post(`/profile`, localProfile)
//       .then(res => {
//         console.log(res)
//       })
//       .catch(err => {
//         console.log(err)
//       })
//   }

//   return [profile, setProfile]

// }



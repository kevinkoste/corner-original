import React, { createContext, useReducer, useContext, Dispatch } from 'react'

import { Profile, EmptyProfile } from '../models/Profile'


type StateType = {
  profile: Profile,
  editing: boolean,
  auth: boolean
}

const initialState: StateType = {
  profile: EmptyProfile,
  editing: false,
  auth: false
}

type ProfileContextType = {
  state: {
    profile: Profile,
    editing: boolean
  }
  dispatch: Dispatch<Action>
}

const ProfileContext = createContext<ProfileContextType>({
  state: initialState,
  dispatch: () => null
})

// Action constants
const UPDATE_PROFILE = "UPDATE_PROFILE"
const TOGGLE_EDITING = "TOGGLE_EDITING"
const UPDATE_COMPONENT = "UPDATE_COMPONENT"
const MOVE_COMPONENT = "MOVE_COMPONENT"

// Valid action types
type Action =
 | { type: "UPDATE_PROFILE", profile: Profile }
 | { type: "TOGGLE_EDITING" }
 | { type: "UPDATE_COMPONENT", id: string, props: any }
 | { type: "MOVE_COMPONENT" }


// Action creators
export const updateProfile = (profile: Profile): Action => {
  return { type: UPDATE_PROFILE, profile: profile}
}

export const toggleEditing = (): Action => {
  return { type: TOGGLE_EDITING }
}

export const updateComponent = (id: string, props: any): Action => {
  return { type: UPDATE_COMPONENT, id: id, props: props}
}

// export const moveComponent = (): Action => {
//   return { type: MOVE_COMPONENT }
// }

// Reducer
const ProfileReducer = (state: StateType, action: Action) => {
  switch (action.type) {

    case UPDATE_PROFILE:
      return {
        ...state,
        profile: action.profile
      }

    case TOGGLE_EDITING:
      return {
        ...state,
        editing: !state.editing
      }

    case UPDATE_COMPONENT:
      // mutate state inplace by updating only the component specified in action
      console.log('changed to : ', {
        ...state,
        profile: {
          ...state.profile,
          data: state.profile.data.map(item => (item.id === action.id) ? {...item, props: action.props} : item )
        }
      })
      return {
        ...state,
        profile: {
          ...state.profile,
          data: state.profile.data.map(item => (item.id === action.id) ? {...item, props: action.props} : item )
        }
      }

    case MOVE_COMPONENT:
      return state

    default:
      return state
  }
}

export const ProfileProvider: React.FC = ({ children }) => {

  const [state, dispatch] = useReducer(ProfileReducer, initialState)

  return (
    <ProfileContext.Provider value={{state, dispatch}}>
      {children}
    </ProfileContext.Provider>
  )
}

export const useProfileContext = () => {
  return useContext(ProfileContext)
}

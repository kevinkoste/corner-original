import React, { createContext, useReducer, useContext, Dispatch } from 'react'

import { Profile, EmptyProfile } from '../models/Profile'

type StateType = {
  profile: Profile,
  editing: boolean,
}

const initialState: StateType = {
  profile: EmptyProfile,
  editing: false,
}

type ProfileContextType = {
  profileState: StateType,
  profileDispatch: Dispatch<Action>
}

const ProfileContext = createContext<ProfileContextType>({
  profileState: initialState,
  profileDispatch: () => null
})

// Action constants
const UPDATE_PROFILE = "UPDATE_PROFILE"
const SET_EDITING = "SET_EDITING"
const UPDATE_COMPONENT = "UPDATE_COMPONENT"
const DELETE_COMPONENT = "DELETE_COMPONENT"


// Valid action types
type Action =
 | { type: "UPDATE_PROFILE", profile: Profile }
 | { type: "SET_EDITING", editing: boolean }
 | { type: "UPDATE_COMPONENT", component: any }
 | { type: "DELETE_COMPONENT", id: string }



// Action creators
export const updateProfile = (profile: Profile): Action => {
  return { type: UPDATE_PROFILE, profile: profile}
}

export const setEditing = (editing: boolean): Action => {
  return { type: SET_EDITING, editing: editing }
}

export const updateComponent = (component: any): Action => {
  return { type: UPDATE_COMPONENT, component: component}
}

export const deleteComponent = (id: string): Action => {
  return { type: DELETE_COMPONENT, id: id}
}


// Reducer
const ProfileReducer = (state: StateType, action: Action) => {
  switch (action.type) {

    case UPDATE_PROFILE:
      return {
        ...state,
        profile: action.profile
      }

    case SET_EDITING:
      return {
        ...state,
        editing: action.editing
      }


    case UPDATE_COMPONENT:
      if (state.profile.components.find(component => component.id === action.component.id) === undefined) {
        // component doesn't exist, add it
        return {
          ...state,
          profile: {
            ...state.profile,
            components: [...state.profile.components, action.component]
          }
        }
      } else {
        // component exists, update it!
        return {
          ...state,
          profile: {
            ...state.profile,
            components: state.profile.components.map(component => (component.id === action.component.id) ? action.component : component )
          }
        }
      }

    case DELETE_COMPONENT:
      return {
        ...state,
        profile: {
          ...state.profile,
          components: state.profile.components.filter(component => component.id !== action.id )
        }
      }


    default:
      return state
  }
}

export const ProfileProvider: React.FC = ({ children }) => {

  const [profileState, profileDispatch] = useReducer(ProfileReducer, initialState)

  return (
    <ProfileContext.Provider value={{profileState, profileDispatch}}>
      {children}
    </ProfileContext.Provider>
  )
}

export const useProfileContext = () => {
  return useContext(ProfileContext)
}

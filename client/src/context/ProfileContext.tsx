import React, { createContext, useReducer, useContext, Dispatch } from 'react'

import { Profile, EmptyProfile } from '../models/Profile'
import { PostProtectProfile } from '../libs/apiLib'

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
const POST_PROFILE = "POST_PROFILE"
const SET_EDITING = "SET_EDITING"
const UPDATE_COMPONENT = "UPDATE_COMPONENT"
const DELETE_COMPONENT = "DELETE_COMPONENT"
const UPDATE_EXPERIENCE = "UPDATE_EXPERIENCE"
const DELETE_EXPERIENCE = "DELETE_EXPERIENCE"
const UPDATE_EDUCATION = "UPDATE_EDUCATION"
const DELETE_EDUCATION = "DELETE_EDUCATION"
const DELETE_BOOK_BY_ID = "DELETE_BOOK_BY_ID"
const DELETE_INTEGRATION = "DELETE_INTEGRATION"


// Valid action types
type Action =
 | { type: "UPDATE_PROFILE", profile: Profile }
 | { type: "POST_PROFILE" }
 | { type: "SET_EDITING", editing: boolean }
 | { type: "UPDATE_COMPONENT", component: any }
 | { type: "DELETE_COMPONENT", id: string }
 | { type: "UPDATE_EXPERIENCE", experience: any }
 | { type: "DELETE_EXPERIENCE", experience: any }
 | { type: "UPDATE_EDUCATION", education: any }
 | { type: "DELETE_EDUCATION", education: any }
 | { type: "DELETE_BOOK_BY_ID", id: string }
 | { type: "DELETE_INTEGRATION", id: string }


// Action creators
export const updateProfile = (profile: Profile): Action => {
  return { type: UPDATE_PROFILE, profile: profile}
}

export const postProfile = (): Action => {
  return { type: POST_PROFILE }
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

export const updateExperience = (experience: any): Action => {
  return { type: UPDATE_EXPERIENCE, experience: experience}
}

export const deleteExperience = (experience: any): Action => {
  return { type: DELETE_EXPERIENCE, experience: experience}
}

export const updateEducation = (education: any): Action => {
  return { type: UPDATE_EDUCATION, education: education}
}

export const deleteEducation = (education: any): Action => {
  return { type: DELETE_EDUCATION, education: education}
}

export const deleteBookById = (id: string): Action => {
  return { type: DELETE_BOOK_BY_ID, id: id }
}

export const deleteIntegration = (id: string): Action => {
  return { type: DELETE_INTEGRATION, id: id }
}


// Reducer
const ProfileReducer = (state: StateType, action: Action) => {
  switch (action.type) {

    case UPDATE_PROFILE:
      return {
        ...state,
        profile: action.profile
      }
    
    case POST_PROFILE:
      PostProtectProfile(state.profile)
      return {...state}

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

    case UPDATE_EXPERIENCE:
      return {
        ...state,
        profile: {
          ...state.profile,
          components: state.profile.components.map(comp => comp.type !== 'experiences' ? comp : 
            {
              ...state.profile.components.find(comp => comp.type === 'experiences'),
              props: {
                experiences: state.profile.components
                  .find(comp => comp.type === 'experiences')?.props.experiences
                  .map((exp: any) => exp.id === action.experience.id ? action.experience : exp)
              }
            }
          )
        }
      }

      case DELETE_EXPERIENCE:
        return {
          ...state,
          profile: {
            ...state.profile,
            components: state.profile.components.map(comp => comp.type !== 'experiences' ? comp : 
              {
                ...state.profile.components.find(comp => comp.type === 'experiences'),
                props: {
                  experiences: state.profile.components
                    .find(comp => comp.type === 'experiences')?.props.experiences
                    .filter((exp:any) => exp.id !== action.experience.id)
                }
              }
            )
          }
        }

      case UPDATE_EDUCATION:
        return {
          ...state,
          profile: {
            ...state.profile,
            components: state.profile.components.map(comp => comp.type !== 'education' ? comp : 
              {
                ...state.profile.components.find(comp => comp.type === 'education'),
                props: {
                  education: state.profile.components
                    .find(comp => comp.type === 'education')?.props.education
                    .map((edu: any) => edu.id === action.education.id ? action.education : edu)
                }
              }
            )
          }
        }

      case DELETE_EDUCATION:
        return {
          ...state,
          profile: {
            ...state.profile,
            components: state.profile.components.map(comp => comp.type !== 'education' ? comp : 
              {
                ...state.profile.components.find(comp => comp.type === 'education'),
                props: {
                  education: state.profile.components
                    .find(comp => comp.type === 'education')?.props.education
                    .filter((edu: any) => edu.id !== action.education.id)
                }
              }
            )
          }
        }

      case DELETE_BOOK_BY_ID:
        return {
          ...state,
          profile: {
            ...state.profile,
            components: state.profile.components.map(comp => comp.type !== 'bookshelf' ? comp : 
              {
                ...state.profile.components.find(comp => comp.type === 'bookshelf'),
                props: {
                  books: state.profile.components
                    .find(comp => comp.type === 'bookshelf')?.props.books
                    .filter((book: any) => book.id !== action.id)
                }
              }
            )
          }
        }

        case DELETE_INTEGRATION:
        return {
          ...state,
          profile: {
            ...state.profile,
            components: state.profile.components.map(comp => comp.type !== 'integrations' ? comp : 
              {
                ...state.profile.components.find(comp => comp.type === 'integrations'),
                props: {
                  integrations: state.profile.components
                    .find(comp => comp.type === 'integrations')?.props.integrations
                    .filter((integration: any) => integration.id !== action.id)
                }
              }
            )
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

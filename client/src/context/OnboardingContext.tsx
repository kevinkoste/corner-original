import React, { createContext, useReducer, useContext, Dispatch } from 'react'
import { Profile, EmptyProfile } from '../models/Profile'


type StateType = {
  profile: Profile, // empty profile to be filled
}

const initialState: StateType = {
  profile: EmptyProfile,
}

type OnboardingContextType = {
  onboardingState: StateType,
  onboardingDispatch: Dispatch<Action>
}

const OnboardingContext = createContext<OnboardingContextType>({
  onboardingState: initialState,
  onboardingDispatch: () => null
})

// Action constants
const UPDATE_COMPONENT = "UPDATE_COMPONENT"
const UPDATE_USERNAME = "UPDATE_USERNAME"

// Valid action types
type Action =
 | { type: "UPDATE_COMPONENT", component: any }
 | { type: "UPDATE_USERNAME", username: string }


// Action creators
export const updateComponent = (component: any): Action => {
  return { type: UPDATE_COMPONENT, component: component}
}

export const updateUsername = (username: string): Action => {
  return { type: UPDATE_USERNAME, username: username }
}


// Reducer
const OnboardingReducer = (state: StateType, action: Action) => {
  switch (action.type) {

    case UPDATE_COMPONENT:
      if (state.profile.components.find(component => component.id === action.component.id) === undefined) {
        // the component doesn't exist, add it
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

    case UPDATE_USERNAME:
      return {
        ...state,
        profile: {
          ...state.profile,
          username: action.username  
        }
      }

    default:
      return state
  }
}

export const OnboardingProvider: React.FC = ({ children }) => {

  const [onboardingState, onboardingDispatch] = useReducer(OnboardingReducer, initialState)

  return (
    <OnboardingContext.Provider value={{onboardingState, onboardingDispatch}}>
      {children}
    </OnboardingContext.Provider>
  )
}

export const useOnboardingContext = () => {
  return useContext(OnboardingContext)
}

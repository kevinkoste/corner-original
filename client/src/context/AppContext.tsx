import React, { createContext, useReducer, useContext, Dispatch } from 'react'

type StateType = {
  auth: boolean,
  onboarded: boolean,
  userId: string,
  email: string,
  username: string
}

const initialState: StateType = {
  auth: false,
  onboarded: false,
  userId: "",
  email: "",
  username: ""
}

type AppContextType = {
  state: StateType,
  dispatch: Dispatch<Action>
}

const AppContext = createContext<AppContextType>({
  state: initialState,
  dispatch: () => null
})

// Action constants
const SET_AUTH = "SET_AUTH"
const SET_ONBOARDED = "SET_ONBOARDED"
const SET_USERID = "SET_USERID"
const SET_EMAIL = "SET_EMAIL"
const SET_USERNAME = "SET_USERNAME"

// Valid action types
type Action =
 | { type: "SET_AUTH", auth: boolean }
 | { type: "SET_ONBOARDED", onboarded: boolean }
 | { type: "SET_USERID", userId: string }
 | { type: "SET_EMAIL", email: string }
 | { type: "SET_USERNAME", username: string }

// Action creators
export const setAuth = (auth: boolean): Action => {
  return { type: SET_AUTH, auth: auth }
}

export const setOnboarded = (onboarded: boolean): Action => {
  return { type: SET_ONBOARDED, onboarded: onboarded }
}

export const setUserId = (userId: string): Action => {
  return { type: SET_USERID, userId: userId }
}

export const setEmail = (email: string): Action => {
  return { type: SET_EMAIL, email: email }
}

export const setUsername = (username: string): Action => {
  return { type: SET_USERNAME, username: username }
}

// Reducer
const AppReducer = (state: StateType, action: Action) => {
  switch (action.type) {

    case SET_AUTH:
      return {
        ...state,
        auth: action.auth
      }

    case SET_ONBOARDED:
      return {
        ...state,
        onboarded: action.onboarded
      }

    case SET_USERID:
      return {
        ...state,
        userId: action.userId
      }

    case SET_EMAIL:
      return {
        ...state,
        email: action.email
      }

    case SET_USERNAME:
      return {
        ...state,
        username: action.username
      }

    default:
      return state
  }
}

export const AppProvider: React.FC = ({ children }) => {

  const [state, dispatch] = useReducer(AppReducer, initialState)

  return (
    <AppContext.Provider value={{state, dispatch}}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  return useContext(AppContext)
}

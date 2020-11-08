import React, { createContext, useReducer, useContext, Dispatch } from 'react'

type StateType = {
  components: any[]
  animating: boolean
  heldIdx: any
  dropIdx: any
  heldId: string
  dropId: string
}

const initialState: StateType = {
  components: [],
  animating: false,
  heldIdx: -1,
  dropIdx: -1,
  heldId: '',
  dropId: '',
}

type DndContextType = {
  dndState: StateType
  dndDispatch: Dispatch<Action>
}

const DndContext = createContext<DndContextType>({
  dndState: initialState,
  dndDispatch: () => null,
})

// Action constants
const SET_COMPONENTS = 'SET_COMPONENTS'
const SET_ANIMATING = 'SET_ANIMATING'
const SWAP_COMPONENTS = 'SWAP_COMPONENTS'
const SET_HELD_IDX = 'SET_HELD_IDX'
const SET_DROP_IDX = 'SET_DROP_IDX'
const SWAP_COMPONENTS_BY_ID = 'SWAP_COMPONENTS_BY_ID'
const SET_HELD_ID = 'SET_HELD_ID'
const SET_DROP_ID = 'SET_DROP_ID'

// Valid action types
type Action =
  | { type: 'SET_COMPONENTS'; components: any[] }
  | { type: 'SET_ANIMATING'; animating: boolean }
  | { type: 'SWAP_COMPONENTS'; fromIdx: number; toIdx: number }
  | { type: 'SET_HELD_IDX'; heldIdx: number }
  | { type: 'SET_DROP_IDX'; dropIdx: number }
  | { type: 'SWAP_COMPONENTS_BY_ID'; fromId: string; toId: string }
  | { type: 'SET_HELD_ID'; heldId: string }
  | { type: 'SET_DROP_ID'; dropId: string }

// Action creators
export const setComponents = (components: any[]): Action => {
  return { type: SET_COMPONENTS, components: components }
}

export const setAnimating = (animating: boolean): Action => {
  return { type: SET_ANIMATING, animating: animating }
}

export const swapComponents = (fromIdx: number, toIdx: number): Action => {
  return { type: SWAP_COMPONENTS, fromIdx: fromIdx, toIdx: toIdx }
}

export const setHeldIdx = (heldIdx: number): Action => {
  return { type: SET_HELD_IDX, heldIdx: heldIdx }
}

export const setDropIdx = (dropIdx: number): Action => {
  return { type: SET_DROP_IDX, dropIdx: dropIdx }
}

export const swapComponentsById = (fromId: string, toId: string): Action => {
  return { type: SWAP_COMPONENTS_BY_ID, fromId: fromId, toId: toId }
}

export const setHeldId = (heldId: string): Action => {
  return { type: SET_HELD_ID, heldId: heldId }
}

export const setDropId = (dropId: string): Action => {
  return { type: SET_DROP_ID, dropId: dropId }
}

// Reducer
const DndReducer = (state: StateType, action: Action) => {
  switch (action.type) {
    case SET_COMPONENTS:
      return { ...state, components: action.components }

    case SET_ANIMATING:
      return {
        ...state,
        animating: action.animating,
      }

    case SWAP_COMPONENTS:
      const comp = state.components[action.fromIdx]
      const removed = state.components.filter(
        (val, idx) => idx !== action.fromIdx
      )

      if (action.toIdx === 0) {
        return { ...state, components: [comp, ...removed] }
      }

      if (action.toIdx === state.components.length - 1) {
        return { ...state, components: [...removed, comp] }
      }

      return {
        ...state,
        components: [
          ...removed.slice(0, action.toIdx),
          comp,
          ...removed.slice(action.toIdx),
        ],
      }

    case SWAP_COMPONENTS_BY_ID:
      const fromIdx = state.components.findIndex(
        (val, idx) => val.id === action.fromId
      )
      const toIdx = state.components.findIndex(
        (val, idx) => val.id === action.toId
      )

      if (fromIdx === -1 || toIdx === -1) {
        return { ...state }
      }

      const copy = [...state.components]

      const temp = copy[toIdx]
      copy[toIdx] = copy[fromIdx]
      copy[fromIdx] = temp

      return {
        ...state,
        components: copy,
      }

    case SET_HELD_IDX:
      return {
        ...state,
        heldIdx: action.heldIdx,
      }

    case SET_DROP_IDX:
      return {
        ...state,
        dropIdx: action.dropIdx,
      }

    case SET_HELD_ID:
      return {
        ...state,
        heldId: action.heldId,
      }

    case SET_DROP_ID:
      return {
        ...state,
        dropId: action.dropId,
      }

    default:
      return state
  }
}

export const DndContextProvider: React.FC = ({ children }) => {
  const [dndState, dndDispatch] = useReducer(DndReducer, initialState)

  return (
    <DndContext.Provider value={{ dndState, dndDispatch }}>
      {children}
    </DndContext.Provider>
  )
}

export const useDndContext = () => {
  return useContext(DndContext)
}

import React from 'react'

import { AppProvider } from './context/AppContext'
import { AppNavigator } from './pages/AppNavigator'

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppNavigator />
    </AppProvider>
  )
}

import React from 'react'

import { ProfileProvider } from './context/ProfileContext'
import { AppNavigator } from './pages/AppNavigator'

export const App: React.FC = () => {

  return (
    <ProfileProvider>
      <AppNavigator />
    </ProfileProvider>
  )
}
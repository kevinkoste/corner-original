import React, { useEffect } from 'react'
import { Route, Switch, BrowserRouter } from 'react-router-dom'

import { useProfileContext } from '../context/ProfileContext'
import { ProfilePage } from '../pages/ProfilePage'
import { LoginPage } from '../pages/LoginPage'

export const AppNavigator: React.FC = () => {

  const { state, dispatch } = useProfileContext()

  // on mount, try to get auth cookie
  useEffect(() => {
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <BrowserRouter>
      <Switch>

        <Route exact path='/login'>
          <LoginPage />
        </Route>

        <Route exact path='/:username'>
          <ProfilePage />
        </Route>

        <Route path='/'>
          <h1>Home</h1>
        </Route>

      </Switch>
    </BrowserRouter>
  )
}
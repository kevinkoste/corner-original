import React, { useEffect } from 'react'
import { Route, Switch, BrowserRouter } from 'react-router-dom'

import { useProfileContext, setAuth } from '../context/ProfileContext'
import { HomePage } from '../pages/HomePage'
import { ProfilePage } from '../pages/ProfilePage'
import { LoginPage } from '../pages/LoginPage'

export const AppNavigator: React.FC = () => {

  const { dispatch } = useProfileContext()

  // on mount, try to get auth cookie
  useEffect(() => {
    if (localStorage.getItem("ACCESS_TOKEN") != null) {
      console.log('found access token: ', localStorage.getItem('ACCESS_TOKEN'))
      dispatch(setAuth(true))
    }
    
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
          <HomePage />
        </Route>

      </Switch>
    </BrowserRouter>
  )
}
import React, { useState, useEffect } from 'react'
import { Route, Switch, BrowserRouter, useHistory } from 'react-router-dom'

import { useAppContext, setAuth, setUsername } from '../context/AppContext'
import { OnboardingProvider } from '../context/OnboardingContext'
import { ProfileProvider } from '../context/ProfileContext'

import { HomePage } from '../pages/HomePage'
import { ProfilePage } from './ProfilePage'
import { EditProfilePage } from './EditProfilePage'
import { LoginPage } from '../pages/LoginPage'
import { OnboardingPage } from '../pages/OnboardingPage'
import { PostProtectGetUsername } from '../libs/apiLib'


export const AppNavigator: React.FC = () => {

  let history = useHistory()
  const { dispatch } = useAppContext()

  const [ loading, setLoading ] = useState(true)

  // on mount, handle auth checks
  useEffect(() => {

    PostProtectGetUsername()
    .then(res => {
      console.log('post protect get username', res)

      setLoading(false)
      if ('username' in res.data) {
        console.log('signed in with:', res.data.username)
        dispatch(setUsername(res.data.username))
        dispatch(setAuth(true))
      } else {
        console.log('no user signed in')
      }
    })
    .catch(err => console.log(err))
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!loading) {
    return (
      <BrowserRouter>
        <Switch>
  
          <Route exact path='/'>
            <HomePage />
          </Route>
  
          <Route exact path='/login'>
            <LoginPage />
          </Route>
  
          <Route exact path='/onboarding'>
            <OnboardingProvider>
              <OnboardingPage />
            </OnboardingProvider>
          </Route>
  
          {/* if own profile, can navigate to edit version of profile */}
          <Route exact path='/edit/:username'>
            <ProfileProvider>
              <EditProfilePage />
            </ProfileProvider>
          </Route>
  
          {/* public version of profile */}
          <Route path='/:username'>
            <ProfilePage />
          </Route>
  
        </Switch>
      </BrowserRouter>
    )
  } else {
    return (
      // this should be an app load spinner
      <div style={{height: '100vh', backgroundColor: 'black'}}/>
    )
  }
  
}
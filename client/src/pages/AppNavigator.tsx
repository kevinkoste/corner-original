import React, { useState, useEffect } from 'react'
import { Route, Switch, BrowserRouter, useHistory } from 'react-router-dom'

import { useAppContext, setAuth, setOnboarded, setUsername } from '../context/AppContext'
import { OnboardingProvider } from '../context/OnboardingContext'
import { ProfileProvider } from '../context/ProfileContext'

import { HomePage } from '../pages/HomePage'
import { ProfilePage } from './ProfilePage'
import { EditProfilePage } from './EditProfilePage'
import { LoginPage } from '../pages/LoginPage'
import { OnboardingPage } from '../pages/OnboardingPage'
import { BrowsePage } from '../pages/BrowsePage'
import { NotInvitedPage } from '../pages/NotInvitedPage'

import { PostProtectGetUsername } from '../libs/apiLib'
import { cotter } from '../libs/cotterLib'


export const AppNavigator: React.FC = () => {

  let history = useHistory()
  const { dispatch } = useAppContext()

  const [ loading, setLoading ] = useState(true)

  // on mount, handle auth checks
  useEffect(() => {

    const user = cotter.getLoggedInUser()
    
    if (user !== null) {
      PostProtectGetUsername()
      .then(res => {
        console.log('post protect get username', res)
  
        if (res.data.username !== false) {
          console.log('signed in with:', res.data.username)
          dispatch(setUsername(res.data.username))
          dispatch(setAuth(true))
          dispatch(setOnboarded(true))
          setLoading(false)
        } else {
          console.log('no user signed in')
          dispatch(setAuth(true))
          setLoading(false)
        }
  
      })
      .catch(err => {
        setLoading(false)
        console.log(err)
      })
    } else {
      setLoading(false)
    }
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

          <Route exact path='/browse'>
            <BrowsePage />
          </Route>

          <Route path='/not-invited'>
            <NotInvitedPage />
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
      <div style={{height: '100vh', backgroundColor: 'white'}}/>
    )
  }
  
}
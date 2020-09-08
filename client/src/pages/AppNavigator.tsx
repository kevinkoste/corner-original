import React, { useState, useEffect, Suspense, lazy } from 'react'
import { Route, Switch, BrowserRouter } from 'react-router-dom'

import { useAppContext, setAuth, setOnboarded, setUsername } from '../context/AppContext'
import { OnboardingProvider } from '../context/OnboardingContext'
import { ProfileProvider } from '../context/ProfileContext'

import { cotter } from '../libs/cotterLib'
import { PostProtectOnboardCheck } from '../libs/apiLib'

const HomePage = lazy(() => import('../pages/HomePage'))
const ProfilePage = lazy(() => import('../pages/ProfilePage'))
const EditProfilePage = lazy(() => import('../pages/EditProfilePage'))
const LoginPage = lazy(() => import('../pages/LoginPage'))
const OnboardingPage = lazy(() => import('../pages/OnboardingPage'))
const BrowsePage = lazy(() => import('../pages/BrowsePage'))
const NotInvitedPage = lazy(() => import('../pages/NotInvitedPage'))

export const AppNavigator: React.FC = () => {

  const { dispatch } = useAppContext()

  const [ loading, setLoading ] = useState(true)

  // on mount, handle auth checks
  useEffect(() => {

    const onMount = async () => {
      const user = cotter.getLoggedInUser()

      if (user === null) {
        setLoading(false)
        return
      }

      const res = await PostProtectOnboardCheck()

      if (res.data.onboarded !== false) {
        dispatch(setUsername(res.data.profile.username))
        dispatch(setAuth(true))
        dispatch(setOnboarded(true))
        setLoading(false)
      } else {
        dispatch(setAuth(true))
        setLoading(false)
      }
    }

    onMount()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!loading) {
    return (
      <BrowserRouter>
        <Suspense fallback={<Fallback />}>
          <Switch>
    
            <Route exact path='/' component={HomePage} />
    
            <Route exact path='/login' component={LoginPage} />
    
            <Route exact path='/onboarding'>
              <OnboardingProvider>
                <OnboardingPage />
              </OnboardingProvider>
            </Route>

            <Route exact path='/browse' component={BrowsePage} />

            <Route path='/not-invited' component={NotInvitedPage} />
    
            {/* if own profile, navigate to edit version of profile */}
            <Route exact path='/edit/:username'>
              <ProfileProvider>
                <EditProfilePage />
              </ProfileProvider>
            </Route>
    
            {/* public version of profile */}
            <Route path='/:username'component={ProfilePage} />
    
          </Switch>
        </Suspense>
      </BrowserRouter>
    )
  } else {
    return (
      <Fallback />
    )
  }
  
}

const Fallback: React.FC = () => {
  return <div style={{height: '100vh', backgroundColor: 'white'}}/>
}
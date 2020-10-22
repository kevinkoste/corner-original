import React, { useState, useEffect, Suspense, lazy } from 'react'
import { Route, Switch, BrowserRouter } from 'react-router-dom'
import BeatLoader from 'react-spinners/BeatLoader'

import { Div } from '../components/Base'
import { useAppContext, setAuth, setOnboarded, setUserId, setEmail, setUsername, setProfile } from '../context/AppContext'
import { OnboardingProvider } from '../context/OnboardingContext'
import { ProfileProvider } from '../context/ProfileContext'

import { PostAuthLogin } from '../libs/apiLib'
import magic from '../libs/magicLib'

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

      const isLoggedIn = await magic.user.isLoggedIn()
      console.log('isLoggedIn: ', isLoggedIn)
      if (!isLoggedIn) {
        setLoading(false)
        return
      }

      const didToken = await magic.user.getIdToken()
      console.log('didToken: ', didToken)

      const authRes = await PostAuthLogin(didToken)
      console.log('authRes is:', authRes)

      dispatch(setAuth(true))

      const { userId, email, username, profile, onboarded } = authRes.data
      console.log('userId:', userId, 'email:', email, 'profile:', profile, 'onboarded:', onboarded)

      if (onboarded) {
        dispatch(setUserId(userId))
        dispatch(setEmail(email))
        dispatch(setUsername(username))
        dispatch(setProfile(profile))
        dispatch(setOnboarded(true))
      }
      setLoading(false)
    }

    onMount()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return <Fallback />
  } else {
    return (
      <BrowserRouter>
        <Suspense fallback={<Fallback/>}>
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
  }
}

const Fallback: React.FC = () => {
  return (
    <Div row width={12} style={{height: '100vh', backgroundColor: 'white', alignItems: 'center'}}>
      <BeatLoader
        css={'margin: auto;'}
        size={20}
        loading={true}
        color={'#000000'}
      />
    </Div>
  )
}
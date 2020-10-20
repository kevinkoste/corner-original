import React, { useState, useEffect, Suspense, lazy } from 'react'
import { Route, Switch, BrowserRouter } from 'react-router-dom'
import PacmanLoader from "react-spinners/PacmanLoader"

import { useAppContext, setAuth, setOnboarded, setUserId, setEmail, setUsername, setProfile } from '../context/AppContext'
import { OnboardingProvider } from '../context/OnboardingContext'
import { ProfileProvider } from '../context/ProfileContext'

import { GetProtectProfile, PostAuthLogin } from '../libs/apiLib'
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
      if (isLoggedIn) {
        dispatch(setAuth(true))
        await PostAuthLogin(await magic.user.getIdToken())
      } else {
        setLoading(false)
        return
      }

      const profileRes = await GetProtectProfile()
      const { userId, email, username, profile } = profileRes.data
      console.log('userId:', userId, 'email:', email, 'profile:', profile)

      if (username) {
        dispatch(setUserId(username))
        dispatch(setEmail(username))
        dispatch(setUsername(username))
        dispatch(setProfile(profile))
        dispatch(setOnboarded(true))
      }
      setLoading(false)
    }

    onMount()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!loading) {
    return (
      <BrowserRouter>
        <Suspense fallback={<Fallback loading={loading}/>}>
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
      <Fallback loading={loading} />
    )
  }
  
}

type FallbackProps = { loading: boolean }
const Fallback: React.FC<FallbackProps> = ({ loading }) => {
  return (
    <div style={{height: '100vh', width: '100vw', backgroundColor: 'white'}}>
      <PacmanLoader
        css={'height: 300px; width: 300px;'}
        loading={loading}
        color={'#000000'}
      />
    </div>
  )
}
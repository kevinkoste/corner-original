import React, { useState, useEffect, Suspense, lazy } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import BeatLoader from 'react-spinners/BeatLoader'

import { Div } from '../components/Base'
import {
  useAppContext,
  setAuth,
  setOnboarded,
  setUserId,
  setEmail,
  setUsername,
} from '../context/AppContext'
import { OnboardingProvider } from '../context/OnboardingContext'
import { ProfileProvider } from '../context/ProfileContext'

import { PostAuthCheck } from '../libs/apiLib'

const HomePage = lazy(() => import('../pages/HomePage'))
const ProfilePage = lazy(() => import('../pages/ProfilePage'))
const EditProfilePage = lazy(() => import('../pages/EditProfilePage'))
const LoginPage = lazy(() => import('../pages/LoginPage'))
const OnboardingPage = lazy(() => import('../pages/OnboardingPage'))
const BrowsePage = lazy(() => import('../pages/BrowsePage'))
const NotInvitedPage = lazy(() => import('../pages/NotInvitedPage'))

export const AppNavigator: React.FC = () => {
  const { dispatch } = useAppContext()

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // on mount, handle auth checks
    const onMount = async () => {
      // attempt to retrieve existing session
      try {
        const auth = await PostAuthCheck()
        console.log('auth response', auth)
        dispatch(setAuth(true))

        const { userId, email, onboarded, username } = auth.data
        console.log('userId:', userId, 'email:', email, 'onboarded:', onboarded)

        dispatch(setUserId(userId))
        dispatch(setEmail(email))

        if (onboarded) {
          dispatch(setOnboarded(true))
          dispatch(setUsername(username))
        }
      } catch {
        console.log('unauthorized')
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
        <Suspense fallback={<Fallback />}>
          <Switch>
            <Route exact path="/" component={HomePage} />

            <Route exact path="/login" component={LoginPage} />

            <Route exact path="/onboarding">
              <OnboardingProvider>
                <OnboardingPage />
              </OnboardingProvider>
            </Route>

            <Route exact path="/browse" component={BrowsePage} />

            <Route path="/not-invited" component={NotInvitedPage} />

            {/* if own profile, navigate to edit version of profile */}
            <Route exact path="/edit/:username">
              <ProfileProvider>
                <EditProfilePage />
              </ProfileProvider>
            </Route>

            {/* public version of profile */}
            <Route path="/:username" component={ProfilePage} />
          </Switch>
        </Suspense>
      </BrowserRouter>
    )
  }
}

const Fallback: React.FC = () => {
  return (
    <Div
      row
      width={12}
      style={{
        height: '100vh',
        backgroundColor: 'white',
        alignItems: 'center',
      }}
    >
      <BeatLoader
        css={'margin: auto;'}
        size={20}
        loading={true}
        color={'#000000'}
      />
    </Div>
  )
}

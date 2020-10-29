import React, { useState, useEffect, Suspense, lazy } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { Loader } from '../components/Base'
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

import { PostAuthCheck } from '../libs/api'

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
        dispatch(setAuth(true))

        const { userId, email, onboarded, username } = auth.data

        dispatch(setUserId(userId))
        dispatch(setEmail(email))

        if (onboarded) {
          dispatch(setOnboarded(true))
          dispatch(setUsername(username))
        }
      } catch (err) {
        // user is not logged in
      }

      setLoading(false)
    }

    onMount()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return <Loader />
  } else {
    return (
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <Switch>
            <Route exact path="/" component={HomePage} />

            <Route exact path="/login" component={LoginPage} />

            <Route exact path="/onboarding">
              <OnboardingProvider>
                <OnboardingPage />
              </OnboardingProvider>
            </Route>

            <Route exact path="/browse" component={BrowsePage} />

            <Route exact path="/not-invited" component={NotInvitedPage} />

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

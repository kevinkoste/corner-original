import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import {
  PageContainer,
  BodyContainer,
  Div,
  InlineInput,
  Button,
  Loader,
} from '../components/Base'
import { Header } from '../components/Header'
import { useDetectMobile } from '../libs/hooksLib'
import {
  useAppContext,
  setAuth,
  setOnboarded,
  setUserId,
  setEmail,
  setUsername,
} from '../context/AppContext'
import { PostAuthLogin } from '../libs/apiLib'
import magic from '../libs/magicLib'

export const LoginPage: React.FC = () => {
  let history = useHistory()
  const mobile: boolean = useDetectMobile()

  const { state, dispatch } = useAppContext()

  const [loading, setLoading] = useState<boolean>(false)
  const [emailInput, setEmailInput] = useState<string>('')

  useEffect(() => {
    const onMount = async () => {
      // if authed and onboarded, redirect to profile
      if (state.auth && state.onboarded) {
        history.push(`/edit/${state.username}`)
      }
    }
    onMount()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = async () => {
    try {
      setLoading(true)
      const didToken = await magic.auth.loginWithMagicLink({
        email: emailInput,
      })
      if (!didToken) {
        throw Error('Magic API error')
      }

      const { data } = await PostAuthLogin(didToken)
      const { userId, email, onboarded, username } = data

      dispatch(setAuth(true))
      setLoading(false)

      if (onboarded) {
        dispatch(setUserId(userId))
        dispatch(setEmail(email))
        dispatch(setUsername(username))
        dispatch(setOnboarded(true))
        history.push(`/edit/${username}`)
      } else {
        history.push('/onboarding')
      }
    } catch (err) {
      console.log('login error')
      history.push('/')
    }
  }

  return (
    <PageContainer column width={12}>
      <Header title="Login" />

      <BodyContainer column width={mobile ? 11 : 6} style={{ margin: 'auto' }}>
        {loading && <Loader />}
        {!loading && (
          <Div column width={12} style={{ maxWidth: '400px' }}>
            <EmailTextInput
              placeholder={'you@example.com'}
              onChange={(event: any) => setEmailInput(event.target.value)}
              value={emailInput}
              autoCapitalize="none"
            />
            <SubmitButton onClick={handleLogin}>Log In or Sign Up</SubmitButton>
          </Div>
        )}
      </BodyContainer>
    </PageContainer>
  )
}

export default LoginPage

const EmailTextInput = styled(InlineInput)`
  padding: 10px 20px 12px 20px;
  border-radius: 30px;
  border: 1px solid black;
`

const SubmitButton = styled(Button)`
  margin-top: 12px;
  border: 1px solid black;
`

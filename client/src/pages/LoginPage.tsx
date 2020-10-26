import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { Div, TextArea, Button } from '../components/Base'
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
    const didToken = await magic.auth.loginWithMagicLink({ email: emailInput })
    if (didToken === null) {
      console.log(
        'oh no! your auth token isnt working, redirect to "oh no" screen?'
      )
      return
    }

    const authRes = await PostAuthLogin(didToken)
    console.log('authRes.data is:', authRes.data)

    if (authRes.status !== 200) {
      console.log('oh no! couldnt find your user, redirect to "oh no" screen?')
      return
    }

    dispatch(setAuth(true))

    const { userId, email, onboarded, username } = authRes.data
    console.log('userId:', userId, 'email:', email, 'onboarded:', onboarded)

    if (onboarded) {
      dispatch(setUserId(userId))
      dispatch(setEmail(email))
      dispatch(setUsername(username))
      dispatch(setOnboarded(true))
      history.push(`/edit/${username}`)
    } else {
      history.push('/onboarding')
    }
  }

  return (
    <PageContainer column width={12}>
      <Header title="Login" />

      <BodyContainer column width={mobile ? 11 : 6}>
        {true && (
          <Div
            row
            width={12}
            style={{ position: 'relative', maxWidth: '400px' }}
          >
            <EmailTextInput
              placeholder={'you@example.com'}
              onChange={(event: any) => setEmailInput(event.target.value)}
              value={emailInput}
              autoCapitalize="none"
            />
            <SubmitButton onClick={handleLogin}>Join &#62;</SubmitButton>
          </Div>
        )}

        {/* { !state.auth &&
					<div id="cotter-form-container" style={{ width: '100%', height: 200 }} />
				} */}
      </BodyContainer>
    </PageContainer>
  )
}

export default LoginPage

const PageContainer = styled(Div)`
  max-width: 100vw;
  height: ${window.innerHeight + 'px'};
  align-items: center;
  overflow: hidden;
  position: relative;
`

const BodyContainer = styled(Div)`
  align-items: center;
  margin: auto;
  padding-top: 51px;
  max-width: 1150px;
`

const EmailTextInput = styled(TextArea)`
  font-size: 18px;
  font-family: 'inter';
  line-height: 24px;
  text-transform: lowercase;
  @media (max-width: 768px) {
    font-size: 16px;
  }
`

const SubmitButton = styled(Button)`
  /* font-size: 18px;
	font-family: 'inter';
  line-height: 24px;
	padding: 0;
	@media (max-width: 768px) {
		position: absolute;
		right: 0;
		font-size: 16px;
	}
	:hover {
		cursor: pointer;
	} */
`

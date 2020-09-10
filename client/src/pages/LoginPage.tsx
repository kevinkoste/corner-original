import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

// presentation
import { Div } from '../components/Base'
import { Header } from '../components/Header'
import { useDetectMobile } from '../libs/hooksLib'

// logic
import { useAppContext, setAuth, setOnboarded, setUsername } from '../context/AppContext'
import { PostPublicLoginData, PostProtectOnboardCheck } from '../libs/apiLib'
import { cotter } from '../libs/cotterLib'


export const LoginPage: React.FC = () => {

	let history = useHistory()
	const mobile: boolean = useDetectMobile()

	const { state, dispatch } = useAppContext()
	
	useEffect(() => {

		const onMount = async () => {

			// if authed and onboarded, redirect to profile
			if (state.auth && state.onboarded) {
				history.push(`/edit/${state.username}`)
			}

			// prompt and complete cotter login flow
			const data = await cotter.signInWithLink().showEmailForm()

			// post data to backend and set authenticated
			await PostPublicLoginData(data)
			dispatch(setAuth(true))

			// check if user is onboarded, if yes set username & redirect to profile
			const onboardRes = await PostProtectOnboardCheck()
			if (onboardRes.data.onboarded) {
				dispatch(setOnboarded(true))
				dispatch(setUsername(onboardRes.data.profile.username))
				history.push(`/edit/${onboardRes.data.profile.username}`)
			} else {
				history.push('/onboarding')
			}
		}

		onMount()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	
	return (
		<PageContainer column width={12}>

			<Header title='Login' />

			<BodyContainer column width={mobile ? 11 : 6}>

				{ !state.auth &&
					<div id="cotter-form-container" style={{ width: '100%', height: 200 }} />
				}

			</BodyContainer>

		</PageContainer>
	)
}
export default LoginPage

const PageContainer = styled(Div)`
  max-width: 100vw;
	height: ${window.innerHeight+"px"};
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
import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

// presentation
import { Div, Button } from '../components/BaseComponents'
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

		cotter.signInWithLink().showEmailForm()
		.then(data => {

			// send cotter signup success data to the backend
			PostPublicLoginData(data)
			.then(res => {

				dispatch(setAuth(true))

				// check if onboarded, push to either onboarding or profile
				PostProtectOnboardCheck()
				.then(res => {
					console.log('response from onboard check:', res)
					if (res.data.onboarded) {
						dispatch(setOnboarded(true))
						dispatch(setUsername(res.data.profile.username))
						history.push(`/edit/${res.data.profile.username}`)
					} else {
						history.push('/onboarding')
					}
				})
				.catch(err => console.log(err)) 

			})
			.catch(err => console.log('post login data server error', err))

		})
		.catch(err => console.log('cotter login error', err))

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
`
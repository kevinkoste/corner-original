import React, { useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import styled from 'styled-components'

import { useProfileContext, setAuth } from '../context/ProfileContext'
import { PostPublicLoginData, PostOnboardCheck } from '../libs/apiLib'
import { Div } from '../components/BaseComponents'
import { HomeHeader } from '../components/HomeHeader'
import { cotter } from '../libs/cotterLib'


export const LoginPage: React.FC = () => {

	const { state, dispatch } = useProfileContext()
	
	useEffect(() => {

		cotter
		.signInWithLink()
		.showEmailForm()
		.then(data => {
			// cotter automatically sets the 'ACCESS_TOKEN' in localStorage
			// now we are signed in, which will redirect us to home (see return statement)
			dispatch(setAuth(true))

			// also send this data in the backend to create new user
			PostPublicLoginData(data)
			.then(res => {

				console.log('post login data server response', res)
			})
			.catch(err => console.log('post login data server error', err))

		})
		.catch(err => {
			console.log('cotter login error', err)
		})

			// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// on save profile, post new profile data to server
	const onClick = () => {
		PostOnboardCheck()
		.then(res => {
			console.log('onboard check server response', res)
		})
		.catch(err => {
			console.log('onboard check server error', err)
		})
	}
	
	if (state.auth) {
		return <Redirect to="/" push={true} />
	} else {
		return (
			<PageContainer column width={12}>

				<HomeHeader />

				<div id="cotter-form-container" style={{ width: 300, height: 300 }} />

				<button onClick={onClick} style={{margin: '20px 0px 20px 0px'}}>
					check onboarded
				</button>

			</PageContainer>
		)
	}
}

const PageContainer = styled(Div)`
	max-width: 100vw;
	align-items: center;
	overflow: hidden;
	position: relative;
`


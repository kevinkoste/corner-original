import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

// presentation
import { Div } from '../components/BaseComponents'
import { Header } from '../components/Header'

// logic
import { useAppContext, setAuth } from '../context/AppContext'
import { PostPublicLoginData } from '../libs/apiLib'
import { cotter } from '../libs/cotterLib'


export const LoginPage: React.FC = () => {

	let history = useHistory()
	const { state, dispatch } = useAppContext()
	
	useEffect(() => {

		cotter.signInWithLink().showEmailForm()
		.then(data => {

			// send cotter signup success data to the backend
			PostPublicLoginData(data)
			.then(res => {
				dispatch(setAuth(true))
				history.push('/onboarding')
			})
			.catch(err => console.log('post login data server error', err))

		})
		.catch(err => console.log('cotter login error', err))

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	
	return (
		<PageContainer column width={12}>

			<Header title='Login' />

			<div id="cotter-form-container" style={{ marginTop: 300, width: 300, height: 300 }} />

		</PageContainer>
	)
}

const PageContainer = styled(Div)`
	max-width: 100vw;
	align-items: center;
	overflow: hidden;
	position: relative;
`

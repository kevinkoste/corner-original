import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'

import { useDetectMobile } from '../libs/hooksLib'
import { Div, H1, Button, TextArea } from '../components/BaseComponents'
import BurgerIcon from '../icons/burger.svg'
import ExitIcon from '../icons/exit.svg'

import { cotter } from '../libs/cotterLib'
import { useAppContext, setAuth } from '../context/AppContext'
import { PostProtectInviteNewEmail } from '../libs/apiLib'

type HeaderProps = { title: string }
export const Header: React.FC<HeaderProps> = ({ title }) => {

	let history = useHistory()
	const { state, dispatch } = useAppContext()
	const [ showingBurger, setShowingBurger ] = useState<boolean>(false)
	const mobile: boolean = useDetectMobile()

	const onClick = () => setShowingBurger(!showingBurger)
	const takeHome = () => {
		if (state.auth) {
			history.push('/browse')
		}
		else {
			history.push('/')
		}
	}

	if (!showingBurger) {
		return (
			<HeaderContainer row width={mobile ? 11 : 10}>

				<AnimatedName onClick={takeHome}>
					{title}
				</AnimatedName>

				<AnimatedTitle onClick={takeHome}>
					Corner
				</AnimatedTitle>

				<BurgerButton onClick={onClick} src={BurgerIcon} />

			</HeaderContainer>
		)
	} else {
		return (
			<BurgerMenu>

				<HeaderContainer row width={mobile ? 11 : 10} style={{borderBottom: '1px solid white', backgroundColor: 'black'}}>
					<HeaderTitleText style={{color: 'white'}}>
						Search Profiles...
					</HeaderTitleText>
					<BurgerButton onClick={onClick} src={ExitIcon} />
				</HeaderContainer>

				<BodyContainer column width={mobile ? 11 : 10}>

					<HeaderTitleText onClick={() => history.push(`/browse`)}
						style={{color: 'white', marginTop: '20px'}}>
						Browse Profiles
					</HeaderTitleText>

					{ !state.onboarded && 
						<HeaderTitleText onClick={() => history.push(`/login`)}
							style={{color: 'white', marginTop: '20px'}}>
							Join Corner
						</HeaderTitleText>
					}

					{	state.onboarded && state.auth &&
						<React.Fragment>

							<HeaderTitleText onClick={() => history.push(`/edit/${state.username}`)}
								style={{color: 'white', marginTop: '20px'}}>
								My Profile
							</HeaderTitleText>

							<HeaderTitleText onClick={() => {
									cotter.logOut()
									dispatch(setAuth(false))
									history.push('/')
								}} style={{color: 'white', marginTop: '20px'}}>
								Log Out
							</HeaderTitleText>

							<InviteForm />

						</React.Fragment>
					}

				</BodyContainer>

			</BurgerMenu>
		)
	}
}

const HeaderContainer = styled(Div)`
	position: fixed;
	align-items: center;
	/* justify-content: stretch; */
	background-color: white;
	z-index: 1;
	
	padding-top: 15px;
	padding-bottom: 5px;
	border-bottom: 1px solid black;
`

const HeaderTitleText = styled(H1)`
	overflow: hidden;
	white-space: nowrap;
	margin: unset;

	font-size: 24px;
`

const AnimatedNameKeyframes = keyframes`
	0% { width: 0%; height: 0%; }
	0.01% { width: 0%; height: 100%; }
	50% { width: 50%; height: 100%; }
	99.99% { width: 0%; height: 100%; }
	100% { width: 0%; height: 0%; }
`
const AnimatedName = styled(HeaderTitleText)`
	animation-name: ${AnimatedNameKeyframes};
	animation-duration: 3s;
	animation-delay: 0.5s;
	animation-timing-function: steps(30, end);
	animation-fill-mode: both;
`

const AnimatedTitleKeyframes = keyframes`
	0% { width: 0%; height: 0%; }
	0.01% { width: 0%; height: 100%; }
	100% { width: 50%; height: 100%; }
`
const AnimatedTitle = styled(HeaderTitleText)`
	animation-name: ${AnimatedTitleKeyframes};
	animation-duration: 1.5s;
	animation-delay: 3.5s;
	animation-timing-function: steps(30, end);
	animation-fill-mode: both;
`

const BurgerButton = styled.img`
	position: absolute;
	z-index: 2;
	right: 0;
`

const BurgerMenu = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;

	position: fixed;
	z-index: 1;
	top: 0;
	left: 0;
	height: 100vh;
	width: 100vw;

	background-color: black;
`

const BodyContainer = styled(Div)`
	padding-top: 51px;
`


const InviteForm: React.FC = () => {

	const [ emailInput, setEmailInput ] = useState<string>('') 

	const onSubmit = () => {

		PostProtectInviteNewEmail(emailInput)
			.then(res => {
				console.log(res)
			})
			.catch(err => console.log(err))
	}

	return (
		<Div column width={12}>

			<HeaderTitleText style={{color: 'white', marginTop: '20px'}}>
				Invite a friend
			</HeaderTitleText>

			<Div row width={12}>
				<InviteTextInput 
					placeholder={'yourfriend@gmail.com'}
					onChange={(event: any) => setEmailInput(event.target.value)}
					value={emailInput}
				/>
				<InviteButton onClick={onSubmit} />
			</Div>

		</Div>
	)
}

const InviteTextInput = styled(TextArea)`
	background-color: black;
	color: white;
	font-size: 16px;

`

const InviteButton = styled(Button)`
	background-color: white;
`
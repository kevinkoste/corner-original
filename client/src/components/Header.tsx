import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'

import { useDetectMobile } from '../libs/hooksLib'
import { Div, H1 } from '../components/BaseComponents'
import BurgerIcon from '../icons/burger.svg'
import ExitIcon from '../icons/exit.svg'

import { cotter } from '../libs/cotterLib'
import { useAppContext, setAuth } from '../context/AppContext'

type HeaderProps = { title: string }
export const Header: React.FC<HeaderProps> = ({ title }) => {

	let history = useHistory()
	const { state, dispatch } = useAppContext()
	const [ showingBurger, setShowingBurger ] = useState<boolean>(false)
	const mobile: boolean = useDetectMobile()

	const onClick = () => setShowingBurger(!showingBurger)


	if (!showingBurger) {
		return (
			<HeaderContainer row width={mobile ? 11 : 6}>

				<AnimatedName>
					{title}
				</AnimatedName>

				<AnimatedTitle>
					Corner
				</AnimatedTitle>

				<BurgerButton onClick={onClick} src={BurgerIcon} />

			</HeaderContainer>
		)
	} else {
		return (
			<BurgerMenu>

				<HeaderContainer row width={mobile ? 11 : 6} style={{borderBottom: '1px solid white'}}>
					<HeaderTitleText style={{color: 'white'}}>
						Search Profiles...
					</HeaderTitleText>
					<BurgerButton onClick={onClick} src={ExitIcon} />
				</HeaderContainer>

				<BodyContainer column width={mobile ? 11 : 6}>

					{ !state.auth && 
						<HeaderTitleText onClick={() => history.push(`/login`)}
							style={{color: 'white', marginTop: '20px'}}>
							Join Corner
						</HeaderTitleText>
					}

					{	state.auth &&
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
						</React.Fragment>
					}

				</BodyContainer>

			</BurgerMenu>
		)
	}
}

const HeaderContainer = styled(Div)`
	position: relative;
	align-items: center;
	justify-content: stretch;
	
	margin-top: 15px;
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
	50% { width: 100%; height: 100%; }
	99.99% { width: 0%; height: 100%; }
	100% { width: 0%; height: 0%; }
`
const AnimatedName = styled(HeaderTitleText)`
	animation-name: ${AnimatedNameKeyframes};
	animation-duration: 3s;
	animation-delay: 0.8s;
	animation-timing-function: steps(30, end);
	animation-fill-mode: both;
`

const AnimatedTitleKeyframes = keyframes`
	0% { width: 0%; height: 0%; }
	0.01% { width: 0%; height: 100%; }
	100% { width: 100%; height: 100%; }
`
const AnimatedTitle = styled(HeaderTitleText)`
	animation-name: ${AnimatedTitleKeyframes};
	animation-duration: 1.5s;
	animation-delay: 3.8s;
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

	position: absolute;
	z-index: 1;
	top: 0;
	left: 0;
	height: 100vh;
	width: 100vw;

	background-color: black;
`

const BodyContainer = styled(Div)`
`
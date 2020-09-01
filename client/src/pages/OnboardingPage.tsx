import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { useDetectMobile } from '../libs/hooksLib'
import { Div, Button } from '../components/BaseComponents'
import { Header } from '../components/Header'
import { Transition } from 'react-transition-group'

import { useAppContext } from '../context/AppContext'
import { GenerateOnboardingComponent } from '../components/OnboardingComponents'
import { PostProtectOnboardCheck, PostProtectInviteCheck } from '../libs/apiLib'


export const OnboardingPage: React.FC = () => {

	let history = useHistory()
	const mobile: boolean = useDetectMobile()

	const duration: number = 400
	const [ animate, setAnimate ] = useState(false)
	const [ activeItem, setActiveItem ] = useState(1)

	type OnboardingItem = { id: number, type: string, buttons?: any, props?: any }
	const items: OnboardingItem[] = [
    { id: 1,
			type: 'username',
			buttons: {forward: 'Add Name', backward: ''},
			props: { title: 'Your Unique Username', placeholder: 'johnkauber' }
		},
    { id: 2, 
			type: 'name',
			buttons: {forward: 'Add Headline', backward: 'Edit Username'},
			props: { title: 'Your Name', placeholder: 'John Kauber' }
		},
		{ id: 3, 
			type: 'headline',
			buttons: {forward: 'Add Headshot', backward: 'Edit Name'},
			props: { title: 'Your One Liner', placeholder: 'John Kauber is a Security Engineer and Analyst passionate about protecting critical systems from threat of attack.' }
    },
    { id: 4, 
			type: 'headshot',
			buttons: {forward: 'Generate Profile', backward: 'Edit Headline'},
			props: { title: 'Your Headshot', placeholder: 'images/pg.jpg' }
		},
		{ id: 5,
			buttons: {forward: 'Go to Your Profile', backward: ''},
			type: 'done'
		}
	]
	
	useEffect(() => {

		// check if the user is invited
		PostProtectInviteCheck()
		.then(res => {
			if (!res.data) {
				history.push('/not-invited')
			}
		})
		.catch(err => console.log(err))

	}, [])

	const onBackClick = () => {
		setAnimate(true)
		setTimeout(() => {
			setActiveItem(activeItem - 1)
    }, duration-250)
    setTimeout(() => {
      setAnimate(false)
    }, duration)
	}

	const onForwardClick = () => {
		setAnimate(true)
		setTimeout(() => {
			setActiveItem(activeItem + 1)
    }, duration-250)
    setTimeout(() => {
      setAnimate(false)
    }, duration)
	}
	
  return (
    <PageContainer column width={12}>

      <Header title='Onboarding' />

			<BodyContainer column width={mobile ? 11 : 6}>

				<Transition row timeout={duration} in={animate}>
					{ state => (
						items.filter(item => item.id === activeItem).map(item => (
							<AnimationComponent state={state} duration={duration} key={item.id}>
								{GenerateOnboardingComponent(item, onForwardClick)}
							</AnimationComponent>
						))
					)}
				</Transition>

				<ButtonContainer row width={12}>
					{	(activeItem > 1) && (activeItem < items.length) &&
						<BackButton onClick={onBackClick}>
							{items[activeItem-1].buttons.backward}
						</BackButton>
					}
					{ (activeItem < items.length) &&
						<ForwardButton onClick={onForwardClick}>
							{items[activeItem-1].buttons.forward}
						</ForwardButton>
					}
				</ButtonContainer>
				
			</BodyContainer>

    </PageContainer>
  )
}

const PageContainer = styled(Div)`
	max-width: 100vw;
	height: ${window.innerHeight+"px"};
	align-items: center;
	position: relative;
`

const BodyContainer = styled(Div)`
	flex: 1;
	justify-content: center;
	padding-top: 51px;
`

const ButtonContainer = styled(Div)`
	margin-top: 60px;
	display: flex;
	position: relative;
	justify-content: space-between;
	max-width: 350px;
	@media (max-width: 768px) {
		margin: 0;
	}
`
const ForwardButton = styled(Button)`
  position: relative;
	@media (max-width: 768px) {
		position: absolute;
		bottom: 10px;
		right: 0px;
	}
`
const BackButton = styled(Button)`
	position: relative;
	background-color: white;
	color: black;
	border: 1px solid #000000;
	@media (max-width: 768px) {
		position: absolute;
		bottom: 10px;
		left: 0px;
	}
`


type AnimationComponentProps = { state: any, duration: number }
const AnimationComponent = styled.div<AnimationComponentProps>`
	width: 100%;
	transition: ${({ duration }) => duration}ms;
	
	@media (max-width: 768px) {
		margin: auto;
	}

	opacity: ${({ state }) => {
    switch (state) {
      case 'exited':
				return '1'
			default:
				return '0'
    }
  }};

	/* transform: ${({ state }) => {
    switch (state) {
      case 'entering':
        return 'translateX(-100vw)'
      case 'entered':
        return 'translateX(0px)'
      case 'exiting':
        return 'translateX(100vw)'
      case 'exited':
        return 'translateX(0px)'
    }
  }}; */
`

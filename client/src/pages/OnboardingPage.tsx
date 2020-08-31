import React, { useState, useEffect, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { useDetectMobile } from '../libs/hooksLib'
import { Div, Button } from '../components/BaseComponents'
import { Header } from '../components/Header'
import { Transition, CSSTransition, TransitionGroup } from 'react-transition-group'

import { useAppContext } from '../context/AppContext'
import { GenerateOnboardingComponent } from '../components/OnboardingComponents'
import { PostProtectOnboardCheck, PostProtectInviteCheck } from '../libs/apiLib'



export const OnboardingPage: React.FC = () => {

	let history = useHistory()
	const mobile: boolean = useDetectMobile()
	const { state, dispatch } = useAppContext()

	const duration: number = 500
	const [ animate, setAnimate ] = useState(false)
	const [ activeItem, setActiveItem ] = useState(1)

	type OnboardingItem = { id: number, type: string, props?: any }
	const items: OnboardingItem[] = [
    { id: 1,
			type: 'username',
			props: { title: 'Your Unique Username', placeholder: 'johnkauber' }
		},
    { id: 2, 
			type: 'name',
			props: { title: 'Your Name', placeholder: 'John Kauber' }
		},
		{ id: 3, 
			type: 'headline',
			props: { title: 'Your One Liner', placeholder: 'John Kauber is a Security Engineer and Analyst passionate about protecting critical systems from threat of attack.' }
    },
    { id: 4, 
			type: 'headshot',
			props: { title: 'Your Headshot', placeholder: 'images/05449456-c9c5-46a4-a42b-bde2c7de2e32.png' }
		},
    { id: 5,
			type: 'done'
		}
	]
	
	useEffect(() => {
		PostProtectOnboardCheck()
		.then(res => {
			console.log('response from onboard check:', res)
			if (res.data) {
				history.push(`/edit/${res.data.username}`)
			} else {
				PostProtectInviteCheck()
				.then(res => {
					if (!res.data) {
						history.push('/not-invited')
					}
				})
				.catch(err => console.log(err))
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

			<BodyContainer row width={mobile ? 11 : 6}>

				<Transition timeout={duration} in={animate}>
					{ state => (
						items.filter(item => item.id === activeItem).map(item => (
							<AnimationComponent state={state} duration={duration} key={item.id}>
								{GenerateOnboardingComponent(item)}
							</AnimationComponent>
						))
					)}
				</Transition>
				
			</BodyContainer>

			<ButtonContainer row width={mobile ? 11 : 6}>
				{	(activeItem > 1) && 
					<Button onClick={onBackClick}>
						backward
					</Button>
				}
				{	(activeItem < items.length) && 
					<Button onClick={onForwardClick}>
						forward
					</Button>
				}
			</ButtonContainer>

    </PageContainer>
  )
}

const PageContainer = styled(Div)`
	max-width: 100vw;
	min-height: 80vh;
	align-items: center;
	overflow: hidden;
	position: relative;
`

const BodyContainer = styled(Div)`
	flex: 1;
`

const ButtonContainer = styled(Div)`
	justify-content: space-between;
`


type AnimationComponentProps = { state: any, duration: number }
const AnimationComponent = styled.div<AnimationComponentProps>`
	width: 100%;
	transition: ${({ duration }) => duration}ms;
	
	opacity: ${({ state }) => {
    switch (state) {
      case 'exited':
				return '1'
			default:
				return '0'
    }
  }};

	transform: ${({ state }) => {
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
  }};
`

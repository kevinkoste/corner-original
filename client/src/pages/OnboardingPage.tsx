import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { useDetectMobile } from '../libs/hooksLib'
import { Div, Button } from '../components/BaseComponents'
import { Header } from '../components/Header'

import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { GenerateOnboardingComponent } from '../components/OnboardingComponents'
import { PostProtectOnboardCheck, PostProtectInviteCheck } from '../libs/apiLib'


export const OnboardingPage: React.FC = () => {

	let history = useHistory()
	const mobile: boolean = useDetectMobile()

	const [activeItem, setActiveItem] = useState(1)

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
			props: { title: 'Your Headshot', placeholder: 'images/05449456-c9c5-46a4-a42b-bde2c7de2e32.png' }
		},
		{ id: 5,
			buttons: {forward: 'Go to Your Profile', backward: ''},
			type: 'done'
		}
	]
	
	useEffect(() => {
		PostProtectOnboardCheck()
		.then(res => {
			if (res.data) {
				history.push(`/`)
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
	
  return (
    <PageContainer column width={12}>

      <Header title='Onboarding' />

			<BodyContainer row width={mobile ? 11 : 6}>

				<TransitionGroup>
					{items.filter(item => item.id === activeItem).map(item => (
						<CSSTransition key={item.id} timeout={100} >
							{GenerateOnboardingComponent(item)}
						</CSSTransition>
					))}
				</TransitionGroup>
				
			</BodyContainer>

			<ButtonContainer row width={12}>
				{	(activeItem > 1) && (activeItem < items.length) &&
					<BackButton onClick={() => setActiveItem(activeItem - 1) }>
						{items[activeItem-1].buttons.backward}
					</BackButton>
				}
				{ (activeItem < items.length) &&
					<ForwardButton onClick={() => setActiveItem(activeItem + 1) }>
						{items[activeItem-1].buttons.forward}
					</ForwardButton>
				}
			</ButtonContainer>

    </PageContainer>
  )
}

const PageContainer = styled(Div)`
	max-width: 100vw;
	align-items: center;
	overflow: hidden;
	position: relative;
`

const BodyContainer = styled(Div)`
`

const ButtonContainer = styled(Div)`
	/* justify-content: space-between; */
`
const ForwardButton = styled(Button)`
  position: absolute;
  bottom: 10px;
  right: 10px;
`
const BackButton = styled(Button)`
  position: absolute;
  bottom: 10px;
  left: 10px;
`
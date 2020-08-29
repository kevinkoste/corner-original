import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { useDetectMobile } from '../libs/hooksLib'
import { Div } from '../components/BaseComponents'
import { Header } from '../components/Header'

import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { GenerateOnboardingComponent } from '../components/OnboardingComponents'
import { PostProtectOnboardCheck, PostProtectInviteCheck } from '../libs/apiLib'


export const OnboardingPage: React.FC = () => {

	let history = useHistory()
	const mobile: boolean = useDetectMobile()

	const [activeItem, setActiveItem] = useState(1)

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
				{	(activeItem > 1) && 
					<button onClick={() => setActiveItem(activeItem - 1) }>
						backward
					</button>
				}
				{	(activeItem < items.length) && 
					<button onClick={() => setActiveItem(activeItem + 1) }>
						forward
					</button>
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
	justify-content: space-between;
`


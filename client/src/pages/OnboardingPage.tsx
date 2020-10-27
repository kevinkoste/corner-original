import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { useDetectMobile } from '../libs/hooks'
import { Div, Button } from '../components/Base'
import { Header } from '../components/Header'
import { Transition } from 'react-transition-group'

import { GenerateOnboardingComponent } from '../components/Onboarding'
import { PostProtectInviteCheck } from '../libs/api'

export const OnboardingPage: React.FC = () => {
  let history = useHistory()
  const mobile = useDetectMobile()

  const duration: number = 400
  const [animate, setAnimate] = useState(false)
  const [activeItem, setActiveItem] = useState(1)
  const [showButton, setShowButton] = useState(false)

  type OnboardingItem = { id: number; type: string; buttons?: any; props?: any }
  const items: OnboardingItem[] = [
    {
      id: 1,
      type: 'username',
      buttons: { forward: 'Add Name', backward: '' },
      props: { title: 'Your Unique Username', placeholder: 'johnkauber' },
    },
    {
      id: 2,
      type: 'name',
      buttons: { forward: 'Add Headline', backward: 'Edit Username' },
      props: { title: 'Your Name', placeholder: 'John Kauber' },
    },
    {
      id: 3,
      type: 'headline',
      buttons: { forward: 'Add Headshot', backward: 'Edit Name' },
      props: {
        title: 'Your One Liner',
        placeholder:
          'John Kauber is a Security Engineer and Analyst passionate about protecting critical systems from threat of attack.',
      },
    },
    {
      id: 4,
      type: 'headshot',
      buttons: { forward: 'Generate Profile', backward: 'Edit Headline' },
      props: { title: 'Your Headshot', placeholder: 'pg.jpg' },
    },
    {
      id: 5,
      type: 'done',
      buttons: { forward: 'Go to Your Profile', backward: '' },
    },
  ]

  useEffect(() => {
    const onMount = async () => {
      const res = await PostProtectInviteCheck()
      if (!res.data) {
        history.push('/not-invited')
      }

      // could also check to see if user has already onboarded and redirect
    }

    onMount()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onBackClick = () => {
    setAnimate(true)
    setTimeout(() => {
      setActiveItem(activeItem - 1)
    }, duration - 250)
    setTimeout(() => {
      setAnimate(false)
    }, duration)
  }

  const onForwardClick = () => {
    setAnimate(true)
    setTimeout(() => {
      setActiveItem(activeItem + 1)
      setShowButton(false)
    }, duration - 250)
    setTimeout(() => {
      setAnimate(false)
    }, duration)
  }

  return (
    <PageContainer column width={12}>
      <Header title="Onboarding" />

      <BodyContainer column width={mobile ? 11 : 6}>
        <Transition row timeout={duration} in={animate}>
          {(state) =>
            items
              .filter((item) => item.id === activeItem)
              .map((item) => (
                <AnimationComponent
                  state={state}
                  duration={duration}
                  key={item.id}
                >
                  {GenerateOnboardingComponent(
                    item,
                    onForwardClick,
                    setShowButton
                  )}
                </AnimationComponent>
              ))
          }
        </Transition>

        <ButtonContainer row width={12}>
          {activeItem > 1 && activeItem < items.length && (
            <BackButton onClick={onBackClick}>
              {items[activeItem - 1].buttons.backward}
            </BackButton>
          )}
          {activeItem < items.length && showButton && (
            <ForwardButton onClick={onForwardClick}>
              {items[activeItem - 1].buttons.forward}
            </ForwardButton>
          )}
        </ButtonContainer>
      </BodyContainer>
    </PageContainer>
  )
}
export default OnboardingPage

const PageContainer = styled(Div)`
  max-width: 100vw;
  height: ${window.innerHeight + 'px'};
  align-items: center;
  position: relative;
`

const BodyContainer = styled(Div)`
  flex: 1;
  justify-content: center;
  padding-top: 51px;
  max-width: 1150px;
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

type AnimationComponentProps = { state: any; duration: number }
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
`

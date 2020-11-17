import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { CSSTransition } from 'react-transition-group'

import { useMobile } from '../libs/hooks'
import { Div, HoverButton, HoverButtonContainer } from '../components/Base'

import { Profile } from '../models/Profile'
import { PostProtectFollow } from '../libs/api'

type ProfileModalProps = { profile: Profile }
export const ProfileModal: React.FC<ProfileModalProps> = ({ profile }) => {
  const mobile = useMobile()

  const [showing, setShowing] = useState<boolean>(false)

  const wrapperRef = useRef(null)
  useOutsideAlerter(wrapperRef, setShowing)

  return (
    <BodyContainer column width={mobile ? 11 : 10}>
      {showing && (
        <HoverButtonContainer row width={12} ref={wrapperRef}>
          <HoverButton onClick={() => setShowing(false)}>Done</HoverButton>
        </HoverButtonContainer>
      )}

      {!showing && (
        <HoverButtonContainer row width={12}>
          <HoverButton onClick={() => setShowing(true)}>Social</HoverButton>
        </HoverButtonContainer>
      )}

      <Buttons inProp={showing} profile={profile} />
    </BodyContainer>
  )
}

type ButtonsProps = { inProp: any; profile: Profile }
const Buttons: React.FC<ButtonsProps> = ({ inProp, profile }) => {
  const onFollowClick = () => {
    PostProtectFollow(profile.username)
  }

  const onEndorseClick = () => {}
  return (
    <CSSTransition
      unmountOnExit
      in={inProp}
      classNames="fade"
      timeout={{ appear: 0, enter: 500, exit: 500 }}
      appear
    >
      <TransitionContainer>
        <FollowButton onClick={onFollowClick}>
          Follow{' '}
          {
            profile.components
              .find((component) => component.type === 'name')
              ?.props.name.split(' ')[0]
          }
        </FollowButton>

        <EndorseButton onClick={onEndorseClick}>
          Add{' '}
          {
            profile.components
              .find((component) => component.type === 'name')
              ?.props.name.split(' ')[0]
          }{' '}
          to Your Corner
        </EndorseButton>
      </TransitionContainer>
    </CSSTransition>
  )
}

const BodyContainer = styled(Div)`
  max-width: 1300px;
`

const TransitionContainer = styled(Div)`
  transition: opacity 0.5s;

  /* enter from */
  &.fade-enter {
    opacity: 0;
  }

  /* enter to */
  &.fade-enter-active {
    opacity: 1;
  }

  /* exit from */
  &.fade-exit {
    opacity: 1;
  }

  /* exit to  */
  &.fade-exit-active {
    opacity: 0;
  }
`

const EndorseButton = styled(HoverButton)`
  bottom: 63px;
  color: black;
  background-color: white;
  border: 1px solid black;
`

const FollowButton = styled(EndorseButton)`
  position: fixed;
  bottom: 116px;
`

const useOutsideAlerter = (ref: any, setShowing: any) => {
  useEffect(() => {
    // Alert if clicked on outside of element
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowing(false)
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('scroll', handleClickOutside, true)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', handleClickOutside, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref])
}

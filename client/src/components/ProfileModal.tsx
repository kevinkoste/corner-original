import React, { useState, useRef, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { useDetectMobile } from '../libs/hooksLib'
import { Div, H1, H2, Button, TextArea } from '../components/BaseComponents'

import { Profile } from '../models/Profile'
import { useAppContext, setAuth } from '../context/AppContext'
import { CSSTransition } from 'react-transition-group';


function useOutsideAlerter(ref: any, setShowing: any) {
  useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event: any) {
          if (ref.current && !ref.current.contains(event.target)) {
              setShowing(false)
          }
      }

      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener('scroll', handleClickOutside, true);
      return () => {
          // Unbind the event listener on clean up
          document.removeEventListener("mousedown", handleClickOutside);
          window.removeEventListener('scroll', handleClickOutside, true);
      };
  }, [ref]);
}

type ProfileModalProps = { profile: Profile }
export const ProfileModal: React.FC<ProfileModalProps> = ({ profile }) => {

  let history = useHistory()
	const mobile: boolean = useDetectMobile()

  const [ showing, setShowing ] = useState<boolean>(false)

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, setShowing);
  return (
    <BodyContainer column width={mobile ? 11 : 10}>
      
      {showing && 
      <ButtonContainer row width={12} ref={wrapperRef}>
        <ModalButton onClick={() => setShowing(false)} >
          Done
        </ModalButton>
      </ButtonContainer>
      }

      {!showing && 
      <ButtonContainer row width={12}>
        <ModalButton onClick={() => setShowing(true)} >
          Social
        </ModalButton>
      </ButtonContainer>
      }

      <Buttons inProp={showing} profile={profile} />

      {/* <CSSTransition in={this.showing} timeout={1000} classNames="fadeOut" unmountOnExit={true}><Div>
      <FollowButton onClick={onFollowClick} >
        Follow {profile.components.find(component => component.type === 'name')?.props.name.split(' ')[0]}
      </FollowButton>

      <EndorseButton onClick={onEndorseClick} >
        Add {profile.components.find(component => component.type === 'name')?.props.name.split(' ')[0]} to Your Corner
      </EndorseButton>
      </Div></CSSTransition> */}
    </BodyContainer>
  )
}

type ButtonsProps = {inProp: any, profile: Profile}
const Buttons: React.FC<ButtonsProps> = ({inProp, profile}) => {
  const onFollowClick = () => {

  }

  const onEndorseClick = () => {

  }
  return (
    <CSSTransition       
      unmountOnExit
      in={inProp}
      classNames="fade"
      timeout={{ appear: 0, enter: 500, exit: 500 }}
      appear>
      <TransitionContainer>
        <FollowButton onClick={onFollowClick} >
          Follow {profile.components.find(component => component.type === 'name')?.props.name.split(' ')[0]}
        </FollowButton>

        <EndorseButton onClick={onEndorseClick} >
          Add {profile.components.find(component => component.type === 'name')?.props.name.split(' ')[0]} to Your Corner
        </EndorseButton>
      </TransitionContainer>
    </CSSTransition>
  )
}



const ButtonContainer = styled(Div)`
  display: flex;
  position: relative;
  justify-content: space-between;
  max-width: 350px;
  @media (max-width: 768px) {
    margin: 0;
  }
`

const TransitionContainer = styled(Div)`
  transition: opacity .5s;

  // enter from
  &.fade-enter {
    opacity: 0;
  }

  // enter to
  &.fade-enter-active {
    opacity: 1;
  }

  // exit from
  &.fade-exit {
    opacity: 1;
  }

  // exit to 
  &.fade-exit-active {
    opacity: 0;
  }
  
`

const ModalButton = styled(Button)`
  position: fixed;
  bottom: 10px;
  right: 8.34vw;
  @media (max-width: 768px) {
    right: 4.17vw;
  }
  @media (min-width: 1560px) {
    right: ${parseInt(((window.innerWidth-1300)*0.5).toString(),10) + "px"}
  }
`

const EndorseButton = styled(Button)`
  position: fixed;
  bottom: 63px;
  right: 8.34vw;
  color: black;
  background-color: white;
  border: 1px solid black;
  @media (max-width: 768px) {
    right: 4.17vw;
  }
  @media (min-width: 1560px) {
    right: ${parseInt(((window.innerWidth-1300)*0.5).toString(),10) + "px"}
  }
`

const FollowButton = styled(EndorseButton)`
  position: fixed;
  bottom: 116px;
`

const BodyContainer = styled(Div)`
	padding-top: 51px;
	max-width: 1300px;
`
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { useDetectMobile } from '../libs/hooksLib'
import { Div, H1, H2, Button, TextArea } from '../components/BaseComponents'
import ExitIcon from '../icons/bigdelete.svg'

import { Profile } from '../models/Profile'
import { useAppContext, setAuth } from '../context/AppContext'


type ProfileModalProps = { profile: Profile }
export const ProfileModal: React.FC<ProfileModalProps> = ({ profile }) => {

  let history = useHistory()
	const mobile: boolean = useDetectMobile()

  const { state, dispatch } = useAppContext()
  const [ showing, setShowing ] = useState<boolean>(false)


  const onFollowClick = () => {

  }

  const onEndorseClick = () => {

  }


  if (!showing) {
    return (
      <ButtonContainer row width={12}>
        <ModalButton onClick={() => setShowing(true)} >
          Options!
        </ModalButton>
      </ButtonContainer>
    )
  } else {
    return (
      <BurgerMenu>

				<HeaderContainer row width={mobile ? 11 : 10} style={{borderBottom: '1px solid black'}}>
					<HeaderTitleText>
            {profile.components.find(component => component.type === 'name')?.props.name}'s Profile
					</HeaderTitleText>
					<ExitButton onClick={() => setShowing(false)} src={ExitIcon} />
				</HeaderContainer>

				<BodyContainer column width={mobile ? 11 : 10}>

          <FollowButton onClick={onFollowClick} >
            Follow {profile.components.find(component => component.type === 'name')?.props.name.split(' ')[0]}
          </FollowButton>

          <FollowButton onClick={onEndorseClick} >
            Endorse {profile.components.find(component => component.type === 'name')?.props.name.split(' ')[0]}
          </FollowButton>

				</BodyContainer>

			</BurgerMenu>
    )
  }
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

const FollowButton = styled(Button)`
  /* position: fixed;
  bottom: 10px;
  right: 8.34vw; */
  @media (max-width: 768px) {
    right: 4.17vw;
  }
  @media (min-width: 1560px) {
    right: ${parseInt(((window.innerWidth-1300)*0.5).toString(),10) + "px"}
  }
`

const HeaderContainer = styled(Div)`
	position: fixed;
	align-items: center;
	/* justify-content: stretch; */
	background-color: white;
	z-index: 1;
	
	padding-top: 15px;
	padding-bottom: 5px;
	border-bottom: 1px solid black;
	max-width: 1300px;
`

const HeaderTitleText = styled(H1)`
	overflow: hidden;
	white-space: nowrap;
	margin: unset;
	font-size: 24px;
`

const ExitButton = styled.img`
	position: absolute;
	z-index: 2;
	right: 0;
	height: 25px;
	width: 25px;
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
  background-color: white;
`

const BodyContainer = styled(Div)`
	padding-top: 51px;
	max-width: 1300px;
`
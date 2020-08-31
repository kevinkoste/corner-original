import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { Div, H1, H2, Button } from '../components/BaseComponents'
import { Header } from '../components/Header'

import { useDetectMobile } from '../libs/hooksLib'
import { useAppContext } from '../context/AppContext'


export const HomePage: React.FC = () => {

  let history = useHistory()
	const mobile: boolean = useDetectMobile()
	const { state, dispatch } = useAppContext()

	const onClick = () => {
    history.push('/login')
	}
  
  useEffect(() => {
    if (state.auth) {
      history.push('/browse')
    }
  }, [])

  return (
    <PageContainer column width={12}>

      <Header title='Home' />

      <BodyContainer column width={mobile ? 11 : 6}>
        <TitleText>
          Welcome to Your Corner of the Internet
        </TitleText>

        <SubtitleText>
        Corner is a platform to meet young people with big ideas. It’s part website builder, part professional network, and part portfolio site.
        </SubtitleText>

        <LoginButton onClick={onClick} >
          Join Corner
        </LoginButton>

      </BodyContainer>

    </PageContainer>
  )
}

const PageContainer = styled(Div)`
  max-width: 100vw;
  height: ${window.innerHeight+"px"};
	align-items: center;
	overflow: hidden;
  position: relative;
`

const BodyContainer = styled(Div)`
  align-items: left;
  margin: auto;
  text-align: left;
  max-width: 580px;
`

const TitleText = styled(H1)`
  font-size: 32px;
`

const SubtitleText = styled(H2)`
  margin-top: 8px;
`

const LoginButton = styled(Button)`
  margin-top: 20px;
  align-self: flex-start;
`
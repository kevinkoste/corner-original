import React from 'react'
import styled from 'styled-components'

import { Div, H1, H2 } from '../components/BaseComponents'
import { Header } from '../components/Header'

import { useAppContext } from '../context/AppContext'
import { useDetectMobile } from '../libs/hooksLib'


export const HomePage: React.FC = () => {

	const mobile: boolean = useDetectMobile()
  const { dispatch } = useAppContext()
	
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
      </BodyContainer>

    </PageContainer>
  )
}

const PageContainer = styled(Div)`
  max-width: 100vw;
  height: 100vh;
	align-items: center;
	overflow: hidden;
  position: relative;
`

const BodyContainer = styled(Div)`
  flex: 1;
  justify-content: center;
`

const TitleText = styled(H1)`
  font-size: 32px;
`

const SubtitleText = styled(H2)`
  margin-top: 8px;
`

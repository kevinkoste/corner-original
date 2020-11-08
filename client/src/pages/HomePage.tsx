import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import {
  PageContainer,
  BodyContainer,
  H1,
  H2,
  Button,
} from '../components/Base'
import { Header } from '../components/Header'

import { useMobile } from '../libs/hooks'
import { useAppContext } from '../context/AppContext'

export const HomePage: React.FC = () => {
  let history = useHistory()
  const mobile = useMobile()
  const { state } = useAppContext()

  const onClick = () => {
    history.push('/login')
  }

  useEffect(() => {
    if (state.auth) {
      history.push('/browse')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <PageContainer column width={12}>
      <Header title="Home" />

      <BodyContainer column width={mobile ? 11 : 6} style={{ margin: 'auto' }}>
        <TitleText>Welcome to Your Corner of the Internet</TitleText>

        <SubtitleText>
          Corner is a platform to meet young people with big ideas. It’s part
          website builder, part professional network, and part portfolio site.
        </SubtitleText>

        <LoginButton onClick={onClick}>Join Corner</LoginButton>
      </BodyContainer>
    </PageContainer>
  )
}

export default HomePage

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

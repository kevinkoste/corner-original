import React from 'react'
import styled from 'styled-components'

// presentation
import { useDetectMobile } from '../libs/hooks'
import { Div, H1 } from '../components/Base'
import { Header } from '../components/Header'

export const NotInvitedPage: React.FC = () => {
  const mobile = useDetectMobile()

  return (
    <PageContainer column width={12}>
      <Header title={'Profile Not Found'} />

      <NotFoundContainer column width={mobile ? 11 : 6}>
        <H1>
          Sorry, you have not been invited! Ask a friend on Corner for an
          invite.
        </H1>
      </NotFoundContainer>
    </PageContainer>
  )
}
export default NotInvitedPage

const PageContainer = styled(Div)`
  max-width: 100vw;
  height: ${window.innerHeight + 'px'};
  align-items: center;
  position: relative;
`

// const BodyContainer = styled(Div)`
//   padding-top: 51px;
//   max-width: 1150px;
// `

const NotFoundContainer = styled(Div)`
  flex: 1;
  justify-content: center;
`

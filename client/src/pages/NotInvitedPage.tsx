import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import styled from 'styled-components'

// presentation
import { useDetectMobile } from '../libs/hooksLib'
import { Div, H1 } from '../components/BaseComponents'
import { Header } from '../components/Header'


export const NotInvitedPage: React.FC = () => {

  const mobile: boolean = useDetectMobile()

  return (
    <PageContainer column width={12}>

      <Header title={'Profile Not Found'} />

      <NotFoundContainer column width={mobile ? 11 : 6}>
        <H1>
          Sorry, you have not been invited! Ask a friend on Corner for an invite.
        </H1>
      </NotFoundContainer>

    </PageContainer>
  )

}

const PageContainer = styled(Div)`
  max-width: 100vw;
  min-height: 100vh;
	align-items: center;
	overflow: hidden;
	position: relative;
`

const BodyContainer = styled(Div)`
`

const NotFoundContainer = styled(Div)`
  flex: 1;
  justify-content: center;
`


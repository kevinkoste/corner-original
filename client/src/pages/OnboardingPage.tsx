import React, { useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import styled from 'styled-components'

import { useProfileContext } from '../context/ProfileContext'
import { Div } from '../components/BaseComponents'
import { HomeHeader } from '../components/HomeHeader'
import { PostProtectProfileUpdate } from '../libs/apiLib'


export const OnboardingPage: React.FC = () => {

	const { state, dispatch } = useProfileContext()
	
	useEffect(() => {

			// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	
  return (
    <PageContainer column width={12}>

      <HomeHeader />

    </PageContainer>
  )
}

const PageContainer = styled(Div)`
	max-width: 100vw;
	align-items: center;
	overflow: hidden;
	position: relative;
`


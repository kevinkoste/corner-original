import React, { useEffect } from 'react'
import styled from 'styled-components'

import { Div } from '../components/BaseComponents'
import { HomeHeader } from '../components/HomeHeader'

import { useProfileContext } from '../context/ProfileContext'

export const LoginPage: React.FC = () => {

  const { state, dispatch } = useProfileContext()


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


import React from 'react'
import styled from 'styled-components'

import { Div } from '../components/BaseComponents'
import { useDetectMobile } from '../libs/hooksLib'
import { GenerateComponent } from '../components/ProfileItems'
import { useProfileContext } from '../context/ProfileContext'


export const ProfileBody: React.FC = () => {

	const mobile: boolean = useDetectMobile()
	const { state } = useProfileContext()

	return (
		<BodyContainer column width={mobile ? 11 : 6}>

			{state.profile.data.map(item => GenerateComponent(item))}
				
		</BodyContainer>
	)
}

const BodyContainer = styled(Div)`
`

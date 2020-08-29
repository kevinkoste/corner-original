import React from 'react'
import styled, { keyframes } from 'styled-components'

import { Div, H1 } from './BaseComponents'
import { useDetectMobile } from '../libs/hooksLib'

type HeaderProps = { title: string }
export const Header: React.FC<HeaderProps> = ({ title }) => {

	const mobile: boolean = useDetectMobile()

	return (
		<HeaderContainer row width={mobile ? 11 : 6}>

			<AnimatedName>
				{title}
			</AnimatedName>

			<AnimatedTitle>
				Corner
			</AnimatedTitle>

		</HeaderContainer>
	)
}

const HeaderContainer = styled(Div)`
	align-items: center;
	justify-content: flex-start;
	
	margin-top: 20px;
	padding-bottom: 5px;
	border-bottom: 1px solid black;
`

const HeaderTitleText = styled(H1)`
	overflow: hidden;
	white-space: nowrap;
	margin: unset;

	font-size: 24px;
`

const AnimatedNameKeyframes = keyframes`
	0% { width: 0%; height: 0%; }
	0.01% { width: 0%; height: 100%; }
	50% { width: 100%; height: 100%; }
	99.99% { width: 0%; height: 100%; }
	100% { width: 0%; height: 0%; }
`
const AnimatedName = styled(HeaderTitleText)`
	animation-name: ${AnimatedNameKeyframes};
	animation-duration: 3s;
	animation-delay: 1s;
	animation-timing-function: steps(30, end);
	animation-fill-mode: both;
`

const AnimatedTitleKeyframes = keyframes`
	0% { width: 0%; height: 0%; }
	0.01% { width: 0%; height: 100%; }
	100% { width: 100%; height: 100%; }
`
const AnimatedTitle = styled(HeaderTitleText)`
	animation-name: ${AnimatedTitleKeyframes};
	animation-duration: 1.5s;
	animation-delay: 4s;
	animation-timing-function: steps(30, end);
	animation-fill-mode: both;
`

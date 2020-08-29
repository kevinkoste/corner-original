import React from 'react'
import styled from 'styled-components'

import { Div, H1, H2, Img } from './BaseComponents'
import { HeadlineComponent, BioComponent, HeadshotComponent, ArticleComponent } from '../models/Profile'


export const Headline: React.FC<HeadlineComponent> = ({ id, type, props }) => {
	return (
		<HeadlineText>
			{props.headline}
		</HeadlineText>
	)
}

export const Bio: React.FC<BioComponent> = ({ id, type, props }) => {
	return (
		<BioText>
			{props.bio}
		</BioText>
	)
}

export const Headshot: React.FC<HeadshotComponent> = ({ id, type, props }) => {
	return (
		<ProfileImage size={12} src={props.image} />
	)
}

export const Article: React.FC<ArticleComponent> = ({ id, type, props }) => {
	return (
		<BioText>
			{props.title}
		</BioText>
	)
}



const HeadlineText = styled(H1)`
	margin-top: 20px;
`

const BioText = styled(H2)`
	margin-top: 20px;
`

const ProfileImage = styled(Img)`
	margin-top: 20px;
` 


// GenerateComponent takes JSON {id, component, props},
// then generates a component from the Components map above
// also, the id and key are injected as props to each component
type ComponentIndex = {
	[index: string]: any
}
const Components: ComponentIndex  = {
	headline: Headline,
  bio: Bio,
  headshot: Headshot,
  article: Article
}

export const GenerateComponent = (component: any) => {
  // component exists
  if (typeof Components[component.type] !== 'undefined') {
		return React.createElement(Components[component.type], {...component?.props, id: component.id, key: component.id} )
	}
	// component does not exist
  return <React.Fragment key={component.id} />
}
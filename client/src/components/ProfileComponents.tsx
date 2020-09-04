import React from 'react'
import styled from 'styled-components'

import { Div, H1, H2, Img } from './BaseComponents'
import { Component, HeadlineComponent, BioComponent, HeadshotComponent, ArticleComponent, Profile, ExperiencesComponent } from '../models/Profile'
import { useDetectMobile } from '../libs/hooksLib'
import { ExperienceRow } from './EditProfileComponents'
import { PublicBookshelf } from '../components/ProfileBookshelf'


export const Headline: React.FC<HeadlineComponent> = ({ id, props }) => {
	return (
			<ComponentContainer>
				<HeadlineText>
					{props.headline}
				</HeadlineText>
			</ComponentContainer>
	)
}

type BioProps = { id: string, type: string, props: any, profile: Profile }
export const Bio: React.FC<BioProps> = ({ id, props, profile }) => {
	console.log("`" + props.bio + "`")
	if (props.bio !== '') {
		return (
				<ComponentContainer column width={12}>
					<H1>
						About {profile.components.find(comp => comp.type === 'name')?.props.name.split(' ')[0]}
					</H1>
					<BioText>
						{props.bio}
					</BioText>
				</ComponentContainer>
		)
	} 
	else {
		return (
			<span></span>
		)
	}
}

export const Headshot: React.FC<HeadshotComponent> = ({ id, props }) => {
	const mobile: boolean = useDetectMobile()
	return (
			<ProfileImage size={mobile ? 12 : 10} style={{marginTop:''}} src={props.image} />
	)
}

export const Experiences: React.FC<ExperiencesComponent> = ({ id, props }) => {
	const mobile: boolean = useDetectMobile()
	if (props.experiences.length !== 0) {
		return (
			<ComponentContainer column width={12}>
				<H1>
					Experiences
				</H1>

				{ props.experiences.map((exp: any, idx: number) => 
					<ExperienceRow
						key={idx}
						experience={exp}
					/>
				)}

			</ComponentContainer>
		)
	}
	else {
		return (
			<span></span>
		)
	}
}

export const Article: React.FC<ArticleComponent> = ({ id, props }) => {
	return (
		<BioText>
			{props.title}
		</BioText>
	)
}


const HeadlineText = styled(H1)`
	margin-bottom: 15px;
	margin-top: 20px;
`

const BioText = styled(H2)`
	margin-top: 10px;
	margin-bottom: 15px;
`

const ProfileImage = styled(Img)`
	margin-top: 20px;
	flex-direction: column;
` 

const ComponentContainer = styled(Div)`
	margin-bottom: 30px;
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
	article: Article,
	experiences: Experiences,
	bookshelf: PublicBookshelf
}

export const GenerateComponent = (component: Component, profile: any) => {
  // component exists
  if (typeof Components[component.type] !== 'undefined') {		
		return React.createElement(Components[component.type], {
			...component,
			key:component.id,
			profile: profile
		})
	}
	// component does not exist
  return <React.Fragment key={component.id} />
}
import React, { useState } from 'react'
import styled from 'styled-components'

// presentation/types
import { Div, H1, H2, Img, TextArea } from './BaseComponents'
import {
	Component,
	HeadlineComponent,
	BioComponent,
	HeadshotComponent,
	ArticleComponent
} from '../models/Profile'

// logic
import { useProfileContext, updateComponent } from '../context/ProfileContext'
import axios from '../libs/axiosLib'


export const Headline: React.FC<HeadlineComponent> = ({ id, props }) => {

	const { profileState, profileDispatch } = useProfileContext()

	const [textInput, setTextInput] = useState<string>(props.headline)

	const handleClickAway = () => {
		profileDispatch(updateComponent({
			id: id,
			type: 'headline',
			props: {
				headline: textInput
			}
		}))
	}

	if (!profileState.editing) {
		return (
			<HeadlineText>
				{textInput}
			</HeadlineText>
		)
	} else {
		return (
			<HeadlineTextArea
				onBlur={handleClickAway}
				onChange={(event: any) => setTextInput(event.target.value)}
				value={textInput}
			/>
		)
	}
}

export const Bio: React.FC<BioComponent> = ({ id, props }) => {

  const { profileState, profileDispatch } = useProfileContext()

	const [textInput, setTextInput] = useState<string>(props.bio)

	const handleClickAway = () => {
		profileDispatch(updateComponent({
			id: id,
			type: 'headline',
			props: {
				bio: textInput
			}
		}))
	}
	
	if (!profileState.editing) {
		return (
			<BioText>
				{textInput}
			</BioText>
		)
	} else {
		return (
			<BioTextArea
				onBlur={handleClickAway}
				onChange={(event: any) => setTextInput(event.target.value)}
				value={textInput}
			/>
		)
	}
}

export const Headshot: React.FC<HeadshotComponent> = ({ id, props }) => {

  const { profileState, profileDispatch } = useProfileContext()

	const [uploading, setUploading] = useState(false)

	const handleFileUpload = (event: any) => {
		setUploading(true)
		const formData = new FormData()
		formData.append('file', event.target.files[0])
		axios
			.post(`/profile/upload-image`, formData, {
				headers: { 'Content-Type': 'multipart/form-data' }
			})
			.then(res => {
				profileDispatch(updateComponent({
					id: id,
					type: 'headshot',
					props: {
						image: res.data.image
					}
				}))
				setUploading(false)
			}).catch(err => {
				setUploading(false)
			})
	}
	
	if (uploading) {
		return (
			<Div column width={12} style={{height:'300px', backgroundColor:'black'}}>
				<H1>
					This is the spinner
				</H1>
			</Div>
		)
	} else {
		return (
			<ProfileImage size={12} src={props.image}>

				{ (profileState.editing) &&
					<ProfileImageUploadTopWrapper>
						<ProfileImageUploadWrapper>
							Choose Photo
							<ProfileImageUploadInput
								type='file'
								onChange={handleFileUpload}
							/>
						</ProfileImageUploadWrapper>
					</ProfileImageUploadTopWrapper>
				}

			</ProfileImage>
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
	margin-top: 20px;
`

const HeadlineTextArea = styled(TextArea)`
	font-size: 30px;
	margin-top: 20px;

	outline: 1px solid red;
	outline-style: dashed;
  outline-offset: 5px;
`

const BioText = styled(H2)`
	margin-top: 20px;
`

const BioTextArea = styled(TextArea)`
	font-family: helvetica;
	font-size: 14px;
	margin-top: 20px;

	outline: 1px solid red;
	outline-style: dashed;
  outline-offset: 5px;
`

const ProfileImage = styled(Img)`
	margin-top: 20px;
` 

const ProfileImageUploadInput = styled.input`
	display: none;
	width: unset;
`

const ProfileImageUploadTopWrapper = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
  transform: translate(0%,-50%);
`

const ProfileImageUploadWrapper = styled.label`
	position: relative;
	left: -50%;
	text-align: center;
	width: unset;

	border: none;
  padding: 0;
  margin: 0;
  text-decoration: none;

  font-family: 'inter';
  font-size: 16px;

  background-color: black;
  color: white;
  padding: 10px 20px 12px 20px;
  cursor: pointer;
  border-radius: 30px;
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

export const GenerateEditComponent = (component: Component) => {
  // component exists
  if (typeof Components[component.type] !== 'undefined') {		
		return React.createElement(Components[component.type], {...component, key:component.id} )
	}
	// component does not exist
  return <React.Fragment key={component.id} />
}
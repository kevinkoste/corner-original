import React, { useState } from 'react'
import styled from 'styled-components'

import { useProfileContext, updateComponent } from '../context/ProfileContext'
import { Div, H1, H2, Img, TextArea } from '../components/BaseComponents'
import { Component, HeadlineProps, BioProps, ImageProps, ArticleProps } from '../models/Profile'
import axios from '../libs/axiosLib'


export const Headline: React.FC<HeadlineProps> = ({ id, headline }) => {

	const { state, dispatch } = useProfileContext()

	const [textInput, setTextInput] = useState<string>(headline)

	const handleClickAway = () => {
		dispatch(updateComponent(id, { headline: textInput }))
	}

	if (!state.editing) {
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

export const Bio: React.FC<BioProps> = ({ id, bio }) => {

	const { state, dispatch } = useProfileContext()

	const [textInput, setTextInput] = useState<string>(bio)

	const handleClickAway = () => {
		dispatch(updateComponent(id, { bio: textInput }))
	}
	
	if (!state.editing) {
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

export const Image: React.FC<ImageProps> = ({ id, image }) => {

	const { state, dispatch } = useProfileContext()

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
				dispatch(updateComponent(id, { image: res.data.image }))
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
	} else if (!state.editing) {
		return (
			<ProfileImage size={12} src={image} />
		)
	} else {
		return (
			<ProfileImageUpload size={12} src={image}>

				<ProfileImageUploadInput
					type='file'
					onChange={handleFileUpload}
				/>

			</ProfileImageUpload>
		)
	}
}

export const Article: React.FC<ArticleProps> = ({ id, source, title, subtitle, date, link }) => {

	return (
		<BioText>
			{title}
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

const ProfileImageUpload = styled(Img)`
	margin-top: 20px;
	filter: blur(2px);

	justify-content: center;
	align-items: center;
` 

const ProfileImageUploadInput = styled.input`
`

const HeadlineTextArea = styled(TextArea)`
	font-family: 'glypha';
	font-size: 30px;
	margin-top: 20px;

	outline: 1px solid red;
	outline-style: dashed;
  outline-offset: 5px;
`

const BioTextArea = styled(TextArea)`
	font-family: helvetica;
	font-size: 14px;
	margin-top: 20px;

	outline: 1px solid red;
	outline-style: dashed;
  outline-offset: 5px;
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
  image: Image,
  article: Article
}
export const GenerateComponent = (item: Component, props?: any) => {
  // component exists
  if (typeof Components[item.component] !== 'undefined') {
		return React.createElement(Components[item.component], {...item.props, id: item.id, key: item.id, ...props} )
	}
	// component does not exist
  return <React.Fragment key={item.id} />
}
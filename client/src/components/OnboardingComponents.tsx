import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useHistory } from "react-router-dom"

import { useDetectMobile } from '../libs/hooksLib'
import { useOnboardingContext, updateUsername, updateComponent } from '../context/OnboardingContext'
import { Div, H1, H2, TextArea, Img, Button } from './BaseComponents'
import { v4 as uuidv4 } from 'uuid'

import { PostProtectProfileImage, GetPublicUsernameAvailability, PostProtectProfile } from '../libs/apiLib'

import { NameComponent, HeadlineComponent, HeadshotComponent } from '../models/Profile'

// USERNAME //
type OnboardingUsernameProps = { id: number, title: string, placeholder: string }
export const OnboardingUsername: React.FC<OnboardingUsernameProps> = ({ id, title, placeholder }) => {

	const { onboardingState, onboardingDispatch } = useOnboardingContext()
	const [ username, setUsername ] = useState<string>(placeholder)
	const [ available, setAvailable ] = useState<boolean>(true)

	useEffect(() => {
		// if returning to component, populate input
		const username = onboardingState.profile.username
		if (username !== "") {
			setUsername(username)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// checks availability on a timeout
	useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
			if (username !== "" && username !== placeholder) {
				GetPublicUsernameAvailability(username)
				.then(res => {
					console.log(res)
					setAvailable(res.data)
				})
				.catch(err => console.log(err))
			}
		}, 750)
		return () => clearTimeout(delayDebounceFn)
		// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username])

	// clear the placeholder on initial click
	const onClick = () => {
		if (username === placeholder) {
			setUsername("")
		}
	}

	// dispatch the updated text to OnboardingContext state
	const onBlur = () => {
		onboardingDispatch(updateUsername(username))
	}

	const onChange = (event: any) => {
		setUsername(event.target.value)
	}

	return (
		<OnboardingScreenContainer column width={12}>
			<OnboardingTitleText>
				{title}
			</OnboardingTitleText>
			<OnboardingTextArea
				onClick={onClick}
				onChange={onChange}
				onBlur={onBlur}
				value={username}
			/>
			{(!available) &&
				<H2>
					That username is taken, loser!
				</H2>
			}
		</OnboardingScreenContainer>
	)
}

// NAME //
type OnboardingNameProps = { title: string, placeholder: string }
export const OnboardingName: React.FC<OnboardingNameProps> = ({ title, placeholder }) => {

	const { onboardingState, onboardingDispatch } = useOnboardingContext()
	// component.props.name is basically our "textInput"
	const [ component, setComponent ] = useState<NameComponent>({
		id: uuidv4().toString(),
		type: 'name',
		props: {
			name: placeholder
		}
	})

	// if returning to component, populate input
	useEffect(() => {
		const foundComponent = onboardingState.profile.components.find(component => component.type === 'name')
		if (foundComponent) {
			// @ts-ignore
			const name = foundComponent.props.name
			if (name !== "") {
				setComponent({...component, props: {...component.props, name: name } })
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// clear the placeholder on initial click
	const onClick = () => {
		if (component.props.name === placeholder) {
			setComponent({...component, props: {...component.props, name: "" } })
		}
	}

	// dispatch the updated text to OnboardingContext state
	const onBlur = () => {
		console.log('dispatching new name component:', component)
		onboardingDispatch(updateComponent(component))
	}

	// updates textinput (text that is displayed) and component
	const onChange = (event: any) => {
		setComponent({...component, props: {...component.props, name: event.target.value } })
	}

	return (
		<OnboardingScreenContainer column width={12}>
			<OnboardingTitleText>
				{title}
			</OnboardingTitleText>
			<OnboardingTextArea
				onClick={onClick}
				onChange={onChange}
				onBlur={onBlur}
				value={component.props.name}
			/>
		</OnboardingScreenContainer>
	)
}

// HEADLINE //
type OnboardingHeadlineProps = { title: string, placeholder: string }
export const OnboardingHeadline: React.FC<OnboardingHeadlineProps> = ({ title, placeholder }) => {

	const { onboardingState, onboardingDispatch } = useOnboardingContext()

	// component.props.headline is basically our "textInput"
	const [ component, setComponent ] = useState<HeadlineComponent>({
		id: uuidv4().toString(),
		type: 'headline',
		props: {
			headline: placeholder
		}
	})

	// if returning to component, populate input
	useEffect(() => {
		const foundComponent = onboardingState.profile.components.find(component => component.type === 'headline')
		if (foundComponent) {
			// @ts-ignore
			const headline = foundComponent.props.headline
			if (headline !== "") {
				setComponent({...component, props: {...component.props, headline: headline } })
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// clear the placeholder on initial click
	const onClick = () => {
		if (component.props.headline === placeholder) {
			setComponent({...component, props: {...component.props, headline: "" } })
		}
	}

	// dispatch the updated text to OnboardingContext state
	const onBlur = () => {
		onboardingDispatch(updateComponent(component))
	}

	// updates textinput (text that is displayed) and component
	const onChange = (event: any) => {
		setComponent({...component, props: {...component.props, headline: event.target.value } })
	}


	return (
		<OnboardingScreenContainer column width={12}>
			<OnboardingTitleText>
				{title}
			</OnboardingTitleText>
			<OnboardingTextArea
				onClick={onClick}
				onChange={onChange}
				onBlur={onBlur}
				value={component.props.headline}
			/>
		</OnboardingScreenContainer>
	)
}

// HEADSHOT //
type OnboardingHeadshotProps = { id: number, title: string, placeholder: string }
export const OnboardingHeadshot: React.FC<OnboardingHeadshotProps> = ({ id, title, placeholder }) => {

	const { onboardingState, onboardingDispatch } = useOnboardingContext()

	// local state to render spinner while uploading image
	const [ uploading, setUploading ] = useState<boolean>(false)

	const [ component, setComponent ] = useState<HeadshotComponent>({
		id: uuidv4().toString(),
		type: 'headshot',
		props: {
			image: placeholder
		}
	})

	// if returning to component, populate input
	useEffect(() => {
		const foundComponent = onboardingState.profile.components.find(component => component.type === 'headshot')
		if (foundComponent) {
			// @ts-ignore
			const image = foundComponent.props.image
			if (image !== "") {
				setComponent({...component, props: {...component.props, image: image } })
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const handleFileUpload = (event: any) => {
		setUploading(true)
		const formData = new FormData()
		formData.append('file', event.target.files[0])
		PostProtectProfileImage(onboardingState.profile.username, formData)
			.then(res => {
				console.log('response from upload-image endpoint:', res.data.image)
				const uploadedImage = res.data.image

				// maintain local component for display
				setComponent({
					...component,
					props: {
						image: uploadedImage
					}
				})

				// update glocal component
				onboardingDispatch(updateComponent({
					...component,
					props: {
						image: uploadedImage
					}
				}))

				// handle display states
				setUploading(false)

			}).catch(err => {
				setUploading(false)
			})
	}

	// need to add spinner here based on {uploading}
	return (
		<OnboardingScreenContainer column width={12}>
			<OnboardingTitleText>
				{title}
			</OnboardingTitleText>

			<OnboardingHeadshotUpload size={12} src={component.props?.image}>
				<OnboardingHeadshotUploadInput
					type='file'
					onChange={handleFileUpload}
				/>
			</OnboardingHeadshotUpload>

		</OnboardingScreenContainer>
	)
}

// DONE //
export const OnboardingDone: React.FC = () => {

	let history = useHistory()

	const { onboardingState } = useOnboardingContext()

	const onClick = () => {
		console.log('about to post profile:', onboardingState.profile)

		PostProtectProfile(onboardingState.profile)
			.then(res => {
				console.log('PostProtectProfile response:', res)
				console.log('trying to push to history')
				history.push(`/${onboardingState.profile.username}`)
			})
			.catch(err => {
				console.log('PostProtectProfile error:', err)
			})

	}

	return (
		<OnboardingScreenContainer column width={12}>
			<OnboardingTitleText>
				Done!
			</OnboardingTitleText>
			<DoneButton onClick={onClick}>
				Go to your profile
			</DoneButton>
		</OnboardingScreenContainer>
	)
}

const OnboardingScreenContainer = styled(Div)`
	min-height: 75vh;
	justify-content: center;
`

const OnboardingTitleText = styled(H1)`
	font-family: 'glypha';
	font-size: 30px;
`

const OnboardingTextArea = styled(TextArea)`
	font-family: 'glypha';
	font-size: 30px;
	margin-top: 20px;

	color: lightgray;
`

const OnboardingHeadshotUpload = styled(Img)`
	margin-top: 20px;
	filter: blur(2px);
	justify-content: center;
	align-items: center;
` 

const DoneButton = styled(Button)`
  position: absolute;
  bottom: 10px;
  right: 10px;
`

const OnboardingHeadshotUploadInput = styled.input`
`


// GenerateOnboardingComponent takes object {id, component, props},
// then generates a component from the Components map above
// also, the id and key are injected as props to each component
type ComponentIndex = {
	[index: string]: any
}
const Components: ComponentIndex  = {
	username: OnboardingUsername,
	name: OnboardingName,
	headline: OnboardingHeadline,
	headshot: OnboardingHeadshot,
	done: OnboardingDone
}
export const GenerateOnboardingComponent = (component: any) => {
  // component exists
  if (typeof Components[component.type] !== 'undefined') {
		return React.createElement(Components[component.type], {...component?.props, id: component.id, key: component.id} )
	}
	// component does not exist
  return <React.Fragment key={component.id} />
}
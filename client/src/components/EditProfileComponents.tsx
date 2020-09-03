import React, { useState } from 'react'
import styled from 'styled-components'

// presentation/types
import ClipLoader from "react-spinners/ClipLoader"
import { useDetectMobile } from '../libs/hooksLib'
import { Div, H1, H2, Img, ExternalImg, TextArea, Button } from '../components/BaseComponents'
import { Component,	HeadlineComponent,	BioComponent,	HeadshotComponent, ExperiencesComponent,ArticleComponent } from '../models/Profile'

// logic
import { useProfileContext, setEditing, updateComponent, deleteComponent } from '../context/ProfileContext'
import { PostProtectProfileImage } from '../libs/apiLib'


export const Headshot: React.FC<HeadshotComponent> = ({ id, props }) => {

	const mobile: boolean = useDetectMobile()

  const { profileState, profileDispatch } = useProfileContext()

	const [ uploading, setUploading ] = useState(false)

	const handleFileUpload = (event: any) => {
		setUploading(true)
		const formData = new FormData()
		formData.append('file', event.target.files[0])
		PostProtectProfileImage(profileState.profile.username, formData)
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
	
	return (
		<ProfileImage size={mobile? 12 : 6} src={props.image}>

			{ (profileState.editing) &&
				<ProfileImageUploadTopWrapper>
						{	uploading &&
							<ClipLoader
								css={'position: relative; left: -50%; text-align: center;'}
								loading={uploading}
								color={'#000000'}
							/>
						}
						{ !uploading &&
							<ProfileImageUploadWrapper>
								Choose Photo
								<ProfileImageUploadInput
									type='file'
									onChange={handleFileUpload}
								/>
							</ProfileImageUploadWrapper>
						}
				</ProfileImageUploadTopWrapper>
			}

		</ProfileImage>
	)
}


export const Headline: React.FC<HeadlineComponent> = ({ id, props }) => {

	const { profileState, profileDispatch } = useProfileContext()

	const [ textInput, setTextInput ] = useState<string>(props.headline)

	const placeholder = 'John Kauber is a Security Engineer and Analyst passionate about protecting critical systems from threat of attack.'

	const handleClickAway = () => {
		profileDispatch(updateComponent({
			id: id,
			type: 'headline',
			props: {
				headline: textInput
			}
		}))
	}

	const onAddClick = () => {
		profileDispatch(setEditing(true))
	}


	if (!profileState.editing && textInput === "") {
		// not editing, component is not populated
		return (
			<Div column width={12} style={{marginTop: '20px', position: 'relative'}}>

				<H1 style={{color: 'lightgray'}}>
					{placeholder}
				</H1>

				<AddButton onClick={onAddClick}>
					Add a headline
				</AddButton>

			</Div>
		)
	} else if (profileState.editing) {
		return (
			<HeadlineTextArea
				placeholder={placeholder}
				onBlur={handleClickAway}
				onChange={(event: any) => setTextInput(event.target.value)}
				value={textInput}
			/>
		)
	} else {
		return (
			<HeadlineText>
				{textInput}
			</HeadlineText>
		)
	}
}

export const Bio: React.FC<BioComponent> = ({ id, props }) => {

  const { profileState, profileDispatch } = useProfileContext()

	const [ textInput, setTextInput ] = useState<string>(props.bio)

	const placeholder = "He’s currently a security engineer at BigCo, where he’s helping to build a system wide penetration testing platform to keep BigCo’s systems safe. A big advocate for the EFF, part-time white hat hacker, and proud member of the Information Systems Security Association, John also founded the young hacker coalition (YHC) in 2018. John loves to travel internationally, and is rarely found abroad without a camera in his hand. You can find him in San Francisco, California."

	const handleClickAway = () => {
		profileDispatch(updateComponent({
			id: id,
			type: 'bio',
			props: {
				bio: textInput
			}
		}))
	}

	const onAddClick = () => {
		profileDispatch(setEditing(true))
	}


	if (!profileState.editing && textInput === "") {
		return (
			<Div column width={12} style={{marginTop: '20px'}}>

				<H1 style={{color: 'lightgray'}}>
					About {profileState.profile.components.find(comp => comp.type === 'name')?.props.name.split(' ')[0]}
				</H1>

				<Div column width={12} style={{position: 'relative'}}>
					<H2 style={{color: 'lightgray', lineHeight: '24px'}}>
						{placeholder}
					</H2>

					<AddButton onClick={onAddClick}>
						Add a bio
					</AddButton>
				</Div>

			</Div>
		)
	} else if (profileState.editing) {
		return (
			<Div column width={12} style={{marginTop: '20px'}}>
				<H1 style={{color: (textInput === "" ? 'lightgray': 'black')}}>
					About {profileState.profile.components.find(comp => comp.type === 'name')?.props.name.split(' ')[0]}
				</H1>
				<BioTextArea
					placeholder={placeholder}
					onBlur={handleClickAway}
					onChange={(event: any) => setTextInput(event.target.value)}
					value={textInput}
				/>
			</Div>
		)
	} else {
		return (
			<Div column width={12} style={{marginTop: '20px'}}>
				<H1>
					About {profileState.profile.components.find(comp => comp.type === 'name')?.props.name.split(' ')[0]}
				</H1>
				<BioText>
					{textInput}
				</BioText>
			</Div>
		)
	}
}


export const Experiences: React.FC<ExperiencesComponent> = ({ id, props }) => {

  const { profileState, profileDispatch } = useProfileContext()

	const [ experiences, setExperiences ] = useState(props.experiences)

	const placeholder = [
		{
			domain: 'google.com',
			title: 'Security Engineer',
			company: 'Google',
			date: 'June 2020 - present'
		},
		{
			domain: 'retool.com',
			title: 'Sofware Engineer',
			company: 'Retool',
			date: 'Jan 2019 - June 2020'
		},
		{
			domain: 'stripe.com',
			title: 'Software Engineering Intern',
			company: 'Stripe',
			date: '2018'
		}
	]

	const handleClickAway = () => {
		profileDispatch(updateComponent({
			id: id,
			type: 'experiences',
			props: {
				experiences: experiences
			}
		}))
	}

	const onAddClick = () => {
		profileDispatch(setEditing(true))
	}

	if (!profileState.editing && experiences.length === 0) {
		return (
			<Div column width={12} style={{marginTop: '60px'}}>

				<H1 style={{color: 'lightgray'}}>
					Experiences
				</H1>

				<Div column width={12} style={{position: 'relative'}}>
					{ placeholder.map((exp, idx) => 
						<ExperienceRow
							key={idx}
							domain={exp.domain}
							title={exp.title}
							company={exp.company}
							date={exp.date}
						/>
					)}
					<AddButton onClick={onAddClick}>
						Add experiences
					</AddButton>
				</Div>

			</Div>
		)
	} else if (profileState.editing) {
		return (
			<Div column width={12} style={{marginTop: '60px'}}>
				<H1>
					Experiences
				</H1>

				{ experiences.map((exp, idx) => 
					<ExperienceRow
						key={idx}
						domain={exp.domain}
						title={exp.title}
						company={exp.company}
						date={exp.date}
					/>
				)}

			</Div>
		)
	} else {
		return (
			<Div column width={12} style={{marginTop: '60px'}}>
				<H1>
					Experiences
				</H1>

				{ experiences.map((exp, idx) => 
					<ExperienceRow
						key={idx}
						domain={exp.domain}
						title={exp.title}
						company={exp.company}
						date={exp.date}
					/>
				)}

			</Div>
		)
	}
}


type ExperienceRowProps = { domain: string, title: string, company: string, date: string }
export const ExperienceRow: React.FC<ExperienceRowProps> = ({ domain, title, company, date }) => {

	return (
		<Div row width={12} style={{ alignItems:'top', marginTop:'15px' }}>

			<ExternalImg
				src={`//logo.clearbit.com/${domain}`}
				style={{ minWidth:'51px', minHeight:'51px', backgroundSize:'auto' }}
			/>

			<Div column width={12} style={{ marginLeft:'10px' }}>
				<H2>
					{title} at {company}
				</H2>
				<H2>
					{date}
				</H2>
			</Div>

		</Div>
	)
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
	::-webkit-input-placeholder { /* Chrome */
  	color: lightgray;
	}
	:-ms-input-placeholder { /* IE 10+ */
  	color: lightgray;
	}
	::-moz-placeholder { /* Firefox 19+ */
		color: lightgray;
		opacity: 1;
	}
	:-moz-placeholder { /* Firefox 4 - 18 */
		color: lightgray;
		opacity: 1;
	}
`

const BioText = styled(H2)`
	font-family: 'inter';
  font-size: 16px;
	line-height: 24px;
	margin-top: 10px;
	white-space: pre-wrap;
`

const BioTextArea = styled(TextArea)`
	font-family: 'inter';
  font-size: 16px;
	line-height: 24px;
	margin-top: 10px;

	::-webkit-input-placeholder { /* Chrome */
  	color: lightgray;
	}
	:-ms-input-placeholder { /* IE 10+ */
  	color: lightgray;
	}
	::-moz-placeholder { /* Firefox 19+ */
		color: lightgray;
		opacity: 1;
	}
	:-moz-placeholder { /* Firefox 4 - 18 */
		color: lightgray;
		opacity: 1;
	}
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
  transform: translate(0,-50%);
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


const AddButton = styled(Button)`
	position: absolute;
	top: 50%;
	left: 50%;
  transform: translate(-50%,-50%);
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
	experiences: Experiences,
  article: Article
}


export const GenerateEditComponent = (component: Component) => {
  // component exists
  if (typeof Components[component.type] !== 'undefined') {	
		return React.createElement(Components[component.type], {...component, key:component.id} )
	} else {
		// component does not exist
		return <React.Fragment key={component.id} />
	}
}
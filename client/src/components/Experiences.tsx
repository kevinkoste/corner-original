import React, { useState } from 'react'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'
import ExitIcon from '../icons/delete.svg'

// presentation/types
import { Div, H1, H2, ExternalImg, Button, InlineInput } from '../components/Base'
import { ExperiencesComponent } from '../models/Profile'

// logic
import { useProfileContext, setEditing, updateComponent, updateExperience, deleteExperience } from '../context/ProfileContext'
import { GetPublicCompanyFromDomain } from '../libs/apiLib'


export const EditExperiences: React.FC<ExperiencesComponent> = ({ id, props }) => {

  const { profileState, profileDispatch } = useProfileContext()

	const placeholder = [
		{
			id: '1',
			domain: 'google.com',
			title: 'Security Engineer',
			company: 'Google',
			date: 'June 2020 - present'
		},
		{
			id: '2',
			domain: 'retool.com',
			title: 'Sofware Engineer',
			company: 'Retool',
			date: 'Jan 2019 - June 2020'
		},
		{
			id: '3',
			domain: 'stripe.com',
			title: 'Software Engineering Intern',
			company: 'Stripe',
			date: '2018'
		}
	]

	const onAddClick = () => {
		profileDispatch(setEditing(true))
	}

	// controlling domain input for add experience option
	const [ domainInput, setDomainInput ] = useState<string>('')

	const onDomainClick = async () => {
		let company: string
		try {
			const response = await GetPublicCompanyFromDomain(domainInput)
			company = response.data
			console.log(response.data)
		} catch {
			company = ''
		}

		const experience = {
			id: uuidv4().toString(),
			domain: domainInput,
			title: '',
			company: company,
			date: ''
		}

		profileDispatch(updateComponent({
			id: id,
			type: 'experiences',
			props: { experiences: [...profileState.profile.components.find(comp => comp.type === 'experiences')?.props.experiences, experience] }
		}))
	}

	// enter key advances form
	const onKeyDown = (event: any) => {
		if (event.key === 'Enter') {
			event.preventDefault()
			onDomainClick()
		}
	}

	if (!profileState.editing && profileState.profile.components.find(comp => comp.type === 'experiences')?.props.experiences.length === 0) {
		return (
			<ComponentContainer column width={12}>

				<H1 style={{color: 'lightgray'}}>
					Experiences
				</H1>

				<Div column width={12} style={{position: 'relative'}}>
					{ placeholder.map((exp, idx) => 
						<ExperienceRow
							color={'lightgray'}
							key={idx}
							experience={exp}
						/>
					)}
					<AddButton onClick={onAddClick}>
						Add experiences
					</AddButton>
				</Div>

			</ComponentContainer>
		)
	} else if (profileState.editing) {
		return (
			<ComponentContainer column width={12}>
				<H1>
					Experiences
				</H1>

				{/* the experiences edit row */}
				{ profileState.profile.components.find(comp => comp.type === 'experiences')?.props.experiences.map((exp: any, idx: number) => 
					<ExperienceEditRow
						key={idx}
						experience={exp}
					/>
				)}

				{/* this is the domain input form */}
				<Div row width={12} style={{ alignItems:'top', marginTop:'15px' }}>
			
					<Div column width={12}>
						<H2>
							Enter your company domain name
						</H2>
						<Div width={12} style={{ position:'relative' }}>
							<ExperienceInput
								placeholder={'e.g. google.com'}
								onChange={(event: any) => setDomainInput(event.target.value)}
								onKeyDown={onKeyDown}
								value={domainInput}
								style={{borderBottom: 'none', height: 'auto', marginLeft: '0px'}}
							/>
							<DomainButton onClick={onDomainClick}>
								Add Experience &#62;
							</DomainButton>
						</Div>
					</Div>

				</Div>

			</ComponentContainer>
		)
	} else {
		return (
			<ComponentContainer column width={12}>
				<H1>
					Experiences
				</H1>

				{ profileState.profile.components.find(comp => comp.type === 'experiences')?.props.experiences.map((exp: any, idx: number) => 
					<ExperienceRow
						key={idx}
						experience={exp}
					/>
				)}

			</ComponentContainer>
		)
	}
}


type ExperienceRowProps = { experience: any, color?: string }
export const ExperienceRow: React.FC<ExperienceRowProps> = ({ experience, color }) => {

	const { domain, title, company, date } = experience

	return (
		<Div row width={12} style={{ alignItems:'top', marginBottom:'15px', marginTop:'15px' }}>
			<LogoWrapper style={{position: 'relative'}}>
			<ExternalImg
				src={`//logo.clearbit.com/${domain}`}
				style={{ minWidth:'51px', minHeight:'51px', backgroundSize:'contain' }}
			/>
			</LogoWrapper>

			<ExperienceText column width={12} style={{color: color||'black' }}>
				<H2>
					{title} at {company}
				</H2>
				<H2>
					{date}
				</H2>
			</ExperienceText>

		</Div>
	)
}

const ExperienceEditRow: React.FC<ExperienceRowProps> = ({ experience, color }) => {

	const { id, domain, title, company, date } = experience

	const { profileDispatch } = useProfileContext()

	const [ titleInput, setTitleInput ] = useState(title)
	const [ companyInput, setCompanyInput ] = useState(company)
	const [ dateInput, setDateInput ] = useState(date)

	const handleClickAway = () => {
		profileDispatch(updateExperience({
			id: id,
			domain: domain,
			title: titleInput,
			company: companyInput,
			date: dateInput
		}))
	}
	
	const handleDeleteExperience = () => {
		profileDispatch(deleteExperience({
			id: id,
			domain: domain,
			title: titleInput,
			company: companyInput,
			date: dateInput
		}))
	}


	return (
		<Div row width={12} style={{ alignItems:'top', marginBottom:'15px', marginTop:'15px' }}>

			{/* need to add delete functionality */}
			<LogoWrapper style={{position: 'relative'}}>
			<ExternalImg
				src={`//logo.clearbit.com/${domain}`}
				style={{ minWidth:'51px', minHeight:'51px', backgroundSize:'contain' }}>
			</ExternalImg>
			<DeleteIcon 
					src={ExitIcon}
					onClick={handleDeleteExperience}/>
			</LogoWrapper>

			<ExperienceText column width={12} style={{ color: color||'black' }}>
				<Div row width={12}>
					<ExperienceInput
						placeholder={'Software Engineer'}
						onChange={(event: any) => setTitleInput(event.target.value)}
						value={titleInput}
						style={{width: '40%'}}
						// style={(titleInput==='')? {width: Math.ceil('Software Engineer'.length * .95) + "ex"} : {width: Math.ceil(titleInput.length * .95) + "ex"}}
						onBlur={handleClickAway}
					/>
					<H2>&nbsp;at&nbsp;</H2> 
					<ExperienceInput
						placeholder={'Google'}
						onChange={(event: any) => setCompanyInput(event.target.value)}
						value={companyInput}
						style={{width: '40%'}}
						// style={(companyInput==='')? {width: Math.ceil('Google'.length * 1.1) + "ex"} : {width: Math.ceil(companyInput.length * 1.1) + "ex"}}
						onBlur={handleClickAway}
					/>
				</Div>
				<ExperienceInput
					placeholder={'August 2019 - Present'}
					onChange={(event: any) => setDateInput(event.target.value)}
					value={dateInput}
					style={{width: 'calc(80% + 37px)'}}
					// style={(dateInput==='')? {width: Math.ceil('August 2019 - Present'.length * 1) + "ex"} : {width: Math.ceil(dateInput.length * 1) + "ex"}}
					onBlur={handleClickAway}
				/>
			</ExperienceText>

		</Div>
	)
}

// public version
export const Experiences: React.FC<ExperiencesComponent> = ({ id, props }) => {

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

const ExperienceInput = styled(InlineInput)`
	border-bottom: 1px solid black;
	height: 20px;
	margin-right: 5px;
	margin-left: 5px;
	border-radius: 0px;
`

const ExperienceText = styled(Div)`
	display: inline-block;
	margin-left: 15px;
`

const LogoWrapper = styled(Div)`
	margin-left: 15px;
	@media (max-width: 768px) {
		margin-left: 0px;
	}
`

const DeleteIcon = styled.img`
	position: absolute;
	background-size: 50%;
	left:0;
	z-index: 2;
	height: 51px;
	width: 51px;
`

const DomainButton = styled(Button)`
	background-color: white;
	color: black;
	font-size: 16px;
	font-family: 'inter';
  line-height: 24px;
	padding: 0;
	@media (max-width: 768px) {
		position: absolute;
		right: 0;
	}`


const ComponentContainer = styled(Div)`
	margin-bottom: 30px;
`

const AddButton = styled(Button)`
	position: absolute;
	top: 50%;
	left: 50%;
  transform: translate(-50%,-50%);
`

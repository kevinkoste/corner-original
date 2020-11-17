import React, { useState } from 'react'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'
import ExitIcon from '../icons/delete.svg'

// presentation/types
import {
  Div,
  H1,
  H2,
  ExternalImg,
  Button,
  InlineInput,
  ComponentContainer,
} from '../components/Base'
import { ExperienceType, ExperienceComponent } from '../models/Profile'

// logic
import {
  useProfileContext,
  updateComponent,
  updateExperience,
  deleteExperience,
} from '../context/ProfileContext'
import { GetPublicCompanyFromDomain } from '../libs/api'

export const EditExperience: React.FC<ExperienceComponent> = ({
  id,
  props,
}) => {
  const { profileState, profileDispatch } = useProfileContext()

  // controlling domain input for add experience option
  const [domainInput, setDomainInput] = useState<string>('')

  const onDomainClick = async () => {
    let company: string
    try {
      const response = await GetPublicCompanyFromDomain(domainInput)
      company = response.data
      console.log(response.data)
    } catch {
      company = ''
    }

    const experience: ExperienceType = {
      id: uuidv4().toString(),
      domain: domainInput,
      title: '',
      company: company,
      date: '',
    }

    profileDispatch(
      updateComponent({
        id: id,
        type: 'experiences',
        props: {
          experiences: [
            ...profileState.profile.components.find(
              (comp) => comp.type === 'experiences'
            )?.props.experiences,
            experience,
          ],
        },
      })
    )
    setDomainInput('')
  }

  // enter key advances form
  const onKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      onDomainClick()
    }
  }

  if (profileState.editing) {
    return (
      <ComponentContainer>
        {/* <OptionBar id={id} /> */}

        <H1>Experience</H1>

        {/* this is the domain input form */}
        <Div column width={12} style={{ alignItems: 'top', marginTop: '15px' }}>
          <H2>Enter your company domain name</H2>
          <ExperienceInput
            placeholder={'e.g. google.com'}
            onChange={(event: any) => setDomainInput(event.target.value)}
            onKeyDown={onKeyDown}
            value={domainInput}
            style={{ height: '26px' }}
          />
          {domainInput !== '' && (
            <Div column width={12} style={{ alignItems: 'center' }}>
              <DomainButton onClick={onDomainClick}>
                Add Experience &#62;
              </DomainButton>
            </Div>
          )}
        </Div>

        {/* the experiences edit row */}
        {profileState.profile.components
          .find((comp) => comp.type === 'experiences')
          ?.props.experiences.map((exp: ExperienceType, idx: number) => (
            <ExperienceEditRow key={idx} experience={exp} />
          ))}
      </ComponentContainer>
    )
  } else {
    return (
      <ComponentContainer column width={12}>
        <H1>Experience</H1>

        {profileState.profile.components
          .find((comp) => comp.type === 'experiences')
          ?.props.experiences.map((exp: ExperienceType, idx: number) => (
            <ExperienceRow key={idx} experience={exp} />
          ))}
      </ComponentContainer>
    )
  }
}

type ExperienceRowProps = { experience: ExperienceType; color?: string }
export const ExperienceRow: React.FC<ExperienceRowProps> = ({
  experience,
  color,
}) => {
  const { domain, title, company, date } = experience

  return (
    <Div
      row
      width={12}
      style={{ alignItems: 'top', marginBottom: '15px', marginTop: '15px' }}
    >
      <LogoWrapper style={{ position: 'relative' }}>
        <ExternalImg
          src={`//logo.clearbit.com/${domain}`}
          style={{
            minWidth: '64px',
            minHeight: '64px',
            backgroundSize: 'contain',
          }}
        />
      </LogoWrapper>

      <ExperienceTextContainer
        column
        width={12}
        style={{ color: color || 'black' }}
      >
        <H2>{title}</H2>
        <H2>{company}</H2>
        <H2>{date}</H2>
      </ExperienceTextContainer>
    </Div>
  )
}

const ExperienceEditRow: React.FC<ExperienceRowProps> = ({
  experience,
  color,
}) => {
  const { id, domain, title, company, date } = experience

  const { profileDispatch } = useProfileContext()

  const [titleInput, setTitleInput] = useState(title)
  const [companyInput, setCompanyInput] = useState(company)
  const [dateInput, setDateInput] = useState(date)

  const handleClickAway = () => {
    profileDispatch(
      updateExperience({
        id: id,
        domain: domain,
        title: titleInput,
        company: companyInput,
        date: dateInput,
      })
    )
  }

  const handleDeleteExperience = () => {
    profileDispatch(
      deleteExperience({
        id: id,
        domain: domain,
        title: titleInput,
        company: companyInput,
        date: dateInput,
      })
    )
  }

  return (
    <Div
      row
      width={12}
      style={{ alignItems: 'top', marginBottom: '15px', marginTop: '15px' }}
    >
      {/* need to add delete functionality */}
      <LogoWrapper style={{ position: 'relative' }}>
        <ExternalImg
          src={`//logo.clearbit.com/${domain}`}
          style={{
            minWidth: '64px',
            minHeight: '64px',
            backgroundSize: 'contain',
          }}
        ></ExternalImg>
        <DeleteIcon src={ExitIcon} onClick={handleDeleteExperience} />
      </LogoWrapper>

      <ExperienceTextContainer
        column
        width={12}
        style={{ color: color || 'black' }}
      >
        <ExperienceInput
          placeholder={'Software Engineer'}
          onChange={(event: any) => setTitleInput(event.target.value)}
          value={titleInput}
          style={{ width: 'calc(80% + 37px)' }}
          onBlur={handleClickAway}
        />
        <ExperienceInput
          placeholder={'Google'}
          onChange={(event: any) => setCompanyInput(event.target.value)}
          value={companyInput}
          style={{ width: 'calc(80% + 37px)' }}
          onBlur={handleClickAway}
        />
        <ExperienceInput
          placeholder={'August 2019 - Present'}
          onChange={(event: any) => setDateInput(event.target.value)}
          value={dateInput}
          style={{ width: 'calc(80% + 37px)' }}
          onBlur={handleClickAway}
        />
      </ExperienceTextContainer>
    </Div>
  )
}

// public version
export const Experiences: React.FC<ExperienceComponent> = ({ id, props }) => {
  if (props.experiences.length !== 0) {
    return (
      <ComponentContainer>
        <H1>Experience</H1>

        {props.experiences.map((exp: any, idx: number) => (
          <ExperienceRow key={idx} experience={exp} />
        ))}
      </ComponentContainer>
    )
  } else {
    return <React.Fragment />
  }
}

const ExperienceInput = styled(InlineInput)`
  border-bottom: 1px solid darkgrey;
  height: 23px;
  margin: 0px;
`

const ExperienceTextContainer = styled(Div)`
  justify-content: center;
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
  top: 0;
  left: 0;
  background-size: 50%;
  z-index: 2;
  height: 72px;
  width: 64px;
`

const DomainButton = styled(Button)`
  background-color: white;
  color: black;
  border: 1px solid darkgrey;
  margin: 10px 0px;
`

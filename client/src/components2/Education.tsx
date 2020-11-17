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
import { EducationType, EducationComponent } from '../models/Profile'

import { ComponentMenu } from '../components2/ComponentMenu'

// logic
import {
  useProfileContext,
  updateComponent,
  updateEducation,
  deleteEducation,
} from '../context/ProfileContext'
import { GetPublicCompanyFromDomain } from '../libs/api'

export const EditEducation: React.FC<EducationComponent> = ({ id, props }) => {
  const { profileState, profileDispatch } = useProfileContext()

  // controlling domain input for add education option
  const [domainInput, setDomainInput] = useState<string>('')

  const onDomainClick = async () => {
    let company: string
    try {
      const response = await GetPublicCompanyFromDomain(domainInput)
      company = response.data
    } catch {
      company = ''
    }

    const education: EducationType = {
      id: uuidv4().toString(),
      domain: domainInput,
      degree: '',
      school: company,
      date: '',
    }

    profileDispatch(
      updateComponent({
        id: id,
        type: 'education',
        props: {
          education: [
            ...profileState.profile.components.find(
              (comp) => comp.type === 'education'
            )?.props.education,
            education,
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
        <ComponentMenu>
          <H1>Education</H1>

          {/* this is the domain input form */}
          <Div
            column
            width={12}
            style={{ alignItems: 'top', marginTop: '15px' }}
          >
            <H2>Enter your schools domain name</H2>
            <EducationInput
              placeholder={'e.g. yale.edu'}
              onChange={(event: any) => setDomainInput(event.target.value)}
              onKeyDown={onKeyDown}
              value={domainInput}
              style={{ height: '26px' }}
            />
            {domainInput !== '' && (
              <Div column width={12} style={{ alignItems: 'center' }}>
                <DomainButton onClick={onDomainClick}>
                  Add Education &#62;
                </DomainButton>
              </Div>
            )}
          </Div>

          {/* the education edit row */}
          {profileState.profile.components
            .find((comp) => comp.type === 'education')
            ?.props.education.map((edu: EducationType, idx: number) => (
              <EducationEditRow key={idx} education={edu} />
            ))}
        </ComponentMenu>
      </ComponentContainer>
    )
  } else {
    return (
      <ComponentContainer>
        <H1>Education</H1>
        {profileState.profile.components
          .find((comp) => comp.type === 'education')
          ?.props.education.map((edu: EducationType, idx: number) => (
            <EducationRow key={idx} education={edu} />
          ))}
      </ComponentContainer>
    )
  }
}

// type for both edit row and presentation row
type EducationRowProps = {
  education: EducationType
  color?: string
}

export const EducationRow: React.FC<EducationRowProps> = ({
  education,
  color,
}) => {
  const { domain, degree, school, date } = education

  return (
    <Div row width={12} style={{ alignItems: 'top', margin: '15px 0px' }}>
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

      <EducationTextContainer
        column
        width={12}
        style={{ color: color || 'black' }}
      >
        <H2>{school}</H2>
        <H2>{degree}</H2>
        <H2>{date}</H2>
      </EducationTextContainer>
    </Div>
  )
}

const EducationEditRow: React.FC<EducationRowProps> = ({
  education,
  color,
}) => {
  const { id, domain, degree, school, date } = education

  const { profileDispatch } = useProfileContext()

  const [degreeInput, setDegreeInput] = useState(degree)
  const [schoolInput, setSchoolInput] = useState(school)
  const [dateInput, setDateInput] = useState(date)

  const handleClickAway = () => {
    profileDispatch(
      updateEducation({
        id: id,
        domain: domain,
        degree: degreeInput,
        school: schoolInput,
        date: dateInput,
      })
    )
  }

  const handleDeleteEducation = () => {
    profileDispatch(
      deleteEducation({
        id: id,
        domain: domain,
        degree: degreeInput,
        school: schoolInput,
        date: dateInput,
      })
    )
  }

  return (
    <Div row width={12} style={{ alignItems: 'top', margin: '15px 0px' }}>
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
        <DeleteIcon src={ExitIcon} onClick={handleDeleteEducation} />
      </LogoWrapper>

      <EducationTextContainer
        column
        width={12}
        style={{ color: color || 'black' }}
      >
        <EducationInput
          placeholder={'Yale University'}
          onChange={(event: any) => setSchoolInput(event.target.value)}
          value={schoolInput}
          style={{ width: 'calc(80% + 37px)' }}
          onBlur={handleClickAway}
        />
        <EducationInput
          placeholder={'B.S. Mechanical Engineering'}
          onChange={(event: any) => setDegreeInput(event.target.value)}
          value={degreeInput}
          style={{ width: 'calc(80% + 37px)' }}
          onBlur={handleClickAway}
        />
        <EducationInput
          placeholder={'2015 - 2019'}
          onChange={(event: any) => setDateInput(event.target.value)}
          value={dateInput}
          style={{ width: 'calc(80% + 37px)' }}
          onBlur={handleClickAway}
        />
      </EducationTextContainer>
    </Div>
  )
}

// public version
export const Education: React.FC<EducationComponent> = ({ id, props }) => {
  if (props.education.length !== 0) {
    return (
      <ComponentContainer column width={12}>
        <H1>Education</H1>
        {props.education.map((edu: EducationType, idx: number) => (
          <EducationRow key={idx} education={edu} />
        ))}
      </ComponentContainer>
    )
  } else {
    return <span></span>
  }
}

const EducationInput = styled(InlineInput)`
  border-bottom: 1px solid darkgrey;
  height: 23px;
  margin: 0px;
`

const EducationTextContainer = styled(Div)`
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

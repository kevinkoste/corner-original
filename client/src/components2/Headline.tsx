import React, { useState } from 'react'
import styled from 'styled-components'

// presentation/types
import { H1, TextArea, ComponentContainer } from '../components/Base'
import { HeadlineComponent } from '../models/Profile'

import { ComponentMenu } from '../components2/ComponentMenu'

// logic
import { useProfileContext, updateComponent } from '../context/ProfileContext'

export const EditHeadline: React.FC<HeadlineComponent> = ({ id, props }) => {
  const { profileState, profileDispatch } = useProfileContext()

  const [textInput, setTextInput] = useState(props.headline)

  const placeholder =
    'John Kauber is a Security Engineer and Analyst passionate about protecting critical systems from threat of attack.'

  const handleClickAway = () => {
    profileDispatch(
      updateComponent({
        id: id,
        type: 'headline',
        props: {
          headline: textInput,
        },
      })
    )
  }

  if (profileState.editing) {
    return (
      <ComponentContainer>
        <ComponentMenu id={id}>
          <HeadlineTextArea
            placeholder={placeholder}
            onBlur={handleClickAway}
            onChange={(event: any) => setTextInput(event.target.value)}
            value={textInput}
          />
        </ComponentMenu>
      </ComponentContainer>
    )
  } else {
    return (
      <ComponentContainer>
        <H1>{textInput}</H1>
      </ComponentContainer>
    )
  }
}

// public version of headline
export const Headline: React.FC<HeadlineComponent> = ({ props }) => {
  return (
    <ComponentContainer>
      <H1>{props.headline}</H1>
    </ComponentContainer>
  )
}

const HeadlineTextArea = styled(TextArea)`
  font-size: 36px;
  @media (max-width: 768px) {
    font-size: 30px;
  }
`

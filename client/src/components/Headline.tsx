import React, { useState } from 'react'
import styled from 'styled-components'

// presentation/types
import { Div, H1, TextArea, Button } from '../components/Base'
import { HeadlineComponent } from '../models/Profile'

// logic
import {
  useProfileContext,
  setEditing,
  updateComponent,
} from '../context/ProfileContext'

export const EditHeadline: React.FC<HeadlineComponent> = ({ id, props }) => {
  const { profileState, profileDispatch } = useProfileContext()

  const [textInput, setTextInput] = useState<string>(props.headline)

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

  const onAddClick = () => {
    profileDispatch(setEditing(true))
  }

  if (!profileState.editing && textInput === '') {
    // not editing, component is not populated
    return (
      <ComponentContainer column width={12} style={{ position: 'relative' }}>
        <H1 style={{ color: 'lightgray', marginTop: '20px' }}>{placeholder}</H1>

        <AddButton onClick={onAddClick}>Add a headline</AddButton>
      </ComponentContainer>
    )
  } else if (profileState.editing) {
    return (
      <ComponentContainer column width={12} style={{ position: 'relative' }}>
        <HeadlineTextArea
          placeholder={placeholder}
          onBlur={handleClickAway}
          onChange={(event: any) => setTextInput(event.target.value)}
          value={textInput}
        />
      </ComponentContainer>
    )
  } else {
    return (
      <ComponentContainer column width={12} style={{ position: 'relative' }}>
        <HeadlineText>{textInput}</HeadlineText>
      </ComponentContainer>
    )
  }
}

// public version of headline
export const Headline: React.FC<HeadlineComponent> = ({ props }) => {
  return (
    <ComponentContainer>
      <HeadlineText>{props.headline}</HeadlineText>
    </ComponentContainer>
  )
}

const HeadlineText = styled(H1)`
  margin-top: 20px;
`

const HeadlineTextArea = styled(TextArea)`
  font-size: 36px;
  margin-top: 20px;
  ::-webkit-input-placeholder {
    /* Chrome */
    color: lightgray;
  }
  :-ms-input-placeholder {
    /* IE 10+ */
    color: lightgray;
  }
  ::-moz-placeholder {
    /* Firefox 19+ */
    color: lightgray;
    opacity: 1;
  }
  :-moz-placeholder {
    /* Firefox 4 - 18 */
    color: lightgray;
    opacity: 1;
  }
  @media (max-width: 768px) {
    font-size: 30px;
  }
`

const ComponentContainer = styled(Div)`
  margin-bottom: 30px;
`

const AddButton = styled(Button)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

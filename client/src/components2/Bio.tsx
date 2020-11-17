import React, { useState } from 'react'
import styled from 'styled-components'

// presentation/types
import { H1, H2, TextArea, ComponentContainer } from '../components/Base'
import { ComponentMenu } from '../components2/ComponentMenu'

import { Profile, BioComponent } from '../models/Profile'

// logic
import { useProfileContext, updateComponent } from '../context/ProfileContext'

export const EditBio: React.FC<BioComponent> = ({ id, props }) => {
  const { profileState, profileDispatch } = useProfileContext()

  const [textInput, setTextInput] = useState<string>(props.bio)

  const placeholder =
    'He’s currently a security engineer at BigCo, where he’s helping to build a system wide penetration testing platform to keep BigCo’s systems safe. A big advocate for the EFF, part-time white hat hacker, and proud member of the Information Systems Security Association, John also founded the young hacker coalition (YHC) in 2018. John loves to travel internationally, and is rarely found abroad without a camera in his hand. You can find him in San Francisco, California.'

  const handleClickAway = () => {
    profileDispatch(
      updateComponent({
        id: id,
        type: 'bio',
        props: {
          bio: textInput,
        },
      })
    )
  }

  if (profileState.editing) {
    return (
      <ComponentContainer>
        <ComponentMenu>
          <H1 style={{ color: textInput === '' ? 'lightgray' : 'black' }}>
            About{' '}
            {
              profileState.profile.components
                .find((comp) => comp.type === 'name')
                ?.props.name.split(' ')[0]
            }
          </H1>
          <BioTextArea
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
        <H1>
          About{' '}
          {
            profileState.profile.components
              .find((comp) => comp.type === 'name')
              ?.props.name.split(' ')[0]
          }
        </H1>
        <BioText>{textInput}</BioText>
      </ComponentContainer>
    )
  }
}

// public bio component
type BioProps = { id: string; type: string; props: any; profile: Profile }
export const Bio: React.FC<BioProps> = ({ id, props, profile }) => {
  if (props.bio !== '') {
    return (
      <ComponentContainer>
        <H1>
          About{' '}
          {
            profile.components
              .find((comp) => comp.type === 'name')
              ?.props.name.split(' ')[0]
          }
        </H1>
        <BioText>{props.bio}</BioText>
      </ComponentContainer>
    )
  } else {
    return <React.Fragment />
  }
}

const BioText = styled(H2)`
  margin-top: 10px;
  white-space: pre-wrap;
`

const BioTextArea = styled(TextArea)`
  font-family: 'inter';
  font-size: 18px;
  line-height: 24px;
  margin-top: 10px;

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
    font-size: 16px;
  }
`

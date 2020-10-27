import React, { useEffect } from 'react'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'

// presentation
import { useDetectMobile } from '../libs/hooks'
import { PageContainer, BodyContainer, Div, Button } from '../components/Base'
import { Header } from '../components/Header'

// logic
import { useAppContext } from '../context/AppContext'
import { Profile } from '../models/Profile'
import {
  useProfileContext,
  updateProfile,
  setEditing,
  postComponents,
} from '../context/ProfileContext'
import { GenerateEditComponent } from '../components/ProfileEdit'
import { GetPublicProfileData } from '../libs/api'

export const EditProfilePage: React.FC = () => {
  const mobile = useDetectMobile()

  // not yet sure which we are using...
  const { state } = useAppContext()
  const { profileState, profileDispatch } = useProfileContext()

  // on mount, supply profileState with public profile data and add missing components if needed
  useEffect(() => {
    const onMount = async () => {
      const { data } = await GetPublicProfileData(state.username)
      const profile: Profile = data

      // add any missing components
      for (let type of [
        'bio',
        'bookshelf',
        'experiences',
        'education',
        'integrations',
      ]) {
        if (
          profile.components.find((comp) => comp.type === type) === undefined
        ) {
          if (type === 'bio') {
            profile.components.push({
              id: uuidv4().toString(),
              type: type,
              props: { bio: '' },
            })
          } else if (type === 'bookshelf') {
            profile.components.push({
              id: uuidv4().toString(),
              type: 'bookshelf',
              props: { books: [] },
            })
          } else if (type === 'experiences') {
            profile.components.push({
              id: uuidv4().toString(),
              type: 'experiences',
              props: { experiences: [] },
            })
          } else if (type === 'education') {
            profile.components.push({
              id: uuidv4().toString(),
              type: 'education',
              props: { education: [] },
            })
          } else if (type === 'integrations') {
            profile.components.push({
              id: uuidv4().toString(),
              type: 'integrations',
              props: { integrations: [] },
            })
          }
        }
      }

      // sort components
      const sortMap: { [index: string]: any } = {
        name: 0,
        headshot: 1,
        headline: 2,
        bio: 3,
        experiences: 4,
        education: 5,
        integrations: 6,
        bookshelf: 7,
      }
      profile.components.sort((a, b) => {
        return sortMap[a.type] - sortMap[b.type]
      })

      // dispatch to profile context
      profileDispatch(updateProfile(profile))
    }

    onMount()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // on save profile, post new profile data to server, NOT async
  const onSave = () => {
    if (profileState.editing) {
      profileDispatch(postComponents())
    }
    profileDispatch(setEditing(!profileState.editing))
  }

  return (
    <PageContainer column width={12}>
      <Header
        title={
          profileState.profile.components.find((comp) => comp.type === 'name')
            ?.props.name
        }
      />

      <BodyContainer column width={mobile ? 11 : 8}>
        <CenteredContainer column width={12}>
          <FrontPageWrapper>
            {profileState.profile.components
              .filter((comp) => comp.type === 'headshot')
              .map((comp) => GenerateEditComponent(comp))}
          </FrontPageWrapper>
          <FrontPageWrapper>
            {profileState.profile.components
              .filter((comp) => comp.type === 'headline')
              .map((comp) => GenerateEditComponent(comp))}
            {!mobile &&
              profileState.profile.components
                .filter((comp) => comp.type === 'bio')
                .map((comp) => GenerateEditComponent(comp))}
          </FrontPageWrapper>
        </CenteredContainer>

        <Div column width={12}>
          {mobile &&
            profileState.profile.components
              .filter(
                (comp) => comp.type !== 'headshot' && comp.type !== 'headline'
              )
              .map((comp) => GenerateEditComponent(comp))}
          {!mobile &&
            profileState.profile.components
              .filter(
                (comp) =>
                  comp.type !== 'headshot' &&
                  comp.type !== 'headline' &&
                  comp.type !== 'bio'
              )
              .map((comp) => GenerateEditComponent(comp))}
        </Div>
      </BodyContainer>

      <ButtonContainer row width={12}>
        <EditButton onClick={onSave}>
          {profileState.editing ? 'Finish Editing' : 'Edit Corner'}
        </EditButton>
      </ButtonContainer>

      <Div style={{ height: '54px' }} />
    </PageContainer>
  )
}
export default EditProfilePage

const CenteredContainer = styled(Div)`
  justify-content: center;
  flex-direction: row;
  min-height: ${window.innerHeight - 51 + 'px'};
  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const FrontPageWrapper = styled(Div)`
  width: 50%;
  flex-direction: column;
  justify-content: center;
  display: flex;
  @media (max-width: 768px) {
    width: unset;
  }
`

const EditButton = styled(Button)`
  position: fixed;
  bottom: 10px;
  right: 8.34vw;
  @media (max-width: 768px) {
    right: 4.17vw;
  }
  @media (min-width: 1560px) {
    right: ${parseInt(((window.innerWidth - 1300) * 0.5).toString(), 10) +
    'px'};
  }
`

const ButtonContainer = styled(Div)`
  display: flex;
  position: relative;
  justify-content: space-between;
  max-width: 350px;
  @media (max-width: 768px) {
    margin: 0;
  }
`

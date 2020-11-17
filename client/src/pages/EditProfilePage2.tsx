import React, { useEffect } from 'react'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'
import {
  Container as DndContainer,
  Draggable as DndDraggable,
} from 'react-smooth-dnd'

// presentation
// import { useMobile } from '../libs/hooks'
import {
  H1,
  PageContainer,
  // BodyContainer,
  Div,
  Button,
  WhiteButton,
  HoverButton,
  HoverButtonContainer,
} from '../components/Base'
import { Header } from '../components/Header'

// logic
import { useAppContext } from '../context/AppContext'
import { Profile } from '../models/Profile'
import {
  useProfileContext,
  updateProfile,
  setEditing,
  setModal,
  postComponents,
  swapComponents,
  updateComponent,
} from '../context/ProfileContext'
import { GenerateEditComponent } from '../components/ProfileEdit'
import { GetPublicProfileData } from '../libs/api'

export const EditProfilePage: React.FC = () => {
  // const mobile = useMobile()
  const { state } = useAppContext()
  const { profileState, profileDispatch } = useProfileContext()

  // on mount, supply profileState with public profile data
  useEffect(() => {
    const onMount = async () => {
      const { data } = await GetPublicProfileData(state.username)

      const profile: Profile = data

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

  // helper function for drag and drop support
  const onDrop = (dropResult: any) => {
    const { removedIndex, addedIndex } = dropResult
    profileDispatch(swapComponents(removedIndex, addedIndex))
  }

  return (
    <PageContainer column width={12}>
      <Header
        title={
          profileState.profile.components.find((comp) => comp.type === 'name')
            ?.props.name
        }
      />

      <BodyContainer column width={12}>
        <DndContainer
          onDrop={onDrop}
          // dragClass='animate'
          dragHandleSelector=".field"
          lockAxis="y"
        >
          {profileState.profile.components.map((comp, idx) => (
            <DndDraggable key={idx}>{GenerateEditComponent(comp)}</DndDraggable>
          ))}
        </DndContainer>

        {profileState.editing && (
          <WhiteButton
            onClick={() => profileDispatch(setModal(true))}
            style={{ margin: '0 auto' }}
          >
            <H1>+</H1>
          </WhiteButton>
        )}
      </BodyContainer>

      <HoverButtonContainer row width={12}>
        <HoverButton onClick={onSave}>
          {profileState.editing ? 'Finish Editing' : 'Edit Corner'}
        </HoverButton>
      </HoverButtonContainer>

      {profileState.modal && <AddComponentModal />}

      <Div style={{ height: '54px' }} />
    </PageContainer>
  )
}
export default EditProfilePage

const BodyContainer = styled(Div)`
  padding-top: calc(51px);
  padding-bottom: 60px;
  max-width: 1150px;
`

const AddComponentModal: React.FC = () => {
  const { profileDispatch } = useProfileContext()

  const components = [
    {
      display: 'Bio',
      type: 'bio',
      props: { bio: '' },
    },
    {
      display: 'Bookshelf',
      type: 'bookshelf',
      props: { books: [] },
    },
    {
      display: 'Experiences',
      type: 'experiences',
      props: { experiences: [] },
    },
    {
      display: 'Education',
      type: 'education',
      props: { education: [] },
    },
    {
      display: 'Integrations',
      type: 'integrations',
      props: { integrations: [] },
    },
  ]

  return (
    <FullScreenModal onClick={() => profileDispatch(setModal(false))}>
      {components.map((comp, idx) => (
        <Button
          key={idx}
          onClick={() => {
            profileDispatch(setModal(false))
            profileDispatch(
              updateComponent({
                id: uuidv4().toString(),
                type: comp.type,
                props: comp.props,
              })
            )
          }}
          style={{ marginBottom: '12px' }}
        >
          Add {comp.display}
        </Button>
      ))}
    </FullScreenModal>
  )
}

const FullScreenModal = styled(Div)`
  position: fixed;
  z-index: 10;
  width: 100vw;
  height: 100vh;

  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);

  justify-content: center;
  align-items: center;
  flex-direction: column;
`

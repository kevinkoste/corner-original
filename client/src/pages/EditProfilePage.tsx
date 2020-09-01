import React, { useEffect } from 'react'
import styled from 'styled-components'

// presentation
import { useDetectMobile } from '../libs/hooksLib'
import { Div, Button } from '../components/BaseComponents'
import { Header } from '../components/Header'

// logic
import { useAppContext } from '../context/AppContext'
import { useProfileContext, updateProfile, setEditing, updateComponent } from '../context/ProfileContext'
import { GenerateEditComponent } from '../components/EditProfileComponents'
import { GetPublicProfileData, PostProtectProfile } from '../libs/apiLib'


export const EditProfilePage: React.FC = () => {

  const mobile: boolean = useDetectMobile()

  // not yet sure which we are using...
  const { state, dispatch } = useAppContext()
  const { profileState, profileDispatch } = useProfileContext()

  // on mount, supply profileState with public profile data
  useEffect(() => {
    GetPublicProfileData(state.username)
      .then(res => {
        profileDispatch(updateProfile(res.data))
      })
      .catch(err => {
        console.log(err)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  // on save profile, post new profile data to server
  const onSave = () => {
    if (profileState.editing) {
      PostProtectProfile(profileState.profile)
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
    }
    profileDispatch(setEditing(!profileState.editing))
  }

	return (
		<PageContainer column width={12}>

      <Header title={profileState.profile.components.find(component => component.type === 'name')?.props.name} />

      <BodyContainer column width={mobile ? 11 : 6}>

        {profileState.profile.components.map(component => GenerateEditComponent(component))}

      </BodyContainer>


      <EditButton onClick={onSave} >
        {profileState.editing ? 'Finish Editing' : 'Edit Corner'}
      </EditButton>

		</PageContainer>
	)
}


const PageContainer = styled(Div)`
  max-width: 100vw;
	height: ${window.innerHeight+"px"};
	align-items: center;
	position: relative;
`

const BodyContainer = styled(Div)`
`

const EditButton = styled(Button)`
  position: fixed;
  bottom: 10px;
  right: 10px;
`

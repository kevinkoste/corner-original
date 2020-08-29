import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

// presentation
import { useDetectMobile } from '../libs/hooksLib'
import { Div } from '../components/BaseComponents'
import { Header } from '../components/Header'

// logic
import { GenerateEditComponent } from '../components/EditProfileComponents'
import { useProfileContext, updateProfile, toggleEditing } from '../context/ProfileContext'
import { GetPublicProfileData, PostProtectProfile } from '../libs/apiLib'
import { Profile, EmptyProfile } from '../models/Profile'


export const EditProfilePage: React.FC = () => {

  const mobile: boolean = useDetectMobile()

  const { username } = useParams()

  // not yet sure which we are using...
  const { profileState, profileDispatch } = useProfileContext()

  // on mount, supply profileState with public profile data
  useEffect(() => {
    GetPublicProfileData(username)
      .then(res => {
        profileDispatch(updateProfile(res.data))
      })
      .catch(err => {
        console.log(err)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  // on save profile, post new profile data to server
  const onClick = () => {
    if (profileState.editing) {
      PostProtectProfile(profileState.profile)
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
    }
    profileDispatch(toggleEditing())
  }

	return (
		<PageContainer column width={12}>

			<Header title={username} />

      <BodyContainer column width={mobile ? 11 : 6}>
        {profileState.profile.components.map(component => GenerateEditComponent(component))}
      </BodyContainer>

      <button onClick={onClick} style={{margin: '20px 0px 20px 0px'}}>
        edit mode: {profileState.editing ? 'on' : 'off'}
      </button>

		</PageContainer>
	)
}

const PageContainer = styled(Div)`
	max-width: 100vw;
	align-items: center;
	overflow: hidden;
	position: relative;
`

const BodyContainer = styled(Div)`
`
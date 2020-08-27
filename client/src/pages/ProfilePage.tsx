import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import { Div } from '../components/BaseComponents'
import { ProfileHeader } from '../components/ProfileHeader'

import { ProfileBody } from '../components/ProfileBody'

import { useProfileContext, updateProfile, toggleEditing } from '../context/ProfileContext'
import { GetPublicProfileData, PostProtectProfileUpdate } from '../libs/apiLib'

export const ProfilePage: React.FC = () => {

  const { username } = useParams()
  const { state, dispatch } = useProfileContext()

  // on component mount, get profile data from server
  useEffect(() => {
    GetPublicProfileData(username)
      .then(res => {
        dispatch(updateProfile(res.data))
      })
      .catch(err => {
        console.log(err)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // on save profile, post new profile data to server
  const onClick = () => {
    if (state.editing) {
      PostProtectProfileUpdate(state.profile)
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
    }
    dispatch(toggleEditing())
  }

	return (
		<PageContainer column width={12}>

			<ProfileHeader />

			<ProfileBody />

      <button onClick={onClick} style={{margin: '20px 0px 20px 0px'}}>
        edit mode: {state.editing ? 'on' : 'off'}
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


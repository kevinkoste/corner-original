import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import styled from 'styled-components'

// presentation
import { useDetectMobile } from '../libs/hooksLib'
import { Div } from '../components/BaseComponents'
import { Header } from '../components/Header'

// logic
import { useAppContext } from '../context/AppContext'
import { Profile, EmptyProfile } from '../models/Profile'
import { GetPublicProfileData } from '../libs/apiLib'
import { GenerateComponent } from '../components/ProfileComponents'


export const ProfilePage: React.FC = () => {

  let history = useHistory()
  const mobile: boolean = useDetectMobile()
  const { state, dispatch } = useAppContext()

  const { username } = useParams()
  const [ profile, setProfile ] = useState<Profile>(EmptyProfile)

  // on component mount, get profile data from server
  useEffect(() => {
    GetPublicProfileData(username)
      .then(res => {
        console.log('got public profile with res:', res)
        setProfile(res.data)
      })
      .catch(err => {
        console.log(err)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // if this is the current users profile, redirect to edit page
  useEffect(() => {
    if (profile.username === state.username) {
      history.push(`/edit/${state.username}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

	return (
		<PageContainer column width={12}>

			<Header title={profile.components.find(component => component.type === 'name')?.props.name} />

      <BodyContainer column width={mobile ? 11 : 6}>
        { profile.components.map(component => GenerateComponent(component)) }
      </BodyContainer>

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


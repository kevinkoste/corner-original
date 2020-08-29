import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

// presentation
import { useDetectMobile } from '../libs/hooksLib'
import { Div } from '../components/BaseComponents'
import { Header } from '../components/Header'

// logic
import { Profile, EmptyProfile } from '../models/Profile'
import { GetPublicProfileData } from '../libs/apiLib'
import { GenerateComponent } from '../components/ProfileComponents'


export const ProfilePage: React.FC = () => {

  const mobile: boolean = useDetectMobile()

  const { username } = useParams()
  const [ profile, setProfile ] = useState<Profile>(EmptyProfile)

  // on component mount, get profile data from server
  useEffect(() => {
    GetPublicProfileData(username)
      .then(res => {
        console.log('got public profile with res:')
        console.log(res)

        setProfile(res.data)
      })
      .catch(err => {
        console.log(err)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

	return (
		<PageContainer column width={12}>

			<Header title={username} />

      <BodyContainer column width={mobile ? 11 : 6}>
        {profile.components.map(component => GenerateComponent(component))}
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


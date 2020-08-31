import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { useDetectMobile } from '../libs/hooksLib'
import { Div, H1, H2, Img, GridMap } from '../components/BaseComponents'
import { Header } from '../components/Header'

import { useAppContext } from '../context/AppContext'
import { GetPublicAllProfiles } from '../libs/apiLib'
import { Profile } from '../models/Profile'


export const BrowsePage: React.FC = () => {

  let history = useHistory()
	const mobile: boolean = useDetectMobile()
  const { state, dispatch } = useAppContext()

  const [ profiles, setProfiles ] = useState<Profile[]>([])
  
  useEffect(() => {
    GetPublicAllProfiles()
    .then(res => {
      console.log(res)
      // remove empty profiles
      setProfiles(res.data)
    })
    .catch(err => console.log(err))
  }, [])
	
  return (
    <PageContainer column width={12}>

      <Header title='Browse' />

      <BodyContainer column width={mobile ? 11 : 6}>
        {profiles
          .filter(profile => (profile !== undefined && profile !== null))
          .map((profile, index) => <ProfileRow key={index} profile={profile}/> )
        }
      </BodyContainer>

    </PageContainer>
  )
}

const PageContainer = styled(Div)`
  max-width: 100vw;
  min-height: 100vh;
	align-items: center;
	overflow: hidden;
  position: relative;
`

const BodyContainer = styled(Div)`
  align-items: center;
`


type ProfileRowProps = { profile: Profile }
const ProfileRow: React.FC<ProfileRowProps> = ({ profile }) => {

  let history = useHistory()

  const name = profile.components.find(component => component.type === 'name')?.props?.name
  const image = profile.components.find(component => component.type === 'headshot')?.props?.image

  const onClick = () => {
    history.push(`/${profile.username}`)
  }

  return (
    <RowContainer onClick={onClick} row width={12}>
      <ProfileImage size={3} src={image}/>

      <ProfileName>
        {name}
      </ProfileName>

    </RowContainer>
  )
}

const RowContainer = styled(Div)`
  align-items: center;
  margin-top: 20px;
`

type ImageProps = { src: string, size: number }
const ProfileImage = styled.div<ImageProps>`
  background-image: ${props => `url(${process.env.REACT_APP_S3_BUCKET + props.src})`};
  background-position: center;
  background-size: cover;
  width: 75px;
  height: 75px;
`

const ProfileName = styled(H1)`
  font-size: 20px;
  margin-left: 10px;
`

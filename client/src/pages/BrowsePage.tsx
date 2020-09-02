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

	const mobile: boolean = useDetectMobile()

  const [ profiles, setProfiles ] = useState<Profile[]>([])
  
  useEffect(() => {
    GetPublicAllProfiles()
    .then(res => {
      console.log(res)
      setProfiles(res.data)
    })
    .catch(err => console.log(err))
  }, [])
	
  return (
    <PageContainer column width={12}>

      <Header title='Browse' />

      <BodyContainer column width={mobile ? 11 : 6}>
        {profiles
          .filter(profile => Object.keys(profile).length !== 0)
          .map((profile, index) => <ProfileRow key={index} profile={profile}/> )
        }
      </BodyContainer>

    </PageContainer>
  )
}

const PageContainer = styled(Div)`
  max-width: 100vw;
	min-height: ${window.innerHeight+"px"};
	align-items: center;
	position: relative;
`

const BodyContainer = styled(Div)`
  align-items: center;
  padding-top: 51px;
  padding-bottom: 60px;
`


type ProfileRowProps = { profile: Profile }
const ProfileRow: React.FC<ProfileRowProps> = ({ profile }) => {

  let history = useHistory()

  const name = profile.components.find(component => component.type === 'name')?.props?.name
  const image = profile.components.find(component => component.type === 'headshot')?.props?.image
  const headline = profile.components.find(component => component.type === 'headline')?.props?.headline

  const onClick = () => {
    history.push(`/${profile.username}`)
  }

  return (
    <RowContainer onClick={onClick} row width={12}>
      <ProfileImage size={3} src={image}/>

      <ProfileName>
        <u>{name}</u><br/>
        "{headline}"
      </ProfileName>

    </RowContainer>
  )
}

const RowContainer = styled(Div)`
  align-items: top;
  margin-top: 20px;
`

type ImageProps = { src: string, size: number }
const ProfileImage = styled.div<ImageProps>`
  background-image: ${props => `url(${process.env.REACT_APP_S3_BUCKET + props.src})`};
  background-position: center;
  background-size: cover;
  width: 60px;
  height: 60px;
`

const ProfileName = styled(H1)`
  font-family: 'inter';
  font-size: 16px;
  margin-left: 10px;
`

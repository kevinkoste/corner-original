import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { useDetectMobile } from '../libs/hooksLib'
import { Div, H2 } from '../components/Base'
import { Header } from '../components/Header'

import { GetPublicAllProfiles } from '../libs/apiLib'
import { Profile } from '../models/Profile'

export const BrowsePage: React.FC = () => {
  const mobile: boolean = useDetectMobile()

  const [profiles, setProfiles] = useState<Profile[]>([])

  useEffect(() => {
    const onMount = async () => {
      const res = await GetPublicAllProfiles()
      setProfiles(res.data)
    }
    onMount()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <PageContainer column width={12}>
      <Header title="Browse" />

      <BodyContainer column width={mobile ? 11 : 10}>
        {profiles
          .filter((profile) => Object.keys(profile).length !== 0)
          .map((profile, index) => (
            <ProfileRow key={index} profile={profile} />
          ))}
      </BodyContainer>
    </PageContainer>
  )
}
export default BrowsePage

const PageContainer = styled(Div)`
  max-width: 100vw;
  min-height: ${window.innerHeight + 'px'};
  align-items: center;
  position: relative;
`

const BodyContainer = styled(Div)`
  align-items: center;
  padding-top: 51px;
  margin-bottom: 60px;
  max-width: 1150px;
`

type ProfileRowProps = { profile: Profile }
const ProfileRow: React.FC<ProfileRowProps> = ({ profile }) => {
  let history = useHistory()

  const name = profile.components.find((component) => component.type === 'name')
    ?.props?.name
  const image = profile.components.find(
    (component) => component.type === 'headshot'
  )?.props?.image
  const headline = profile.components.find(
    (component) => component.type === 'headline'
  )?.props?.headline

  const onClick = () => {
    history.push(`/${profile.username}`)
  }

  return (
    <RowContainer onClick={onClick} row width={12}>
      <ProfileImage size={3} src={'small/' + image} />

      <ProfileName>
        <u>{name}</u>
        <br />"{headline}"
      </ProfileName>
    </RowContainer>
  )
}

const RowContainer = styled(Div)`
  align-items: top;
  margin-top: 20px;
`

type ImageProps = { src: string; size: number }
const ProfileImage = styled.div<ImageProps>`
  background-image: ${(props) =>
    `url(${process.env.REACT_APP_S3_BUCKET + props.src})`};
  background-position: center;
  background-size: cover;
  min-width: 60px;
  min-height: 60px;
`

const ProfileName = styled(H2)`
  margin-left: 10px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

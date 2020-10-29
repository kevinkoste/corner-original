import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import styled from 'styled-components'

// presentation
import { useDetectMobile } from '../libs/hooks'
import {
  PageContainer,
  BodyContainer,
  Div,
  H1,
  Button,
  Loader,
} from '../components/Base'
import { Header } from '../components/Header'
import { ProfileModal } from '../components/Modal'

// logic
import { useAppContext } from '../context/AppContext'
import { Profile, EmptyProfile } from '../models/Profile'
import { GetPublicProfileData } from '../libs/api'
import { GenerateComponent } from '../components/ProfilePublic'

export const ProfilePage: React.FC = () => {
  let history = useHistory()
  const mobile = useDetectMobile()
  const { state } = useAppContext()

  const { username } = useParams<{ username: string }>()
  const [loading, setLoading] = useState<boolean>(true)
  const [profileExists, setProfileExists] = useState<boolean>(false)
  const [profile, setProfile] = useState<Profile>(EmptyProfile)

  // on component mount, get profile data from server
  useEffect(() => {
    const onMount = async () => {
      if (state.username === username) {
        history.push(`/edit/${state.username}`)
      }

      const { data } = await GetPublicProfileData(username)
      if (!data) {
        setProfileExists(false)
      } else {
        setProfileExists(true)
        setProfile(data)
      }
      setLoading(false)
    }

    onMount()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return (
      <PageContainer column width={12}>
        <Header title="" />
        <Loader />
      </PageContainer>
    )
  }

  return (
    <PageContainer column width={12}>
      <Header
        title={
          profile.components.find((comp) => comp.type === 'name')?.props.name
        }
      />
      {profileExists ? (
        <BodyContainer column width={mobile ? 11 : 8}>
          <CenteredContainer column width={12}>
            <FrontPageWrapper>
              {profile.components
                .filter((comp) => comp.type === 'headshot')
                .map((comp) => GenerateComponent(comp, profile))}
            </FrontPageWrapper>
            <FrontPageWrapper>
              {profile.components
                .filter((comp) => comp.type === 'headline')
                .map((comp) => GenerateComponent(comp, profile))}
              {!mobile &&
                profile.components
                  .filter((comp) => comp.type === 'bio')
                  .map((comp) => GenerateComponent(comp, profile))}
              {!mobile &&
                profile.components
                  .filter((comp) => comp.type === 'experiences')
                  .map((comp) => GenerateComponent(comp, profile))}
            </FrontPageWrapper>
          </CenteredContainer>

          <Div column width={12}>
            {mobile &&
              profile.components
                .filter(
                  (comp) => comp.type !== 'headshot' && comp.type !== 'headline'
                )
                .map((comp) => GenerateComponent(comp, profile))}
            {!mobile &&
              profile.components
                .filter(
                  (comp) =>
                    comp.type !== 'headshot' &&
                    comp.type !== 'headline' &&
                    comp.type !== 'bio' &&
                    comp.type !== 'experiences'
                )
                .map((comp) => GenerateComponent(comp, profile))}
          </Div>
        </BodyContainer>
      ) : (
        <BodyContainer column width={mobile ? 11 : 8}>
          <H1>This profile doesn't exist!</H1>
        </BodyContainer>
      )}

      {!state.auth && (
        <ButtonContainer row width={12}>
          <EditButton onClick={() => history.push('/login')}>
            Join Corner
          </EditButton>
        </ButtonContainer>
      )}

      {state.auth && <ProfileModal profile={profile} />}

      <Div style={{ height: '54px' }} />
    </PageContainer>
  )

  // if (!loading && profileExists) {
  //   return (
  //     <PageContainer column width={12}>
  //       <Header
  //         title={
  //           profile.components.find((component) => component.type === 'name')
  //             ?.props.name
  //         }
  //       />

  //       <BodyContainer column width={mobile ? 11 : 8}>
  //         <CenteredContainer column width={12}>
  //           <FrontPageWrapper>
  //             {profile.components
  //               .filter((comp) => comp.type === 'headshot')
  //               .map((comp) => GenerateComponent(comp, profile))}
  //           </FrontPageWrapper>
  //           <FrontPageWrapper>
  //             {profile.components
  //               .filter((comp) => comp.type === 'headline')
  //               .map((comp) => GenerateComponent(comp, profile))}
  //             {!mobile &&
  //               profile.components
  //                 .filter((comp) => comp.type === 'bio')
  //                 .map((comp) => GenerateComponent(comp, profile))}
  //             {!mobile &&
  //               profile.components
  //                 .filter((comp) => comp.type === 'experiences')
  //                 .map((comp) => GenerateComponent(comp, profile))}
  //           </FrontPageWrapper>
  //         </CenteredContainer>

  //         <Div column width={12}>
  //           {mobile &&
  //             profile.components
  //               .filter(
  //                 (comp) => comp.type !== 'headshot' && comp.type !== 'headline'
  //               )
  //               .map((comp) => GenerateComponent(comp, profile))}
  //           {!mobile &&
  //             profile.components
  //               .filter(
  //                 (comp) =>
  //                   comp.type !== 'headshot' &&
  //                   comp.type !== 'headline' &&
  //                   comp.type !== 'bio' &&
  //                   comp.type !== 'experiences'
  //               )
  //               .map((comp) => GenerateComponent(comp, profile))}
  //         </Div>
  //       </BodyContainer>

  //       {!state.auth && (
  //         <ButtonContainer row width={12}>
  //           <EditButton onClick={() => history.push('/login')}>
  //             Join Corner
  //           </EditButton>
  //         </ButtonContainer>
  //       )}

  //       {state.auth && <ProfileModal profile={profile} />}

  //       <Div style={{ height: '54px' }} />
  //     </PageContainer>
  //   )
  // } else if (!loading && !profileExists) {
  //   return (
  //     <PageContainer column width={12}>
  //       <Header title={'Profile Not Found'} />

  //       <NotFoundContainer width={mobile ? 11 : 6}>
  //         <H1>This profile doesn't exist!</H1>
  //       </NotFoundContainer>

  //       {!state.auth && (
  //         <ButtonContainer row width={12}>
  //           <EditButton onClick={() => history.push('/login')}>
  //             Join Corner
  //           </EditButton>
  //         </ButtonContainer>
  //       )}
  //       {mobile && <Div style={{ height: '60px' }} />}
  //     </PageContainer>
  //   )
  // } else {
  //   return <div style={{ height: '100vh', backgroundColor: 'white' }} />
  // }
}
export default ProfilePage

// const BodyContainer = styled(Div)`
//   padding-top: 51px;
//   max-width: 1150px;
// `

const CenteredContainer = styled(Div)`
  justify-content: center;
  flex-direction: row;
  min-height: ${window.innerHeight - 111 + 'px'};
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

// const NotFoundContainer = styled(Div)`
//   flex: 1;
//   justify-content: center;
// `

const ButtonContainer = styled(Div)`
  display: flex;
  position: fixed;
  justify-content: space-between;
  max-width: 350px;
  @media (max-width: 768px) {
    margin: 0;
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

import React, { useState, useMemo, useCallback } from 'react'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'
import ExitIcon from '../icons/delete.svg'

// presentation/types
import {
  Div,
  H1,
  H2,
  ExternalImg,
  ComponentContainer,
} from '../components/Base'
import { IntegrationsComponent, Integration, Post } from '../models/Profile'

// logic
import {
  useProfileContext,
  updateComponent,
  deleteIntegration,
} from '../context/ProfileContext'
import { FetchSubstack, FetchMedium } from '../libs/api'

export const EditIntegrations: React.FC<IntegrationsComponent> = ({
  id,
  props,
}) => {
  const { profileState, profileDispatch } = useProfileContext()
  const [integrationUrl, setIntegrationUrl] = useState<string>('')

  const onChangeIntegrationUrl = (event: any) => {
    setIntegrationUrl(event.target.value)
  }

  const onAddIntegration = async () => {
    let integration = {}
    try {
      if (integrationUrl.includes('medium.com')) {
        const response = await FetchMedium(integrationUrl)
        integration = {
          id: uuidv4().toString(),
          type: 'medium',
          title: response.data.title,
          description: response.data.description,
          url: response.data.url,
          posts: response.data.posts,
        }
      } else if (integrationUrl.includes('substack.com')) {
        const response = await FetchSubstack(integrationUrl)
        integration = {
          id: uuidv4().toString(),
          type: 'substack',
          title: response.data.title,
          description: response.data.description,
          url: response.data.url,
          posts: response.data.posts,
        }
      }
    } catch (e) {
      console.log(e)
    }

    profileDispatch(
      updateComponent({
        id: id,
        type: 'integrations',
        props: {
          integrations: [
            ...profileState.profile.components.find(
              (comp) => comp.type === 'integrations'
            )?.props.integrations,
            integration,
          ],
        },
      })
    )
    setIntegrationUrl('')
  }

  if (profileState.editing) {
    return (
      <ComponentContainer>
        <H1>Integrations</H1>

        {/* the integrations edit row */}
        {profileState.profile.components
          .find((comp) => comp.type === 'integrations')
          ?.props.integrations.map((integration: Integration, idx: number) => (
            <IntegrationSection key={idx} integration={integration} />
          ))}

        {/* this is the integration input form */}
        <Div row width={12} style={{ alignItems: 'top', marginTop: '15px' }}>
          <Div column width={12}>
            <H2>Enter a link to your substack or medium</H2>
            <Div width={12} style={{ position: 'relative' }}>
              <input
                type="text"
                value={integrationUrl}
                onChange={onChangeIntegrationUrl}
              />
              <button onClick={onAddIntegration}>submit</button>
            </Div>
          </Div>
        </Div>
      </ComponentContainer>
    )
  } else {
    return (
      <ComponentContainer>
        <H1>Integrations</H1>

        {profileState.profile.components
          .find((comp) => comp.type === 'integrations')
          ?.props.integrations.map((integration: Integration, idx: number) => (
            <IntegrationSection key={idx} integration={integration} />
          ))}
      </ComponentContainer>
    )
  }
}

type IntegrationSectionProps = { integration: Integration; color?: string }
const IntegrationSection: React.FC<IntegrationSectionProps> = ({
  integration,
  color,
}) => {
  const { profileState, profileDispatch } = useProfileContext()
  const { id, type, posts } = integration
  const [numPostsVisible, setNumPostsVisible] = useState(1)

  const renderDelete = () => {
    if (profileState.editing) {
      return <DeleteIcon src={ExitIcon} onClick={onDeleteIntegration} />
    }
  }

  const onDeleteIntegration = () => {
    profileDispatch(deleteIntegration(id))
  }

  const renderLogoOrPlaceholder = (idx: number) => {
    if (idx === 0) {
      return (
        <LogoWrapper style={{ position: 'relative' }}>
          <ExternalImg
            src={`//logo.clearbit.com/${type}.com`}
            style={{
              minWidth: '51px',
              minHeight: '51px',
              backgroundSize: 'contain',
            }}
          />
          {renderDelete()}
        </LogoWrapper>
      )
    } else {
      return (
        // TODO: Match width to width of logo
        <div style={{ width: '51px' }}></div>
      )
    }
  }

  const renderSeeMore = () => {
    if (numPostsVisible < posts.length && !profileState.editing) {
      return <button onClick={onSeeMore}>See more</button>
    }
  }

  const onSeeMore = useCallback(() => {
    setNumPostsVisible((prevState) => prevState + 3)
  }, [])

  const renderCollapse = () => {
    if (numPostsVisible > 1 && !profileState.editing) {
      return <button onClick={onCollapse}>Collapse</button>
    }
  }

  const onCollapse = useCallback(() => {
    setNumPostsVisible(1)
  }, [])

  const postsToRender = useMemo(() => {
    return (
      <React.Fragment>
        {posts.map((post: Post, idx: number) => {
          if (
            (profileState.editing && idx === 0) ||
            (!profileState.editing && idx < numPostsVisible)
          ) {
            return (
              <Div
                row
                width={12}
                style={{ alignItems: 'top', marginTop: '15px' }}
                key={idx}
              >
                {renderLogoOrPlaceholder(idx)}
                <IntegrationText
                  column
                  width={12}
                  style={{ color: color || 'black' }}
                >
                  <a
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'unset' }}
                  >
                    <H2>{post.title}</H2>
                  </a>
                  <H2>{post.subtitle}</H2>
                  <H2>{post.timestamp}</H2>
                </IntegrationText>
              </Div>
            )
          } else {
            return <React.Fragment />
          }
        })}
        {renderSeeMore()}
        {renderCollapse()}
      </React.Fragment>
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numPostsVisible, profileState.editing])

  return postsToRender
}

const LogoWrapper = styled(Div)`
  margin-left: 15px;
  @media (max-width: 768px) {
    margin-left: 0px;
  }
`

const IntegrationText = styled(Div)`
  display: inline-block;
  margin-left: 15px;
`

const DeleteIcon = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  background-size: 50%;
  z-index: 2;
  height: 72px;
  width: 64px;
`

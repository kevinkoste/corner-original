import React from 'react'
import styled from 'styled-components'

import { useProfileContext, setAuth } from '../context/ProfileContext'
import { Div } from '../components/BaseComponents'
import { HomeHeader } from '../components/HomeHeader'

export const HomePage: React.FC = () => {

  const { dispatch } = useProfileContext()
  
  const onLogOutClick = () => {
    localStorage.removeItem("ACCESS_TOKEN")
    dispatch(setAuth(false))
	}
	
  return (
    <PageContainer column width={12}>

      <HomeHeader />

      <div id="cotter-form-container" style={{ width: 300, height: 300 }} />

      <button onClick={onLogOutClick} style={{margin: '20px 0px 20px 0px'}}>
        logout
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


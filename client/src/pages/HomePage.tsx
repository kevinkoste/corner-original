import React from 'react'
import styled from 'styled-components'

import { useAppContext, setAuth } from '../context/AppContext'
import { Div } from '../components/BaseComponents'
import { Header } from '../components/Header'

export const HomePage: React.FC = () => {

  const { dispatch } = useAppContext()
  
  const onLogOutClick = () => {
    localStorage.removeItem("ACCESS_TOKEN")
    dispatch(setAuth(false))
	}
	
  return (
    <PageContainer column width={12}>

      <Header title='Home' />

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


import React, { useState } from 'react'
import styled from 'styled-components'

// presentation/types
import { Div } from '../components/Base'

import MenuIcon from '../icons/menu-gradient.svg'

// logic
// import { useProfileContext } from '../context/ProfileContext'

export const ComponentMenu: React.FC<{ id?: string }> = ({ id, children }) => {
  // const { profileState, profileDispatch } = useProfileContext()
  const [showing, setShowing] = useState(false)

  const toggleMenu = () => {
    setShowing(!showing)
  }

  if (!showing) {
    return (
      <Div column style={{ overflow: 'auto' }}>
        <MenuImage src={MenuIcon} alt="menu icon" onClick={toggleMenu} />
        <DragBar className="field" />
        {children}
      </Div>
    )
  }

  return (
    <Div column style={{ overflow: 'auto' }}>
      <MenuImage src={MenuIcon} alt="menu icon" onClick={toggleMenu} />
      <DeleteButton>Delete</DeleteButton>
      <DeleteButton2>Edit</DeleteButton2>
      {children}
    </Div>
  )
}

const MenuImage = styled.img`
  position: absolute;
  z-index: 1;
  top: 16px;
  right: 0px;
  height: 30px;
  width: 30px;
`

const DeleteButton = styled.div`
  position: absolute;
  z-index: 1;
  top: 16px;
  left: 16px;

  height: 20px;
  width: 60px;

  padding: 8px;
  border-radius: 20px;

  background-color: red;
`

const DeleteButton2 = styled(DeleteButton)`
  left: 120px;
  background-color: blue;
`

const DragBar = styled.div`
  position: absolute;
  z-index: 1;
  top: 48px;
  right: 6px;

  height: 32px;
  width: 12px;

  border-radius: 2px;

  background-color: gray;
`

import React from 'react'
import styled from 'styled-components'

import { Div } from '../components/Base'
import DeleteIcon from '../icons/x-black.svg'
import DragIcon from '../icons/vertical-drag-black.svg'

import { useProfileContext, deleteComponent } from '../context/ProfileContext'

export const OptionBar: React.FC<{ id: string }> = ({ id }) => {
  const { profileDispatch } = useProfileContext()

  const onClick = () => {
    profileDispatch(deleteComponent(id))
  }

  return (
    <OptionBarContainer>
      <DeleteImage
        src={DeleteIcon}
        onClick={onClick}
        alt="delete component icon"
      />

      <DragImage src={DragIcon} alt="vertical drag icon" className="field" />
    </OptionBarContainer>
  )
}

const OptionBarContainer = styled(Div)`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`

const DeleteImage = styled.img`
  height: 20px;
  width: 20px;
  padding: 8px 0;
  :hover {
    cursor: pointer;
  }
`

const DragImage = styled.img`
  height: 20px;
  width: 20px;
  padding: 8px 0;
  cursor: grab;
`

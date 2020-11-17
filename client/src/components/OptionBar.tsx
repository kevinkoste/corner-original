import React from 'react'
import styled from 'styled-components'

import { Div } from './Base'
import ExitIcon from '../icons/bigdelete.svg'

export const OptionBar: React.FC = () => {
  return (
    <Div row width={12} style={{ justifyContent: 'space-between' }}>
      <DeleteButton src={ExitIcon} alt="exit burger button" />
      <DragBar className="field" />
    </Div>
  )
}

const DeleteButton = styled.img`
  height: 25px;
  width: 25px;
  :hover {
    cursor: pointer;
  }
`

const DragBar = styled(Div)`
  width: 20px;
  height: 30px;
  cursor: grab;
  background-color: gray;
  border-radius: 10px;
`

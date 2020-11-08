import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Container, Draggable } from 'react-smooth-dnd'

import {
  useDndContext,
  setComponents,
  swapComponents,
} from '../context/DndContext'
import { useMobile } from '../libs/hooks'

import { Div, H1, H2 } from '../components/Base'

export const DragPage: React.FC = () => {
  const mobile = useMobile()
  const { dndState, dndDispatch } = useDndContext()

  useEffect(() => {
    dndDispatch(
      setComponents([
        {
          id: '1',
          title: 'About Kevin',
          value: 1111,
        },
        {
          id: '2',
          title: `Kevin's Bookshelf`,
          value: 2222,
        },
        {
          id: '3',
          title: `Education`,
          value: 3333,
        },
        {
          id: '4',
          title: `Work`,
          value: 4444,
        },
      ])
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onDrop = (dropResult: any) => {
    const { removedIndex, addedIndex } = dropResult
    dndDispatch(swapComponents(removedIndex, addedIndex))
  }

  return (
    <Div column width={12} style={{ alignItems: 'center' }}>
      <Div column width={mobile ? 11 : 9}>
        <Container onDrop={onDrop} dragHandleSelector=".field" lockAxis="y">
          {dndState.components.map(({ id, title, value }, idx) => (
            <Draggable key={idx}>
              {/* put components in here! */}
              <Comp id={id} idx={idx} title={title} value={value} />
            </Draggable>
          ))}
        </Container>
      </Div>
    </Div>
  )
}

export default DragPage

type CompType = {
  idx: any
  id: any
  title: any
  value: any
}
const Comp: React.FC<CompType> = ({ title, value }) => {
  return (
    <Div column width={12} style={{ marginTop: '30px' }}>
      <Div row width={12} style={{ alignItems: 'center' }}>
        {/* this is the actual component! */}
        <Div column style={{ flex: 1 }}>
          <Div row width={12}>
            <H1 style={{ flex: 1 }}>{title}</H1>
            <DragBar className="field" />
          </Div>
          <H2>
            Content here: <br></br>
            {value} <br></br>
          </H2>
        </Div>
      </Div>
    </Div>
  )
}

const DragBar = styled(Div)`
  width: 20px;
  height: 30px;
  cursor: grab;
  background-color: gray;
  border-radius: 10px;
`

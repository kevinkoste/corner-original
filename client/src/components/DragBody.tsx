import React, { useState } from 'react'
// import styled from 'styled-components'
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

// import { Div } from '../components/BaseComponents'
// import { useDetectMobile } from '../libs/hooksLib'

// import { GenerateComponent } from '../components/ProfileItems'
// import { Component } from '../models/Profile'
// import { useProfileContext } from '../context/ProfileContext'


// const GenerateDraggableComponent = (component: Component, index: number) => {
//   return (
//     <Draggable draggableId={component.id} index={index}>
//       {provided => (
//         GenerateComponent(component, {
//           ref: provided.innerRef,
//           ...provided.draggableProps,
//           ...provided.dragHandleProps
//         })
//       )}
//     </Draggable>
//   )
// }


// export const ProfileBody: React.FC = () => {

//   const mobile: boolean = useDetectMobile()
  
//   const { state, dispatch } = useProfileContext()

//   const [items, setItems] = useState<any[]>(state.profile.data)

//   // handles dnd reorder logic
//   const onDragEnd = (result: any) => {
//     if (!result.destination || (result.destination.index === result.source.index)) {
//       return
//     }

//     // dispatch reorder event here instead of local state
//     setItems(reorder(
//       items,
//       result.source.index,
//       result.destination.index
//     ))
//   }

//   // helper function to reorder the list of items
//   const reorder = (list: any[], startIndex: number, endIndex: number) => {
//     const result = Array.from(list)
//     const [removed] = result.splice(startIndex, 1)
//     result.splice(endIndex, 0, removed)
  
//     return result
//   }

// 	return (
// 		<BodyContainer column width={mobile ? 11 : 6}>

//       <DragDropContext onDragEnd={onDragEnd}>
//         <Droppable droppableId="list">
//           {provided => (
//             <div ref={provided.innerRef} {...provided.droppableProps}>
//               {state.profile.data.map((component, index) => GenerateDraggableComponent(component, index))}
//               {provided.placeholder}
//             </div>
//           )}
//         </Droppable>
//       </DragDropContext>
				
// 		</BodyContainer>
// 	)
// }

// const BodyContainer = styled(Div)`
// `

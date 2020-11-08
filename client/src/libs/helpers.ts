import React from 'react'

type ListAnimationChild = {
  key: string | number
  ref: React.RefObject<HTMLElement>
  [x: string]: any
}

export type BoundingBoxType = {
  [index: string]: DOMRect
}

export const calculateBoundingBoxes = (children: ListAnimationChild[]) => {
  const boundingBoxes: BoundingBoxType = {}

  React.Children.forEach(children, (child) => {
    if (!child.ref.current) {
      return
    }

    const domNode = child.ref.current
    const nodeBoundingBox = domNode.getBoundingClientRect()

    boundingBoxes[child.key] = nodeBoundingBox
  })

  return boundingBoxes
}

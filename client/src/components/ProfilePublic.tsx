import React from 'react'

import { Component } from '../models/Profile'
import { Headline } from './Headline'
import { Bio } from './Bio'
import { Headshot } from './Headshot'
import { Experiences } from './Experiences'
import { Bookshelf } from './Bookshelf'

// GenerateComponent takes JSON {id, component, props},
// then generates a component from the Components map above
// id, key, and profile are injected as props to each component
type ComponentIndex = {
	[index: string]: any
}
const Components: ComponentIndex  = {
	headline: Headline,
  bio: Bio,
  headshot: Headshot,
	experiences: Experiences,
	bookshelf: Bookshelf
}

export const GenerateComponent = (component: Component, profile: any) => {
  // component exists
  if (typeof Components[component.type] !== 'undefined') {		
		return React.createElement(Components[component.type], {
			...component,
			key:component.id,
			profile: profile
		})
	}
	// component does not exist
  return <React.Fragment key={component.id} />
}
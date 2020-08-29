// top-level type defining a profile
export type Profile = {
  username: string,
  data: Component[]
}

export const EmptyProfile: Profile = {
  username: "",
  data: []
}

// COMPONENT PROPS TYPES //
export type NameProps = {
  id: string,
  name: string
}

export type HeadlineProps = {
  id: string,
  headline: string
}

export type BioProps = {
  id: string,
  bio: string
}

export type HeadshotProps = {
  id: string,
  image: string
}

export type ArticleProps = {
  id: string,
  source: string,
  title: string,
  subtitle: string,
  date: string,
  link: string
}

// COMPONENT TYPES //

export type Component = {
  id: string,
  component: 'name' | 'headline' | 'bio' | 'headshot' | 'article',
  props: NameProps | HeadlineProps | BioProps | HeadshotProps | ArticleProps
}

export type NameComponent = {
  id: string,
  component: 'name',
  props: NameProps
}

export type HeadlineComponent = {
  id: string,
  component: 'headline',
  props: HeadlineProps
}

export type BioComponent = {
  id: string,
  component: 'bio',
  props: BioProps
}

export type HeadshotComponent = {
  id: string,
  component: 'headshot',
  props: HeadshotProps
}

export type ArticleComponent = {
  id: string,
  component: 'article',
  props: ArticleProps
}
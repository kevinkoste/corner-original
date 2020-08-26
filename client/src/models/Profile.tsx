// top-level type defining a profile
export type Profile = {
  username: string,
  data: Component[]
}

export const EmptyProfile: Profile = {
  username: "",
  data: []
}

// base for all profile components
export type Component = {
  id: string,
  component: 'name' | 'headline' | 'bio' | 'image' | 'article',
  props: NameProps | HeadlineProps | BioProps | ImageProps | ArticleProps
}

// specific profile component types
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

export type ImageProps = {
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
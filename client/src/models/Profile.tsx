// top-level type defining a profile
export type Profile = {
  username: string,
  components: Component[]
}

export const EmptyProfile: Profile = {
  username: "",
  components: []
}

// COMPONENT TYPES //
export type Component = {
  id: string,
  type: string,
  props: any
}

export type NameComponent = {
  id: string,
  type: 'name',
  props: {
    name: string
  }
}

export type HeadlineComponent = {
  id: string,
  type: 'headline',
  props: {
    headline: string
  }
}

export type BioComponent = {
  id: string,
  type: 'bio',
  props: {
    bio: string
  }
}

export type HeadshotComponent = {
  id: string,
  type: 'headshot',
  props: {
    image: string
  }
}

export type Experience = {
  domain: string,
  title: string,
  company: string,
  date: string
}
export type ExperiencesComponent = {
  id: string,
  type: 'experiences',
  props: {
    experiences: Experience[],
  }
}

export type ArticleComponent = {
  id: string,
  type: 'article',
  props: {
    source: string,
    title: string,
    subtitle: string,
    date: string,
    link: string
  }
}

export type Post = {
  title: string,
  timestamp: string,
  subtitle: string,
  link: string
}
export type Integration = {
  type: string,
  title: string,
  description: string,
  url: string,
  posts: Post[]
}
export type IntegrationsComponent = {
  id: string,
  type: 'integrations',
  props: {
    integrations: Integration[]
  }
}

// top-level type defining a profile
export type Profile = {
  username: string,
  components: Component[]
}

export const EmptyProfile: Profile = {
  username: "",
  components: []
}

// COMPONENT PROPS TYPES //
// export type NameProps = {
//   name: string
// }

// export type HeadlineProps = {
//   headline: string
// }

// export type BioProps = {
//   bio: string
// }

// export type HeadshotProps = {
//   image: string
// }

// export type ArticleProps = {
//   source: string,
//   title: string,
//   subtitle: string,
//   date: string,
//   link: string
// }

// COMPONENT TYPES //

export type Component = {
  id: string,
  type: 'name' | 'headline' | 'bio' | 'headshot' | 'article',
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
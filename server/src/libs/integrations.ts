import axios from 'axios'

type Rss = {
  url: string
  title: string
  description: string
  posts: any[]
}

const parseRss = (url: string, rss: any) => {
  const parsedRss: Rss = {
    url: url,
    title: rss.feed.title,
    description: rss.feed.description,
    posts: [],
  }
  rss.items.forEach((post: any) => {
    parsedRss.posts.push({
      title: post.title,
      timestamp: post.pubDate,
      subtitle: post.description,
      link: post.link,
    })
  })
  return parsedRss
}

export const fetchSubstack = async (substackUrl: string) => {
  const res = await axios.get('https://api.rss2json.com/v1/api.json', {
    params: {
      rss_url: `${substackUrl}feed`,
    },
  })

  return parseRss(substackUrl, res.data)
}

export const fetchMedium = async (mediumUrl: string) => {
  const res = await axios.get('https://api.rss2json.com/v1/api.json', {
    params: {
      rss_url: mediumUrl.replace('medium.com/', 'medium.com/feed/'),
    },
  })

  return parseRss(mediumUrl, res.data)
}

import axios from 'axios'

export const fetchSubstack = (substackUrl: string) => {
  return axios.get("https://api.rss2json.com/v1/api.json", {
    params: {
      rss_url: substackUrl + "feed"
    }
  })
  .then(response => {
    return parseRss(substackUrl, response.data)
  }).catch(error => {
    console.error(error)
    return error
  });
}

export const fetchMedium = (mediumUrl: string) => {
  return axios.get("https://api.rss2json.com/v1/api.json", {
    params: {
      rss_url: mediumUrl.replace("medium.com/", "medium.com/feed/")
    }
  })
  .then(response => {
    return parseRss(mediumUrl, response.data)
  }).catch(error => {
    console.error(error)
    return error
  });
}


type Rss = {
  url: string,
  title: string,
  description: string,
  posts: any[]
}

const parseRss = (url: string, rss: any) => {
  const parsedRss: Rss = {
    url: url,
    title: rss.feed.title,
    description: rss.feed.description,
    posts: []
  }
  rss.items.forEach((post: any) => {
    parsedRss.posts.push({
      title: post.title,
      timestamp: post.pubDate,
      subtitle: post.description,
      link: post.link
    })
  });
  return parsedRss;
}
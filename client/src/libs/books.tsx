import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://www.googleapis.com',
})

export const GetBookData = (bookInput: string): Promise<any> => {
  return instance({
    method: 'get',
    url: `/books/v1/volumes`,
    params: {
      q: bookInput,
    },
  })
}

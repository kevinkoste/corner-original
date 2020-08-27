import Cotter from 'cotter'

export const cotter = new Cotter(process.env.REACT_APP_COTTER_API_KEY || 'c6a8b817-0f46-46d9-b503-409eb08ef6f6')

export const GetCotterToken = (): Promise<any> => {
  return cotter.tokenHandler.getAccessToken()
}


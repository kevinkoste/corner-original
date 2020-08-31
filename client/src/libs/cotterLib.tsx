import Cotter from 'cotter'

export const cotter = new Cotter({
  ApiKeyID: '193d4beb-caf1-4fd6-a170-9606af6eb8e6',
  Type: "EMAIL",
  // ContainerID: "cotter-container-signup",
  // RedirectURL: "https://yourwebsite.com/account/create",
  // SkipRedirectURL: true,
  // OnSuccess: payload => {
  //   // SET Token Cookie/localstorage here
  //   window.localStorage.setItem("access_token", payload?.access_token);
  //   window.localStorage.setItem("refresh_token", payload?.refresh_token);
  //   window.location.href = "/signin"
  // },

  // Change Country Code
  // CountryCode: ["+62"], // IT HAS TO BE AN ARRAY

  // Styling
  ButtonBackgroundColor: "#000000",
  ButtonTextColor: "#ffffff",
  ButtonText: "Join Corner",
  ButtonBorderColor: "#000000", // don't specify for no border
})

export const GetCotterToken = (): Promise<any> => {
  return cotter.tokenHandler.getAccessToken()
}


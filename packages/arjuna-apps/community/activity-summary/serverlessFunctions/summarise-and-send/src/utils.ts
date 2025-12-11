export const request = async (route: string, authToken?: string) => {
  const response = await fetch(
    `https://api.vedpragya.com/rest/${route}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.ARJUNA_API_KEY}`
      },
    }
  )

  const json = await response.json()
  return json.data
}

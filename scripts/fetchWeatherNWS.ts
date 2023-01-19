import Weather from '../models/weather'

// api provides 7 days max of weather info
export default async function fetchWeatherNWS(lat: string, long: string, ...days: Weather[]): Promise<Weather | undefined> {
  console.log('fetching', lat, long)
  if (!days.length || days.length > 7) {
    console.log('fetchWeather can update 7 days worth of weather, 0 or more than 7 requested were requested')
    return undefined
  }
  // get Geo Location info, hard coding atm
  // tulsa coordinates, need to figure out gps access
  // `https://api.weather.gov/points/36.1653,-96.0138`
  // const lat = '36.1653'
  // const long = '-96.0138'
  // okc
  // https://api.weather.gov/points/35.4676,-97.5164
  // const lat ='35.4676'
  // const long ='-97.5164'
  // new orleans
  // const lat = '29.9511'
  // const long = '-90.0715'

  // get geometry data from long / lat for forcast info
  try {
    const pointRes = await fetch(`https://api.weather.gov/points/${lat},${long}`)
    // check res status = 200
    if (pointRes.status != 200) {
      // local log file to store info about failure
      console.log(`Error: https://api.weather.gov/points/${lat},${long}`, pointRes)
      return undefined
    }
    const points = await pointRes.json()
    const grid = {
      id: points.properties.gridId,
      x: points.properties.gridX,
      y: points.properties.gridY,
    }
    const forecastRes = await fetch(`https://api.weather.gov/gridpoints/${grid.id}/${grid.x},${grid.y}/forecast/hourly`)
    if (forecastRes.status != 200) {
      // local log file to store info about failure
      console.log(`Error: https://api.weather.gov/gridpoints/${grid.id}/${grid.x},${grid.y}/forecast/hourly`, forecastRes)
      return undefined
    }
    // forcast pulls 7 days max
    const forecast = await forecastRes.json()

    for (const day of days) {
      const dayFilter = forecast.properties.periods.filter(
        (time: any) => time.startTime.includes(day.date)
      )
      day.low = Math.min(...dayFilter.map(
        (time: any) => time.temperature
      ))
      day.high = Math.max(...dayFilter.map(
        (time: any) => time.temperature
      ))
      day.avg = Math.round(dayFilter.reduce(
        (sum: number, time: any): number => sum + time.temperature, 0
      ) / dayFilter.length)
      day.rain = dayFilter.reduce(
        (val: boolean, time: any): boolean => val || time.shortForecast.includes('rain'), false
      )
      day.snow = dayFilter.reduce(
        (val: boolean, time: any): boolean => val || time.shortForecast.includes('snow'), false
      )
      day.lat = lat
      day.long = long
    }

    return days[0]
  } catch (e) {
    console.log('unexpected Error:', e)
    return undefined
  }
}

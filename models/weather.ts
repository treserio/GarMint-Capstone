interface weatherInterface {
  owner_id: String
  date: string
  high: number
  low: number
  avg: number
  rain: boolean
  snow: boolean
  expirationTime: number
  lat: string
  long: string
}

class Weather implements weatherInterface {
  owner_id: String
  date: string
  high: number
  low: number
  avg: number
  rain: boolean
  snow: boolean
  expirationTime: number
  lat: string
  long: string

  constructor(
    owner_id?: String,
    date?: string,
    high?: number,
    low?: number,
    avg?: number,
    rain?: boolean,
    snow?: boolean,
    expirationTime?: number,
    lat?: string,
    long?: string,
  ) {
    this.owner_id = owner_id ? owner_id : ''
    this.date = date ? date : ''
    this.high = high ? high : 100
    this.low = low ? low : 32
    this.avg = avg ? avg : 70
    this.rain = rain ? rain : false
    this.snow = snow ? snow : false
    this.expirationTime = expirationTime ? expirationTime : 0
    this.lat = lat ? lat : ''
    this.long = long ? long : ''
  }

  toJson(): any {return JSON.stringify(this)}

  public static fromJson(item: object): Weather {
    return Object.assign(new Weather(), item)
  }
}

export default Weather

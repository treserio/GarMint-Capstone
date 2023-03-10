import { createContext } from 'react'
import { DynamoDB } from 'aws-sdk'
import { Auth } from 'aws-amplify'
import awskeys from '../certificates/awskeys.json'

import Garmint from '../models/garmint'
import Weather from '../models/weather'
import fetchWeatherNWS from '../scripts/fetchWeatherNWS'

interface AppInfoInterface {
  db: DynamoDB.DocumentClient
  // db tables
  garmints: Array<Garmint>
  // tops: Array<Garmint>
  // bottoms: Array<Garmint>
  // garmintTypes: Array<String>
  garmintCount: number
  // get from weather api
  weather?: Weather
  getcha: boolean
  // month.date for numeric comparison for seasons, maybe 15th of month before / after for overlap
  seasons: Array<string>
}

export class AppInfo implements AppInfoInterface {
  // db access
  db: DynamoDB.DocumentClient
  // db tables
  garmints: Array<Garmint>
  // tops: Array<Garmint>
  // bottoms: Array<Garmint>
  garmintCount: number
  // get from weather api
  weather?: Weather
  getcha: boolean
  // month.date for numeric comparison for seasons, maybe 15th of month before / after for overlap
  seasons: Array<string>

  constructor() {
    // db access
    this.db = new DynamoDB.DocumentClient({
      region: 'us-east-2',
      credentials: {
        accessKeyId: awskeys.tofer.AWS_ACCESS_KEY_ID,
        secretAccessKey: awskeys.tofer.AWS_SECRET_ACCESS_KEY
      }
    })
    // db tables
    // this.tops = []
    // this.bottoms = []
    this.garmints = []
    this.garmintCount = 0
    // this.garmintTypes = ['tops', 'bottoms']
    this.getcha = true
    // stretch goal of working hours, maybe when you sleep
    this.seasons = this.getSeasons()
  }

  getSeasons(): Array<string> {
    const today = new Date()
    const dateValue = today.getMonth() + 1 + today.getDate() * 0.01
    const seasonArray: Array<string>  = []
    // seasons with 15 days of overlap
    // dec, jan, feb
    if (dateValue >= 11.15 || dateValue <= 3.15) seasonArray.push('winter')
    // mar, apr, may
    if (dateValue >= 2.15 && dateValue <= 6.15) seasonArray.push('spring')
    // jun, jul, aug
    if (dateValue >= 5.15 && dateValue <= 9.15) seasonArray.push('summer')
    // sep, oct, nov
    if (dateValue >= 7.15 && dateValue <= 12.15) seasonArray.push('fall')
    return seasonArray
  }

  async getUserData(setAppContext: any) {
    let user = null
    try {
      user = await Auth.currentAuthenticatedUser()
    } catch (e) {
      return
    }
    // console.log('getUserGarmints #=', this.garmintCount)
    if (user && this.getcha) {
      // stop the query from running multiple times, and 0 on error, else add correct val
      this.getcha = false
      // setup the query parameters
      const params: DynamoDB.DocumentClient.QueryInput = {
        TableName: 'garmints',
        KeyConditionExpression: `owner_id = :id AND item_number > :num`,
        ExpressionAttributeValues: {
          // 'f4299314-4135-4974-a430-5d9655d0fc33'
          ':id': user.username,
          ':num': 0,
        },
      }
      const that = new AppInfo()
      // run query and use data in callback
      // console.log('\nRunningQuery\n')
      this.db.query(params, async (err, data) => {
        if (err) {
          console.log('getUserGarmints Error:', err)
        }
				// console.log('data test for count:', data)
        if (data?.Count != 0) {
          // that.tops = data!.Items!.filter((item: any) => item.type == 'top')
          //   .map((item) => Garmint.fromJson(item))
          // that.bottoms = data!.Items!.filter((item: any) => item.type == 'bottom')
          //   .map((item) => Garmint.fromJson(item))
          that.garmints = data.Items!.map((item: any) => Garmint.fromJson(item))
        }
        that.garmintCount = data.Count ? data.Count : 0
        await that.getWeather()
        setAppContext(that)
      })
    }
  }

  // check dynamoDB for today's weather before grabbing 2 days from National Weather Service
  async getWeather(): Promise<void> {
    // confirm user is authenticated
    let user = null
    try {
      user = await Auth.currentAuthenticatedUser()
    } catch (e) {
      return
    }
    // stop multiple runs, useEffect has odd behaviors with async functions
    if (!this.getcha) return
    this.getcha = false
    // find today, and adjust for timezone
    const dateToday = new Date()
    dateToday.setMinutes(dateToday.getMinutes() - dateToday.getTimezoneOffset())
    const dateString = dateToday.toISOString().split('T')[0]
    // console.log('dateString', dateString)
    const params: DynamoDB.DocumentClient.QueryInput = {
      TableName: 'weather',
      KeyConditionExpression: `owner_id = :id AND #sortKey = :val`,
      // date is a reserved word, needs to be added this way
      ExpressionAttributeNames: {
        '#sortKey': 'date',
      },
      ExpressionAttributeValues: {
        ':id': user.username,
        ':val': dateString,
      },
    }
    this.db.query(params, async (err, data) => {
      // if query errs or if there isn't a weather value for today
      if (err || !data.Count) {
        if (err) console.log(err)
        await this.getWeatherNWS()
      } else {
        this.weather = Weather.fromJson(data.Items![0])
      }
    })
  }

  async getWeatherNWS(): Promise<void> {
    // get our authorized user
    let user = null
    try {
      user = await Auth.currentAuthenticatedUser()
    } catch (e) {
      return
    }
    // stop multiple runs
    if (this.weather) return
    const todaysWeather = new Weather()
    const tomorrowsWeather = new Weather()
    // create date time for today and tomorrow
    const dateToday = new Date()
    const dateTomorrow = new Date()
    // find tomorrow before adjusting today to local time to avoid changing day
    dateTomorrow.setDate(dateToday.getDate() + 1)
    // set to local time, getTimezoneOffset() returns opposite sign of the direction
    // eg: GMT-6 = 360, GMT+1 = -60
    dateToday.setMinutes(dateToday.getMinutes() - dateToday.getTimezoneOffset())
    dateTomorrow.setMinutes(dateTomorrow.getMinutes() - dateTomorrow.getTimezoneOffset())
    // set expiration dates for DynamoDB TTL auto expiration, no write costs to delete
    // 86400 seconds in a day, also getTime() is milliseconds, need seconds * 0.001
    todaysWeather.expirationTime = Math.round(dateTomorrow.getTime() * 0.001)
    tomorrowsWeather.expirationTime = Math.round(dateTomorrow.getTime() * 0.001 + 86400)
    // set owner_id
    todaysWeather.owner_id = user.username
    tomorrowsWeather.owner_id = user.username
    // set date strings
    todaysWeather.date = dateToday.toISOString().split('T')[0]
    tomorrowsWeather.date = dateTomorrow.toISOString().split('T')[0]

    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude.toFixed(4)
      const long = position.coords.longitude.toFixed(4)

      // set weather values for today and tomorrow, can fetch a max of 7 days
      this.weather = await fetchWeatherNWS(lat, long, todaysWeather, tomorrowsWeather)

      // if today's weather was found, fetch returns undefined on error
      if (this.weather) {
        // create our db params to send weather
        const params: any = {
          RequestItems: {
            'weather': [
              {
                PutRequest: {
                  Item: todaysWeather
                }
              },
              {
                PutRequest: {
                  Item: tomorrowsWeather
                }
              },
            ]
          }
        }
        this.db.batchWrite(params, (err, data) => {
          if (err) return console.log('batch Err:', err)
          // console.log('batch data', data)
        })
      }
    }, (err) => console.log('GeoError:', err))
  }
}

interface AppContext {
  appContext: AppInfo,
  setAppContext: Function
}

const appContext: AppContext = {appContext: new AppInfo(), setAppContext: () => {}}

export default createContext(appContext)

import { createContext } from 'react'
import { DynamoDB } from 'aws-sdk'
import { Auth } from 'aws-amplify'
import awskeys from '../certificates/awskeys.json'

import Garmint from '../models/garmint'
import Weather from '../models/weather'
import fetchWeatherNWS from '../scripts/fetchWeatherNWS'

export class AppInfo {
  // db access
  db: DynamoDB.DocumentClient
  // db tables
  tops: Array<Garmint>
  bottoms: Array<Garmint>
  garmintTypes: Array<String>
  garmintCount: number
  // get from weather api
  weather?: Weather

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
    this.tops = []
    this.bottoms = []
    this.garmintCount = 0
    this.garmintTypes = ['tops', 'bottoms']
    // stretch goal of working hours, maybe when you sleep
  }

  async getUserGarmints(setGarmintCount: any): Promise<void> {
    let user = null
    try {
      user = await Auth.currentAuthenticatedUser()
    } catch (e) {
      return
    }
    // console.log('getUserGarmints #=', this.garmintCount)
    if (user && this.garmintCount === 0) {
      // stop the query from running multiple times, and 0 on error, else add correct val
      this.garmintCount = 1
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
      // run query and use data in callback
      // console.log('\nRunningQuery\n')
      this.db.query(params, (err, data) => {
				console.log('data test for count:', data)
        if (data?.Count != 0) {
          this.tops = data!.Items!.filter((item: any) => item.type == 'top')
            .map((item) => Garmint.fromJson(item))
          this.bottoms = data!.Items!.filter((item: any) => item.type == 'bottom')
            .map((item) => Garmint.fromJson(item))
        }
        // may need to refresh
        setGarmintCount(data.Count)
        this.garmintCount = data.Count!
        // console.log('tops:', this.tops)
        // console.log('bottoms:', this.bottoms)
        console.log('garmintCount', this.garmintCount)
        if (err) {
          console.log('getUserGarmints Error:', err)
					// setGarmintCount(0)
          this.garmintCount = 0
        }
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
    if (this.weather) return
    this.weather = new Weather()
    // find today, and adjust for timezone
    const dateToday = new Date()
    dateToday.setMinutes(dateToday.getMinutes() - dateToday.getTimezoneOffset())
    const dateString = dateToday.toISOString().split('T')[0]
    console.log('dateString', dateString)
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
    this.db.query(params, (err, data) => {
      // if query errs or if there isn't a weather value for today
      if (err || !data.Count) {
        console.log(err)
        this.weather = undefined
        this.getWeatherNWS()
      } else {
        this.weather = Weather.fromJson(data.Items![0])
        console.log(this.weather)
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
    this.weather = todaysWeather
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
    console.log('tDate', todaysWeather.date)
    console.log('tomDate', tomorrowsWeather.date)
    // set weather values for today and tomorrow, can fetch a max of 7 days
    this.weather = await fetchWeatherNWS(todaysWeather, tomorrowsWeather)

    console.log('this', this.weather)
    console.log('today', todaysWeather)
    console.log('tomorrow', tomorrowsWeather)
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
  }
}

interface AppContext {
  appContext: AppInfo,
  setAppContext: Function
}

const appContext: AppContext = {appContext: new AppInfo(), setAppContext: () => {}}

export default createContext(appContext)

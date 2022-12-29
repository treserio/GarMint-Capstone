import Garmint from "../models/garmint"
import { createContext } from 'react'
import { DynamoDB } from 'aws-sdk'
import { Auth } from 'aws-amplify'
import awskeys from './awskeys.json'

interface Temperature {
  high: number,
  low: number,
  avg: number,
}

export class AppInfo {
  // db access
  db: DynamoDB.DocumentClient
  // db tables
  tops: Array<Garmint>
  bottoms: Array<Garmint>
  garmintTypes: Array<String>
  garmintCount: number
  // get from weather api
  temperature: Temperature
  weather: Array<String>

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
    // get from weather api
    this.temperature = { high: 0, low: 0, avg: 0 }
    this.weather = ['rainy', 'cloudy']
  }

  async getUserGarmints(setGarmintCount: any): Promise<void> {
    let user = null
    try {
      user = await Auth.currentAuthenticatedUser()
    } catch (e) {
      // console.log(e)
    }
    console.log('getUserGarmints #=', this.garmintCount)
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
      console.log('\nRunningQuery\n')
      this.db.query(params, (err, data) => {
        if (data?.Count != 0) {
          this.tops = data!.Items!.filter((item: any) => item.type == 'top')
            .map((item) => Garmint.fromJson(item))
          this.bottoms = data!.Items!.filter((item: any) => item.type == 'bottom')
            .map((item) => Garmint.fromJson(item))
          setGarmintCount(data.Count)
          this.garmintCount = data.Count!
        }
        console.log('tops:', this.tops)
        console.log('bottoms:', this.bottoms)
        console.log('garmintCount', this.garmintCount)
        if (err) {
          console.log('getUserGarmints Error:', err)
          this.garmintCount = 0
        }

      })
    }
  }

  async getWeatherInfo(): Promise<Temperature> {


    return { high: 0, low: 0, avg: 0 }
  }
}

interface AppContext {
  appContext: AppInfo,
  setAppContext: Function
}

const appContext: AppContext = {appContext: new AppInfo(), setAppContext: () => {}}

export default createContext(appContext)

import Garmint from "../models/garmint"
import { createContext } from 'react'
import { DynamoDB } from 'aws-sdk'
import { Auth } from 'aws-amplify'
import awskeys from './awskeys.json'


export class AppInfo {
  // db access
  db: DynamoDB.DocumentClient
  // db tables
  tops: Array<Garmint>
  bottoms: Array<Garmint>
  garmintTypes: Array<String>
  // get from weather api
  temperature: number
  weather: Array<String>

  constructor() {
    // db access
    this.db = new DynamoDB.DocumentClient({
      region: 'us-east-2',
      credentials: {
        accessKeyId: awskeys.AWS_ACCESS_KEY_ID,
        secretAccessKey: awskeys.AWS_SECRET_ACCESS_KEY
      }
    })
    // db tables
    this.tops = []
    this.bottoms = []
    this.garmintTypes = ['tops', 'bottoms']
    // get from weather api
    this.temperature = 70
    this.weather = ['rainy', 'cloudy']
  }

  async getUserGarmints() {
    const user = await Auth.currentAuthenticatedUser()
    // console.log(user.username)
    if (user) {
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
      this.db.query(params, (err, data) => {
        if (data?.Count) {
          this.tops = data!.Items!.filter((item: any) => item.type == 'top')
            .map((item) => Garmint.fromJson(item))
          this.bottoms = data!.Items!.filter((item: any) => item.type == 'bottom')
            .map((item) => Garmint.fromJson(item))
        }
        console.log('tops:', this.tops)
        console.log('bottoms:', this.bottoms)
        err && console.log('getUserGarmints Error:', err)
      })
    }
  }
}

export default createContext(new AppInfo())

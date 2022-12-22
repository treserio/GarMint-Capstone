import { createContext } from 'react'
import Garmint from "../models/garmint"
import { DynamoDBClient, QueryCommand, ScanCommand } from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'


class userGarmints {
  garmints: Array<Garmint>
  temperature: number
  weather: Array<String>
  wtf: any

  constructor() {
    // get garmints from DynamoDb
    this.garmints = []
    // get from weather api
    this.temperature = 70
    this.weather = ['rainy', 'cloudy']
    this.wtf = findGarmints
  }
}




const client = new DynamoDBClient({
  region: 'us-east-2',
})

const params = {
  TableName: 'tops',
}

const findGarmints = async function () {
  console.log('wtf')
  try {
    const res = await client.send(new ScanCommand(params))
    console.log(res.Items)
    const what = res.Items!.map((item) => Object.assign(new Garmint(), unmarshall(item)))
    console.log(what)
  } catch(err) {
    console.log(err)
  }
}

findGarmints()


export default createContext(
  new userGarmints()
)

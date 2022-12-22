import { v4 } from 'uuid'

interface GarmintInterface {
  id: String
  colors: String
  styles: String
  uses: number
  temperature: number
  image: String
}

class Garmint implements GarmintInterface {
  id: String
  colors: String
  styles: String
  uses: number
  temperature: number
  image: String

  constructor(
    id?: String,
    colors?: String,
    styles?: String,
    uses?: number,
    temperature?: number,
    image?: String,
  ) {
    this.id = id ? id : v4()
    this.colors = colors ? colors : ''
    this.styles = styles ? styles : ''
    this.uses = uses ? uses : 1
    this.temperature = temperature ? temperature : 65
    this.image = image ? image : ''
  }

  toJson(): any {return JSON.stringify(this)}

  fromDynamo(item: object): Garmint {
    return new Garmint()
  }

  // initialize garmint from json example
  // const item = Object.assign(new Garmint(), {
  //   id: '99',
  //   colors: ['red'],
  //   style: ['casual'],
  //   uses: 1,
  // })
}

export default Garmint

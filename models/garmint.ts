import { v4 } from 'uuid'

interface GarmintInterface {
  owner_id: String
  item_number: number
  type: String
  colors: String
  styles: String
  temperature: number
  image: String
  uses: number
}
// owner_id is the primary key, with iterative item number as sort value
class Garmint implements GarmintInterface {
  owner_id: String
  item_number: number
  type: String
  colors: String
  styles: String
  temperature: number
  image: String
  uses: number

  constructor(
    owner_id?: String,
    item_number?: number,
    type?: String,
    colors?: String,
    styles?: String,
    temperature?: number,
    image?: String,
    uses?: number,
  ) {
    this.owner_id = owner_id ? owner_id : ''
    this.item_number = item_number ? item_number : v4()
    this.type = type ? type : ''
    this.colors = colors ? colors : ''
    this.styles = styles ? styles : ''
    // may need to handle a celsius or farenhiet switch
    // maybe find the temperature type of the device?
    this.temperature = temperature ? temperature : 65
    this.image = image ? image : ''
    this.uses = uses ? uses : 1
  }

  toJson(): any {return JSON.stringify(this)}

  public static fromJson(item: object): Garmint {
    return Object.assign(new Garmint(), item)
  }
}

export default Garmint

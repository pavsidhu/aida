import Geocoder from 'react-native-geocoding'
import config from '../../config'

Geocoder.init(config.googleMaps.apiKey)

const intersect = (a, b) => new Set(a.filter(v => ~b.indexOf(v)))

const gettowncity = function(addressComponents) {
  if (
    typeof addressComponents === 'object' &&
    addressComponents instanceof Array
  ) {
    const order = [
      'sublocality_level_1',
      'neighborhood',
      'locality',
      'postal_town'
    ]

    for (let component of addressComponents) {
      if (intersect(order, component.types).size > 0) return component
    }
  }
  return false
}

export default async function getCity(latitude: number, longitude: number) {
  const response = await Geocoder.from(latitude, longitude)

  const { address_components } = response.results[0]
  return gettowncity(address_components).long_name
}

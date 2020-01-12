import Geocoder from 'react-native-geocoding'
import config from '../../config'

Geocoder.init(config.googleMaps.apiKey)

export default async function getCity(latitude: number, longitude: number) {
  const response = await Geocoder.from(latitude, longitude)

  const { address_components } = response.results[0]

  const town = address_components.find(component =>
    component.types.includes('postal_town')
  ).long_name

  return town
}

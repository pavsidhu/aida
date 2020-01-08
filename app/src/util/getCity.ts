import Geocoder from 'react-native-geocoding'
import config from '../../config'

Geocoder.init(config.googleMaps.apiKey)

export default async function getCity(latitude: number, longitude: number) {
  const response = await Geocoder.from(latitude, longitude)

  const { address_components } = response.results[0]

  const locality = address_components.find(component =>
    component.types.includes('locality')
  ).long_name

  const level2Area = address_components.find(component =>
    component.types.includes('administrative_area_level_2')
  ).long_name

  return `${locality}, ${level2Area}`
}

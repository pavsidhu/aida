import { AppRegistry } from 'react-native'
import App from './src/App'
import { name as appName } from './app.json'
import { YellowBox } from 'react-native'

YellowBox.ignoreWarnings([
  'Warning: componentWillReceiveProps has been renamed',
  'Error: [messaging/unregistered]'
])

AppRegistry.registerComponent(appName, () => App)

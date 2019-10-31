import { createAppContainer } from 'react-navigation'
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs'
import Chat from './src/Chat'
import Matches from './src/Matches'
import Profile from './src/Profile'

const App = createMaterialBottomTabNavigator({
  Chat: { screen: Chat },
  Matches: { screen: Matches },
  Profile: { screen: Profile }
})

export default createAppContainer(App)

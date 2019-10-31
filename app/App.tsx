import { createAppContainer } from 'react-navigation'
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { createStackNavigator } from 'react-navigation-stack'
import Chat from './src/Chat'
import Matches from './src/Matches'
import Profile from './src/Profile'

const ChatStack = createStackNavigator({
  Chat: {
    screen: Chat,
    navigationOptions: { header: null }
  }
})
const MatchesStack = createStackNavigator({
  Matches: {
    screen: Matches,
    navigationOptions: { header: null }
  }
})
const ProfileStack = createStackNavigator({
  Profile: {
    screen: Profile
  }
})

const App = createMaterialBottomTabNavigator(
  {
    Chat: { screen: ChatStack },
    Matches: { screen: MatchesStack },
    Profile: { screen: ProfileStack }
  },
  {
    barStyle: {
      backgroundColor: '#fefefe'
    }
  }
)

export default createAppContainer(App)

import React from 'react'
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs'
import {
  createStackNavigator,
  NavigationStackScreenComponent
} from 'react-navigation-stack'
import { TouchableRipple } from 'react-native-paper'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import Chat from './Chat'
import Matches from './Matches'
import MatchChat from './Matches/MatchChat'
import Profile from './Profile'
import Settings from './Profile/Settings'

const DEFAULT_NAVIGATION_OPTIONS = {
  headerStyle: { elevation: 0 },
  headerTitleStyle: {
    fontSize: 18
  }
}

interface Screen {
  name: string
  screen: (props: any) => JSX.Element | null
  headerTitle?: boolean
  navigationOptions?: NavigationStackScreenComponent['navigationOptions']
}

const generateTab = (screens: Screen[]) =>
  createStackNavigator(
    screens.reduce(
      (acc, screen) => ({
        ...acc,
        [screen.name]: {
          screen: screen.screen,
          navigationOptions: {
            ...DEFAULT_NAVIGATION_OPTIONS,
            ...screen.navigationOptions,
            headerTitle: screen.headerTitle !== false ? screen.name : null
          }
        }
      }),
      {}
    ),
    { headerLayoutPreset: 'center' }
  )

const ChatTab = generateTab([{ name: 'Chat', screen: Chat }])

const MatchesTab = generateTab([
  { name: 'Matches', screen: Matches },
  { name: 'MatchChat', screen: MatchChat, headerTitle: false }
])

const ProfileTab = generateTab([
  {
    name: 'Profile',
    screen: Profile,
    navigationOptions: ({ navigation }) => ({
      headerRight: () => (
        <TouchableRipple
          onPress={() => {
            navigation.navigate('Settings')
          }}
          style={{ padding: 16 }}
        >
          <MaterialIcon name="settings" size={24} color="#1b1b1b" />
        </TouchableRipple>
      )
    })
  },
  { name: 'Settings', screen: Settings }
])

const generateTabBarIcon = (name: string, focused: boolean) => (
  <MaterialIcon name={name} size={24} color={focused ? '#705EF1' : '#9b9b9b'} />
)

const Home = createMaterialBottomTabNavigator(
  {
    Chat: {
      screen: ChatTab,
      navigationOptions: {
        tabBarIcon: props => generateTabBarIcon('chat-bubble', props.focused)
      }
    },
    Matches: {
      screen: MatchesTab,
      navigationOptions: {
        tabBarIcon: props => generateTabBarIcon('people', props.focused)
      }
    },
    Profile: {
      screen: ProfileTab,
      navigationOptions: {
        tabBarIcon: props => generateTabBarIcon('person', props.focused)
      }
    }
  },
  {
    activeColor: '#705EF1',
    barStyle: { backgroundColor: '#fefefe' }
  }
)

export default Home

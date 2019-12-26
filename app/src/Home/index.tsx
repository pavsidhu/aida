import React from 'react'
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs'
import { createStackNavigator } from 'react-navigation-stack'
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

const ChatTab = createStackNavigator(
  {
    Chat: {
      screen: Chat,
      navigationOptions: {
        ...DEFAULT_NAVIGATION_OPTIONS,
        headerTitle: 'Chat'
      }
    }
  },
  { headerLayoutPreset: 'center' }
)

const MatchesTab = createStackNavigator(
  {
    Matches: {
      screen: Matches,
      navigationOptions: {
        ...DEFAULT_NAVIGATION_OPTIONS,
        headerTitle: 'Matches'
      }
    },
    MatchChat: {
      screen: MatchChat,
      navigationOptions: DEFAULT_NAVIGATION_OPTIONS
    }
  },
  { headerLayoutPreset: 'center' }
)

const ProfileTab = createStackNavigator(
  {
    Profile: {
      screen: Profile,
      navigationOptions: ({ navigation }) => ({
        ...DEFAULT_NAVIGATION_OPTIONS,
        headerTitle: 'Profile',
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
    Settings: {
      screen: Settings,
      navigationOptions: {
        ...DEFAULT_NAVIGATION_OPTIONS,
        headerTitle: 'Settings'
      }
    }
  },
  { headerLayoutPreset: 'center' }
)

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

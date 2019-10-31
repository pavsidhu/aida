import React from 'react'
import { createAppContainer } from 'react-navigation'
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { createStackNavigator } from 'react-navigation-stack'
import Chat from './src/Chat'
import Matches from './src/Matches'
import Profile from './src/Profile'
import { View } from 'react-native'

const ChatStack = createStackNavigator(
  {
    Chat: {
      screen: Chat,
      navigationOptions: {
        headerTitle: 'Chat',
        headerStyle: { elevation: 0 },
        headerTitleStyle: {
          fontSize: 18
        }
      }
    }
  },
  { headerLayoutPreset: 'center' }
)
const MatchesStack = createStackNavigator(
  {
    Matches: {
      screen: Matches,
      navigationOptions: {
        headerTitle: 'My Matches',
        headerStyle: { elevation: 0 },
        headerTitleStyle: {
          fontSize: 18
        }
      }
    }
  },
  { headerLayoutPreset: 'center' }
)

const ProfileStack = createStackNavigator(
  {
    Profile: {
      screen: Profile,
      navigationOptions: {
        headerTitle: 'My Profile',
        headerStyle: { elevation: 0 },
        headerTitleStyle: {
          fontSize: 18
        }
      }
    }
  },
  { headerLayoutPreset: 'center' }
)

const App = createMaterialBottomTabNavigator(
  {
    Chat: {
      screen: ChatStack,
      navigationOptions: {
        tabBarIcon: props => (
          <MaterialIcon
            name="chat-bubble"
            size={24}
            color={props.focused ? '#1b1b1b' : '#9b9b9b'}
          />
        )
      }
    },
    Matches: {
      screen: MatchesStack,
      navigationOptions: {
        tabBarIcon: props => (
          <MaterialIcon
            name="people"
            size={24}
            color={props.focused ? '#1b1b1b' : '#9b9b9b'}
          />
        )
      }
    },
    'My Profile': {
      screen: ProfileStack,
      navigationOptions: {
        tabBarIcon: props => (
          <MaterialIcon
            name="person"
            size={24}
            color={props.focused ? '#1b1b1b' : '#9b9b9b'}
          />
        )
      }
    }
  },
  {
    barStyle: {
      backgroundColor: '#eeeeee'
    }
  }
)

export default createAppContainer(App)

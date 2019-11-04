import React from 'react'
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { createStackNavigator } from 'react-navigation-stack'
import Chat from './Chat'
import Matches from './Matches'
import Profile from './Profile'
import Settings from './Profile/Settings'
import { TouchableRipple } from 'react-native-paper'

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
      navigationOptions: ({ navigation }) => ({
        headerTitle: 'My Profile',
        headerStyle: { elevation: 0 },
        headerTitleStyle: {
          fontSize: 18
        },
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
        headerTitle: 'Settings',
        headerStyle: { elevation: 0 },
        headerTitleStyle: {
          fontSize: 18
        }
      }
    }
  },
  { headerLayoutPreset: 'center' }
)

const Home = createMaterialBottomTabNavigator(
  {
    Chat: {
      screen: ChatStack,
      navigationOptions: {
        tabBarIcon: props => (
          <MaterialIcon
            name="chat-bubble"
            size={24}
            color={props.focused ? '#5C30D3' : '#9b9b9b'}
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
            color={props.focused ? '#5C30D3' : '#9b9b9b'}
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
            color={props.focused ? '#5C30D3' : '#9b9b9b'}
          />
        )
      }
    }
  },
  {
    activeColor: '#5C30D3',
    barStyle: {
      backgroundColor: '#fefefe'
    }
  }
)

export default Home

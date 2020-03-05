import React from 'react'
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs'
import {
  createStackNavigator,
  NavigationStackScreenComponent
} from 'react-navigation-stack'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

import Chat from './Chat'
import Matches from './Matches'
import MatchChat from './Matches/MatchChat'
import Profile from './Profile'
import Settings from './Settings'
import LeftHeader from './Header/LeftHeader'
import RightHeader from './Header/RightHeader'
import colors from '../colors'
import { Platform } from 'react-native'

const navigationOptions = (options?: {
  title?: string
  headerLeft?: boolean
  headerRight?: boolean
}): NavigationStackScreenComponent['navigationOptions'] => ({
  navigation
}) => ({
  ...(options?.title && { title: options.title }),
  ...(options?.headerLeft !== false && {
    headerLeft: <LeftHeader navigation={navigation} />
  }),
  ...(options?.headerRight !== false && {
    headerRight: <RightHeader navigation={navigation} />
  }),
  headerStyle: {
    elevation: 1,
    backgroundColor: colors.lilac
  },
  headerTintColor: Platform.select({
    ios: colors.purple,
    android: colors.black
  }),
  headerTitleStyle: {
    color: colors.black,
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 8
  }
})

const generateTabBarIcon = (name: string, focused: boolean) => (
  <MaterialIcon
    name={name}
    size={24}
    color={focused ? colors.purple : colors.inActiveTab}
  />
)

const Tabs = createMaterialBottomTabNavigator(
  {
    Aida: {
      screen: createStackNavigator(
        {
          Chat: {
            screen: Chat,
            navigationOptions: navigationOptions({ title: 'Aida' })
          }
        },
        { headerLayoutPreset: 'center' }
      ),
      navigationOptions: {
        tabBarIcon: props => generateTabBarIcon('chat-bubble', props.focused)
      }
    },
    Matches: {
      screen: createStackNavigator(
        {
          Matches: {
            screen: Matches,
            navigationOptions: navigationOptions({ title: 'Matches' })
          },
          MatchChat: {
            screen: MatchChat,
            navigationOptions: navigationOptions({
              headerLeft: false,
              headerRight: false
            })
          }
        },
        { headerLayoutPreset: 'center' }
      ),
      navigationOptions: {
        tabBarIcon: props => generateTabBarIcon('people', props.focused)
      }
    }
  },
  {
    activeColor: colors.purple,
    barStyle: {
      elevation: 10,
      backgroundColor: colors.white
    }
  }
)

const Home = createStackNavigator({
  Tabs: { screen: Tabs, navigationOptions: { header: null } },
  Profile: {
    screen: Profile,
    navigationOptions: navigationOptions({
      title: 'Profile',
      headerLeft: false,
      headerRight: false
    })
  },
  Settings: {
    screen: Settings,
    navigationOptions: navigationOptions({
      title: 'Settings',
      headerLeft: false,
      headerRight: false
    })
  }
})

export default Home

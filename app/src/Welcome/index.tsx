import { createStackNavigator } from 'react-navigation-stack'
import SignIn from './SignIn'
import Onboarding from './Onboarding'

const Welcome = createStackNavigator(
  {
    SignIn: { screen: SignIn },
    Onboarding: { screen: Onboarding }
  },
  { headerMode: 'none' }
)

export default Welcome

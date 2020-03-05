import React from 'react'
import { TouchableRipple } from 'react-native-paper'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { NavigationStackScreenProps } from 'react-navigation-stack'

import colors from '../../colors'

export default function RightHeader(props: NavigationStackScreenProps) {
  return (
    <TouchableRipple
      onPress={() => {
        props.navigation.navigate('Settings')
      }}
      style={{
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <MaterialIcon name="settings" size={24} color={colors.black} />
    </TouchableRipple>
  )
}

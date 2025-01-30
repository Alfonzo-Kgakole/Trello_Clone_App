import { View, Text } from 'react-native'
import React from 'react'
import { ModalType } from '@/types/enums'

// interface
interface AuthModalProps {
  authType:  ModalType | null
}

const AuthModal = ({authType}: AuthModalProps) => {
  return (
    <View>
      <Text>authMadal - type: {authType}</Text>
    </View>
  )
}

export default AuthModal
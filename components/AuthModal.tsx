import { View, Text, StyleSheet, TouchableOpacity,Image } from 'react-native'
import React from 'react'
import { AuthStrategy, ModalType } from '@/types/enums'
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { useOAuth, useSignIn, useSignUp } from '@clerk/clerk-expo';

//enum 
const LOGIN_OPTIONS = [
  {
    text: 'Continue with Google',
    icon: require('@/assets/images/login/google.png'),
    strategy: AuthStrategy.Google,
  },
  {
    text: 'Continue with Microsoft',
    icon: require('@/assets/images/login/microsoft.png'),
    strategy: AuthStrategy.Microsoft,
  },
  {
    text: 'Continue with Apple',
    icon: require('@/assets/images/login/apple.png'),
    strategy: AuthStrategy.Apple,
  },
  {
    text: 'Continue with Slack',
    icon: require('@/assets/images/login/slack.png'),
    strategy: AuthStrategy.Slack,
  },
];

// interface
interface AuthModalProps {
  authType: ModalType | null
}

const AuthModal = ({ authType }: AuthModalProps) => {
  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: AuthStrategy.Google });
  const { startOAuthFlow: microsoftAuth } = useOAuth({ strategy: AuthStrategy.Microsoft });
  const { startOAuthFlow: slackAuth } = useOAuth({ strategy: AuthStrategy.Slack });
  const { startOAuthFlow: appleAuth } = useOAuth({ strategy: AuthStrategy.Apple });
  const { signUp, setActive } = useSignUp();
  const { signIn } = useSignIn();

  const onSelectedAuth = async (strategy: AuthStrategy) => {
    if(!signIn || !signUp) return;

    const selectedAuth = {
      [AuthStrategy.Google]: googleAuth,
      [AuthStrategy.Microsoft]: microsoftAuth,
      [AuthStrategy.Apple]: appleAuth,
      [AuthStrategy.Slack]: slackAuth,
    }[strategy]

    try {
      const { createdSessionId, setActive } = await selectedAuth()

      if( createdSessionId) {
        setActive!({session: createdSessionId})
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <BottomSheetView style={[styles.modalContainer]}>
      <TouchableOpacity style={styles.modalBtn}>
        <Ionicons name="mail-outline" size={20} />
        <Text style={styles.btnText}>
          {authType === ModalType.Login ? 'Log in' : 'Sign up'} with Email
        </Text>
      </TouchableOpacity>
      {LOGIN_OPTIONS.map((option, index) => (
        <TouchableOpacity
        onPress={()=> onSelectedAuth(option.strategy)}
          key={index}
          style={styles.modalBtn}>
          <Image source={option.icon} style={styles.btnIcon} />
          <Text style={styles.btnText}>{option.text}</Text>
        </TouchableOpacity>
      ))}
    </BottomSheetView>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: "flex-start",
    padding: 20,
    gap: 20
  },
  modalBtn: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    borderColor: "#fff",
    borderWidth: 1
  },
  btnIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  btnText: {
    fontSize: 18
  }
})

export default AuthModal
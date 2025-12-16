import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Header } from './ui/header';

type AppLayoutsProps = {
  children: React.ReactNode
  heading: string
}

export default function AppLayouts ({children, heading} : AppLayoutsProps){
  return(
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
       <Header heading={heading} />
        <View style={styles.contentContainer}>
        {children}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff'
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingInline: 20,
  }
})
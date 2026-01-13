import { FloatingNavProvider } from '@/components/floatingNavContext';
import FloatingNav from '@/components/ui/floatingNav';
import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function TabLayout () {
  return (
      <FloatingNavProvider>
        <View style={{flex: 1}}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="checkout" />
            <Stack.Screen name="cashier" />
            <Stack.Screen name="history" />
            <Stack.Screen name="addData" />
            <Stack.Screen name="list" />
            <Stack.Screen name="detailHistory" />
        </Stack>
            <FloatingNav />
        </View>
      </FloatingNavProvider>
  )
}
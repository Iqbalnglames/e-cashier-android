import { Stack } from 'expo-router';

export default function TabLayout () {
  return (
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="cashier" options={{ headerShown: false }} />
        <Stack.Screen name="history" options={{ headerShown: false }} />
    </Stack>
  )
}
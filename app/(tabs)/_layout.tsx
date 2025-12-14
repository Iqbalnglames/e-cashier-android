import CustomTabBar from "@/components/customTabBar";
import { Tabs } from 'expo-router';

export default function TabLayout () {
  return (
      <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="menu" options={{ title: 'Menu' }} />
      <Tabs.Screen name="history" options={{ title: 'History' }} />
    </Tabs>
  )
}
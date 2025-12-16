import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <SafeAreaView edges={['bottom']} style={{ backgroundColor: '#fff' }}>
     <View
        style={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            right: 16,
            height: 64,
            borderRadius: 20,
            backgroundColor: '#fff',
            elevation: 8,
            flexDirection: 'row',
        }}
    >

        {state.routes.map((route: any, index: any) => {
          const isFocused = state.index === index;
          const { options } = descriptors[route.key]

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons
                name={ options.title === 'Home' ? 'home': options.title === 'Cashier' ? 'restaurant' : 'calendar-number' }
                size={24}
                color={isFocused ? '#4F46E5' : '#999'}
              />
              <Text
                style={{
                  fontSize: 12,
                  marginTop: 4,
                  color: isFocused ? '#4F46E5' : '#999',
                }}
              >
                {options.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.7;

type SideBarProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Sidebar({ open, setOpen }: SideBarProps) {
  const translateX = useSharedValue(-SIDEBAR_WIDTH);

    useEffect(() => {
    if (open) {
        translateX.value = withTiming(0, { duration: 250 });
    }
    }, [open]);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationX < 0) {
        translateX.value = e.translationX;
      }
    })
    .onEnd(() => {
      if (translateX.value < -SIDEBAR_WIDTH * 0.25) {
        translateX.value = withTiming(
          -SIDEBAR_WIDTH,
          { duration: 250 },
          () => runOnJS(setOpen)(false)
        );
      } else {
        translateX.value = withTiming(0, { duration: 250 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  if (!open) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.sidebar, animatedStyle]}>
          <View style={{flex: 1, flexWrap: 'wrap'}}>
            <View style={[styles.profile]}>
                <Ionicons name="person" size={70} />
            </View>
            <View style={{}}>
                <Text style={styles.profileText}>User</Text>
                <Text style={{fontWeight: 200, color: '#a0a0a0ff', marginLeft: 20}}>user@email.com</Text>
            </View>
            <View style={styles.line}></View>
            <View>
                <TouchableOpacity style={styles.SidebarButton}>
                    <Ionicons name="home" size={30} />
                    <Text style={{fontSize: 20}}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.SidebarButton}>
                    <Ionicons name="cart" size={30} />
                    <Text style={{fontSize: 20}}>Cashier</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.SidebarButton}>
                    <Ionicons name="calendar" size={30} />
                    <Text style={{fontSize: 20}}>Selling History</Text>
                </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    left: 0,
    position: "absolute",
    zIndex: 40,
    backgroundColor: "white",
    elevation: 7,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    width: SCREEN_WIDTH * 0.7,
    height: Dimensions.get("window").height,
  },
  profile: {
    padding: 10,
    marginTop: 50,
    borderRadius: 60,
    borderWidth: 1,
    alignSelf: 'flex-start'
  },
  profileText: {
    fontWeight: 800,
    fontSize: 50,
    marginLeft: 20,
  },
  line: {
    width: '100%',
    marginBlock: 10,
    height: 1,
    backgroundColor: '#a0a0a0ff',
  },
  SidebarButton: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  }

});

import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
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
            <View style={styles.profile}>
                <Ionicons name="person" size={70} />
            </View>
            <Text>Sidebar</Text>
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
    padding: 30,
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
    borderRadius: 60,
    borderWidth: 1,
  }
});

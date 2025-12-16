import { useEffect } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';

type Item = {
    id: number
    nama: string
    harga: number
    qty: number
}

type CartDrawerProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  items?: Item[]
};

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function CartDrawer({open, setOpen, items}: CartDrawerProps) {
    if(!open) return null

    const translateY = useSharedValue(SCREEN_HEIGHT)

    useEffect(() => {
        if (open) {
            translateY.value = withTiming(0, { duration: 300 });
        }
    }, [open]);

    const closeDrawer = () => {
        translateY.value = withTiming(
        SCREEN_HEIGHT,
        { duration: 300 },
        (finished) => {
            if (finished) {
            runOnJS(setOpen)(false);
            }
        }
        );
    };

    translateY.value = withTiming(open ? 0 : SCREEN_HEIGHT, {
        duration: 300
    })

    const panGesture = Gesture.Pan()
    .onUpdate(e => {
       if (e.translationY > 0) {
        translateY.value = e.translationY;
      }
    })
    .onEnd(() => {
       if (translateY.value > SCREEN_HEIGHT * 0.25) {
        translateY.value = withTiming(
          SCREEN_HEIGHT,
          { duration: 250 },
          () => runOnJS(setOpen)(false)
        );
      } else {
        translateY.value = withTiming(0, { duration: 250 });
      }
    });

   const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

    return(
     <View style={StyleSheet.absoluteFill}>
      <Pressable onPress={closeDrawer} style={styles.overlay} />
      <GestureDetector gesture={panGesture}>        
        <Animated.View style={[styles.drawer, animatedStyle]}>
            <Text style={{textAlign: 'center', marginBottom: 20, fontSize: 20, fontWeight: 800}}>Sub Total Items</Text>
            {!items || items.length == 0 ? <Text>Belum Ada Item</Text> : 
            items.map(item => {
                return(
                    <View style={styles.itemsContainer}>
                        <View>
                            <Text style={{fontWeight: 800, fontSize: 18}}>{item.nama}</Text>
                            <Text>Rp. {item.harga.toLocaleString('id-ID')}</Text>
                        </View>
                        <View>
                            <Text>x {item.qty}</Text>
                        </View>
                    </View>
                )
            })}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  drawer: {
    position: 'absolute',
    zIndex: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    bottom:0,
    height: SCREEN_HEIGHT * 0.8,
    width: '100%',
    backgroundColor: '#fff',
  },
  itemsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});

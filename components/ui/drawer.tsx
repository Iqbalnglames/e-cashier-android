import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Item = {
  id: number;
  nama_makanan: string;
  harga: number;
  qty: number;
};

type CartDrawerProps = {
  items?: Item[];
  setItems?: React.Dispatch<React.SetStateAction<Item[]>>
};

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function CartDrawer({ items, setItems }: CartDrawerProps) {
  const [ open, setOpen ] = useState(false);
  const [ totalHarga, setTotalHarga ] = useState<number>(0);
  const [ totalQty, setTotalQty ] = useState<number>(0);

  const translateY = useSharedValue(SCREEN_HEIGHT);
  
  
  useEffect(() => {
    if(items){
      setTotalHarga(items.reduce((sum, item) => sum + item.harga * item.qty, 0))
      setTotalQty(items.reduce((sum, item) => sum + item.qty, 0))
      setItems(items)      
    }
    if (open) {
      translateY.value = withTiming(0, { duration: 300 });
    }
  }, [open, items]);

  const increaseQty = (id: number) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id 
        ?
        {...item, qty: item.qty + 1}
        : 
        item
      )
      .filter(item => item.qty > 0)
    )
  }

  const decreaseQty = (id: number) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id 
        ?
        {...item, qty: item.qty - 1}
        : 
        item
      )
      .filter(item => item.qty > 0)
    )
  }

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

  const handleCheckOut = () => {
    router.push({
      pathname: '/(tabs)/checkout',
      params: {
        items: JSON.stringify(items),
      }
    })
  }

  const translateX = useSharedValue(0);
  const MAX_TRANSLATE = Dimensions.get('window').width - 100;
  const checkOutGesture = Gesture.Pan()
   .onUpdate((e) => {
    if (e.translationX > 0) {
      translateX.value = Math.min(e.translationX, MAX_TRANSLATE);
    }
  })
    .onEnd(() => {
      if (translateX.value > MAX_TRANSLATE * 0.85) {
        translateX.value = withTiming(MAX_TRANSLATE);
        runOnJS(handleCheckOut)()
      } else {
        translateX.value = withTiming(0);
      }
      setTimeout(() => {
        translateX.value = withTiming(0);
      }, 400)
    });

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) {
        translateY.value = e.translationY;
      }
    })
    .onEnd(() => {
      if (translateY.value > SCREEN_HEIGHT * 0.25) {
        translateY.value = withTiming(SCREEN_HEIGHT, { duration: 250 }, () =>
          runOnJS(setOpen)(false)
        );
      } else {
        translateY.value = withTiming(0, { duration: 250 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const checkoutStyle = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}]
  }));

  return (
    <>
      <TouchableOpacity onPress={() => setOpen(true)} style={styles.buttonCart}>
        <Text style={{color: 'white'}}>Checkout {totalQty} Items</Text>
        <View style={{flexDirection: 'row', gap: 4}}>
          <Ionicons name="basket" size={24} color={'white'} />
          <Text style={{color: 'white'}}>Rp. {totalHarga.toLocaleString('id-ID')}</Text>
        </View>
      </TouchableOpacity>
     {open &&(
       <View style={StyleSheet.absoluteFill}>
      <Pressable onPress={closeDrawer} style={styles.overlay} />
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.drawer, animatedStyle]}>
          <Text
            style={{
              textAlign: "center",
              marginBottom: 20,
              fontSize: 20,
              fontWeight: 800,
            }}
          >
            Sub Total Items
          </Text>
          {!items || items.length == 0 ? (
            <Text>Belum Ada Item</Text>
          ) : (
            items.map((item, index) => {
              return (
                <View key={index} style={styles.itemsContainer}>
                  <View>
                    <Text style={{ fontWeight: 800, fontSize: 18 }}>
                      {item.nama}
                    </Text>
                    <Text>Rp. {item.harga.toLocaleString("id-ID")}</Text>
                  </View>
                  <View style={styles.plusMinQty}>
                    <TouchableOpacity onPress={() => increaseQty(item.id)} style={styles.buttonQty}>
                      <Text>+</Text>
                    </TouchableOpacity>
                    <Text>{item.qty}</Text>
                    <TouchableOpacity onPress={() => decreaseQty(item.id)} style={styles.buttonQty}>
                      <Text>-</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}          
        </Animated.View>
      </GestureDetector>
      <View style={styles.button}>
          <GestureDetector gesture={checkOutGesture}>
             <Animated.View pointerEvents={items?.length === 0 ? 'none' : 'auto'} style={[styles.arrow, items?.length === 0 && { opacity: 0.5 }, checkoutStyle]}>
                <Ionicons name="chevron-forward-circle" size={60} color="white" />
             </Animated.View>
          </GestureDetector>
            <View>
              <Text style={{ color: "white", textAlign: "center" }}>
                {items?.length == 0
                  ? "Belum Ada Item"
                  : "Geser ke Kanan Untuk Checkout"}
              </Text>
            </View>
          </View>
    </View>
     )}     
    </>
    
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  plusMinQty: {
    flexDirection: 'row',
    gap: 10
  },
  buttonQty: {
    paddingBlock: 1,
    paddingInline: 6,
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center'
  },
  arrow: {
    position: "absolute",
    top: -1,
    left: 0,
  },
  buttonCart: {
    position: 'absolute',
    elevation: 10,
    zIndex: 10,
    left: 20,
    right: 20,
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 5,
    padding: 16,
    borderRadius: 40,
    backgroundColor: 'blue',
    },
  button: {
    position: "absolute",
    elevation: 10,
    zIndex: 10,
    left: 20,
    right: 20,
    bottom: 20,
    alignItems: "center",
    gap: 5,
    padding: 20,
    borderRadius: 40,
    backgroundColor: "blue",
  },
  drawer: {
    position: "absolute",
    zIndex: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    bottom: 0,
    height: SCREEN_HEIGHT * 0.8,
    width: "100%",
    backgroundColor: "#fff",
  },
  itemsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

import AppLayouts from '@/components/appLayouts';
import CartDrawer from '@/components/ui/drawer';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Cashier() {

const DATA_MAKANAN_KEY = "DATA_MAKANAN"

 type Makanan = {
  id: number
  nama: string
  harga: number
  kategori: string
}

type CartItem = Makanan & { qty: number }

const [ activeCategory, setActiveCategory ] = useState<string | null>(null)
const [ dataMakanan, setDataMakanan ] = useState<Makanan[]>([])  
const [ cartItems, setCartItems ] = useState<CartItem[]>([])

useEffect(() => {
  muatData()
},[])

const muatData = async() => {
  try {
    const jsonVal = await AsyncStorage.getItem(DATA_MAKANAN_KEY)
    if(jsonVal != null) {
      setDataMakanan(JSON.parse(jsonVal))
    }
  } catch(e) {
    Alert.alert('GAGAL', e)
  }
}

const categories = [...new Set(dataMakanan.map(item => item.kategori))]
  
  const filteredData = useMemo(() => {
  if (!activeCategory || activeCategory == 'all') return dataMakanan
    return dataMakanan.filter(item => item.kategori === activeCategory)
  }, [activeCategory, dataMakanan])

  const capitalizeFirst = (string: string) => {
    if(string != undefined) {
      if(string.length === 0) {
        return string
      }
      return string.charAt(0).toUpperCase() + string.slice(1)
    }
  }

  const onPressButton = (category: string) => {
    setActiveCategory(category)
  }

  const addToCart = (item: CartItem) => {
  setCartItems(prev => {
    const exist = prev.find(i => i.id === item.id)

    if (exist) {
      return prev.map(i =>
        i.id === item.id
          ? { ...i, qty: i.qty + 1 }
          : i
      )
    }

    return [...prev, item]
  })
}


  return (
    <AppLayouts heading="Cashier">
      <FlatList
        data={filteredData}
        numColumns={2}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={{
          padding: 10,
          gap: 10,
          paddingBottom: 100,
        }}
        columnWrapperStyle={{ gap: 10 }}
        ListHeaderComponent={() => (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 10 }}
            >
              <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TouchableOpacity
                    onPress={() => onPressButton('all')}
                    style={styles.smallCard}
                  >
                    <Ionicons name="fast-food" size={24} />
                    <Text>Semua</Text>
                  </TouchableOpacity>
                {categories.map(category => (
                  <TouchableOpacity
                    key={category}
                    onPress={() => onPressButton(category)}
                    style={styles.smallCard}
                  >
                    <Ionicons name="fast-food" size={24} />
                    <Text>{capitalizeFirst(category)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <Text>{capitalizeFirst(activeCategory == null ? 'Semua' : activeCategory == 'all' ? 'Semua' : activeCategory)}</Text>
          </>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => addToCart({id: item.id, nama: item.nama_makanan, harga: item.harga, qty: 1})}
            style={styles.card}
          >
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: item.foto }}
                style={{ width: 180, height: '100%' }}
              />
            </View>
            <View style={{ padding: 10 }}>
              <Text style={{ fontWeight: 'bold' }}>{item.nama_makanan}</Text>
              <Text>Rp. {Number(item.harga).toLocaleString('id-ID')}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <CartDrawer       
        items={cartItems}
        setItems={setCartItems}
      />
</AppLayouts>
  )
}

const styles = StyleSheet.create({
  
  smallCard: {
    padding: 5,
    flexDirection: 'row',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'green',
  },
  card: {
    width: 170,
    borderWidth: 2,
    borderColor: 'grey',
    borderRadius: 10,
  },
  imageWrapper: {
    height: 150,
    overflow: 'hidden',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  }

})
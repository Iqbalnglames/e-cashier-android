import AppLayouts from '@/components/appLayouts';
import CartDrawer from '@/components/ui/drawer';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PRODUCTS_KEY = '@kasir_products_v1';
const SALES_KEY = '@kasir_sales_v1';


const dataMakan = [
  { id: 1, nama: 'Tempe Goreng', harga: 5000, category: 'makanan' },
  { id: 2, nama: 'Tahu Goreng', harga: 8000, category: 'makanan' },
  { id: 3, nama: 'Risol Mayo', harga: 10000, category: 'makanan' },
  { id: 4, nama: 'Otak Otak', harga: 15000, category: 'makanan' },
  { id: 5, nama: 'Es Teh', harga: 5000, category: 'minuman' },
  { id: 6, nama: 'Es Teh', harga: 5000, category: 'minuman' },
  { id: 7, nama: 'Es Teh', harga: 5000, category: 'minuman' },
]

const categories = [...new Set(dataMakan.map(item => item.category))]

const IMAGE_URL = 'https://asset.kompas.com/crops/f3PxrJKuM1Aa_gjYA21_eKdBFXM=/100x67:900x600/1200x800/data/photo/2023/04/01/6427b71555180.jpg'

export default function Cashier() {

  type Item = {
    id: number
    nama: string
    harga: number
    qty: number
}

  const [ activeCategory, setActiveCategory ] = useState<string | null>(null)
  const [ selectedSubTotal, setSelectedSubTotal ] = useState<number | 0>(0)
  const [cartOpen, setCartOpen] = useState(false);
  const [ cartItems, setCartItems ] = useState<Item[]>([])
  
  const filteredData = useMemo(() => {
    if (!activeCategory || activeCategory == 'all') return dataMakan
    return dataMakan.filter(item => item.category === activeCategory)
  }, [activeCategory])

  const capitalizeFirst = (string: string) => {
    if(string.length === 0) {
      return string
    }
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const onPressButton = (category: string) => {
    setActiveCategory(category)
  }

  const totalHarga = cartItems.reduce((sum, item) => sum + item.harga * item.qty, 0)
  const totalQty = cartItems.reduce((sum, item) => sum + item.qty, 0)

  const addToCart = (item:Item) => {
    setCartItems(prev => {
      const exist = prev.find(i => i.id == item.id)
      if(exist) {
        return prev.map(i => 
          i.id == item.id ? {...i, qty: i.qty + 1} 
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
            onPress={() => addToCart({id: item.id, nama: item.nama, harga: item.harga, qty: 1})}
            style={styles.card}
          >
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: IMAGE_URL }}
                style={{ width: '100%', height: '100%' }}
              />
            </View>
            <View style={{ padding: 10 }}>
              <Text style={{ fontWeight: 'bold' }}>{item.nama}</Text>
              <Text>Rp. {item.harga.toLocaleString('id-ID')}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity onPress={() => setCartOpen(true)} style={styles.button}>
          <Text style={{color: 'white'}}>Checkout {totalQty} Items</Text>
          <View style={{flexDirection: 'row', gap: 4}}>
            <Ionicons name="basket" size={24} color={'white'} />
            <Text style={{color: 'white'}}>Rp. {totalHarga ? totalHarga.toLocaleString('id-ID') : 0}</Text>
          </View>
      </TouchableOpacity>
      <CartDrawer
        open={cartOpen}
        setOpen={setCartOpen}
        items={cartItems}
      />
</AppLayouts>


  )
}

const styles = StyleSheet.create({
  button: {
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
  smallCard: {
    padding: 5,
    flexDirection: 'row',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'green',
  },
  card: {
    minWidth: 170,
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
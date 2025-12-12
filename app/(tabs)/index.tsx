import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PRODUCTS_KEY = '@kasir_products_v1';
const SALES_KEY = '@kasir_sales_v1';

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({}); // { productId: { ...product, qty }}
  const [sales, setSales] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });
  const [view, setView] = useState('pos'); // 'pos' | 'history'

  // Load saved data
  useEffect(() => {
    (async () => {
      try {
        const rawProducts = await AsyncStorage.getItem(PRODUCTS_KEY);
        const rawSales = await AsyncStorage.getItem(SALES_KEY);
        if (rawProducts) setProducts(JSON.parse(rawProducts));
        else {
          const seed = [
            { id: 'p1', name: 'Nasi Goreng', price: 15000 },
            { id: 'p2', name: 'Es Teh', price: 5000 },
            { id: 'p3', name: 'Bakso', price: 20000 },
          ];
          setProducts(seed);
          await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(seed));
        }
        if (rawSales) setSales(JSON.parse(rawSales));
      } catch (e) {
        console.error('Load error', e);
      }
    })();
  }, []);

  // Persist products
  const saveProducts = useCallback(async (next) => {
    setProducts(next);
    try {
      await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(next));
    } catch (e) {
      console.error('Save products err', e);
    }
  }, []);

  // Persist sales
  const saveSales = useCallback(async (next) => {
    setSales(next);
    try {
      await AsyncStorage.setItem(SALES_KEY, JSON.stringify(next));
    } catch (e) {
      console.error('Save sales err', e);
    }
  }, []);

  const addProduct = async () => {
    const name = newProduct.name.trim();
    const price = parseInt(newProduct.price, 10);
    if (!name || isNaN(price) || price <= 0) {
      Alert.alert('Validasi', 'Nama dan harga harus diisi dengan benar');
      return;
    }
    const id = 'p' + Date.now();
    const next = [...products, { id, name, price }];
    await saveProducts(next);
    setNewProduct({ name: '', price: '' });
    setShowAddModal(false);
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev[product.id];
      const updated = { ...prev };
      updated[product.id] = { ...product, qty: existing ? existing.qty + 1 : 1 };
      return updated;
    });
  };

  const changeQty = (productId, delta) => {
    setCart(prev => {
      const item = prev[productId];
      if (!item) return prev;
      const next = { ...prev };
      const newQty = item.qty + delta;
      if (newQty <= 0) {
        delete next[productId];
      } else {
        next[productId] = { ...item, qty: newQty };
      }
      return next;
    });
  };

  const cartTotal = () => {
    return Object.values(cart).reduce((s, it) => s + it.price * it.qty, 0);
  };

  const checkout = async () => {
    const items = Object.values(cart);
    if (items.length === 0) {
      Alert.alert('Keranjang kosong', 'Tambahkan produk terlebih dahulu');
      return;
    }
    const total = cartTotal();
    const sale = {
      id: 's' + Date.now(),
      items,
      total,
      createdAt: new Date().toISOString(),
    };
    const nextSales = [sale, ...sales];
    await saveSales(nextSales);
    setCart({});
    Alert.alert('Sukses', `Checkout berhasil. Total: Rp ${formatNumber(total)}`);
  };

  const formatNumber = (n) => {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const clearAll = async () => {
    Alert.alert('Hapus semua data', 'Apakah Anda yakin ingin menghapus semua produk dan riwayat penjualan?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus', style: 'destructive', onPress: async () => {
        try {
          await AsyncStorage.removeItem(PRODUCTS_KEY);
          await AsyncStorage.removeItem(SALES_KEY);
          setProducts([]);
          setSales([]);
          setCart({});
          Alert.alert('Dihapus', 'Semua data dihapus.');
        } catch (e) { console.error(e); }
      } }
    ]);
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>Rp {formatNumber(item.price)}</Text>
      </View>
      <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(item)}>
        <Text style={styles.addBtnText}>Tambah</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCartItem = ({ item }) => (
    <View style={styles.cartRow}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: '600' }}>{item.name}</Text>
        <Text>Rp {formatNumber(item.price)} x {item.qty} = Rp {formatNumber(item.price * item.qty)}</Text>
      </View>
      <View style={styles.qtyControls}>
        <TouchableOpacity style={styles.qtyBtn} onPress={() => changeQty(item.id, -1)}>
          <Text>-</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.qtyBtn} onPress={() => changeQty(item.id, 1)}>
          <Text>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSale = ({ item }) => (
    <View style={styles.saleCard}>
      <Text style={{ fontWeight: '700' }}>#{item.id}</Text>
      <Text>{new Date(item.createdAt).toLocaleString()}</Text>
      <Text>Total: Rp {formatNumber(item.total)}</Text>
      <View style={{ marginTop: 8 }}>
        {item.items.map(it => (
          <Text key={it.id}>- {it.name} x {it.qty} = Rp {formatNumber(it.price * it.qty)}</Text>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Kasir Digital</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={[styles.headerBtn, styles.headerBtnSpacing]} onPress={() => setView('pos')}>
            <Text>POS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.headerBtn, styles.headerBtnSpacing]} onPress={() => setView('history')}>
            <Text>Riwayat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.headerBtn, styles.headerBtnSpacing]} onPress={() => setShowAddModal(true)}>
            <Text>Tambah Produk</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtnDanger} onPress={clearAll}>
            <Text style={{ color: '#fff' }}>Hapus Semua</Text>
          </TouchableOpacity>
        </View>
      </View>

      {view === 'pos' && (
        <View style={{ flex: 1 }}>
          <Text style={styles.sectionTitle}>Daftar Produk</Text>
          <FlatList data={products} keyExtractor={p => p.id} renderItem={renderProduct} ListEmptyComponent={<Text style={{ padding: 12 }}>Belum ada produk.</Text>} />

          <View style={styles.cartBox}>
            <Text style={{ fontWeight: '700' }}>Keranjang</Text>
            <FlatList data={Object.values(cart)} keyExtractor={i => i.id} renderItem={renderCartItem} ListEmptyComponent={<Text style={{ padding: 6 }}>Keranjang kosong</Text>} />
            <View style={styles.cartFooter}>
              <Text style={{ fontSize: 18, fontWeight: '700' }}>Total: Rp {formatNumber(cartTotal())}</Text>
              <TouchableOpacity style={styles.checkoutBtn} onPress={checkout}><Text style={{ color: '#fff' }}>Checkout</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {view === 'history' && (
        <View style={{ flex: 1 }}>
          <Text style={styles.sectionTitle}>Riwayat Penjualan</Text>
          <FlatList data={sales} keyExtractor={s => s.id} renderItem={renderSale} ListEmptyComponent={<Text style={{ padding: 12 }}>Belum ada penjualan.</Text>} />
        </View>
      )}

      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>Tambah Produk</Text>
            <TextInput placeholder="Nama produk" value={newProduct.name} onChangeText={(t) => setNewProduct(prev => ({ ...prev, name: t }))} style={styles.input} />
            <TextInput placeholder="Harga (angka)" value={newProduct.price} onChangeText={(t) => setNewProduct(prev => ({ ...prev, price: t.replace(/[^0-9]/g, '') }))} keyboardType="numeric" style={styles.input} />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setShowAddModal(false)} style={[styles.modalBtn, styles.modalBtnSpacing]}><Text>Batal</Text></TouchableOpacity>
              <TouchableOpacity onPress={addProduct} style={[styles.modalBtn, { backgroundColor: '#2a9d8f' }]}><Text style={{ color: '#fff' }}>Simpan</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 12, borderBottomWidth: 1, borderColor: '#eee', backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '800' },
  headerButtons: { flexDirection: 'row', alignItems: 'center' },
  headerBtn: { padding: 8, borderWidth: 1, borderColor: '#ddd', borderRadius: 6, backgroundColor: '#fff' },
  headerBtnSpacing: { marginRight: 8 },
  headerBtnDanger: { padding: 8, borderRadius: 6, backgroundColor: '#e63946' },
  sectionTitle: { margin: 12, fontSize: 16, fontWeight: '700' },
  productCard: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#fff', marginHorizontal: 12, marginBottom: 8, borderRadius: 8, borderWidth: 1, borderColor: '#eee' },
  productName: { fontSize: 16, fontWeight: '700' },
  productPrice: { color: '#555' },
  addBtn: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#2a9d8f', borderRadius: 6 },
  addBtnText: { color: '#fff', fontWeight: '700' },
  cartBox: { margin: 12, padding: 12, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#eee' },
  cartRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#f1f1f1' },
  qtyControls: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: { padding: 8, borderWidth: 1, borderColor: '#ddd', borderRadius: 4, minWidth: 36, alignItems: 'center', marginHorizontal: 4 },
  cartFooter: { marginTop: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  checkoutBtn: { padding: 10, borderRadius: 8, backgroundColor: '#264653' },
  modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)', padding: 20 },
  modalBox: { backgroundColor: '#fff', padding: 16, borderRadius: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 6, marginBottom: 8 },
  modalBtn: { padding: 10, borderRadius: 6, backgroundColor: '#eee' },
  modalBtnSpacing: { marginRight: 8 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' },
  saleCard: { backgroundColor: '#fff', padding: 12, margin: 12, borderRadius: 8, borderWidth: 1, borderColor: '#eee' }
});

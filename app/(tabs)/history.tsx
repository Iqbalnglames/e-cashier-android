import AppLayouts from "@/components/appLayouts"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { router } from "expo-router"
import React, { useEffect, useState } from "react"
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native"

const NOTA_KEY = 'NOTA_PENJUALAN'

type Item = {
  id: number;
  nama_makanan: string;
  harga: number;
  qty: number;
  tanggal_transaksi: string;
};

export default function History() {

    const [ items, setItems ] = useState<Item[]>([])

    useEffect(() => {
        showData()
    },[])

    const detailData = async(id: any) => {
    router.push({
        pathname: '/detailHistory',
        params: { id: String(id) },
    });
    }

    const showData = async() => {
        try {
            const jsonVal = await AsyncStorage.getItem(NOTA_KEY)
            const parsedArr = JSON.parse(jsonVal)
            setItems([...parsedArr].reverse())
        } catch(e) {
            Alert.alert('Gagal', `${e}`)
        }
    }
    
    return(
        <AppLayouts heading="Riwayat Penjualan">
            <FlatList
                data={items}               
                contentContainerStyle={{
                gap: 10,
                paddingBottom: 100,
                }}
                renderItem={({ item }) => (
                <TouchableOpacity           
                    style={styles.card}
                    onPress={() => detailData(item.id)}
                >            
                    <View style={{ padding: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Transaksi No.#{item.id}</Text>
                    <Text>{item.tanggal_transaksi}</Text>
                    </View>
                </TouchableOpacity>
                )}
            />
        </AppLayouts>
    )
}

const styles = StyleSheet.create({
  card: {
    minWidth: 170,
    borderWidth: 2,
    borderColor: 'grey',
    borderRadius: 10,
  },
})


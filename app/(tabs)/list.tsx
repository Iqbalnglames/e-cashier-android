import AppLayouts from "@/components/appLayouts"
import AsyncStorage from "@react-native-async-storage/async-storage"
import React, { useEffect, useState } from "react"
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native"


export default function List() {

    type Makanan = {
        id: number
        nama: string
        harga: number
        kategori: string
    }
    
    const [ dataMakanan, setDataMakanan ] = useState<Makanan[]>([])

    const DATA_MAKANAN_KEY = "DATA_MAKANAN"

    useEffect(() => {
        showData()
    },[])

    const hapusData = async(id: any) => {
        Alert.alert(
            'Konfirmasi Hapus Data',
            'Apakah kamu yakin ingin menghapus data?',
            [
                {
                    text: 'Batal',
                    style: 'cancel',
                },
                {
                    text: 'Iya',
                    onPress: async() => {
                        try{          
                                const filtered = dataMakanan.filter(item => item.id !== id)

                                await AsyncStorage.setItem(DATA_MAKANAN_KEY, JSON.stringify(filtered))

                                setDataMakanan(filtered)
                            }catch(e) {
                                Alert.alert(`error ${e}`)
                            }
                    }
                },

            ]
        )       
    }

    const showData = async() => {
        try {
            const jsonVal = await AsyncStorage.getItem(DATA_MAKANAN_KEY)
            setDataMakanan(JSON.parse(jsonVal))
        } catch(e) {
            Alert.alert('Gagal', e)
        }
    }
    
    return(
        <AppLayouts heading="Data Penjualan">
            <FlatList
                data={dataMakanan}               
                contentContainerStyle={{
                gap: 10,
                paddingBottom: 100,
                }}
                renderItem={({ item }) => (
                <TouchableOpacity           
                    style={styles.card}
                    onPress={() => hapusData(item.id)}
                >            
                    <View style={{ padding: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{item.nama_makanan}</Text>              
                    <Text>{item.kategori}</Text>              
                    <Text>Rp. {Number(item.harga).toLocaleString('id-ID')}</Text>
                    </View>
                </TouchableOpacity>
                )}
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


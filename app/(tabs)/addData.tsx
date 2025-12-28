import AppLayouts from "@/components/appLayouts"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as ImagePicker from "expo-image-picker"
import React, { useState } from "react"
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { TextInput } from "react-native-gesture-handler"

export default function AddData() {
    const [ namaMakanan, setNamaMakanan ] = useState<string>('')
    const [ harga, setHarga ] = useState<string>('')
    const [ kategori, setKategori ] = useState<string>('')
    const [ foto, setFoto ] = useState(null)

    const DATA_MAKANAN_KEY = "DATA_MAKANAN"

    const simpanMakanan = async() => {
        try {
            const dataMakananBaru = {id: Date.now().toLocaleString('id'), nama_makanan:namaMakanan, harga, kategori, foto}
            const dataMakananLama = await AsyncStorage.getItem(DATA_MAKANAN_KEY)
            const list = dataMakananLama ? JSON.parse(dataMakananLama) : []

            if(namaMakanan == '' || harga == '' || kategori == ''){
                Alert.alert(
                    'Peringatan',
                    'Isi Semua Form yang ada'
                )
                return
            }

            const listTerbaru = [...list, dataMakananBaru]

            await AsyncStorage.setItem(DATA_MAKANAN_KEY, JSON.stringify(listTerbaru))
            Alert.alert('Sukses', 'Data berhasil disimpan!');
        } catch(e) {
            Alert.alert(`Gagal: ${e}`)
        }
    }

    const pilihFoto = async() => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.7
        })
         if (!result.canceled) {
            setFoto(result.assets[0].uri);
        }
    }
    
    return(
        <AppLayouts heading="Tambah Data">
            <View>
                <Text>Nama Makanan</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nama Makanan"
                    value={namaMakanan}
                    onChangeText={setNamaMakanan}
                />
            </View>
            <View>
                <Text>Harga</Text>
                <TextInput
                    inputMode="numeric"
                    style={styles.input}
                    placeholder="Harga"
                    value={harga}
                    onChangeText={setHarga}
                />
            </View>
            <View>
                <Text>Kategori</Text>
                <TextInput
                    style={styles.input}
                    placeholder="kategori"
                    value={kategori}
                    onChangeText={setKategori}
                />
            </View>
            <View>
        <TouchableOpacity style={[styles.button, {marginBottom: 10}]} onPress={pilihFoto}>
          <Ionicons name="cloud-upload" size={18} color={'white'} />
          <Text style={{color: 'white', fontSize: 15}}>Pilih Foto</Text>
        </TouchableOpacity>
        {foto && (
          <Image
            source={{ uri: foto }}
            style={{ width: 120, height: 120, marginTop: 10 }}
          />
        )}
      </View>
            <View>
                <TouchableOpacity style={styles.button} onPress={simpanMakanan}>
                    <Ionicons name="save" color={'white'} size={18} />
                    <Text style={{color: 'white', fontSize: 15}}>Simpan Data</Text>
                </TouchableOpacity>
            </View>
        </AppLayouts>
    )
}

const styles = StyleSheet.create({
    inputSection: {
        flexDirection: 'column',
        gap: 20
    },
    input: { 
        borderWidth: 1, 
        borderColor: '#ccc', 
        padding: 10, 
        marginBottom: 10, 
        borderRadius: 5 
    },
    button: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        gap: 5,
        padding: 20,
        textAlign: 'center',
        fontSize: 18,
        borderRadius: 5,
        color: 'white',
        backgroundColor: 'blue',
    }
})


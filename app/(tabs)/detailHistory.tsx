import AppLayouts from "@/components/appLayouts";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as MediaLibrary from 'expo-media-library';
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ViewShot from "react-native-view-shot";

const NOTA_KEY = 'NOTA_PENJUALAN'

type Item = {
  id: number;
  nama: string;
  harga: number;
  qty: number;
};

type NotaPenjualan = {
  id: number;
  tanggal_transaksi: string;
  items: Item[];
  total_harga: number;
  total_qty: number;
};


export default function DetailHistory() {

    const { id } = useLocalSearchParams<{ id: string }>();

    const [ item, setItem ] = useState<NotaPenjualan | null>(null)

     const loadData = async () => {
      try {
        const jsonVal: NotaPenjualan[] = await AsyncStorage.getItem(NOTA_KEY)
        const valueData = JSON.parse(jsonVal)

        const found = valueData.find(nota => nota.id == id);
        if (found) {
            setItem(found);
        }
      } catch (e) {
        Alert.alert("Error", String(e));
      }
    };

    useEffect(() => {
        loadData()
    },[])

    const ref = useRef<ViewShot>(null)
    
    const capture = async() => {
        const uri = await ref.current?.capture()
        try{
            
            const { status } = await MediaLibrary.requestPermissionsAsync()
            if (status === 'granted') {
    await MediaLibrary.saveToLibraryAsync(uri);
    alert('Nota berhasil disimpan!');
  } else {
    alert('Izin akses galeri ditolak.');
  }

            await MediaLibrary.saveToLibraryAsync(uri)
        }catch(e) {
            Alert.alert('error', `${e}`)
        }
    }

    return(
        <AppLayouts 
            heading="Nota"
            bgColor="#0a62c7"
        >
            <ViewShot style={styles.receipt} ref={ref}>
                <View style={{justifyContent: 'center', flexDirection: 'row', marginBottom: 15}}>
                    <Image style={{width: 70, height: 70}} source={{
                        uri: 'https://cdn-icons-png.flaticon.com/512/8215/8215539.png'
                    }} />
                </View>
                <Text style={{textAlign: "center", fontWeight: 'bold', fontSize: 20}}>Transaksi Selesai</Text>
                <View style={{gap: 10, marginTop: 20}}>
                    <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
                        <Text style={{fontWeight: '300'}}>Tanggal</Text>
                        <Text style={{fontWeight: '400'}}>{item?.tanggal_transaksi}</Text>
                    </View>
                    <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
                        <Text style={{fontWeight: '300'}}>No. Nota</Text>
                        <Text style={{fontWeight: '400'}}>{item?.id}</Text>
                    </View>
                <View style={[styles.sobekan, {left: 0, marginRight: 0}]}>
                    <View>
                        <Text style={{fontSize: 40, fontWeight: '100'}}>----------------------------</Text>
                    </View>
                </View>
                    {item?.items.map((item) => (
                        <View key={item.id} style={{flexDirection:'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <View style={{flexDirection:'row', gap: 10}}>                                                     
                                <Text style={{fontWeight: '300'}}>{item.nama}</Text>
                                <Text style={{fontWeight: '300'}}>x{item.qty}</Text>
                            </View>
                                <Text style={{fontWeight: '400'}}>Rp. {(item.qty * item.harga).toLocaleString('id-ID')}</Text>
                        </View>
                    ))}
                <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
                    <Text style={{fontWeight: '300'}}>Total</Text>
                    <Text style={{fontWeight: '400'}}>Rp. {item?.total_harga}</Text>
                </View>
                <View style={styles.sobekan}>
                    <View style={styles.circle}></View>
                    <View>
                        <Text style={{fontSize: 40, fontWeight: '100'}}>-----------------------------</Text>
                    </View>
                    <View style={styles.circle}></View>
                </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={{fontWeight: '300'}}>Metode Pembayaran</Text>
                        <Text>QRIS</Text>
                    </View>
                    <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
                            <Text style={{fontWeight: '300'}}>No. Nota</Text>
                            <Text style={{fontWeight: '400'}}>1124112</Text>
                    </View>
                    <View style={{flexDirection:'row', justifyContent: 'center'}}>
                            <Text>Terima kasih Atas Kunjungan Anda</Text>
                    </View>
                    <View style={{gap: 10}}>
                        <TouchableOpacity style={styles.button} onPress={capture}>
                            <Ionicons name="download" color={'white'} size={18} />
                            <Text style={{color: 'white', fontSize: 15}}>Unduh Nota</Text>
                        </TouchableOpacity>
                        <Link href={'/history'}>
                            <Text style={{fontWeight: 'bold',fontSize: 18, textAlign: 'center', color: "#0a62c7"}}>Selesai</Text>
                        </Link>
                    </View>
                </View>
            </ViewShot>
        </AppLayouts>
    )
}

const styles = StyleSheet.create({
    sobekan: {
        alignItems: 'center', 
        left: -40, 
        marginRight: -60,
        justifyContent: 'space-between', 
        flexDirection: 'row'
    },
    button: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        gap: 5,
        padding: 20,
        textAlign: 'center',
        fontSize: 18,
        borderRadius: 5,
        color: 'white',
        backgroundColor: 'blue',
    },
    receipt: {
        padding: 20,
        backgroundColor: 'white',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        position: 'relative'
    },
    circle: {
        backgroundColor: '#0a62c7',
        width: 33,
        height: 33,
        borderRadius: 40,        
    }
})
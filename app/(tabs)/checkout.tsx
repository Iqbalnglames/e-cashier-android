import AppLayouts from "@/components/appLayouts";
import { useLocalSearchParams } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

export default function Checkout() {
    const { items } = useLocalSearchParams()

    const parsedItems = items ? JSON.parse(items as string) : []

    const totalHarga = parsedItems.reduce((sum, item) => sum + item.harga * item.qty, 0)

    return(
        <AppLayouts heading="Nota">
            <View style={styles.receipt}>
                <View style={{justifyContent: 'center', flexDirection: 'row', marginBottom: 20}}>
                    <Image style={{width: 100, height: 100}} source={{
                        uri: 'https://cdn-icons-png.flaticon.com/512/8215/8215539.png'
                    }} />
                </View>
                <Text style={{textAlign: "center", fontWeight: 'bold', fontSize: 20}}>Transaksi Selesai</Text>
                <View style={{gap: 10, marginTop: 20}}>
                    {parsedItems.map((item) => (
                        <View key={item.id} style={{flexDirection:'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <Text>{item.nama}</Text>
                            <View>
                                <Text style={{textAlign: 'right'}}>x{item.qty}</Text>                        
                                <Text style={{textAlign: 'right'}}>Rp. {(item.qty * item.harga).toLocaleString('id-ID')}</Text>
                            </View>
                        </View>
                    ))}
                <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
                    <Text style={{fontWeight: 'bold'}}>Total</Text>
                    <Text style={{fontWeight: 'bold'}}>Rp. {totalHarga.toLocaleString()}</Text>
                </View>
                </View>
            </View>
        </AppLayouts>
    )
}

const styles = StyleSheet.create({
    receipt: {
        borderWidth: 0.5,
        borderColor: 'black',
        padding: 20,
        borderRadius: 8,
        
    }
})
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Landing() {
    return(
        <View style={styles.container}>
            <Text style={styles.textHeading}>Buat Bisnismu Makin Mudah Dikelola</Text>
            <Text style={{marginBottom: 15}}>e cashier app dapat membantu mendata bisnismu tanpa ribet pendataan</Text>
            <Image source={require('../assets/images/cashier.png')} style={{width: 350, height: 400}} />
            <TouchableOpacity onPress={() => router.push('/(tabs)/cashier')} style={styles.button}>
                <Text style={{color: 'white'}}>Masuk Ke Aplikasi</Text>
                <Ionicons name="arrow-forward" size={24} color={'white'} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        gap: 20,
        backgroundColor: '#ffff',
    },
    textHeading: {
        fontWeight: 800,
        fontSize: 30,
        lineHeight: 50,
    },
    textCenter: {
        textAlign: 'center',
        alignContent: 'center',
        fontSize: 20
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
        borderRadius: 40,
        color: 'white',
        backgroundColor: 'blue',

    }
})
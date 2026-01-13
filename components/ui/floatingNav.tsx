import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFloatingNav } from "../floatingNavContext";

const NOT_ALLOWED_ROUTE = [
    '/detailHistory',
    '/checkout',
]

export default function FloatingNav() {
    const pathname = usePathname();
    const router = useRouter();

    const { hide } = useFloatingNav();

    if (hide) return null;

    if(NOT_ALLOWED_ROUTE.includes(pathname)) return null;

    return(
        <View style={styles.fab}>
            <TouchableOpacity onPress={() => router.push('/')} style={{justifyContent: 'center', alignItems: 'center'}}>
                <Ionicons name="home" size={30}/>
                <Text style={{textAlign: 'center'}}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/cashier')} style={{justifyContent: 'center', alignItems: 'center'}}>
                <Ionicons name="cart" size={30}/>
                <Text style={{textAlign: 'center'}}>Cashier</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/list')} style={{justifyContent: 'center', alignItems: 'center'}}>
                <Ionicons name="list" size={30}/>
                <Text style={{textAlign: 'center'}}>Data</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/history')} style={{justifyContent: 'center', alignItems: 'center'}}>
                <Ionicons name="calendar" size={30}/>
                <Text style={{textAlign: 'center'}}>History</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    fab: {
        zIndex: 0,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 40,
        alignItems: 'center',
        backgroundColor: 'white',
        elevation: 8,
        position: 'absolute',
        bottom: 25,
        left: 20,
        right: 20,
        height: 60,
    }
})
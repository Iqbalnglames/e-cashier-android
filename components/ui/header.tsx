import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { useState } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Sidebar from "./sidebar"

type HeaderProps = {
 heading : string
}
export const Header = ({ heading }: HeaderProps) => {
    const [ open, setOpen ] = useState(false)
    return(
        <View style={styles.headerContainer}>
            <Sidebar open={open} setOpen={setOpen} />
            <TouchableOpacity onPress={() => setOpen(!open)} style={{alignItems: 'flex-start', alignSelf: 'center', padding: 10, backgroundColor: '#bedeff5c', borderRadius: 15, height: 50, borderWidth: 1}}>
                <View style={{flex: 1, justifyContent: 'center', gap: 5}}>
                    <View style={{width: 30, height: 4, borderRadius: 5, backgroundColor: 'black'}}></View>
                    <View style={{width: 20, height: 4, borderRadius: 5, backgroundColor: 'black'}}></View>
                    <View style={{width: 30, height: 4, borderRadius: 5, backgroundColor: 'black'}}></View>
                </View>
            </TouchableOpacity>
            <Text style={{fontSize: 19, textAlignVertical: 'center', fontWeight: 600}}>{heading}</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/addData')} style={{alignItems: 'flex-start', alignSelf: 'center', padding: 10, backgroundColor: '#bedeff5c', borderRadius: 15, height: 50, borderWidth: 1}}>
                <Ionicons name="add" size={26} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer : {
        display: 'flex', 
        flexDirection: 'row', 
        gap: 10, 
        justifyContent: 'space-between', 
        padding: 20
    },
})
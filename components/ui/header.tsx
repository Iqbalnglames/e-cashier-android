import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

type HeaderProps = {
 heading : string
}
export const Header = ({ heading }: HeaderProps) => {
    return(
            <View style={styles.headerContainer}>
        <TouchableOpacity style={{alignItems: 'flex-start', alignSelf: 'center', padding: 10, backgroundColor: '#bedeff5c', borderRadius: 15, height: 50, borderWidth: 1}}>
                    <View style={{flex: 1, justifyContent: 'center', gap: 5}}>
                      <View style={{width: 30, height: 4, borderRadius: 5, backgroundColor: 'black'}}></View>
                      <View style={{width: 20, height: 4, borderRadius: 5, backgroundColor: 'black'}}></View>
                      <View style={{width: 30, height: 4, borderRadius: 5, backgroundColor: 'black'}}></View>
                    </View>
        </TouchableOpacity>
                <Text style={{fontSize: 19, textAlignVertical: 'center', fontWeight: 600}}>{heading}</Text>
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
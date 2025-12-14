import { StyleSheet, Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function History() {
    return(
        <SafeAreaView>
            <Text style={styles.textColor}>apakah anda yakin</Text>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {backgroundColor: '#ffffff'},
    textColor: {color: '#ffffff'}
})
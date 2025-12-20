import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function Checkout() {
    const { items } = useLocalSearchParams()

    const parsedItems = items ? JSON.parse(items as string) : []

    return(
        <View style={{backgroundColor: 'white'}}>
        {parsedItems.map((item) => (
            <Text key={item.id}>{[item.nama, item.qty]}</Text>
        ))}
        </View>
    )
}
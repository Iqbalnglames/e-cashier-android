import React from 'react';
import { Alert, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const PRODUCTS_KEY = '@kasir_products_v1';
const SALES_KEY = '@kasir_sales_v1';

const dataMakan = [
  {nama: 'Tempe Goreng', harga: 'Rp. 5.000'},
  {nama: 'Tahu Goreng', harga: 'Rp. 8.000'},
  {nama: 'Risol Mayo', harga: 'Rp. 10.000'},
  {nama: 'Otak Otak', harga: 'Rp. 15.000'},
]

export default function Index (){

  const onPressButton = () => {
    Alert.alert('halo')
  }

  return(
    <SafeAreaProvider>
      <SafeAreaView style={{backgroundColor: 'white'}}>
        <View style={{display: 'flex', flexDirection: 'row', gap: 10, justifyContent: 'space-between', padding: 20}}>
          <TouchableOpacity onPress={onPressButton} style={{alignItems: 'flex-start', alignSelf: 'center', padding: 10, backgroundColor: '#bedeff5c', borderRadius: 15, height: 50, borderWidth: 1}}>
            <View style={{flex: 1, justifyContent: 'center', gap: 5}}>
              <View style={{width: 30, height: 4, borderRadius: 5, backgroundColor: 'black'}}></View>
              <View style={{width: 20, height: 4, borderRadius: 5, backgroundColor: 'black'}}></View>
              <View style={{width: 30, height: 4, borderRadius: 5, backgroundColor: 'black'}}></View>
            </View>
          </TouchableOpacity>
          <Text style={{fontSize: 19, textAlignVertical: 'center'}}>Order #10</Text>
           <TouchableOpacity onPress={onPressButton} style={{alignItems: 'flex-start', alignSelf: 'center', padding: 10, backgroundColor: '#bedeff5c', borderRadius: 15, height: 50, borderWidth: 1}}>
            <View style={{flex: 1, justifyContent: 'center', gap: 5}}>
              <View style={{width: 30, height: 4, borderRadius: 5, backgroundColor: 'black'}}></View>
              <View style={{width: 20, height: 4, borderRadius: 5, backgroundColor: 'black'}}></View>
              <View style={{width: 30, height: 4, borderRadius: 5, backgroundColor: 'black'}}></View>
            </View>
          </TouchableOpacity>
        </View>
        <SafeAreaView style={{ margin: 20, gap: 10}}>
          <FlatList 
            data={dataMakan}
            numColumns={2}
            keyExtractor={(_, i) => i.toString()}
            ItemSeparatorComponent={() => <View style={{height: 5}} />}
            columnWrapperStyle={{ gap: 5 }}
            renderItem={({item}) => {
              return(
              <TouchableOpacity onPress={() => alert(item.nama)} style={{borderWidth: 2, borderColor: 'grey', alignSelf: 'flex-start', borderRadius: 10}}>
              <View style={{width: 180, height: 150, borderWidth: 0, borderColor: 'grey', overflow: 'hidden', borderRadius: 10}}>
                <Image source={{uri: 'https://asset.kompas.com/crops/f3PxrJKuM1Aa_gjYA21_eKdBFXM=/100x67:900x600/1200x800/data/photo/2023/04/01/6427b71555180.jpg'}} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
              </View>
              <View style={{padding: 10}}>
                <Text style={{fontWeight: 'bold', fontSize: 16}}>{item.nama}</Text>
                <Text style={{fontSize: 16}}>{item.harga}</Text>
              </View>
            </TouchableOpacity>
              )
            }}
          />
        </SafeAreaView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

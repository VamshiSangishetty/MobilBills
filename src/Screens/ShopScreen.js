import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet, TextInput,Button, TouchableOpacity,ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomInput from '../Components/CustomInput';
import CustomButton from '../Components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { BannerAd, BannerAdSize, TestIds,InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';

const inadUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-5687012734553237/3225387966';

const interstitial = InterstitialAd.createForAdRequest(inadUnitId);

const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-5687012734553237/9274176598';

function ShopScreen(props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [gst,setGst]=useState('');
  const [email,setEmail]=useState('');
  const [termsAndConditions, setTermsAndConditions] = useState([]);
  const [newTerm, setNewTerm] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState("₹");
  
  const navigation = useNavigation();
  
  useEffect(() => {
    const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
    });

    // Start loading the interstitial straight away
    interstitial.load();
    
    // Unsubscribe from events on unmount
    return unsubscribe;
  }, [])

  const currencyOptions = [
      { code: "INR", symbol: "₹", label: "Indian Rupee" },
    { code: 'USD', symbol: '$', label: 'Dollar' },
    { code: 'EUR', symbol: '€', label: 'Euro' },
    { code: 'JPY', symbol: '¥', label: 'Yen' },
    { code: 'GBP', symbol: '£', label: 'British Pound' },
    { code: "PKR", symbol: "₨", label: "Pakistani Rupee" },
    { code: "BDT", symbol: "৳", label: "Bangladeshi Taka" },
    { code: "THB", symbol: "฿", label: "Thai Baht" },
    { code: "KRW", symbol: "₩", label: "South Korean Won" },
        { code: "AFN", symbol: "Af", label: "Afghan Afghani" },
        { code: "ALL", symbol: "L", label: "Albanian Lek" },
        { code: "IDR", symbol: "Rp", label: "Indonesian Rupiah" },
        { code: "BRL", symbol: "R$", label: "Brazilian Real" },
        { code: "RUB", symbol: "₽", label: "Russian Ruble" },
        { code: "NGN", symbol: "₦", label: "Nigerian Naira" },
        { code: "PHP", symbol: "₱", label: "Philippine Peso" },
        { code: "EGP", symbol: "E£", label: "Egyptian Pound" },
        { code: "VND", symbol: "₫", label: "Vietnamese Dong" },
        { code: "TRY", symbol: "₺", label: "Turkish Lira" },
        { code: "PLN", symbol: "zł", label: "Polish Złoty" }
        ];
      

  const storeData = async () => {
    if(interstitial.load()){
      interstitial.show();
    }
   
    try {
      const details = {
        storeName: name,
        storePhone: phone,
        storeAddress: address,
        storeGst:gst,
        storeEmail:email,
        termsAndConditions: termsAndConditions,
        currency:selectedCurrency
      };
      await AsyncStorage.setItem('businessDetails', JSON.stringify(details));
      await navigation.navigate("Customers")
    } catch (error) {
      // console.error('Error storing data:', error);
    }
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('businessDetails');
      const details = JSON.parse(jsonValue);
      if (details) {
        setName(details.storeName);
        setPhone(details.storePhone);
        setAddress(details.storeAddress);
        setEmail(details.storeEmail);
        setSelectedCurrency(details.currency);
        setGst(details.storeGst || '');
        setTermsAndConditions(details.termsAndConditions || []);
      }
    } catch (error) {
      // console.error('Error retrieving data:', error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const addTerm = () => {
    if (newTerm.trim() !== '') {
      const updatedTerms = [...termsAndConditions, newTerm];
      setTermsAndConditions(updatedTerms);
      setNewTerm('');
      updateAsyncStorage({ termsAndConditions: updatedTerms });
    }
  };
  
  const removeTerm = (index) => {
    const updatedTerms = [...termsAndConditions];
    updatedTerms.splice(index, 1);
    setTermsAndConditions(updatedTerms);
    updateAsyncStorage({ termsAndConditions: updatedTerms });
    setNewTerm('');
  };
  
  const updateAsyncStorage = async (data) => {
    try {
      const jsonValue = await AsyncStorage.getItem('businessDetails');
      const details = JSON.parse(jsonValue);
      const updatedDetails = { ...details, ...data };
      await AsyncStorage.setItem('businessDetails', JSON.stringify(updatedDetails));
    } catch (error) {
      // Handle error
    }
  };
  

  return (
    <View style={{flex:1}}>
    <BannerAd
      unitId={adUnitId}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
    />
    <KeyboardAwareScrollView
    style={styles.container}
    contentContainerStyle={styles.contentContainer}
    keyboardShouldPersistTaps="handled"
    enableOnAndroid={true}
    enableAutomaticScroll={true}
    showsVerticalScrollIndicator={false}>     
     <Text style={styles.head}>Add Business detail</Text>
      <View style={styles.input}>
        <Text style={styles.text}>Store Name : </Text>
        <CustomInput
          placeholder="Enter store name"
          value={name}
          onChange={(text)=>setName(text)}
        />
      </View>
      <View style={styles.input}>
        <Text style={styles.text}>Store Phone number : </Text>
        <CustomInput
          placeholder="Enter store phone number"
          value={phone}
          onChange={(text)=>setPhone(text)}
        />
      </View>
      <View style={styles.input}>
        <Text style={styles.text}>Store Full address : </Text>
        <CustomInput
          placeholder="Enter full address"
          value={address}
          onChange={(text)=>setAddress(text)}
        />
      </View>
      <View style={styles.input}>
        <Text style={styles.text}>Store Email Id : </Text>
        <CustomInput
          placeholder="Enter Email Id"
          value={email}
          onChange={(text)=>setEmail(text)}
        />
      </View>
      <View style={styles.input}>
        <Text style={styles.text}>Store GST No : </Text>
        <CustomInput
          placeholder="Enter GST No"
          value={gst}
          onChange={(text)=>setGst(text)}
        />
      </View>
          <Text style={styles.text}>Terms and Conditions :</Text>
          <ScrollView>
          {termsAndConditions.map((term, index) => (
            <View key={index} style={styles.termContainer}>
              <Text style={styles.termText}>{index + 1}. {term}</Text>
              <TouchableOpacity onPress={() => removeTerm(index)}>
                <Text style={styles.delete}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
  <View style={styles.term}>
          <TextInput
            placeholder="Enter terms and conditions"
            value={newTerm}
            onChangeText={(text) => setNewTerm(text)}
          />
          <View  style={{marginLeft:"auto"}}>
          <Button title="Add" onPress={addTerm} />
          </View>
        </View>
      <View style={styles.input}>
        <Text style={styles.text}>Select Currency: </Text>
        <Picker
          selectedValue={selectedCurrency}
          onValueChange={(itemValue, itemIndex) => setSelectedCurrency(itemValue)}
        >
          {currencyOptions.map(option => (
                <Picker.Item
                  key={option.symbol}
                  label={`${option.symbol} - ${option.label}`}
                  value={option.symbol}
                />
          ))}
        </Picker>
      </View>
      <View style={{marginBottom:27}}>
      <CustomButton text="Next" onPress={storeData} />
      </View>
      <StatusBar style="auto" />
      </KeyboardAwareScrollView>
      <BannerAd
      unitId={adUnitId}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
    />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding :9
  },
  head: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  input: {
    marginVertical: 3,
    padding:6
  },
  text: {
    marginLeft: 9,
  },
  term:{
    flexDirection:'row',
    width:"100%",
    borderColor:"#e8e8e8",
    borderWidth:1,
    borderRadius:5,
    padding:9,
    marginVertical:5,
  },
  termContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  termText: {
    flex: 1,
    marginLeft: 9,
  },
  delete:{
    textAlign:"center",
    color:"red",
    padding:9,
    marginLeft:"auto"
   }
 
});

export default ShopScreen;

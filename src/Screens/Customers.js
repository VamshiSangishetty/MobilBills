import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  TextInput,
  FlatList,
  Button,
  ScrollView
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../Components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-5687012734553237/9274176598';

function Customers(props) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [state,setState]=useState('');
  const [gst,setGst]=useState('');
  const [email,setEmail]=useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [customers, setCustomers] = useState([]);

  const navigation = useNavigation();

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const saveCustomer = async () => {
    try {
      const details = {
        name: name,
        phone: phone,
        address: address,
        company: company,
        state: state,
        gst: gst,
        email: email,
      };
  
      // Get the existing customer list from AsyncStorage
      const existingCustomers = await AsyncStorage.getItem('customerDetails');
      let updatedCustomers = [];
  
      if (existingCustomers) {
        const parsedCustomers = JSON.parse(existingCustomers);
        updatedCustomers = [...parsedCustomers, details];
      } else {
        updatedCustomers = [details];
      }
  
      await AsyncStorage.setItem('customerDetails', JSON.stringify(updatedCustomers));
      toggleModal();
  
      // Update the customers state with the new list
      setCustomers(updatedCustomers);
      setAddress('');
      setCompany('');
      setEmail('');
      setGst('');
      setPhone('');
      setName('');
      setState('');
    } catch (error) {
    //   console.error('Error storing data:', error);
    }
  };
  

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('customerDetails');
      const details = JSON.parse(jsonValue);
      if (details) {
        setCustomers(details);
      }
    } catch (error) {
    //   console.error('Error retrieving data:', error);
    }
  };
 

  useEffect(() => {
    getData();
  }, [customers]);

  const deleteCustomer = async (index) => {
    try {
      const updatedCustomers = [...customers];
      updatedCustomers.splice(index, 1);
      await AsyncStorage.setItem('customerDetails', JSON.stringify(updatedCustomers));
      setCustomers(updatedCustomers);
    } catch (error) {
    //   console.error('Error deleting customer:', error);
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
        <View style={styles.container}>
        <Text style={{textAlign:"center",marginBottom:9,fontSize:24,fontWeight:"bold"}}>Add Customers</Text>
      <FlatList
        data={customers}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.customerItem}>
            <Text>Customer Name : {item.name}</Text>
            {item.company && <Text>Company Name : {item.company}</Text>}
            {item.phone && <Text>phone Number : {item.phone}</Text>}
            {item.address && <Text>Address : {item.address}</Text>}
            {item.state && <Text>State : {item.state}</Text>}
            {item.gst && <Text>GST No : {item.gst}</Text>}
            {item.email && <Text>Email Id : {item.email}</Text>}
            <View style={{marginTop:9}}>
            <Button
              title="create Bill"
              onPress={() => {navigation.navigate("CreateBill", { customer: customers[index] })}}
              />
               </View> 
            <TouchableOpacity onPress={() => deleteCustomer(index)}>
              <Text style={styles.delete}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
     <Modal visible={isModalVisible} animationType="slide">
      <BannerAd
      unitId={adUnitId}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
    />
      <KeyboardAwareScrollView
      style={styles.modalContainer}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      showsVerticalScrollIndicator={false}>   
      <ScrollView>
       <Text style={{textAlign:"center",marginBottom:18,fontSize:24,fontWeight:"bold"}}>Add Customer</Text>
          <Text style={{marginLeft:6}}>Customer name</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => setName(text)}
            value={name}
            placeholder="Customer Name"
          />
          <Text style={{marginLeft:6}}>Company Name </Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text)=>setCompany(text)}
            value={company}
            placeholder="Company Name"
          />
          <Text style={{marginLeft:6}}>Company Address </Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text)=>setAddress(text)}
            value={address}
            placeholder="Company Address"
          />
          <Text style={{marginLeft:6}}>State </Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text)=>setState(text)}
            value={state}
            placeholder="State"
          />
          <Text style={{marginLeft:6}}>Email Id </Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text)=>setEmail(text)}
            value={email}
            placeholder="Email Id"
          />
          <Text style={{marginLeft:6}}>Phone Number </Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text)=>setPhone(text)}
            value={phone}
            placeholder="Phone Number"
          />
          <Text style={{marginLeft:6}}>GST No </Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text)=>setGst(text)}
            value={gst}
            placeholder="GST No"
          />
          <View style={styles.modalButtonContainer}>
          <CustomButton text="ADD" onPress={saveCustomer}/>
            <View style={{marginBottom:27}}>
            <TouchableOpacity onPress={()=>setIsModalVisible(false)} >
              <Text style={{textAlign:"center",fontSize:16,fontWeight:"bold",marginVertical:12,color:"grey"}}>Cancel</Text>
            </TouchableOpacity>
            </View>
          </View>
          </ScrollView>      
        </KeyboardAwareScrollView>
        <BannerAd
      unitId={adUnitId}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
    />
      </Modal>
      <CustomButton text="Add Customer" onPress={toggleModal} />
      </View>
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
    padding: 12,
    flex:1
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  customerItem: {
    borderColor: "#000",
    borderWidth: 1,
    padding: 9,
    borderRadius: 9,
  },
  textInput: {
    // width:100,
    marginTop: 4,
    height: 40,
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    marginBottom:6
  },
  modalContainer:{
    padding:18,
   //  marginVertical:27
   },
   delete:{
    textAlign:"center",
    color:"red",
    padding:9
   }
});

export default Customers;

import { useState,useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  Modal,
  View,
TouchableOpacity,
  Button,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import dateFormat, { masks } from "dateformat";
import * as React from 'react';
import CustomButton from "../Components/CustomButton";
import { Picker } from "@react-native-picker/picker";
import { useRoute, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const bannerAdUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-5687012734553237/9274176598';


const CreateBill = () => {
  const [Invoice,setInvoice] = useState(dateFormat(now, "ddmmyyhhMss")) 
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [sgst, setSgst] = useState('');
  const [cgst, setCgst] = useState('');
  const [productDiscount, setProductDiscount] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [productWeight, setProductWeight] = useState('');
  const [productUnit, setProductUnit] = useState('Quantity'); 
  const [subtotal, setSubTotal] = useState(0);
  const [shipping,setShipping]=useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [storename, setStoreName] = useState('');
  const [storephone, setStorePhone] = useState('');
  const [storeaddress, setStoreAddress] = useState('');
  const [gst,setGst]=useState('');
  const [storeEmail,setStoreEmail]=useState('');
  const [termsAndConditions, setTermsAndConditions] = useState([]);
  const [signature,setSignature]=useState('');
  const [currency,setCurrency]=useState('');
  const now = new Date();
  const date=dateFormat(now, 'dd-mm-yy');
  const [billType,setBillType]=useState('Invoice');
  const [details,setDetails]=useState([]);
  // console.log(termsAndConditions)

  const route = useRoute();
  const { customer } = route.params;
  const navigation=useNavigation();
  

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('businessDetails');
      const details = JSON.parse(jsonValue);
      if (details) {
        setDetails(details)
        setStoreName(details.storeName);
        setStorePhone(details.storePhone);
        setStoreAddress(details.storeAddress);
        setStoreEmail(details.storeEmail||'');
        setCurrency(details.currency);
        setGst(details.storeGst || '');
        setSelectedCurrency(details.currency);
      }

    } catch (error) {
      // console.error('Error retrieving data:', error);
    }
  };
  
  useEffect(() => {
    getData();
    setTermsAndConditions(details.termsAndConditions||[]);
  }, []);

  const addProduct = () => {
    if (productName && productQuantity&&productPrice) {
      const newProduct = { name: productName, quantity: productQuantity,price:productPrice,weight:productWeight,unit: productUnit };
      const amount = productUnit === 'Quantity'
      ?( productQuantity * productPrice)
      :(productUnit==="Weight"? productWeight * productPrice:productQuantity*productWeight*productPrice);
      setSubTotal(parseFloat(subtotal) + parseFloat(amount));
      setProducts([...products, newProduct]);
      setProductName('');
      setProductPrice('');
      setProductWeight('');
      setProductQuantity('');
      setProductUnit("Quantity");
      setIsModalVisible(false); // Close the popup modal
    } else {
      Alert.alert('Please enter product name and quantity.');
    }
  };
  

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const removeProduct = (index) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  const printToFile = async () => {
    const sGstAmount = sgst !== '' ? (parseFloat(sgst) / 100) * parseFloat(subtotal) : 0;
    const cGstAmount = cgst !== '' ? (parseFloat(cgst) / 100) * parseFloat(subtotal) : 0;
    const discountAmount = productDiscount !== '' ? (parseFloat(productDiscount) / 100) * parseFloat(subtotal) : 0;
    
    let total = parseFloat(subtotal);
    
    if (sGstAmount !== 0) {
      total += sGstAmount;
    }
    if (cGstAmount !== 0) {
      total += cGstAmount;
    }
    
    if (discountAmount !== 0) {
      total -= discountAmount;
    }
    
    if (shipping !== '') {
      total += parseFloat(shipping);
    }
   
    
    total = total.toFixed(2);    

      let productsHtml = '';
    products.forEach((product, index) => {
      productsHtml += `
      <div class="i_row">
      <div class="i_col w_55">
        <p>${product.name}</p>
      </div>
      <div class="i_col w_15 text_center">
        <p>${product.quantity}</p>
      </div>
      <div class="i_col w_15 text_center">
        ${product.weight!=0?`<p>${product.weight} KG</p>`:`<p></p>`}
      </div>
      <div class="i_col w_15 text_center">
        <p>${currency} ${product.price}</p>
      </div>
      <div class="i_col w_15 text_right">
      ${product.unit === "Quantity" ? (
                `<p>${currency} ${(product.quantity * product.price).toFixed(2)}</p>`
              ) : (
                product.unit === "Weight" ? `<p>${currency} ${(product.weight * product.price).toFixed(2)}</p>` : `<p>${currency} ${(product.weight * product.price*product.quantity).toFixed(2)}</p>`
              )}
      </div>
    </div>
    `;
  });

  let wt='';
  let hasWeight = false;

products.forEach((product, index) => {
  if (product.weight !== 0&&product.weight!=='' && !hasWeight) {
    wt += '<p class="p_title">WEIGHT(KG)</p>';
    hasWeight = true;
  }
});

      let terms='';
      details.termsAndConditions.forEach((term,index)=>{
      terms+=`
     <p>${index+1}. ${term}</p>
      `;
    });

    let billhtml = `
    <!DOCTYPE html>
<html>
<head>
<style>
@import url("https://fonts.googleapis.com/css2?family=Redressed&family=Ubuntu:wght@400;700&display=swap");
:root {
  --white: #fff;
  --invoice-bg: #e7e7ff;
  --primary-clr: #2f2929;
  --secondary-clr: #88379d;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Ubuntu", sans-serif;
}

body {
  background: var(--bg-clr);
  font-size: 10px;
  line-height: 18px;
  color: var(--primary-clr);
  padding: 0 18px;
  /* Define the A4 page size here */
  width: 210mm;
  height: 297mm;
  margin: 0 auto;
  /* Adjust margins as needed */
  margin-top: 18px;
  margin-bottom: 18px;
}

/* Prevent page breaks inside specific elements */
.invoice {
  page-break-inside: avoid;
}

.main_title{
  font-weight: 700;
  font-size: 12px;
  text-transform: uppercase;
  color: var(--secondary-clr);
  margin-bottom: 8px;
}

.ma_title{
  font-weight: 700;
  font-size: 12px;
  color: var(--secondary-clr);
  margin-bottom: 8px;
}

.p_title {
  font-weight: 700;
  font-size: 12px;
}

.p_title > span{
  font-weight: 400;
  font-size: 10px;
}

.text_right {
  text-align: right;
}

.text_center {
  text-align: center;
}

.i_row{
  display: flex;
  justify-content: space-between;
}

.invoice {
  width: 800px;
  max-width: 100%;
  height: 297mm;
  background: var(--white);
  margin: 20px auto;
}

.invoice > div{
  width: 100%;
  padding: 25px;
}

.invoice .invoice_info .i_row{
  justify-content: space-between;
}

.invoice .invoice_info,
.invoice .invoice_terms{
  background: var(--invoice-bg);
}

.invoice .invoice_info > div:not(:last-child){
  margin-bottom: 18px;
} 

.invoice .invoice_info h1{
  font-size: 32px;
  line-height: 42px;
  color: var(--secondary-clr);
}

.invoice .w_15 {
  width: 15%;
}

.invoice .w_50 {
  width: 50%;
}

.invoice .w_55 {
  width: 55%;
}

.invoice .i_table .i_row {
  padding: 8px 6px; 
  border-bottom: 1px solid var(--invoice-bg);  
}

.invoice .i_table .i_row p{
  margin: 0;
  font-weight: 700;
}

.invoice .i_table .i_table_head .i_row,
.invoice .i_table .i_table_foot .grand_total_wrap{
  background: var(--invoice-bg);
  border: 0;
}

.invoice .invoice_right .terms{
  margin: 0;
}

</style>
</head>
<body>

<section>
  <div class="invoice">
    <div class="invoice_info">
        <div class="i_logo">
            <h1 style="text-align: center; text-transform: uppercase;">${storename}</h1>
            <p class="main_title" style="text-align: center;">${storeaddress}</p>
            ${storeEmail&&`<p class="ma_title" style="text-align: center;">EMAIL : ${storeEmail}</p>`}
            <p class="main_title" style="text-align: center;">contact no : ${storephone}</p>
            ${gst&&`<p class="main_title" style="text-align: center;">gst no : ${gst}</p>`}
      </div>
    </div>
          <p class="p_title" style="text-align: center; margin-top: 16px;">${billType}<p>
      <div class="i_row">

        <div class="i_to">
          <div class="main_title">
            <p>${billType} To</p>
          </div>
          <div class="p_title">
            <p>Customer Name: <span style="font-weight: 500;">${customer.name}</span></p>
           ${customer.company&&`<p>Company Name : <span style="font-weight: 500;">${customer.company}</span></p>`}
            ${customer.address&&`<p>Address : <span style="font-weight: 500;">${customer.address}</span></p>`}
           ${customer.state&&`<p>State : <span style="font-weight: 500;">${customer.state}</span></p>`}
            ${customer.phone&&`<p>Phone No : <span style="font-weight: 500;">${customer.phone}</span></p>`}
            ${customer.email&&`<p>Email Id : <span style="font-weight: 500;">${customer.email}</span></p>`}
            ${customer.gst&&`<p>GST No : <span style="font-weight: 500;">${customer.gst}</span></p>`}
          </div>
        </div>
        <div class="i_details text_right">
          <div class="main_title">
            ${billType==='Quotation'?`<p>Quotation details</p>`:`<p>Invoice details</p>`}
          </div>
          <div class="p_title">
          ${billType==='Quotation'?`<p>Quotation No</p>`:`<p>Invoice No</p>`}
          <span>${Invoice}</span>
          </div>
          <div class="p_title">
          ${billType==='Quotation'?`<p>Quotation Date</p>`:`<p>Invoice Date</p>`}
            <span>${date}</span>
          </div>
        </div>
      </div>
    <div class="invoice_table">
      <div class="i_table">
        <div class="i_table_head">
          <div class="i_row">
            <div class="i_col w_55">
              <p class="p_title">DESCRIPTION</p>
            </div>
            <div class="i_col w_15 text_center">
              <p class="p_title">QTY</p>
            </div>
            <div class="i_col w_15 text_center">
            ${wt}
            </div>
            <div class="i_col w_15 text_center">
              <p class="p_title">PRICE(${currency})</p>
            </div>
            <div class="i_col w_15 text_right">
              <p class="p_title">TOTAL(${currency})</p>
            </div>
          </div>
        </div>
        <div class="i_table_body">
        ${productsHtml}
        </div>
        <div class="i_table_foot">
          <div class="i_row">
            <div class="i_col w_50">
              <p>Sub Total</p>
              ${sgst&&`<p>SGST ${sgst}%</p>`}
              ${cgst&&`<p>CGST ${cgst}%</p>`}
              ${productDiscount&&`<p>Discount ${productDiscount}%</p>`}
              ${shipping&&`<p>Shipping charges(${currency})</p>`}
            </div>
            <div class="i_col w_50 text_right">
              <p>${currency} ${subtotal.toFixed(2)}</p>
              ${sgst&&`<p>${currency} ${sGstAmount.toFixed(2)}</p>`}
              ${cgst&&`<p>${currency} ${cGstAmount.toFixed(2)}</p>`}
              ${productDiscount&&`<p>${currency} ${discountAmount.toFixed(2)}</p>`}
              ${shipping&&`<p>${currency} ${shipping}</p>`}
            </div>
          </div>
          <div class="i_row grand_total_wrap">
            <div class="i_col w_50">
              <p>GRAND TOTAL(${currency}):</p>
            </div>
            <div class="i_col w_50 text_right">
              <p>${currency} ${total}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
    <div class="i_details text_right">
      <div class="p_title">
        <p>${signature}</p>
      </div>
      <div class="main_title">
        <p>Signature</p>
      </div>
    </div>
    ${details.termsAndConditions.length > 0 ? `
  <div class="invoice_terms">
    <div class="main_title">
      <p>Terms and Conditions</p>
    </div>
    ${terms}
  </div>
` : ''}
<p style="text-align: center;">Digitally created invoice by MobilBills Mobile App</p>
  </div>
</section>

</body>
</html>
    `;

    try {
      navigation.navigate('BillScreen', { billhtml,customer });

        setInvoice(dateFormat(now, "ddmmyyhhMss"));      
      } catch (error) {
          }    
        }


  return (
    <View style={styles.container}>
    <KeyboardAwareScrollView
    style={styles.container}
    contentContainerStyle={styles.contentContainer}
    keyboardShouldPersistTaps="handled"
    enableOnAndroid={true}
    enableAutomaticScroll={true}
    showsVerticalScrollIndicator={false}>
       <BannerAd
      unitId={bannerAdUnitId}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
    />
        <View style={styles.InputContainer}>
          <Text>Bill No : </Text>
          <TextInput
            style={styles.textInput}
            onChangeText={setInvoice}
            value={Invoice}
            placeholder="Bill No"
          />
        </View>
        <View style={styles.InputContainer}>
          <Text>Customer Name : <Text style={{fontWeight:"bold"}}> {customer.name}</Text></Text>
        </View>
        <Text style={{marginTop:9,marginBottom:0,marginLeft:18,fontSize:15,fontWeight:"bold"}}>Bill Type : </Text>
           <Picker
    selectedValue={billType}
    onValueChange={(itemValue) => setBillType(itemValue)}
    style={styles.picker}
  >
    <Picker.Item label="Invoice" value="Invoice" />
    <Picker.Item label="Tax Invoice" value="Tax Invoice" />
    <Picker.Item label="Quotation" value="Quotation" />
  </Picker>
        <View style={styles.productList}>
        {products.map((product, index) => (
  <View key={index} style={styles.productItem}>
    <View style={styles.productNameContainer}>
      <Text style={styles.productName}>{product.name}</Text>
    </View>
    <Text>{product.quantity}</Text>
    {product.weight&&<Text style={{marginHorizontal:18}}>{product.weight}KG</Text>}
    <Text style={{marginHorizontal:18}}>{currency}{product.price}</Text>
    <TouchableOpacity onPress={() => removeProduct(index)}>
      <Text style={styles.delete}>Remove</Text>
    </TouchableOpacity>
  </View>
))}
        </View>
        {subtotal!=0&&<Text style={{textAlign:"right",marginRight:27}}>subtotal = {subtotal.toFixed(2)}</Text>}
  <View style={styles.CreateInvoiceButton}>
        <CustomButton
          text="Add Product"
          onPress={toggleModal}
        />
      </View>
      <Modal visible={isModalVisible} animationType="slide">
      <BannerAd
      unitId={bannerAdUnitId}
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
       <Text style={{textAlign:"center",marginBottom:18,fontSize:24,fontWeight:"bold"}}>Add Product</Text>
          <Text style={{marginLeft:6}}>Product name</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => setProductName(text)}
            value={productName}
            placeholder="Product Name"
          />
          <Text style={{marginLeft:6}}>Quantity</Text>
          <TextInput
            style={styles.textInput}
            keyboardType="numeric"
            onChangeText={(text)=>setProductQuantity(text)}
            value={productQuantity}
            placeholder="Quantity"
          />
          <Text style={{marginLeft:6}}>Product Weight in KG (optional)</Text>
          <TextInput
            style={styles.textInput}
            keyboardType="numeric"
            onChangeText={(text)=>setProductWeight(text)}
            value={productWeight}
            placeholder="Product weight"
          />
          <Text style={{marginLeft:6}}>Product price</Text>
          <TextInput
            style={styles.textInput}
            keyboardType="numeric"
            onChangeText={(text)=>setProductPrice(text)}
            value={productPrice}
            placeholder="Product price"
          />
          <Text style={{marginTop:18,marginBottom:0,textAlign:"center",fontSize:18,fontWeight:"bold"}}>Calculate Amount by : </Text>
           <Picker
    selectedValue={productUnit}
    onValueChange={(itemValue) => setProductUnit(itemValue)}
    style={styles.picker}
  >
    <Picker.Item label="Amount=Weight x Price" value="Weight" />
    <Picker.Item label="Amount=Quantity x Price" value="Quantity" />
    <Picker.Item label="Amount=Weight x Quantity x Price" value="weQa" />
  </Picker>
          <View style={styles.modalButtonContainer}>
            <CustomButton text="ADD" onPress={addProduct}/>
            <TouchableOpacity onPress={()=>setIsModalVisible(false)}  style={{marginVertical:12}}>
            <Text style={{textAlign:"center",fontSize:16,fontWeight:"bold",color:"grey"}}>Cancel</Text></TouchableOpacity>
          </View>
          </ScrollView> 
        </KeyboardAwareScrollView>
        <BannerAd
      unitId={bannerAdUnitId}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
    />
      </Modal>
        {/* ReceivedBalance  */}
        <View style={styles.InputContainer}>
            <Text>SGST percentage (optional)</Text>
        <TextInput
            style={styles.textInput}
            keyboardType="numeric"
            onChangeText={(text)=>setSgst(text)}
            value={sgst}
            placeholder="Tax % "
            />
                  </View>
        <View style={styles.InputContainer}>
            <Text>CGST percentage (optional)</Text>
        <TextInput
            style={styles.textInput}
            keyboardType="numeric"
            onChangeText={(text)=>setCgst(text)}
            value={cgst}
            placeholder="Tax % "
            />
                  </View>
                  <View style={styles.InputContainer}>
            <Text>Discount percentage (optional)</Text>
          <TextInput
            style={styles.textInput}
            keyboardType="numeric"
            onChangeText={(text)=>setProductDiscount(text)}
            value={productDiscount}
            placeholder="Discount % "
          />
                  </View>
        {/* Remaining Balance  */}
        <View style={styles.InputContainer}>
          <Text>Shipping Charges (optional) </Text>
          <TextInput
            style={styles.textInput}
            keyboardType="numeric"
            onChangeText={(text)=>setShipping(text)}
            value={shipping}
            placeholder="Shipping Charges  "
          />
        </View>
        <View style={styles.InputContainer}>
          <Text>Signature</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text)=>setSignature(text)}
            value={signature}
            placeholder="Signature  "
          />
        </View>
        <View style={styles.CreateInvoiceButton}>
        <CustomButton 
        text="Create Bill"
        onPress={printToFile}
        />
        </View>
    </KeyboardAwareScrollView>
        <BannerAd
      unitId={bannerAdUnitId}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
    />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    //   alignItems: 'center',
    //   justifyContent: 'center',
  },
  tinyLogo: {
    width: 70,
    height: 70,
  },
  button: {
    alignItems: "center",
    backgroundColor: "lightblue",
    padding: 10,
    borderRadius: 4,
  },
  InputContainer: {
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
  },
  modalContainer:{
   padding:18,
  //  marginVertical:27
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
  PickerContainer:{
    marginTop:10,
    borderWidth:1,
    borderRadius:4,
    height:50
    
  },
  CreateInvoiceButton : {
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
    marginBottom : 15
  },
  spacer: {
    height: 8
  },
  printer: {
    textAlign: 'center',
  },
  productList: {
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 6,
    borderRadius: 4,
  },
  productNameContainer: {
    flex: 1, // Allow the product name to grow and wrap to the next line
    marginRight: 0, // Add spacing between product name and other elements
  },
  delete:{
    textAlign:"center",
    color:"red",
    padding:9,
    marginLeft:"auto"
   }
});

export default CreateBill;

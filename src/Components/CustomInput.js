import React from 'react';
import { View,TextInput,StyleSheet,Text } from 'react-native';

function CustomInput({placeholder,value,onChange,}) {
    return (
            <View style={styles.container}>
            <TextInput 
            placeholder={placeholder}
            value={value}
            onChangeText={onChange}
            style={styles.input}/>
      </View>
        )}
       

const styles = StyleSheet.create({
    container:{
    backgroundColor:"white",
    width:"100%",
    borderColor:"#e8e8e8",
    borderWidth:1,
    borderRadius:5,
    padding:9,
    marginVertical:5,
    },
    input:{
fontSize:15
    }
})

export default CustomInput;
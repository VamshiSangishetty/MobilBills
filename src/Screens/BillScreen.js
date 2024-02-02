import React,{useEffect} from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import dateFormat from "dateformat";
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import CustomButton from '../Components/CustomButton';
import { BannerAd, BannerAdSize, TestIds,RewardedInterstitialAd,RewardedAdEventType} from 'react-native-google-mobile-ads';

const rewardadUnitId = __DEV__
  ? TestIds.REWARDED_INTERSTITIAL
  : 'ca-app-pub-5687012734553237/7961094927';

const rewardedInterstitial = RewardedInterstitialAd.createForAdRequest(rewardadUnitId);


const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-5687012734553237/9274176598';

const BillScreen = ({ route }) => {
  const { billhtml,customer } = route.params;
  const now = new Date();
  const date=dateFormat(now, 'dd-mm-yy');

  useEffect(() => {
    const unsubscribeLoaded = rewardedInterstitial.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
      },
    );
    const unsubscribeEarned = rewardedInterstitial.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
      },
    );

    // Start loading the rewarded interstitial ad straight away
    rewardedInterstitial.load();

    // Unsubscribe from events on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, []);

  const handleShare = async() => {
    if(rewardedInterstitial.loaded){
      rewardedInterstitial.show();
    }
    try {
        const customerPdfFileName = `${customer.name.replace(/\s/g, '_')}_${date}.pdf`;
        const { uri } = await Print.printToFileAsync({
        html: billhtml
        });
      
        const directory = uri.substring(0, uri.lastIndexOf('/') + 1);
      
        const newPdfPath = `${directory}${customerPdfFileName}`;
      
        await FileSystem.moveAsync({
          from: uri,
          to: newPdfPath,
        });
              await shareAsync(newPdfPath, { UTI: '.pdf', mimeType: 'application/pdf' });
      
      } catch (error) {
          }    
          };

  return (
    <View style={styles.container}>
        <BannerAd
      unitId={adUnitId}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
    />
      <WebView source={{ html: billhtml }} />
      <View style={{padding:18}}>
      <CustomButton text="Share" onPress={handleShare} />
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
};

const styles = StyleSheet.create({
    container:{
        flex:1,
    }
})

export default BillScreen;

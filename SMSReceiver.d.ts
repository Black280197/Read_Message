import { PermissionsAndroid, Platform, ToastAndroid, View, Text } from 'react-native';
import Tts from 'react-native-tts';
import { useEffect, useState } from 'react';
import SmsAndroid from 'react-native-get-sms-android';
import React from 'react';


interface SMSReceiverProps {
  onSmsReceived: (smsList: any[]) => void;
  onChangeFirsttime: (fst: boolean, idInt: number) => void;
  firstT: () => boolean;
}
let smsIds = [];
let smsLst = [];


const SMSReceiver: React.FC<SMSReceiverProps> = ({ onSmsReceived, onChangeFirsttime, firstT }) => {
  // const [smsIds, setSmsIds] = useState<number[]>([]);
  // const [smsLst, setSmsLst] = useState<any[]>([]);

  let IdInterval = null;

  const addSmsId = (newSmsId: number) => {
    smsIds.push(newSmsId);
  };

  const addSmsLst = (newS: any) => {
    smsLst.unshift(newS)
  };

  useEffect(() => {
    const requestSMSPermission = async () => {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_SMS,
            {
              title: 'Quyền truy cập tin nhắn SMS',
              message: 'Ứng dụng cần quyền truy cập tin nhắn SMS để đọc nội dung.',
              buttonNeutral: 'Để sau',
              buttonNegative: 'Hủy',
              buttonPositive: 'Đồng ý',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Đã cấp quyền SMS');
          } else {
            console.log('Quyền SMS bị từ chối');
          }
        }
      } catch (err) {
        console.warn(err);
      }
    };

    requestSMSPermission();

    const smsListener = setInterval(() => {
      // Giả lập kiểm tra tin nhắn mỗi 5 giây
      checkForNewSMS();
    }, 5000);
    IdInterval = smsListener;
    return () => clearInterval(smsListener);
  }, [firstT()]);

  const checkForNewSMS = () => {
    
    // Giả sử bạn dùng 'react-native-get-sms-android' để lấy tin nhắn
    SmsAndroid.list(
      JSON.stringify({ box: 'inbox', maxCount: 10 }),
      (fail) => {
        console.log('Lỗi: ' + fail);
      },
      (count, smsList) => {
        const messages = JSON.parse(smsList);
        // const newMssLst = messages.filter(m => !smsIds.includes(m._id));
        let smsIdsClone = [];
        smsIdsClone = smsIds.filter(sm => !smsIdsClone.includes(sm))
        messages.forEach((message) => {
          // console.log(message)
          if (!smsIdsClone.includes(message._id)) {
            addSmsId(message._id)
            addSmsLst(message)
            if (!firstT()) {
              console.log("Alo Ok nha")
              readSmsAloud(message.body);
              displayMessageOnUI(message.body);
            }
            smsIdsClone = smsIds;
          }
          // Chuyển đổi thành lời nói
          
        });
        if (firstT()) {
          console.log("Phát súng đầu tiên")
          readSmsAloud("Chào mừng bạn đến với ứng dụng đọc tin nhắn SMS, một sản phẩm có sứ mệnh là quà tặng dành cho chị Hoàng Thị Liên xin gái, đảm đang, ngoan hiền nhất trần đời!");
          onChangeFirsttime(false, IdInterval);
        }
        onSmsReceived([...smsLst]);
        
      }
    );
  };

  const readSmsAloud = (message: string) => {
    Tts.setDefaultLanguage('vi-VN');
    Tts.speak(message);
  };

  const displayMessageOnUI = (message: string) => {
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.LONG,
      ToastAndroid.CENTER
    );
  };

  return null;
};

export default SMSReceiver;

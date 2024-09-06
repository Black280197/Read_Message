import React from 'react';
import { ScrollView, View, Text, StyleSheet  } from 'react-native';
import SMSReceiver from './SMSReceiver.d';
import { useEffect, useRef, useState } from 'react';

const App = () => {
  const [smsList, setSmsList] = useState<any[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSmsReceived = (smsList: any[]) => {
    setSmsList([...smsList]);
    console.log(smsList.length)
  };

  useEffect(() => {
    // Scroll lên đầu trang mỗi khi có tin nhắn mới
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  }, [smsList.length]);

  return (
    <ScrollView ref={scrollViewRef} style={styles.container}>
    <View style={styles.card}>
      <Text style={styles.title}>Chào mừng bạn đến với ứng dụng đọc tin nhắn SMS</Text>
      <SMSReceiver onSmsReceived={handleSmsReceived} />
      <View>
        <Text style={styles.title} >Danh sách tin nhắn mới:</Text>
        {smsList.map((sms, index) => (
          <View style={styles.card}>
          <Text style={styles.title} key={index + 'title'}>{`${sms._id}_TIME: ${formatTimestamp(sms.date)}`}</Text>
          <Text style={styles.titleVer2} key={index + 'extra'}>{`ADD: ${sms.address}_CRE: ${sms.creator}`}</Text>
          <Text style={styles.message} key={index}>{`ND: ${sms.body}`}</Text>
          </View>
        ))}
      </View>
    </View>
    </ScrollView>
  );
};

const formatTimestamp = (timestamp: number): string => {
  // Tạo một đối tượng Date từ timestamp (timestamp tính bằng milliseconds)
  const date = new Date(timestamp);

  // Các tùy chọn định dạng cho ngày và giờ
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // Sử dụng 24 giờ
  };

  // Định dạng ngày tháng năm giờ phút
  return date.toLocaleDateString('vi-VN', options);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    backgroundColor: '#fff',
    textAlign: 'center'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center'

  },
  titleVer2: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center'

  },
  message: {
    fontSize: 16,
    color: '#666',
  },
});

export default App;

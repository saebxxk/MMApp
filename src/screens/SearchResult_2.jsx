import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Firebase Firestore 설정 파일
import { getAuth } from 'firebase/auth'; // Firebase 인증 모듈
import { removeFavoriteFromFirestore, clearFavoritesFromFirestore } from '../back/favoritesService'; // 즐겨찾기 관련 서비스 함수

const SearchScreen = () => {
  const router = useRouter(); // 페이지 이동을 위한 라우터
  const [searchText, setSearchText] = useState(''); // 검색 입력 값
  const [activeTab, setActiveTab] = useState('recent'); // 현재 활성화된 탭 ('recent' 또는 'favorites')
  const [recentRecords, setRecentRecords] = useState([]); // 최근 검색 기록
  const [favoriteStations, setFavoriteStations] = useState([]); // 즐겨찾기된 역 데이터

  // **Firebase에서 즐겨찾기 역 데이터 가져오기**
  const fetchFavoriteStations = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.error("로그인된 사용자가 없습니다.");
        return;
      }

      const userId = user.uid; // 현재 로그인된 사용자의 UID
      const favoritesCollection = collection(db, "favorites"); // Firestore에서 favorites 컬렉션 참조
      const q = query(favoritesCollection, where("userId", "==", userId)); // userId로 필터링
      const querySnapshot = await getDocs(q); // Firestore에서 데이터 가져오기

      // 가져온 데이터를 배열로 변환
      const favoritesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setFavoriteStations(favoritesData); // 상태 업데이트
    } catch (error) {
      console.error("즐겨찾기 데이터 로드 중 오류:", error.message);
    }
  };

  // 컴포넌트가 렌더링될 때 즐겨찾기 데이터 불러오기
  useEffect(() => {
    fetchFavoriteStations();
  }, []);

  // **사용자가 역을 검색할 때 실행되는 함수**
  const handleSearch = async () => {
    try {
      if (!searchText.trim()) {
        Alert.alert("경고", "검색어를 입력해주세요."); // 빈 검색어 경고
        return;
      }
    
      const stationsCollectionRef = collection(db, "Stations"); // Firestore의 Stations 컬렉션 참조
      const querySnapshot = await getDocs(stationsCollectionRef);
      const matchingDoc = querySnapshot.docs.find((doc) => doc.id === searchText.trim()); // 검색어와 일치하는 데이터 찾기

      if (!matchingDoc) {
        Alert.alert("알림", "찾으시는 역이 없습니다."); // 검색 결과 없음 경고
      } else {
        // 검색 결과를 최근 기록에 추가
        const newRecord = {
          id: matchingDoc.id,
          station: matchingDoc.data().station, // 역 이름
          code: matchingDoc.data().code, // 역 코드
        };

        setRecentRecords((prev) => {
          const isDuplicate = prev.some((item) => item.id === newRecord.id); // 중복 여부 확인
          if (isDuplicate) return prev; // 중복인 경우 추가하지 않음
          return [newRecord, ...prev]; // 새로운 기록 추가
        });
      }
    } catch (error) {
      console.error("검색 중 오류:", error.message);
      Alert.alert("오류", "검색 중 문제가 발생했습니다.");
    }
  };

  // **검색어 입력 변경 시 호출되는 함수**
  const handleSearchChange = (text) => {
    setSearchText(text);
  };

  // **검색 입력 필드 초기화**
  const clearSearchText = () => {
    setSearchText('');
  };

  // **특정 역을 삭제하는 함수**
  const removeStation = (id) => {
    if (activeTab === 'recent') {
      setRecentRecords((prev) => prev.filter((item) => item.id !== id)); // 최근 기록에서 삭제
    } else {
      setFavoriteStations((prev) => prev.filter((item) => item.id !== id)); // 즐겨찾기에서 삭제
    }
  };

  // **즐겨찾기에서 특정 역을 삭제하는 함수**
  const removeFromFavorites = async (id) => {
    try {
      await removeFavoriteFromFirestore(id); // Firestore에서 삭제
      setFavoriteStations((prev) => prev.filter((item) => item.id !== id)); // 상태 업데이트
    } catch (error) {
      console.error("즐겨찾기 해제 중 오류:", error.message);
    }
  };

  // **현재 탭의 기록 전체 삭제**
  const clearAllRecords = async () => {
    try {
      if (activeTab === 'recent') {
        setRecentRecords([]); // 최근 기록 비우기
      } else {
        await clearFavoritesFromFirestore(); // Firestore에서 즐겨찾기 전체 삭제
        setFavoriteStations([]); // 상태 업데이트
      }
    } catch (error) {
      console.error("전체 삭제 중 오류:", error.message);
    }
  };

  // **현재 활성화된 탭에 따라 데이터를 필터링**
  const filteredRecords =
    activeTab === 'recent'
      ? recentRecords.filter((item) => item.id === searchText.trim()) // 검색어와 일치하는 데이터 필터링
      : favoriteStations; // 즐겨찾기 전체 표시

  // **각 역 정보를 렌더링하는 컴포넌트**
  const renderStationItem = ({ item }) => (
    <View style={styles.stationItem}>
      <View style={styles.stationInfo}>
        {activeTab === 'recent' ? (
          <Image
            source={require('../../../assets/images/searchicon/location_on.png')}
            style={styles.icon}
          />
        ) : (
          <TouchableOpacity onPress={() => removeFromFavorites(item.id)}>
            <Image
              source={require('../../../assets/images/searchicon/staricon.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
        <Text style={styles.stationId}>{item.id}</Text> {/* 역 ID 표시 */}
      </View>
      <TouchableOpacity style={styles.deleteIcon} onPress={() => removeStation(item.id)}>
        <Image
          source={require('../../../assets/images/searchicon/X.png')}
          style={{ width: 16, height: 16 }}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 검색 입력 필드 */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="지하철 역 검색"
          value={searchText}
          onChangeText={handleSearchChange}
        />
        <TouchableOpacity style={styles.clearButton} onPress={clearSearchText}>
          <Text style={styles.clearButtonText}>X</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Image
            source={require('../../../assets/images/mainicon/Trailing-Elements.png')}
            style={styles.searchButtonImage}
          />
        </TouchableOpacity>
      </View>

      {/* 탭 메뉴 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => setActiveTab('recent')}
          style={styles.tabSection}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'recent' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.3)' },
            ]}
          >
            최근 기록
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('favorites')}
          style={styles.tabSection}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'favorites' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.3)' },
            ]}
          >
            즐겨찾기
          </Text>
        </TouchableOpacity>
      </View>

      {/* 전체 삭제 버튼 */}
      <TouchableOpacity style={styles.textClearButton} onPress={clearAllRecords}>
        <Text style={styles.textClearButtonText}>전체삭제</Text>
      </TouchableOpacity>

      {/* 역 목록 표시 */}
      <FlatList
        data={filteredRecords}
        renderItem={renderStationItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />

      {/* 뒤로가기 버튼 */}
      <TouchableOpacity style={styles.backButton} onPress={router.back}>
        <Image
          source={require('../../../assets/images/mainicon/뒤로가기.png')}
          style={styles.backIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 20,
    backgroundColor: '#fff',
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'transparent',
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  clearButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#999',
  },
  tabContainer: {
    flexDirection: 'row',
    height: 50,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tabSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  banner: {
    alignSelf: 'center',
    width: '100%',
    height: 52,
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  textClearButton: {
    alignItems: 'flex-end',
    marginBottom: 5,
    marginRight: 5,
  },
  textClearButtonText: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.4)',
  },
  list: {
    flex: 1,
  },
  stationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  stationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 15,
  },
  stationCode: {
    marginRight: 10,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6200ea',
  },
  stationName: {
    fontSize: 12,
    color: '#000',
  },
  deleteIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 16,
    height: 16,
    borderRadius: 16,
    backgroundColor: '#f1f1f1',
  },
  searchButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  searchButtonImage: {
    width: 30, // 이미지의 너비
    height: 30, // 이미지의 높이
    resizeMode: 'contain', // 이미지 크기 조절
    backgroundColor: '#fff',
  },
});

export default SearchScreen;
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native';


const initialRecentRecords = [
  { id: '1', station: '서울역', code: '410' },
  { id: '2', station: '강남역', code: '617' },
  { id: '3', station: '홍대입구역', code: '118' },
];

const initialFavoriteStations = [
  { id: '1', station: '여의도역', code: '211' },
  { id: '2', station: '인천역', code: '220' },
];

const SearchScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('recent');
  const [recentRecords, setRecentRecords] = useState(initialRecentRecords);
  const [favoriteStations, setFavoriteStations] = useState(initialFavoriteStations);

  const handleSearchChange = (text) => {
    setSearchText(text);
  };

  const clearSearchText = () => {
    setSearchText('');
  };

  const removeStation = (id) => {
    if (activeTab === 'recent') {
      setRecentRecords((prev) => prev.filter((item) => item.id !== id));
    } else {
      setFavoriteStations((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const removeFromFavorites = (id) => {
    setFavoriteStations((prev) => prev.filter((item) => item.id !== id));
  }; // 즐겨찾기 아이콘 클릭시 즐겨찾기 해제

  const clearAllRecords = () => {
    if (activeTab === 'recent') {
      setRecentRecords([]);
    } else {
      setFavoriteStations([]);
    }
  };

  const filteredRecords =
    activeTab === 'recent'
      ? recentRecords.filter((item) => item.station.includes(searchText))
      : favoriteStations.filter((item) => item.station.includes(searchText));

  const renderStationItem = ({ item }) => (
    <View style={styles.stationItem}>
      <View style={styles.stationInfo}>
        {activeTab === 'recent' ? (
          <Image
            source={require('../icons/location_on.png')}
            style={styles.icon}
          />
        ) : (
          <TouchableOpacity
            onPress={() => removeFromFavorites(item.id)} // 즐겨찾기 해제
          >
          <Image
            source={require('../icons/staricon.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        )}
        <Text style={styles.stationCode}>{item.code}</Text>
        <Text style={styles.stationName}>{item.station}</Text>
      </View>
      <TouchableOpacity style={styles.deleteIcon} onPress={() => removeStation(item.id)}>
      <Image
          source={require('../icons/X.png')}
          style={{ width: 16, height: 16 }}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
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
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => setActiveTab('recent')}
          style={styles.tabSection}
        >
          <Text
            style={[
              styles.tabText,
              
                activeTab === 'recent' ? styles.activeTabText : styles.inactiveTabText,
              
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
              activeTab === 'favorites' ? styles.activeTabText : styles.inactiveTabText,
            ]}
          >
            즐겨찾기
          </Text>
        </TouchableOpacity>
      </View>

      <Image
        source={require('../icons/div2.png')}
        style={[styles.banner, { width: 402, height: 52 }]}
        resizeMode="cover"
      />

      <TouchableOpacity style={styles.textClearButton} onPress={clearAllRecords}>
        <Text style={styles.textClearButtonText}>전체삭제</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <FlatList
        data={filteredRecords}
        renderItem={renderStationItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    width: '100%',
    backgroundColor: '#ffffff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    width: 375, // 검색창 너비
    height: 40, // 검색창 높이
    alignSelf: 'center', // 부모 뷰에서 가로로 중앙 정렬
    marginTop: 10, // 검색창 위쪽 여백 추가
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
    height: 54,
    width: '100%',
    marginBottom: 10,
    backgroundColor: '#F7F7F7',
    alignItems: 'stretch',
    
    
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
  activeTabText: {
    color: 'rgba(0, 0, 0, 0.6)', // 활성화된 탭 글씨 색상
  },
  inactiveTabText: {
    color: 'rgba(0, 0, 0, 0.3)',
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
});

export default SearchScreen;

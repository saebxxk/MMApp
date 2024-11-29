import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  Modal,
  FlatList,
  Image,
} from 'react-native';

// SVG Icons
//import ArrowBackIcon from '../icons/arrow_back.svg';
//import ExchangeIcon from '../icons/exchange.svg';
//import EmptyStarIcon from '../icons/emptystar.svg';
//import StarIcon from '../icons/star.svg';
//import ClearIcon from '../icons/x.svg';
//import ArrowDropDownIcon from '../icons/arrow_drop_down.svg';
// PNG 아이콘 파일 import
const ArrowBackIcon = require('../icons/arrow_back.png');
const ExchangeIcon = require('../icons/exchange.png');
const emptyStarIcon = require('../icons/emptystaricon.png');
const StarIcon = require('../icons/staricon.png');
const ClearIcon = require('../icons/x.png');
const ArrowDropDownIcon = require('../icons/arrow_drop_down.png');

const initialMockData = [
  {
    id: '1',
    time: '14분',
    cost: '1250원',
    transfers: 1,
    isFavorite: false,
    steps: [
      { type: '승차', station: '620', details: '3개 역 이동 | 8분 소요', color: '#FFC000', duration: 8 },
      { type: '환승', station: '601', details: '2개 역 이동 | 6분 소요', color: '#F7F7F7', duration: 6 },
      { type: '하차', station: '303', details: '', color: '#92D050', duration: 0 },
    ],
  },
];

const SearchResult = () => {
  const [departureStation, setDepartureStation] = useState('');
  const [arrivalStation, setArrivalStation] = useState('');
  const [sortOption, setSortOption] = useState('최소 시간순');
  const [isSortModalVisible, setSortModalVisible] = useState(false);
  const [mockData, setMockData] = useState(initialMockData);
  const [isSearchFavorite, setIsSearchFavorite] = useState(false);

  const exchangeStations = () => {
    const temp = departureStation;
    setDepartureStation(arrivalStation);
    setArrivalStation(temp);
  };

  const toggleFavorite = (id) => {
    setMockData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const clearDeparture = () => setDepartureStation('');
  const clearArrival = () => setArrivalStation('');

  const openSortModal = () => setSortModalVisible(true);
  const closeSortModal = () => setSortModalVisible(false);

  const handleSortOption = (option) => {
    setSortOption(option);
    if (option === '최소 시간순') {
      setMockData((prevData) =>
        [...prevData].sort(
          (a, b) => parseInt(a.time.replace('분', '')) - parseInt(b.time.replace('분', ''))
        )
      );
    } else if (option === '최소 비용순') {
      setMockData((prevData) =>
        [...prevData].sort(
          (a, b) => parseInt(a.cost.replace('원', '')) - parseInt(b.cost.replace('원', ''))
        )
      );
    }
    closeSortModal();
  };
  const renderGraph = (steps) => {
    const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0); // 전체 소요 시간 계산
    let cumulativeWidth = 0; // 누적 너비를 추적
    const graphWidth = 368; // 그래프 전체 너비 고정

  
    return (
      <View style={styles.graphContainer}>
        <View style={styles.graph}>
          {steps.map((step, index) => {
            const segmentWidth = (step.duration / totalDuration) * graphWidth; // 소요 시간 비율에 따른 너비 계산
            const circlePosition = cumulativeWidth; // 동그라미의 시작 위치
            cumulativeWidth += segmentWidth; // 누적 너비 업데이트
            
  
            return (
              <React.Fragment key={index}>
                {/* Step Line */}
                {index < steps.length - 1 && (
                  <View
                    style={[
                      styles.graphLine,
                      {
                        width: segmentWidth, // 막대 비율에 따라 길이 설정
                        backgroundColor: step.color, // 현재 구간 색상 적용
                        left: circlePosition, // 막대 시작 위치 설정
                      },
                    ]}
                  />
                )}
  
                {/* Step Circle */}
                <View
                  style={[
                    styles.graphCircle,
                    { backgroundColor: step.color, left: circlePosition - 15  }, // 동적 색상과 위치
                  ]}
                >
                  <Text style={styles.graphText}>{step.type}</Text>
                </View>
              </React.Fragment>
            );
          })}
        </View>
      </View>
    );
  };
  


  

  const renderResult = ({ item }) => (
    <View style={styles.resultCard}>
      <View style={styles.header}>
        <View style={styles.timeContainer}>
          <Text style={styles.label}>소요시간</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Text style={styles.details}>
          환승 {item.transfers}번 | {item.cost}
        </Text>
        <TouchableOpacity onPress={() => toggleFavorite(item.id)} style={styles.bookmark}>
          {item.isFavorite ? (
            <Image source={StarIcon} width={20} height={20} />
          ) : (
            <Image source={EmptyStarIcon} width={20} height={20} />
          )}
          <Text style={styles.bookmarkText}>즐겨찾기</Text>
        </TouchableOpacity>
      </View>
      {renderGraph(item.steps)}
      <View style={styles.steps}>
        {item.steps.map((step, index) => (
          <View key={index} style={styles.stepContainer}>
            <View style={styles.step}>
              <View style={[styles.circle, { backgroundColor: step.color }]}>
                <Text style={styles.circleText}>{step.type}</Text>
              </View>
              <View style={styles.stepTextContainer}>
                <Text style={styles.stepStation}>
                  {step.station} {step.type}
                </Text>
                {step.details ? <Text style={styles.stepDetails}>{step.details}</Text> : null}
              </View>
            </View>
            {index < item.steps.length - 1 && <View style={styles.line} />}
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.iconContainer}>
            <Image source={ArrowBackIcon} width={20} height={20} />
          </TouchableOpacity>
          <View style={styles.searchBox}>
            <TextInput
              placeholder="출발역"
              style={styles.input}
              value={departureStation}
              onChangeText={setDepartureStation}
            />
            <TouchableOpacity onPress={clearDeparture}>
              <Image source={ClearIcon} width={16} height={16} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.iconContainer} onPress={exchangeStations}>
            <Image source={ExchangeIcon} width={20} height={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <View style={styles.iconContainer} />
          <View style={styles.searchBox}>
            <TextInput
              placeholder="도착역"
              style={styles.input}
              value={arrivalStation}
              onChangeText={setArrivalStation}
            />
            <TouchableOpacity onPress={clearArrival}>
              <Image source={ClearIcon} width={16} height={16} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => setIsSearchFavorite(!isSearchFavorite)}
          >
            {isSearchFavorite ? (
              <Image source={StarIcon} width={20} height={20} />
            ) : (
              <Image source={EmptyStarIcon} width={20} height={20} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sortSection}>
        <Text style={styles.sortText}>{sortOption}</Text>
        <TouchableOpacity onPress={openSortModal} style={styles.sortIcon}>
          <ArrowDropDownIcon width={20} height={20} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={isSortModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeSortModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={['최소 시간순', '최소 비용순']}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => handleSortOption(item)}
                >
                  <Text style={styles.modalOptionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <FlatList
        data={mockData}
        keyExtractor={(item) => item.id}
        renderItem={renderResult}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};



  
  
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#F7F7F7',
    padding: 0,
    margin: 0,
  },
  searchSection: {
    backgroundColor: '#F7F7F7',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  searchBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 9999,
    height: 40,
    width: 305,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
  iconContainer: {
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 40,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
  },
  sortText: {
    fontSize: 14,
    color: '#000',
  },
  sortIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    elevation: 5,
  },
  modalOption: {
    padding: 10,
  },
  modalOptionText: {
    fontSize: 14,
    color: '#000',
  },
  list: {
    padding: 0,
    marginTop: 10,
  },
  resultCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    width: '100%',
    padding: 10,
    
  
    marginBottom: 10,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.4)',
    marginBottom: 5,
  },
  timeContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginRight: 20, // "14분"과 환승 정보 사이 간격 설정
    
  },
  time: {
    fontSize: 24,
    fontWeight: '600',
    color: 'rgba(0, 0, 0, 0.8)',
  },
  bookmark: {
    position: 'absolute',
    top: 5,
    right: 5,
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  bookmarkText: {
    marginLeft: 5,
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.4)',
  },
  details: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.4)',
    flex: 1,
    textAlign: 'left',
    
    alignSelf: 'flex-end',
    
  },
  steps: {
    marginTop: 10,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
    borderColor: '#FFFFFF',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleText: {
    fontSize: 10,
    color: 'rgba(0, 0, 0, 0.4)',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  line: {
    position: 'absolute',
    top: 30, // 동그라미 중심
    left: 15, // 동그라미 중심의 x축 위치
    height: 50, // 두 동그라미 간 거리
    width: 0, // 점선은 border로 처리
    borderLeftWidth: 2, // 점선 두께
    borderColor: 'rgba(0, 0, 0, 0.4)', // 점선 색상
    borderStyle: 'dashed',
    zIndex: -1, // 동그라미 뒤로 배치
  },
  
  stepContainer: {
    alignItems: 'center',
    marginBottom: 20, // 동그라미 간 거리
  },
  stepTextContainer: {
    flex: 1,
  },
  stepStation: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  stepDetails: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.4)',
  },
  graphContainer: {
    width: '100%',
    maxWidth: 368, // 그래프 너비 고정
    height: 36, // 그래프 높이 고정
    position: 'relative',
    alignSelf: 'center', // 화면 가운데 정렬
    borderRadius: 8, // 그래프 모서리 둥글게
    
    
    
  },
  graph: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative', // 동그라미와 막대 배치 조정
    width: '100%',
    height: '100%',
  },
  graphCircle: {
    width: 36, // 원 크기
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFD700', // 기본 원 배경색 (필요 시 동적으로 변경 가능)
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', // 정확한 위치 설정
    zIndex: 2, // 동그라미를 선 위에 표시
    borderColor: '#FFFFFF',
    borderWidth: 1,
    
  },
  graphLine: {
    
    flex: 1,
    height: 20, //그래프 두께
    position: 'absolute', // 막대의 위치를 동적으로 배치
   
  },
  graphText: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.4)',
    fontWeight: 'bold',
  },

});

export default SearchResult;


  




// 그래프 렌더링
const renderGraph = (steps) => {

  

    const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);
    let cumulativeWidth = 0; // 누적 너비 추적
    const graphWidth = 328; // 그래프 전체 너비 고정

    return (
      <View style={styles.graphContainer}>
        <View style={styles.graph}>
          {steps.map((step, index) => {
            
            const segmentWidth = (step.duration / totalDuration) * graphWidth; // 구간 비율에 따른 너비 계산
            const circlePosition = cumulativeWidth; // 써클 시작 위치
            cumulativeWidth += segmentWidth; // 누적 너비 업데이트

            // 다음 구간의 상태 확인
          const nextStep = steps[index + 1];
          


            const color = stepColors[step.type] || defaultColor; // 동적 배경색
            const borderColor = stepBorderColors[step.type] || defaultColor; // 동적 테두리 색상
            // 선 색상: 다음 구간이 '하차'라면 하차 색상 적용, 아니면 현재 구간 색상 적용
            const lineColor =
            nextStep?.type === '하차' ? stepColors['하차'] : stepColors[step.type];



            return (
              <React.Fragment key={index}>
                {/* 선 렌더링 */}
                {index < steps.length - 1 && (
                  <View
                    style={[
                      styles.graphLine,
                      { width: segmentWidth, backgroundColor: lineColor, left: circlePosition },
                    ]}
                  />
                )}
                {/* 써클 렌더링*/}
                <View
                  style={[
                    styles.commonCircle,
                    styles.graphCircle,
                    { backgroundColor: color, borderColor: borderColor, left: circlePosition - 15 },
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

  // 결과 카드 렌더링
  const renderResult = ({ item }) => (
    <View style={styles.resultCard}>
      <View style={styles.header}>
        {/* 소요 시간, 환승 정보 */}
        <View style={styles.timeContainer}>
          <Text style={styles.label}>소요시간</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Text style={styles.details}>
          환승 {item.transfers}번 | {item.cost}
        </Text>

        {/* 즐겨찾기 버튼*/}
        <TouchableOpacity onPress={() => toggleFavorite(item.id)} style={styles.bookmark}>
          {item.isFavorite ? (
            <Image source={StarIcon} style={styles.icon} />
          ) : (
            <Image source={EmptyStarIcon} style={styles.icon} />
          )}
          <Text style={styles.bookmarkText}>즐겨찾기</Text>
        </TouchableOpacity>
      </View>
      {/* 그래프 렌더링*/}
      {renderGraph(item.steps)}
      {/* 스텝 리스트 렌더링*/}
      <View style={styles.steps}>
        {item.steps.map((step, index) => {
          const color = stepColors[step.type] || defaultColor; // 동적 배경색
          const borderColor = stepBorderColors[step.type] || defaultColor; // 동적 테두리 배경색

          return (
            <View key={index} style={styles.stepContainer}>
              <View style={styles.step}>
                <View
                  style={[
                    styles.commonCircle,
                    styles.circle,
                    { backgroundColor: color, borderColor: borderColor },
                  ]}
                >
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
          );
        })}
      </View>
    </View>
  );
return(
    {/* 결과 목록 */}
    <FlatList
    data={mockData}
    keyExtractor={(item) => item.id}
    renderItem={renderResult}
    contentContainerStyle={styles.list}
  />

);


// 결과 목록 스타일 
list: { 
    paddingHorizontal: 0, // 좌우 여백 0
    marginTop: 10, // 상단 여백
  },
  // 결과 카드 스타일
  resultCard: {
    backgroundColor: '#FFFFFF',
    padding: 10, // 내부 여백
    marginBottom: 10, // 하단 여백
    borderRadius: 8, 
  },
  // 헤더 스타일 ( 소요 시간, 즐겨찾기 영역)
  header: { 
    flexDirection: 'row', // 가로 방향 배치 
    justifyContent: 'space-between', // 양쪽 정렬
    alignItems: 'center', // 수직 중앙 정렬
    marginBottom: 10,
  },
  // 소요 시간 컨테이너
  timeContainer: { 
    flexDirection: 'column', 
    alignItems: 'flex-start', //왼쪽 정렬
    justifyContent: 'center',
    marginRight: 20, // "14분"과 환승 정보 사이 간격 설정
  },
  // 소요 시간 텍스트 스타일
  time: { 
    fontSize: 24, 
    fontWeight: '600', // 굵은 글씨
    color: 'rgba(0, 0, 0, 0.8)',
  },
  // 세부 정보 텍스트 스타일
  details: { 
    fontSize: 14, 
    color: 'rgba(0, 0, 0, 0.4)',
    flex: 1,
    textAlign: 'left',
    alignSelf: 'flex-end',
  },
  // 즐겨찾기 버튼 스타일
  bookmark: {
    flexDirection: 'row', // 아이콘과 텍스트를 가로로 배치
    alignItems: 'center', // 수직 중앙 정렬
  },
  // 즐겨찾기 텍스트 스타일
  bookmarkText: {
    marginLeft: 5, // 아이콘과의 간격
    fontSize: 14, // 텍스트 크기
    color: 'rgba(0, 0, 0, 0.4)', // 연한 검정색
  },
  // 스텝 리스트 섹션 스타일
  steps: { 
    marginTop: 10 
  },
  // 개별 스텝 컨테이너 스타일
  stepContainer: { 
    
    marginBottom: 0 
  },
  // 개별 스텝 스타일
  step: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  
  stepTextContainer: { 
    flex: 1 
  },
  // 스텝 역 이름 스타일
  stepStation: { 
    fontSize: 14, 
    color: '#000' 
  },
  // 스텝 세부 정보 텍스트 스타일
  stepDetails: { 
    fontSize: 12, 
    color: 'rgba(0, 0, 0, 0.4)' 
  },
  // 점선 스타일 (스텝 사이 연결)
  line: {
    height: 50, // 점선 길이
    borderLeftWidth: 2, // 점선 두께
    borderColor: 'rgba(0, 0, 0, 0.4)',
    borderStyle: 'dashed', // 점선 스타일
    marginLeft: 15,
  },
  // 그래프 컨테이너 스타일
  graphContainer: { 
    height: 36, 
    width: '100%',
    maxWidth: 328, // 그래프 너비 고정
    justifyContent: 'center', // 수직 중앙 정렬
    alignSelf: 'center',
    alignItems: 'center', // 수직 중앙 정렬
    position: 'relative', // 화면 가운데 정렬
  },
  // 그래프 스타일 (그래프 전체 영역)
  graph: { 
    flexDirection: 'row', // 가로 방향 배치
    alignItems: 'center', // 수직 중앙 정렬
    height: '100%',
    width: '100%', // 부모 컨테이너 높이에 맞춤
    
  },
  // 공통 원 스타일
  commonCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  // 스텝 원 스타일
  circle: { 
    width: 30, 
    height: 30, 
    borderRadius: 15, 
    marginRight: 10 
  },
  circleText: { 
    fontSize: 12, // 텍스트 크기
    color: 'rgba(0, 0, 0, 0.4)', // 텍스트 색상
    textAlign: 'center', // 텍스트 중앙 정렬
    //fontWeight: 'bold', // 텍스트 굵기
  },
  
   // 그래프 원 스타일
  graphCircle: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    position: 'absolute' // 그래프 상의 위치 조정
  },
  graphText: { 
    fontSize: 14, 
    color: 'rgba(0, 0, 0, 0.6)', 
    textAlign: 'center' 
  },
  graphLine: { 
    height: 20, 
    position: 'absolute' 
  },
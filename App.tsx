import React from 'react';
import { View, Text } from 'react-native';
import SearchScreen from './src/screens/SearchScreen'; 
import SearchResult from './src/screens/SearchResult'; 

const App = () => {
  return (
    <View style={{ flex: 1 }}>
      {/*<SearchScreen />*} {/* SearchScreen 컴포넌트 렌더링 */}
      <SearchResult /> {/* SearchResult 컴포넌트를 렌더링 */}
    </View>
  );
};

export default App;



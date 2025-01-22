import React, { useRef, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const visibleItems = 7;
const itemWidth = screenWidth / visibleItems;

const WeeksCarousel = ({ data, selectedWeek, onScrollWeekChange, onWeekChange, scrollToWeek }) => {
  const flatListRef = useRef(null);

  useEffect(() => {
    if (flatListRef.current && scrollToWeek !== null) {
      const index = data.indexOf(scrollToWeek);
      if (index >= 0) {
        console.log(`Scrolling to week: ${scrollToWeek} at index ${index}`);
        setTimeout(() => {
          flatListRef.current.scrollToIndex({
            index,
            animated: true,
          });
        }, 0); // Delay to ensure FlatList is ready
      }
    }
  }, [scrollToWeek]);

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / itemWidth);

    if (onScrollWeekChange) {
      onScrollWeekChange(data[index]);
    }
  };

  const handleScrollEnd = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / itemWidth);

    if (onWeekChange) {
      onWeekChange(data[index]);
    }
  };

  const renderItem = ({ item }) => {
    const isSelected = item === selectedWeek;
    return (
      <View style={styles.itemContainer}>
        <View
          style={[
            styles.line,
            {
              height: isSelected ? 35 : 25,
              backgroundColor: isSelected ? 'white' : '#fff',
            },
          ]}
        />
        <Text style={[styles.weekText, isSelected && styles.selectedWeekText]}>{item}</Text>
      </View>
    );
  };

  return (
    <FlatList
      data={data}
      ref={flatListRef}
      renderItem={renderItem}
      keyExtractor={(item) => item.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={itemWidth}
      decelerationRate="fast"
      onScroll={handleScroll}
      onMomentumScrollEnd={handleScrollEnd}
      scrollEventThrottle={16}
      contentContainerStyle={{
        paddingHorizontal: (screenWidth - itemWidth) / 2 - 16,
      }}
      getItemLayout={(data, index) => ({
        length: itemWidth,
        offset: itemWidth * index,
        index,
      })}
      onScrollToIndexFailed={(error) => {
        console.warn("Scroll to index failed:", error);
        if (flatListRef.current) {
          flatListRef.current.scrollToOffset({
            offset: error.averageItemLength * error.index,
            animated: true,
          });
        }
      }}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    width: itemWidth,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  line: {
    width: 3,
    borderRadius: 2,
    marginBottom: 8,
  },
  weekText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white'
  },
  selectedWeekText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default WeeksCarousel;

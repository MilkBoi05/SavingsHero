import React, { useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import _ from 'lodash';

const screenWidth = Dimensions.get('window').width;
const visibleItems = 7;
const itemWidth = screenWidth / visibleItems;


const WeeksCarousel = forwardRef(({ data, selectedWeek, onScrollWeekChange, onWeekChange }, ref) => {
  const flatListRef = useRef(null);
  
  const debouncedScroll = useRef(
    _.debounce((week) => {
      if (onScrollWeekChange) {
        onScrollWeekChange(week);
      }
    }, 100)
  ).current;

//   useEffect(() => {
//     if (selectedWeek && flatListRef.current) {
//       const index = data.findIndex((item) => item === selectedWeek);
//       if (index >= 0) {
//         setScrollLock(true); // Lock updates during programmatic scrolling
//         flatListRef.current.scrollToIndex({
//           index,
//           animated: true,
//         });
//         setTimeout(() => setScrollLock(false), 300); // Unlock after animation completes
//       }
//     }
//   }, [selectedWeek]);
  
  
 
  const handleScroll = useRef(
    _.throttle((offsetX) => {
      const interpolatedIndex = offsetX / itemWidth; // Calculate fractional index
      const interpolatedWeek = Math.round(interpolatedIndex + 1); // Approximate the week (1-based)
  
      if (onScrollWeekChange) {
        onScrollWeekChange(data[interpolatedWeek - 1]); // Call parent with smooth updates
      }
    }, 100)
  ).current;
  
  const handleScrollEvent = (event) => {
    if (event?.nativeEvent?.contentOffset?.x != null) {
      const offsetX = event.nativeEvent.contentOffset.x;
      handleScroll(offsetX); // Pass only `offsetX` to the throttled function
    }
  };
  
  
  const handleScrollEnd = (event) => {
    if (!event || !event.nativeEvent || !event.nativeEvent.contentOffset) {
      return; // Exit early if event or contentOffset is null
    }
  
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / itemWidth); // Snap to the nearest week index
  
    if (onWeekChange) {
      onWeekChange(data[index]); // Finalize the week on momentum scroll end
    }
  };
  
  
  useImperativeHandle(ref, () => ({
    scrollToWeek: (week) => {
      const index = data.findIndex((item) => item === week);
      if (index >= 0 && flatListRef.current) {
        // setScrollLock(true); // Lock updates during programmatic scrolling
        flatListRef.current.scrollToIndex({
          index,
          animated: true,
        });
        // setTimeout(() => setScrollLock(false), 300); // Unlock after scroll completes
      }
    },
  }));

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
        {isSelected && (
          <Text style={[styles.weekText, styles.selectedWeeksText]}>
              weeks
            </Text>
        )}
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
      onScroll={handleScrollEvent}
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
        if (flatListRef.current) {
          flatListRef.current.scrollToOffset({
            offset: error.averageItemLength * error.index,
            animated: false, // Disable animation for initial scroll
          });
        }
      }}
      
    />
  );
});

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
    color: 'white',
  },
  selectedWeekText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default WeeksCarousel;

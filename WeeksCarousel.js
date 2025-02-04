import React, { useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import _ from 'lodash';

const screenWidth = Dimensions.get('window').width;
const visibleItems = 7;
const itemWidth = screenWidth / visibleItems;


const WeeksCarousel = forwardRef(({ data, selectedWeek, onScrollWeekChange, onWeekChange, lockScroll, setScrollLock, savingRecurrence }, ref) => {
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
      const interpolatedIndex = offsetX / itemWidth;
      const interpolatedPeriod = Math.round(interpolatedIndex + 1);
      console.log('interpolatedPeriod', interpolatedPeriod);
      console.log('interpolatedIndex', interpolatedIndex);

      if (onScrollWeekChange) {
        // Don't adjust the period - let parent component handle the conversion
        const selectedPeriod = data[interpolatedPeriod - 1];
        onScrollWeekChange(selectedPeriod);
        console.log('selectedPeriod', selectedPeriod);
      }
    }, 100)
  ).current;
  
  const handleScrollEvent = (event) => {
    if (lockScroll) return; // Skip updates during programmatic scrolling
  

    console.log('Running handleScrollEvent');
    const offsetX = event?.nativeEvent?.contentOffset?.x;
    if (offsetX != null) {
      handleScroll(offsetX); // Trigger throttled updates
    } 
  };
  
  const handleScrollEnd = (event) => {
    if (lockScroll) return;
  
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / itemWidth);
    const selectedPeriod = data[index];
  
    // Don't adjust the period - let parent component handle the conversion
    onWeekChange(selectedPeriod);
  };
  
  
  
  useImperativeHandle(ref, () => ({
    scrollToWeek: (week) => {
      const index = data.findIndex((item) => item === week);
      if (index >= 0 && flatListRef.current) {
        if (setScrollLock) setScrollLock(true); // Lock updates
        flatListRef.current.scrollToIndex({
          index,
          animated: true,
        });
        setTimeout(() => {
          if (setScrollLock) setScrollLock(false); // Unlock updates after scroll finishes
        }, 300);
        console.log('scrollToWeek', week);
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
        <Text style={[styles.weekText, isSelected && styles.selectedWeekText]}>
          {item}
        </Text>
        {isSelected && (
          <Text style={[styles.weekText, styles.selectedWeeksText]}>
            {getUnitText(item)}
          </Text>
        )}
      </View>
    );
  };
  
  
  

  const getDisplayNumber = (weekNumber) => {
    switch(savingRecurrence) {
      case 'fortnightly':
        return Math.ceil(weekNumber / 2); // Show half the number for fortnights
      case 'monthly':
        return Math.ceil(weekNumber / 4.33); // Show roughly a quarter for months
      default:
        return weekNumber;
    }
  };

  const getUnitText = (period) => {
    switch(savingRecurrence) {
      case 'fortnightly':
        return period === 1 ? 'fortnight' : 'fortnights';
      case 'monthly':
        return period === 1 ? 'month' : 'months';
      default:
        return period === 1 ? 'week' : 'weeks';
    }
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

import BusinessWrapper from '@/components/business/BusinessWrapper'
import { ThemedText, ThemedView } from '@/components/utils'
import { Fonts } from '@/constants/Fonts';
import React, { useCallback, useState } from 'react'
import { useTheme, View } from 'tamagui';
import { UseThemeResult } from '@tamagui/web';
import { RefreshControl, StyleSheet } from 'react-native'
import { useBusinessStore } from '@/utils/stores/businessStore';
import Review from '@/components/business/review/Review';
import { BusinessReview as ReviewProps } from '@/components/business/types';
import { FlashList } from '@shopify/flash-list';

export default function Reviews() {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const loadingReviews = useBusinessStore((state) => state.loadingReviews);
  const reviews = useBusinessStore((state) => state.reviews);
  const loadReviews = useBusinessStore((state) => state.loadReviews);
  const [refreshing, setRefreshing] = useState(false);
  const refresh = useCallback(async () => {
    setRefreshing(true);
    await loadReviews();
    setRefreshing(false);
  }, []);

  return (
    <BusinessWrapper loading={loadingReviews}>
      <View height={"100%"} width={"100%"} paddingHorizontal={20} backgroundColor={theme.background.val}>
        {reviews.size <= 0 ? (
          <ThemedView style={styles.container}>
            <ThemedText style={styles.fadedText}>No Reviews</ThemedText>
          </ThemedView>
        ) : (
          <FlashList
            data={Array.from(reviews.values())}
            renderItem={({ item }: { item: ReviewProps }) => (
              <Review {...item} key={item.id} />
            )}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
            estimatedItemSize={130}
          />
        )}
      </View>
    </BusinessWrapper>
  )
}

const makeStyles = (theme: UseThemeResult) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background.val,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fadedText: {
    lineHeight: 30,
    fontSize: Fonts.contentAlt.fontSize,
    color: theme.gray8.val
  }
})
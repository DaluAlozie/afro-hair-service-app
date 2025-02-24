import BusinessWrapper from '@/components/business/BusinessWrapper'
import { ThemedText, ThemedView } from '@/components/utils'
import { Fonts } from '@/constants/Fonts';
import React from 'react'
import { useTheme } from 'tamagui';
import { UseThemeResult } from '@tamagui/web';
import { StyleSheet } from 'react-native'
import { useBusinessStore } from '@/utils/stores/businessStore';
import Review from '@/components/business/review/Review';
import { Review as ReviewProps } from '@/components/business/types';
import { FlashList } from '@shopify/flash-list';

export default function Reviews() {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const loadingReviews = useBusinessStore((state) => state.loadingReviews);
  const reviews = useBusinessStore((state) => state.reviews);
  return (
    <BusinessWrapper loading={loadingReviews}>
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
        />
      )}
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
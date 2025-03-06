import React from 'react'
import Review from './Review'
import { Review as ReviewProps } from '@/components/business/types';
import { Sheet } from 'tamagui';
import { RefreshControl } from 'react-native';

type ReviewListProps = {
    reviews: ReviewProps[],
    headerComponent?: React.ReactElement | React.ComponentType | null | undefined
    refresh: () => void
    refreshing: boolean
}

export default function ReviewList({ reviews, headerComponent, refresh, refreshing}: ReviewListProps) {
    return reviews.length === 0 ? <></> :(
        <Sheet.ScrollView
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh}/>}>
            {headerComponent}
            {
                reviews.sort((a, b) => a.created_at.getTime() - b.created_at.getTime()).map((review) => (
                    <Review key={review.id} {...review}/>
                ))
            }
        </Sheet.ScrollView>
    )
}

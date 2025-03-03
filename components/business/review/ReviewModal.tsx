import SheetModal from '@/components/utils/ui/SheetModal'
import React from 'react'
import { View, Text } from 'tamagui'
import ReviewList from './ReviewList'
import { Review as ReviewProps } from '@/components/business/types';

type ReviewModalProps = {
    reviews: ReviewProps[],
    open: boolean,
    setOpen: (open: boolean) => void
    refresh: () => void
    refreshing: boolean
}
export default function ReviewModal({ reviews, open, setOpen, refresh, refreshing }: ReviewModalProps) {
  return (
    <SheetModal
      open={open}
      setOpen={setOpen}
      snapPoints={[75]}>
        <View flex={1}>
            <View>
                <Text fontSize={30} fontWeight="bold">Reviews</Text>
            </View>
            <ReviewList reviews={reviews} refresh={refresh} refreshing={refreshing}/>
        </View>
    </SheetModal>
  )
}

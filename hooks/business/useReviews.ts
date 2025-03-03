import { Review } from "@/components/business/types";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { supabaseClient } from "@/utils/auth/supabase";

export function useReviews(businessId: number | undefined) {
    const fetchReviews = useCallback(async (
        { queryKey }: { queryKey: [string, { businessId: number | undefined }] }
    ): Promise<Review[]> => {
        const [, { businessId }] = queryKey;
        if (!businessId) {
            return [] as Review[];
        }
        const supabase = await supabaseClient;
        const { data, error } = await supabase.rpc('get_business_reviews', { bid: businessId });
        if (error) {
            console.log(error);
            return [] as Review[];
        }
        const reviews = data.map((review: Review) => ({ ...review, created_at: new Date(review.created_at) }));
        return reviews;
    }, [businessId]);
    const {
      data: reviews,
      isFetching: isFetchingReviews,
      refetch: refetchReviews,
      isRefetching: isRefetchingReviews
    } = useQuery({
      queryKey: ['reviews', { businessId }],
      queryFn: fetchReviews,
      initialData: [] as Review[],
      enabled: !!businessId,
    });

    return {
      reviews,
      isFetchingReviews,
      refetchReviews,
      isRefetchingReviews,
    };
}
import { BusinessReview } from "@/components/business/types";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { supabaseClient } from "@/utils/auth/supabase";

export function useReviews(businessId: number | undefined) {
    const fetchReviews = useCallback(async (
        { queryKey }: { queryKey: [string, { businessId: number | undefined }] }
    ): Promise<BusinessReview[]> => {
        const [, { businessId }] = queryKey;
        if (!businessId) {
            return [] as BusinessReview[];
        }
        const supabase = await supabaseClient;
        const { data, error } = await supabase
          .from('BusinessReview')
          .select('*')
          .eq('business_id', businessId)
          .order('created_at', { ascending: false });
        if (error) {
            console.log(error);
            return [] as BusinessReview[];
        }
        const reviews = data.map((review: BusinessReview) => ({ ...review, created_at: new Date(review.created_at) }));
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
      initialData: [] as BusinessReview[],
      enabled: !!businessId,
    });

    return {
      reviews,
      isFetchingReviews,
      refetchReviews,
      isRefetchingReviews,
    };
}
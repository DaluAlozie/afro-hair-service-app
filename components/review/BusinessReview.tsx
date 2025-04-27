import React, { useCallback, useEffect, useState } from 'react'
import { Modal } from '../utils/ui/Modal';
import { View, Text, TextInput, Button } from 'react-native'
import Stars from './Stars';
import { useCustomerStore } from '@/utils/stores/customerStore';
import { useAuthStore } from '@/utils/stores/authStore';
import { supabaseClient } from '@/utils/auth/supabase';

export default function BusinessReview() {
    const [open, setOpen] = useState(false);
    const [stars, setStars] = useState(0);
    const [review, setReview] = useState('');
    const [appointmentId, setAppointmentId] = useState<number | null>(null);
    const [business_id, setBusinessId] = useState<number | null>(null);
    const userID = useAuthStore((state) => state.user?.id);

    const addAppointmentReview = useCustomerStore((state) => state.addAppointmentReview);

    const onSubmit = async () => {
        if (!appointmentId || !business_id) return;
        await addAppointmentReview(review, stars, business_id, appointmentId);
        await setBusinessReviewed();
        setOpen(false);
    }
    const getUnreviewedAppointment = useCallback(async () => {
        const supabase = await supabaseClient;
        const { data, error } = await supabase
            .from('Appointment')
            .select()
            .eq('customer_id', userID)
            .gte('end_time', new Date())
            .is('businessReviewed', false)
            .limit(1);
        if (error) {
            console.log(error);
            return;
        }
        if (data && data.length > 0) {
            setAppointmentId(data[0].id);
            setBusinessId(data[0].business_id);
            setOpen(true);
        }
    }, [userID]);
    
    useEffect(() => {
        getUnreviewedAppointment();
    }, [getUnreviewedAppointment]);

    const setBusinessReviewed = useCallback(async () => {
        const supabase = await supabaseClient;
        const { error } = await supabase
            .from('Appointment')
            .update({ businessReviewed: true })
            .eq('id', appointmentId);
        if (error) {
            console.log(error);
            return;
        }
        setOpen(false);
    }, [appointmentId]);

        
    return (
        <Modal
        open={open}
        setOpen={setOpen}
        onclose={setBusinessReviewed}
        >
           <View>
                <Text>Business Review</Text>
                <Stars value={stars} setValue={setStars} />
                <TextInput placeholder="Write your review" multiline={true} numberOfLines={4}
                    value={review}
                    onChangeText={(text) => setReview(text)}
                />
                <Button title="Submit" onPress={onSubmit} />
           </View>
        </Modal>
            

    )
}
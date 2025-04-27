import React, { useCallback, useEffect, useState } from 'react'
import { Modal } from '../utils/ui/Modal';
import { View, Text, TextInput, Button } from 'react-native'
import Stars from './Stars';
import { supabaseClient } from '@/utils/auth/supabase';
import { useBusinessStore } from '@/utils/stores/businessStore';

export default function CustomerReview() {
    const [open, setOpen] = useState(false);
    const [stars, setStars] = useState(0);
    const [review, setReview] = useState('');
    const [appointmentId, setAppointmentId] = useState<number | null>(null);
    const [customerId, setCustomerId] = useState<number | null>(null);
    const businessId = useBusinessStore((state) => state.id);


    const addCustomerReview = useBusinessStore((state) => state.addCustomerReview);

    const onSubmit = async () => {
        if (!appointmentId || !customerId) return;
        await addCustomerReview(review, stars, customerId, appointmentId);
        await setCustomerReviewed();
        setOpen(false);
    }
    const getUnreviewedAppointment = useCallback(async () => {
        const supabase = await supabaseClient;
        const { data, error } = await supabase
            .from('Appointment')
            .select()
            .eq('business_id', businessId)
            .gte('end_time', new Date())
            .is('customerReviewed', false)
            .limit(1);
        if (error) {
            console.log(error);
            return;
        }
        if (data && data.length > 0) {
            setAppointmentId(data[0].id);
            setCustomerId(data[0].customer_id);
            setOpen(true);
        }
    }, [businessId ]);

    const setCustomerReviewed = useCallback(async () => {
        const supabase = await supabaseClient;
        const { error } = await supabase
            .from('Appointment')
            .update({ customerReviewed: true })
            .eq('id', appointmentId);
        if (error) {
            console.log(error);
            return;
        }
        setOpen(false);
    }, [appointmentId]);
    
    useEffect(() => {
        getUnreviewedAppointment();
    }, [getUnreviewedAppointment]);

        
    return (
        <Modal
        open={open}
        setOpen={setOpen}
        onclose={setCustomerReviewed}
        >
           <View>
                <Text>Customer Review</Text>
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
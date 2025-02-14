import { useHeaderHeight } from '@react-navigation/elements';
import { useToastController } from '@tamagui/toast';
import { useCallback } from 'react'

export default function useToast() {
    const toast = useToastController();
    const headerHeight = useHeaderHeight();
    const showToast = useCallback((
        title: string,
        message: string,
        type: string
    ) => {
          toast.show(title, {
            message: message ?? "",
            customData: { type: type, headerHeight }
        })
    }, [toast, headerHeight]);
  return { showToast }
}

import { showErrorTop, showMessage } from "@/shared/utils/show_toast_message";
import { useEventDetailStore } from "@/store/events/use_event_details_store";
import { useUserEventStore } from "@/store/events/user_events_store";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const STICKY_HEADER_THRESHOLD = 250;

export const useEventDetailPage = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    
    // --- Store hooks ---
    const { 
        event, 
        fetchEventById, 
        fetchEventParticipants, 
        eventParticipants, 
        isLoadingEvent, 
        isLoadingParticipants 
    } = useEventDetailStore();

    const subscribeToEvent = useUserEventStore((state) => state.subscribeToEvent)
    const loadingSubscription = useUserEventStore((state) => state.loadingSubscribe)
    const errorSubscribe = useUserEventStore((state) => state.errorSubscribe)

    // --- Animation logic ---
    // Reference to the scroll position
    const scrollY = useRef(new Animated.Value(0)).current;

    // Interpolate opacity based on scroll position for the sticky header
    const headerOpacity = scrollY.interpolate({
        inputRange: [STICKY_HEADER_THRESHOLD - 50, STICKY_HEADER_THRESHOLD],
        outputRange: [0, 1],
        extrapolate: "clamp",
    });

    // --- Effects ---
    // Fetch event details on mount or when ID changes
    useEffect(() => {
        if (id) {
            const eventId = Array.isArray(id) ? id[0] : id;
            fetchEventById(eventId);
        }
    }, [id, fetchEventById]);

    // --- Handlers ---
    const handleJoinEvent = async () => {
        if (loadingSubscription) return

        const success = await subscribeToEvent(event!.id)

        if (success) {
            showMessage("Subscription completed!")
            return
        }

        showErrorTop("Error while subscribing: " + errorSubscribe)
    };
    
    const handleProfileNavigation = (userId: string) => {
        console.log("Navigate to profile:", userId);
    };

    const handleGoBack = () => {
        router.back();
    };

    /**
     * Triggers pagination for participants if not currently loading
     */
    const handleLoadMore = () => {
        if (!event) return;
        if (!isLoadingParticipants) {
            fetchEventParticipants(event.id);
        }
    };

    return {
        // Data
        event,
        eventParticipants,
        isLoadingEvent,
        isLoadingParticipants,
        
        // UI Helpers
        insets,
        scrollY,
        headerOpacity,

        // Actions
        handleJoinEvent,
        handleProfileNavigation,
        handleLoadMore,
        handleGoBack
    };
};
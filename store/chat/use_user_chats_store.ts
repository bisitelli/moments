import { container } from '@/dependency_injection/container';
import { UserChatsView } from '@/domain/model/entities/chat/user_chat_view';
import { getErrorMessage } from '@/shared/utils/error_utils';
import { create } from 'zustand';

interface UserChatsState {
    chats: UserChatsView[];
    isLoading: boolean;
    error: string | null;
    
    // Pagination state
    page: number;
    hasMore: boolean;
    
    // Actions
    setChats: (chats: UserChatsView[]) => void;
    appendChats: (chats: UserChatsView[]) => void;
    
    // Logic for Real-time updates
    updateOrAddChat: (chat: UserChatsView) => void;
    
    clearStore: () => void;
    
    // Async Actions
    fetchUserChats: () => Promise<void>;
    refreshUserChats: () => Promise<void>; // New action
}

export const useUserChatsStore = create<UserChatsState>((set, get) => ({
    chats: [],
    isLoading: false,
    page: 0,
    hasMore: true,
    error: null,

    setChats: (chats) => set({ chats }),

    appendChats: (incomingChats) => set((state) => {
        const uniqueChats = incomingChats.filter(
            newChat => !state.chats.some(existing => existing.id === newChat.id)
        );
        return { chats: [...state.chats, ...uniqueChats] };
    }),

    updateOrAddChat: (updatedChat) => set((state) => {
        const otherChats = state.chats.filter(c => c.id !== updatedChat.id);
        return { chats: [updatedChat, ...otherChats] };
    }),

    clearStore: () => set({ 
        chats: [], 
        page: 0, 
        hasMore: true, 
        isLoading: false,
        error: null
    }),

    // Standard pagination fetch
    fetchUserChats: async () => {
        const { page, hasMore, isLoading, appendChats, setChats } = get();

        if (isLoading || (!hasMore && page !== 0)) return;

        set({ isLoading: true });

        try {
            const response = await container.chatRepository.getUserChats(page);

            if (page === 0) {
                setChats(response.chats);
            } else {
                appendChats(response.chats);
            }

            set((state) => ({
                hasMore: response.hasMore,
                page: state.page + 1,
            }));

        } catch (error: unknown) {
            set({ error: getErrorMessage(error) });
        } finally {
            set({ isLoading: false });
        }
    },

    // New Refresh Logic: Keeps data visible while loading
    refreshUserChats: async () => {
        const { isLoading } = get();
        
        // Optional: Prevent refresh if already loading to avoid race conditions
        if (isLoading) return; 

        set({ isLoading: true });

        try {
            // Force fetch page 0
            const response = await container.chatRepository.getUserChats(0);

            set({
                chats: response.chats, // Replace entire list
                hasMore: response.hasMore,
                page: 1, // Reset page counter to 1 (since we just got 0)
                error: null
            });

        } catch (error: unknown) {
            set({ error: getErrorMessage(error) });
        } finally {
            set({ isLoading: false });
        }
    }
}));
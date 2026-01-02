import { container } from '@/dependency_injection/container';
import { ChatMessage } from '@/domain/model/entities/chat/chat_message';
import { UserChatsView } from '@/domain/model/entities/chat/user_chat_view';
import { getErrorMessage } from '@/shared/utils/error_utils';
import { create } from 'zustand';

interface UserChatsState {
    chats: UserChatsView[];
    unSeenMessagesCount: Map<string, number> // Map of chatId to unseen message count

    isLoading: boolean;
    error: string | null;
    
    // Pagination state
    page: number;
    hasMore: boolean;
    
    // Actions
    setChats: (chats: UserChatsView[]) => void;
    appendChats: (chats: UserChatsView[]) => void;
    setUnseenMessagesCount: (chatId: string, count: number) => void;
    resetUnseenMessagesCount: (chatId: string) => void;
    incrementUnseenMessagesCount: (chatId: string) => void;
    decrementUnseenMessagesCount: (chatId: string) => void;
    
    clearStore: () => void;
    
    // Async Actions
    fetchUserChats: () => Promise<void>;
    refreshUserChats: () => Promise<void>; // New action

    updateChatLastMessage: (message: ChatMessage) => void;

}

export const useUserChatsStore = create<UserChatsState>((set, get) => ({
    chats: [],
    unSeenMessagesCount: new Map<string, number>(),
    isLoading: false,
    page: 0,
    hasMore: true,
    error: null,

    setChats: (chats) => set({ chats }),

    setUnseenMessagesCount: (chatId, count) =>{
        // Update current state with a new reference to trigger reactivity
        const currentUnseenMessages = new Map(get().unSeenMessagesCount)
        currentUnseenMessages.set(chatId, count)

        set({
            unSeenMessagesCount: currentUnseenMessages
        })
    },

    incrementUnseenMessagesCount: (chatId) => {
        const state = get();
        const currentCount = state.unSeenMessagesCount.get(chatId) || 0;

        state.setUnseenMessagesCount(chatId, currentCount + 1)
    },

    decrementUnseenMessagesCount: (chatId) =>{
        const state = get();
        const currentCount = state.unSeenMessagesCount.get(chatId) || 0;
        
        state.setUnseenMessagesCount(chatId, currentCount - 1)
    },


    resetUnseenMessagesCount: (chatId) => {
        get().setUnseenMessagesCount(chatId, 0)
    },


    appendChats: (incomingChats) => set((state) => {
        const uniqueChats = incomingChats.filter(
            newChat => !state.chats.some(existing => existing.id === newChat.id)
        );
        return { chats: [...state.chats, ...uniqueChats] };
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
        const { page, hasMore, isLoading, appendChats, setChats, setUnseenMessagesCount } = get();

        if (isLoading || (!hasMore && page !== 0)) return;

        set({ isLoading: true });

        try {
            const response = await container.chatRepository.getUserChats(page);
            
            if (page === 0) {
                setChats(response.chats);
            } else {
                appendChats(response.chats);
            }

            // Initialize unseen messages count for new chats
            const unseenMap = new Map<string, number>(get().unSeenMessagesCount);
            response.chats.forEach(
                (chat) => unseenMap.set(chat.id, chat.unseenMessagesCount)
            )

            set((state) => ({
                hasMore: response.hasMore,
                page: state.page + 1,
                unSeenMessagesCount: unseenMap
            }));

        } catch (error: unknown) {
            set({ error: getErrorMessage(error) });
        } finally {
            set({ isLoading: false });
        }
    },

    refreshUserChats: async () => {
        const { isLoading } = get();
        
        // Prevent refresh if already loading to avoid race conditions
        if (isLoading) return; 

        set({ isLoading: true });

        try {
            // Force fetch page 0
            const response = await container.chatRepository.getUserChats(0);

            // Initialize unseen messages count for new chats
            const unseenMap = new Map<string, number>();
            response.chats.forEach(
                (chat) => unseenMap.set(chat.id, chat.unseenMessagesCount)
            )

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
    },

   updateChatLastMessage: (newMessage) => {

    const state = get();
       
    const currentChats = state.chats;
    const chatIndex = currentChats.findIndex((c) => c.id === newMessage.chatId);

    // Chat not found locally
    // If a brand new chat arrives via socket but isn't in the list yet,
    // we can't update it because we lack the Chat Metadata (User name, Avatar, etc).
    // It is best to trigger a fetch here or ignore it until the user refreshes.
    if (chatIndex === -1) {
        state.fetchUserChats();
        return;
    }

    // Prepare update
    const chatToUpdate = {
      ...currentChats[chatIndex],
      // Update the last message
      lastMessage: newMessage, 
      updatedAt: newMessage.sentAt || new Date().toISOString(),      
    };

    // Reorder 
    // Remove the old version of the chat
    const otherChats = currentChats.filter((c) => c.id !== newMessage.chatId);

    // Update unseen messages count
    state.incrementUnseenMessagesCount(newMessage.chatId);

    // Add the updated chat to the absolute top of the array
    set({
      chats: [chatToUpdate, ...otherChats],
    });

    console.log("Updated chat last message in store for chatId:", newMessage.chatId);
  },
}));
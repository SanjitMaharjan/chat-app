<template>
  <div
    v-if="chatStore.isMessagesLoading"
    class="flex-1 flex flex-col overflow-auto"
  >
    <ChatHeader />
    <MessageSkeleton />
    <MessageInput />
  </div>
  <template v-else>
    <div class="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div class="flex-1 overflow-y-auto p-4 space-y-4">
        <div
          ref="messageEndRef"
          v-for="message in chatStore.getDecryptedMessages"
          :key="message._id"
          class="chat"
          :class="
            message.senderId === authStore.authUser?._id
              ? 'chat-end'
              : 'chat-start'
          "
        >
          <div class="chat-image avatar">
            <div class="size-10 rounded-full border">
              <img
                :src="
                  message.senderId === authStore.authUser?._id
                    ? `https://i.pravatar.cc/150?u=${authStore.authUser?._id}`
                    : `https://i.pravatar.cc/150?u=${chatStore.selectedUser?._id}`
                "
                alt="profile-pic"
              />
            </div>
          </div>

          <div class="chat-header mb-1">
            <time class="text-xs opacity-50">
              {{ formatMessageTime(message.createdAt) }}
            </time>
          </div>
          <div class="chat-bubble flex">
            <p>{{ message.text }}</p>
          </div>
        </div>
      </div>

      <MessageInput />
    </div>
  </template>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import ChatHeader from "./ChatHeader.vue";
import MessageInput from "./MessageInput.vue";
import { useChatStore } from "../store/useChatStore";
import MessageSkeleton from "./Skeletons/MessageSkeleton.vue";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const chatStore = useChatStore();
const authStore = useAuthStore();
const messageEndRef = ref<any>(null);

watch(
  () => chatStore.selectedUser,
  () => {
    chatStore.unsubscribeToMessages();
    chatStore.getMessages(chatStore.selectedUser?._id);
    chatStore.subscribeToMessages();
  },
  { immediate: true }
);

watch(
  () => chatStore.messages,
  async () => {
    await nextTick();
    if (messageEndRef.value) {
      const messageRef = messageEndRef.value[messageEndRef.value.length - 1];
      messageRef?.scrollIntoView({ behavior: "smooth" });
    }
  },
  { deep: true }
);
</script>

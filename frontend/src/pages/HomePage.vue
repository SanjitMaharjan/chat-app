<template>
  <div class="h-screen bg-base-200">
    <div class="flex items-center justify-center pt-20 px-4">
      <div
        class="bg-base-100 rounded-lg shadow-xl w-full max-w-6xl h-[calc(100vh-8rem)]"
      >
        <div class="flex h-full rounded-lg overflow-hidden">
          <Sidebar />
          <NoChatSelected v-if="!selectedUser" />
          <ChatContainer v-else />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChatContainer from "../components/ChatContainer.vue";
import NoChatSelected from "../components/NoChatSelected.vue";
import Sidebar from "../components/Sidebar.vue";
import { useChatStore } from "../store/useChatStore";

const { selectedUser } = useChatStore();
</script>

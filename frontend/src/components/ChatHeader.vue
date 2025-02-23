<template>
  <div class="p-2.5 border-b border-base-300">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="avatar">
          <div class="size-10 rounded-full relative">
            <img
              :src="
                chatStore.selectedUser?.profilePic ||
                `https://i.pravatar.cc/150?u=${chatStore.selectedUser?._id}`
              "
            />
          </div>
        </div>

        <div>
          <h3 class="font-medium">{{ chatStore.selectedUser?.fullName }}</h3>
          <p class="text-sm text-base-content/70">
            {{
              authStore.onlineUsers.includes(chatStore.selectedUser?._id)
                ? "Online"
                : "Offline"
            }}
          </p>
        </div>
      </div>
      <button @click="() => chatStore.setSelectedUser(null)">
        <X />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X } from "lucide-vue-next";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const chatStore = useChatStore();
const authStore = useAuthStore();
</script>

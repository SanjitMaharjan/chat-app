<template>
  <template v-if="chatStore.isUsersLoading">
    <SidebarSkeleton />
  </template>
  <template v-else>
    <aside
      class="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200"
    >
      <div class="border-b border-base-300 w-full p-5">
        <div class="flex items-center gap-2">
          <Users class="size-6" />
          <span class="font-medium hidden lg:block">Contacts</span>
        </div>
      </div>
      <div class="overflow-y-auto w-full py-3">
        <button
          v-for="user in chatStore.users"
          :key="user.id"
          class="w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors"
          :class="{
            'bg-base-300 ring-1 ring-base-300': user._id === chatStore.selectedUser?.id,
          }"
          @click="chatStore.setSelectedUser(user)"
        >
        <!-- {{ user }} -->
          <div class="relative mx-auto lg:mx-0">
            <img
              :src="
                user.profilePic || `https://i.pravatar.cc/150?u=${user._id}`
              "
              :alt="user.fullName"
              class="size-12 object-cover rounded-full"
            />
            <span
              v-if="onlineUsers.includes(user._id)"
              class="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900"
            />
          </div>
          <div class="hidden lg:block text-left min-w-0">
            <div class="font-medium truncate">{{ user.fullName }}</div>
            <div class="text-sm text-zinc-400">
              {{ onlineUsers.includes(user._id) ? "Online" : "Offline" }}
            </div>
          </div>
        </button>
      </div>
    </aside>
  </template>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./Skeletons/SidebarSkeleton.vue";
import { Users } from "lucide-vue-next";

const chatStore =
  useChatStore();

const onlineUsers = [] as any[];

onMounted(async () => {
  await chatStore.getUsers();
  console.log(chatStore.getUser);
});
</script>

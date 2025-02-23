<template>
  <div
    v-if="isCheckingAuth && authUser"
    class="flex items-center justify-center h-screen"
  >
    <Loader class="size-10 animate-spin" />
  </div>
  <template v-else>
    <Navbar v-if="authUser" />
    <router-view />
  </template>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import Navbar from "./components/Navbar.vue";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-vue-next";

const { isCheckingAuth, authUser, checkAuth } = useAuthStore();

onMounted(() => {
  checkAuth();
  console.log(authUser);
});
</script>

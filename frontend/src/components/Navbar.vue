<template>
    <header class="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
        <div class="container mx-auto px-4 h-16">
            <div class="flex items-center justify-between h-full">
                <div class="flex items-center gap-8">
                    <RouterLink to="/" class="flex items-center gap-2.5 hover:opacity-80 transition-all">
                        <div class="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                            <MessageSquare class="size-5 text-primary" />
                        </div>
                        <h1 class="text-lg font-bold">SaChat</h1>
                    </RouterLink>
                </div>

                <div class="flex items-center gap-2">
                    <!-- <RouterLink to="/settings" class="btn btn-sm gap-2 transition-colors">
                        <Settings class="size-4" />
                        <span class="hidden sm:inline">Settings</span>
                    </RouterLink> -->

                    <template v-if="authStore.authUser">
                        <!-- <RouterLink to="/settings" class="btn btn-sm gap-2 transition-colors">
                            <User class="size-4" />
                            <span class="hidden sm:inline">Profile</span>
                        </RouterLink> -->

                        <p class="flex items-center gap-2">
                            <img :src="`https://i.pravatar.cc/150?u=${authStore.authUser?._id}`" class="rounded-full size-10" />
                            {{ authStore.authUser?.fullName }}
                        </p>
    
                        <button class="flex items-center gap-2" @click="authStore.logout">
                            <LogOut class="size-4" />
                            <span class="hidden sm:inline">Logout</span>
                        </button>
                    </template>
                </div>
            </div>
        </div>
    </header>
</template>

<script lang="ts" setup>
import { LogOut, MessageSquare } from 'lucide-vue-next';
import { useAuthStore } from '../store/useAuthStore';


const authStore = useAuthStore();

</script>
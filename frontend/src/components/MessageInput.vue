<template>
  <div class="p-4 w-full">
    <div v-if="imagePreview" class="mb-3 flex items-center gap-2">
      <div class="relative">
        <img
          :src="imagePreview"
          alt="Preview"
          class="size-20 object-cover rounded-lg border border-zinc-700"
        />
        <button
          class="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-base-300 flex items-center justify-center"
          type="button"
          @click="removeImage"
        >
          <X class="size-3" />
        </button>
      </div>
    </div>

    <form class="flex items-center gap-2" @submit.prevent="handleSendMessage">
      <div class="flex-1 flex gap-2">
        <input
          v-model="text"
          type="text"
          class="w-full input input-bordered rounded-lg input-sm sm:input-md"
          placeholder="Type a message..."
        />
        <!-- <input
          type="file"
          ref="fileInputRef"
          accept="image/*"
          class="hidden"
          @change="handleImageChange"
        />
        <button
          class="hidden sm:flex btn btn-circle"
          :class="imagePreview ? 'text-emerald-500' : 'text-zinc-400'"
          type="button"
          @click="fileInputRef?.click()"
        >
          <Image :size="20" />
        </button> -->
      </div>
      <button
        type="submit"
        class="btn btn-sm btn-circle"
        :disabled="!text.trim() && !imagePreview"
      >
        <Send :size="22" />
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-vue-next";
import { Notify } from "../utils/Notify";

const text = ref("");
const imagePreview = ref<any>(null);
const fileInputRef = ref<any>(null);

const chatStore = useChatStore();

const handleImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target?.files) return;
  const file = target.files[0];
  if (!file.type.startsWith("image/")) {
    Notify({ type: "error", text: "Please select an image file" });
    return;
  }

  const reader = new FileReader();
  reader.onloadend = () => {
    imagePreview.value = reader.result;
  }
};

const removeImage = () => {
    imagePreview.value = null;
    if (fileInputRef.value) fileInputRef.value.value = null;
};

const handleSendMessage = async () => {
  if (!text.value.trim() && !imagePreview.value) return;
  try {
      await chatStore.sendMessage({ text: text.value, image: imagePreview.value });
      text.value = "";
      imagePreview.value = null;
      if (fileInputRef.value) fileInputRef.value.value = null;
  } catch (error) {
    console.error("Failed to send message:", error);
  }
};
</script>

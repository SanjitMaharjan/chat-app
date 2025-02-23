import { defineStore } from "pinia";
import { axiosInstance } from "../lib/axios";
import { Notify } from "../utils/Notify";
import { useAuthStore } from "./useAuthStore";
import { decrypt, encrypt } from "../lib/chchaEncryption";

export const useChatStore = defineStore("chat", {
  state: () => {
    return {
      messages: [] as any[],
      users: [] as any[],
      selectedUser: null as any,
      isUsersLoading: false,
      isMessagesLoading: false,
    };
  },
  getters: {
    getDecryptedMessages: (state) => {
      const messages = [] as any[];
      state.messages.forEach(item => {
        const test = {...item};
        test.text = decrypt(test.text);
        messages.push(test);
      })
      return messages;
    },
  },
  actions: {
    async getUsers() {
      this.isUsersLoading = true;
      try {
        const res = await axiosInstance.get("/messages/users");
        this.users = res.data;
      } catch (error: any) {
        Notify({ type: "error", text: error.response.data.message });
      } finally {
        this.isUsersLoading = false;
      }
    },

    async getMessages(userId: number) {
      this.isMessagesLoading = true;
      try {
        const res = await axiosInstance.get(`/messages/${userId}`);
        this.messages = res.data;
      } catch (error: any) {
        Notify({ type: "error", text: error.response.data.message });
      } finally {
        this.isMessagesLoading = false;
      }
    },

    async sendMessage(messageData: any) {
      try {
        messageData.text = encrypt(messageData.text);
        const res = await axiosInstance.post(
          `/messages/send/${this.selectedUser?._id}`,
          messageData
        );
        console.log(res.data);
        this.messages.push(res.data);
      } catch (error: any) {
        Notify({ type: "error", text: error.response.data.message });
      }
    },

    subscribeToMessages() {
      if (!this.selectedUser) return;
      const authStore = useAuthStore();
      const socket = authStore.socket;
      if (!socket) return;
      socket.on("newMessage", (newMessage) => {
        this.messages.push(newMessage);
      });
    },

    unsubscribeToMessages() {
      const authStore = useAuthStore();
      const socket = authStore.socket;
      if (!socket) return;
      socket.off("newMessage");
    },

    setSelectedUser(selectedUser: any) {
      this.selectedUser = selectedUser;
    },
  },
});

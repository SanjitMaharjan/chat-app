import { defineStore } from "pinia";
import { axiosInstance } from "../lib/axios";
import { Notify } from "../utils/Notify";

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
    getUser: (state) => state.users,
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

    async getMessages() {
      this.isMessagesLoading = true;
      try {
        const res = await axiosInstance.get("/messages");
        this.messages = res.data;
      } catch (error: any) {
        Notify({ type: "error", text: error.response.data.message });
      } finally {
        this.isMessagesLoading = false;
      }
    },

    setSelectedUser(selectedUser: any) {
      this.selectedUser = selectedUser;
    },
  },
});

import { defineStore } from "pinia";
import { axiosInstance } from "../lib/axios";
import { Notify } from "../utils/Notify";
import { useStorage } from "@vueuse/core";
import { io, type Socket } from "socket.io-client";
import router from "../router";

const BASE_URL = "localhost:5001";

export const useAuthStore = defineStore("auth", {
  state: () => {
    return {
      authUser: useStorage<any>("authUser", null),
      isSigningUp: false,
      isLoggingIng: false,
      isUpdatingProfile: false,

      isCheckingAuth: false,
      onlineUsers: [] as any[],
      socket: null as any as Socket,
    };
  },
  actions: {
    async checkAuth() {
      try {
        this.isCheckingAuth = true;
        const res = await axiosInstance.get("/auth/check");
        this.authUser = res.data;
        this.connectSocket();
      } catch (error) {
        console.error("Error in check auth", error);
        this.authUser = null;
      } finally {
        this.isCheckingAuth = false;
      }
    },

    async signup(data: any) {
      try {
        this.isSigningUp = true;
        const response = await axiosInstance.post("/auth/signup", data);
        this.authUser = response.data;
        Notify({
          type: "success",
          text: "Account created successfully",
        });
        this.connectSocket();
        router.push({ name: "Home" });
      } catch (error) {
        console.error("Error in sign up", error);
      } finally {
        this.isSigningUp = false;
      }
    },

    async login(data: any) {
      try {
        this.isSigningUp = true;
        const response = await axiosInstance.post("/auth/login", data);
        this.authUser = response.data;
        Notify({
          type: "success",
          text: "Logged in successfully",
        });
        this.connectSocket();
        router.push({ name: "Home" });
      } catch (error) {
        console.error("Error in sign up", error);
      } finally {
        this.isSigningUp = false;
      }
    },

    async logout() {
      try {
        await axiosInstance.post("/auth/logout");
        this.authUser = null;
        Notify({ type: "success", text: "Logged out successfully" });
        this.disconnectSocket();
        router.push({ name: "Login" });
      } catch (error) {
        console.error("Error in logout", error);
        Notify({
          type: "error",
          text: "Error in logout",
        });
      }
    },

    connectSocket() {
      if (!this.authUser || this.socket?.connected) return;

      const socket = io(BASE_URL, {
        query: {
          userId: this.authUser._id,
        },
      });
      socket.connect();

      socket.on("getOnlineUsers", (onlineUserIds: any[]) => {
        this.onlineUsers = onlineUserIds;
      });

      this.socket = socket;
    },

    disconnectSocket() {
      if (this.socket?.connected) {
        this.socket.disconnect();
      }
    },
  },
});

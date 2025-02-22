import { defineStore } from "pinia";
import { axiosInstance } from "../lib/axios";
import { Notify } from "../utils/Notify";
import { useStorage } from "@vueuse/core";

export const useAuthStore = defineStore("auth", {
  state: () => {
    return {
      authUser: useStorage<any>("authUser", null),
      isSigningUp: false,
      isLoggingIng: false,
      isUpdatingProfile: false,

      isCheckingAuth: false,
    };
  },
  actions: {
    async checkAuth() {
      try {
        this.isCheckingAuth = true;
        const res = await axiosInstance.get("/auth/check");
        this.authUser = res.data;
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
        window.location.href = "/";
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
        window.location.href = "/";
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
        window.location.href = "/login";
      } catch (error) {
        console.error("Error in logout", error);
        Notify({
          type: "error",
          text: "Error in logout",
        });
      }
    },
  },
});

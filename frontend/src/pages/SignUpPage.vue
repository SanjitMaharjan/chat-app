<template>
  <div class="h-screen max-w-lg mx-auto px-5 pt-10">
    <div class="flex flex-col justify-center p-6 sm:p-12">
      <div class="w-full max-w-md- space-y-8">
        <!--LOGO-->
        <div class="text-center mb-8">
          <div class="flex flex-col items-center gap-2 group">
            <div
              class="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors"
            >
              <MessageSquare class="size-6 text-primary" />
            </div>
            <h1 class="text-2xl font-bold mt-2">Create Account</h1>
            <p class="text-base-content/60">
              Get started with your free account
            </p>
          </div>
        </div>
        <!--  -->

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Full Name</span>
            </label>
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
              >
                <User class="size-5 text-base-content/40" />
              </div>
              <input
                type="text"
                class="input input-bordered w-full pl-10"
                placeholder="John Doe"
                :value="formData.fullName"
                @change="formData.fullName = $event.target?.value ?? ''"
              />
            </div>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Email</span>
            </label>
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
              >
                <Mail class="size-5 text-base-content/40" />
              </div>
              <input
                type="email"
                class="input input-bordered w-full pl-10"
                placeholder="you@example.com"
                :value="formData.email"
                @change="formData.email = $event.target?.value ?? ''"
              />
            </div>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Password</span>
            </label>
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
              >
                <Lock class="size-5 text-base-content/40" />
              </div>
              <input
                type="password"
                class="input input-bordered w-full pl-10"
                placeholder="*******"
                :value="formData.password"
                @change="formData.password = $event.target?.value ?? ''"
              />
            </div>
          </div>

          <button
            type="submit"
            class="btn btn-primary w-full"
            :disabled="isSigningUp"
          >
            <span v-if="!isSigningUp">Sign Up</span>
            <template v-else>
              <Loader2 class="size-5 animate-spin" />
              Loading...
            </template>
          </button>
        </form>

        <div class="text-center">
          <p class="text-base-content/60">
            Already have an account?
            <RouterLink :to="{ name: 'Login' }" class="text-primary">
              Login
            </RouterLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../store/useAuthStore";
import { Loader2, Lock, Mail, MessageSquare, User } from "lucide-vue-next";
import { Notify } from "../utils/Notify";

const formData = ref({
  fullName: "",
  email: "",
  password: "",
});

const { signup, isSigningUp, authUser } = useAuthStore();

const validateForm = () => {
  if (!formData.value.fullName.trim())
    return Notify({ type: "error", text: "Full name is required" });
  if (!formData.value.email.trim())
    return Notify({ type: "error", text: "Email is required" });
  if (!formData.value.password.trim())
    return Notify({ type: "error", text: "Password is required" });
  if (formData.value.password.length < 6)
    return Notify({
      type: "error",
      text: "Password must be at least 6 characters",
    });

  return true;
};

const handleSubmit = () => {
  const success = validateForm();
  if (success === true) signup(formData.value);
};

(() => {
  if (authUser) {
    window.location.href = "/";
  }
})();
</script>

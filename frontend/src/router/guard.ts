import type {
  NavigationGuardNext,
  RouteLocationNormalizedGeneric,
  RouteLocationNormalizedLoadedGeneric,
} from "vue-router";
import { useAuthStore } from "../store/useAuthStore";

export const checkAuth = (
  to: RouteLocationNormalizedGeneric,
  _from: RouteLocationNormalizedLoadedGeneric,
  next: NavigationGuardNext
) => {
    console.log(to.meta.requiresAuth);
  if (to.meta.requiresAuth) {
    const { authUser } = useAuthStore();
    console.log(authUser);
    if (!authUser) {
    console.log(to, "test");
      next({ name: "Login" });
      return;
    } else {
        next();
    }
  } else {
      next();
  }
};

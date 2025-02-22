import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";
import { checkAuth } from "./guard";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(checkAuth);

export default router;

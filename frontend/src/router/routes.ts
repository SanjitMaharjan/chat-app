const routes = [
  {
    path: "/",
    children: [
      {
        path: "",
        name: "Home",
        component: () => import("../pages/HomePage.vue"),
        meta: { requiresAuth: true },
      },
      {
        name: "Signup",
        path: "signup",
        component: () => import("../pages/SignUpPage.vue"),
      },
      {
        name: "Login",
        path: "login",
        component: () => import("../pages/LoginPage.vue"),
      },
      {
        name: "Settings",
        path: "settings",
        component: () => import("../pages/SettingsPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        name: "Profile",
        path: "profile",
        component: () => import("../pages/ProfilePage.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },
];

export default routes;

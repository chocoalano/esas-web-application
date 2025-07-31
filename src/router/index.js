import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from "@/stores/auth/auth";
import publicRoutes from './PublicRoutes';
import DashboardRoutes from '@/router/DashboardRoutes';
import Pengaturan from './Pengaturan';
import GeneralRoutes from './GeneralRoutes';
import AplikasiRoutes from './AplikasiRoutes';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...publicRoutes,
    DashboardRoutes,
    Pengaturan,
    AplikasiRoutes,
    GeneralRoutes,
  ],
})

// BAD
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const publicPaths = ['/login', '/register', '/forgot-password'];
  const isPublicPath = publicPaths.includes(to.path);
  if (!authStore.token && !isPublicPath) {
    authStore.returnUrl = to.fullPath;
    return next('/login');
  }
  if (authStore.token && to.path === '/login') {
    return next(authStore.returnUrl || '/app');
  }
  next();
});

export default router

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from "@/stores/auth";
import { routes } from './router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

// BAD
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.path !== '/login' && !authStore.isAuthenticated) {
    next({ name: 'Login' })
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next({ path: '/app' })
  } else {
    if (to.path !== '/login') {
      authStore.getPermission()
      authStore.getProfile()
    }
    // if the user is not authenticated, `next` is called twice
    next()
  }
})

export default router

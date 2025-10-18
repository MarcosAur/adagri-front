import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PropertiesView from '@/views/ProducersView.vue'
import RuralPropertiesView from '@/views/RuralPropertiesView.vue'
import ProductionUnitsView from '@/views/ProductionUnitsView.vue'
import HerdsView from '@/views/HerdsView.vue'
import LoginView from '@/views/LoginView.vue'
import { useAuthStore } from '@/stores/login'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      meta: { requiresAuth: true },
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/propriedades',
      name: 'propriedades',
      meta: { requiresAuth: true },
      component: PropertiesView,
    },
    {
      path: '/propriedades-rurais',
      name: 'propriedades-rurais',
      meta: { requiresAuth: true },
      component: RuralPropertiesView,
    },
    {
      path: '/unidades-produtoras',
      name: 'unidades-produtoras',
      meta: { requiresAuth: true },
      component: ProductionUnitsView,
    },
    {
      path: '/rebanhos',
      name: 'rebanhos',
      meta: { requiresAuth: true },
      component: HerdsView,
    },
  ],
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!useAuthStore().token

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PropertiesView from '@/views/PropertiesView.vue'
import RuralPropertiesView from '@/views/RuralPropertiesView.vue'
import ProductionUnitsView from '@/views/ProductionUnitsView.vue'
import HerdsView from '@/views/HerdsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/propriedades',
      name: 'propriedades',
      component: PropertiesView,
    },
    {
      path: '/produtores-rurais',
      name: 'produtores-rurais',
      component: RuralPropertiesView,
    },
    {
      path: '/unidades-produtoras',
      name: 'unidades-produtoras',
      component: ProductionUnitsView,
    },
    {
      path: '/rebanhos',
      name: 'rebanhos',
      component: HerdsView,
    },
  ],
})

export default router

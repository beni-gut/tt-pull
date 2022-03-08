import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import RaidCardOverview from '@/views/RaidCardOverview';
import OverviewAllRaids from '@/views/OverviewAllRaids';
import InfoPage from "@/views/InfoPage";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/raidCards',
    name: 'Raids',
    component: RaidCardOverview
  },
  {
    path: '/raidsOverview',
    name: 'Overview Raids',
    component: OverviewAllRaids
  },
  {
    path: '/about',
    name: 'Info Page',
    component: InfoPage
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

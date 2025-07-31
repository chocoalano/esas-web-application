const DashboardRoutes = {
  path: '/app',
  component: () => import('@/layouts/DefaultLayout.vue'),
  meta: {
    requiresAuth: true
  },
  children: [
    {
      name: 'dashboard.absensi',
      path: '/app/dashboard/absensi',
      component: () => import('@/views/Dashboard/Hrga/AbsensiView.vue')
    },
    {
      path: '/app',
      redirect: '/app/dashboard/absensi',
    },
  ]
};

export default DashboardRoutes;

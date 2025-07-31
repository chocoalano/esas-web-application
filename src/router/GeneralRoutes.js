const GeneralRoutes = {
  path: '/app',
  component: () => import('@/layouts/DefaultLayout.vue'),
  meta: {
    requiresAuth: true
  },
  children: [
    {
      path: 'general',
      component: () => import('@/views/Pengaturan/IndexView.vue'),
      children: [
        {
          path: 'dokumentasi',
          component: () => import('@/views/General/Dokumentasi/IndexView.vue'),
          children: [
            {
              path: '',
              name: 'general.dokumentasi.list',
              component: () => import('@/views/General/Dokumentasi/DataList.vue'),
            },
            {
              path: 'create',
              name: 'general.dokumentasi.create',
              component: () => import('@/views/General/Dokumentasi/FormSubmit.vue'),
            },
            {
              path: ':id/edit',
              name: 'general.dokumentasi.edit',
              component: () => import('@/views/General/Dokumentasi/FormSubmit.vue'),
            },
          ],
        },
        {
          path: 'laporan-bug',
          component: () => import('@/views/General/LaporanBug/IndexView.vue'),
          children: [
            {
              path: '',
              name: 'general.laporan-bug.list',
              component: () => import('@/views/General/LaporanBug/DataList.vue'),
            },
            {
              path: 'create',
              name: 'general.laporan-bug.create',
              component: () => import('@/views/General/LaporanBug/FormSubmit.vue'),
            },
            {
              path: ':id/edit',
              name: 'general.laporan-bug.edit',
              component: () => import('@/views/General/LaporanBug/FormSubmit.vue'),
            },
          ],
        },
        {
          path: 'pengumuman',
          component: () => import('@/views/General/Pengumuman/IndexView.vue'),
          children: [
            {
              path: '',
              name: 'general.pengumuman.list',
              component: () => import('@/views/General/Pengumuman/DataList.vue'),
            },
            {
              path: 'create',
              name: 'general.pengumuman.create',
              component: () => import('@/views/General/Pengumuman/FormSubmit.vue'),
            },
            {
              path: ':id/edit',
              name: 'general.pengumuman.edit',
              component: () => import('@/views/General/Pengumuman/FormSubmit.vue'),
            },
          ],
        },
      ]
    },
  ]
};

export default GeneralRoutes;

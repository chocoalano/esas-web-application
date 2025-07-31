const AplikasiRoutes = {
  path: '/app',
  component: () => import('@/layouts/DefaultLayout.vue'),
  meta: {
    requiresAuth: true
  },
  children: [
    {
      path: 'aplikasi',
      component: () => import('@/views/Aplikasi/IndexView.vue'),
      children: [
        {
          path: 'jadwal-kerja',
          component: () => import('@/views/Aplikasi/JadwalShift/IndexView.vue'),
          children: [
            {
              path: '',
              name: 'aplikasi.jadwal_shift.list',
              component: () => import('@/views/Aplikasi/JadwalShift/DataList.vue'),
            },
            {
              path: 'create',
              name: 'aplikasi.jadwal_shift.create',
              component: () => import('@/views/Aplikasi/JadwalShift/FormSubmit.vue'),
            },
            {
              path: ':id/edit',
              name: 'aplikasi.jadwal_shift.edit',
              component: () => import('@/views/Aplikasi/JadwalShift/FormSubmit.vue'),
            },
          ],
        },
        {
          path: 'izin',
          component: () => import('@/views/Aplikasi/Izin/IndexView.vue'),
          children: [
            {
              path: '',
              name: 'aplikasi.izin.list',
              component: () => import('@/views/Aplikasi/Izin/DataList.vue'),
            },
            {
              path: 'tmp',
              name: 'aplikasi.izin.tmp',
              component: () => import('@/views/Aplikasi/Izin/DataTmpList.vue'),
            },
            {
              path: 'create',
              name: 'aplikasi.izin.create',
              component: () => import('@/views/Aplikasi/Izin/FormSubmit.vue'),
            },
            {
              path: ':id/edit',
              name: 'aplikasi.izin.edit',
              component: () => import('@/views/Aplikasi/Izin/FormSubmit.vue'),
            },
          ]
        },
        {
          path: 'absensi',
          component: () => import('@/views/Aplikasi/Absensi/IndexView.vue'),
          children: [
            {
              path: '',
              name: 'aplikasi.absensi.list',
              component: () => import('@/views/Aplikasi/Absensi/DataList.vue'),
            },
            {
              path: 'create',
              name: 'aplikasi.absensi.create',
              component: () => import('@/views/Aplikasi/Absensi/FormSubmit.vue'),
            },
            {
              path: ':id/edit',
              name: 'aplikasi.absensi.edit',
              component: () => import('@/views/Aplikasi/Absensi/FormSubmit.vue'),
            },
          ]
        },
      ]
    },
  ]
};

export default AplikasiRoutes;

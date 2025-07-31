const Pengaturan = {
  path: '/app',
  component: () => import('@/layouts/DefaultLayout.vue'),
  meta: {
    requiresAuth: true
  },
  children: [
    {
      path: 'pengaturan',
      component: () => import('@/views/Pengaturan/IndexView.vue'),
      children: [
        {
          path: 'perusahaan',
          component: () => import('@/views/Pengaturan/Perusahaan/IndexView.vue'),
          children: [
            {
              path: '',
              name: 'pengaturan.perusahaan.list',
              component: () => import('@/views/Pengaturan/Perusahaan/DataList.vue'),
            },
            {
              path: 'tmp',
              name: 'pengaturan.perusahaan.tmp',
              component: () => import('@/views/Pengaturan/Perusahaan/DataTmpList.vue'),
            },
            {
              path: 'create',
              name: 'pengaturan.perusahaan.create',
              component: () => import('@/views/Pengaturan/Perusahaan/FormSubmit.vue'),
            },
            {
              path: ':id/edit',
              name: 'pengaturan.perusahaan.edit',
              component: () => import('@/views/Pengaturan/Perusahaan/FormSubmit.vue'),
            },
          ]
        },
        {
          path: 'departemen',
          component: () => import('@/views/Pengaturan/Departemen/IndexView.vue'),
          children: [
            {
              path: '',
              name: 'pengaturan.departemen.list',
              component: () => import('@/views/Pengaturan/Departemen/DataList.vue'),
            },
            {
              path: 'tmp',
              name: 'pengaturan.departemen.tmp',
              component: () => import('@/views/Pengaturan/Departemen/DataTmpList.vue'),
            },
            {
              path: 'create',
              name: 'pengaturan.departemen.create',
              component: () => import('@/views/Pengaturan/Departemen/FormSubmit.vue'),
            },
            {
              path: ':id/edit',
              name: 'pengaturan.departemen.edit',
              component: () => import('@/views/Pengaturan/Departemen/FormSubmit.vue'),
            },
          ]
        },
        {
          path: 'level',
          component: () => import('@/views/Pengaturan/Level/IndexView.vue'),
          children: [
            {
              path: '',
              name: 'pengaturan.level.list',
              component: () => import('@/views/Pengaturan/Level/DataList.vue'),
            },
            {
              path: 'tmp',
              name: 'pengaturan.level.tmp',
              component: () => import('@/views/Pengaturan/Level/DataTmpList.vue'),
            },
            {
              path: 'create',
              name: 'pengaturan.level.create',
              component: () => import('@/views/Pengaturan/Level/FormSubmit.vue'),
            },
            {
              path: ':id/edit',
              name: 'pengaturan.level.edit',
              component: () => import('@/views/Pengaturan/Level/FormSubmit.vue'),
            },
          ]
        },
        {
          path: 'posisi',
          component: () => import('@/views/Pengaturan/Posisi/IndexView.vue'),
          children: [
            {
              path: '',
              name: 'pengaturan.posisi.list',
              component: () => import('@/views/Pengaturan/Posisi/DataList.vue'),
            },
            {
              path: 'tmp',
              name: 'pengaturan.posisi.tmp',
              component: () => import('@/views/Pengaturan/Posisi/DataTmpList.vue'),
            },
            {
              path: 'create',
              name: 'pengaturan.posisi.create',
              component: () => import('@/views/Pengaturan/Posisi/FormSubmit.vue'),
            },
            {
              path: ':id/edit',
              name: 'pengaturan.posisi.edit',
              component: () => import('@/views/Pengaturan/Posisi/FormSubmit.vue'),
            },
          ]
        },
        {
          path: 'peran',
          component: () => import('@/views/Pengaturan/Peran/IndexView.vue'),
          children: [
            {
              path: '',
              name: 'pengaturan.peran.list',
              component: () => import('@/views/Pengaturan/Peran/DataList.vue'),
            },
            {
              path: 'tmp',
              name: 'pengaturan.peran.tmp',
              component: () => import('@/views/Pengaturan/Peran/DataTmpList.vue'),
            },
            {
              path: 'create',
              name: 'pengaturan.peran.create',
              component: () => import('@/views/Pengaturan/Peran/FormSubmit.vue'),
            },
            {
              path: ':id/edit',
              name: 'pengaturan.peran.edit',
              component: () => import('@/views/Pengaturan/Peran/FormSubmit.vue'),
            },
          ],
        },
        {
          path: 'jenis-izin',
          component: () => import('@/views/Pengaturan/JenisIzin/IndexView.vue'),
          children: [
            {
              path: '',
              name: 'pengaturan.jenis-izin.list',
              component: () => import('@/views/Pengaturan/JenisIzin/DataList.vue'),
            },
            {
              path: 'tmp',
              name: 'pengaturan.jenis-izin.tmp',
              component: () => import('@/views/Pengaturan/JenisIzin/DataTmpList.vue'),
            },
            {
              path: 'create',
              name: 'pengaturan.jenis-izin.create',
              component: () => import('@/views/Pengaturan/JenisIzin/FormSubmit.vue'),
            },
            {
              path: ':id/edit',
              name: 'pengaturan.jenis-izin.edit',
              component: () => import('@/views/Pengaturan/JenisIzin/FormSubmit.vue'),
            },
          ],
        },
        {
          path: 'jam-kerja',
          component: () => import('@/views/Pengaturan/JamKerja/IndexView.vue'),
          children: [
            {
              path: '',
              name: 'pengaturan.jam_kerja.list',
              component: () => import('@/views/Pengaturan/JamKerja/DataList.vue'),
            },
            {
              path: 'create',
              name: 'pengaturan.jam_kerja.create',
              component: () => import('@/views/Pengaturan/JamKerja/FormSubmit.vue'),
            },
            {
              path: ':id/edit',
              name: 'pengaturan.jam_kerja.edit',
              component: () => import('@/views/Pengaturan/JamKerja/FormSubmit.vue'),
            },
          ],
        },
        {
          path: 'pengguna',
          component: () => import('@/views/Pengaturan/Pengguna/IndexView.vue'),
          children: [
            {
              path: '',
              name: 'pengaturan.users.list',
              component: () => import('@/views/Pengaturan/Pengguna/DataList.vue'),
            },
            {
              path: 'create',
              name: 'pengaturan.users.create',
              component: () => import('@/views/Pengaturan/Pengguna/FormSubmit.vue'),
            },
            {
              path: ':id/edit',
              name: 'pengaturan.users.edit',
              component: () => import('@/views/Pengaturan/Pengguna/FormSubmit.vue'),
            },
            {
              path: ':id/log',
              name: 'pengaturan.users.log',
              component: () => import('@/views/Pengaturan/Pengguna/InfoLog.vue'),
            },
            {
              path: 'tmp',
              name: 'pengaturan.users.tmp',
              component: () => import('@/views/Pengaturan/Pengguna/TmpLIst.vue'),
            },
          ]
        },
      ]
    },
  ]
};

export default Pengaturan;

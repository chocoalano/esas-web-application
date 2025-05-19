export const routes = [
  {
    path: '/',
    redirect: '/login', // redirect ke login ketika path root diakses
  },
  {
    path: '/app',
    redirect: '/app/dashboard-hrga', // redirect ke login ketika path root diakses
  },
  {
    path: '/app',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      {
        path: 'dashboard-hrga',
        component: () => import('@/views/Dashboard/HrgaView.vue'),
      },
      {
        path: 'pemberitahuan',
        component: () => import('@/views/Dashboard/PemberitahuanVIew.vue'),
      },
      {
        path: 'profile',
        component: () => import('@/views/Dashboard/ProfileView.vue'),
      },
      {
        path: 'dokumentasi',
        component: () => import('@/views/Documentation/IndexView.vue'),
        children: [
          {
            path: '',
            name: 'adm.dokumentasi.list',
            component: () => import('@/views/Documentation/DataList.vue'),
          },
          {
            path: 'create',
            name: 'adm.dokumentasi.create',
            component: () => import('@/views/Documentation/FormSubmit.vue'),
          },
          {
            path: ':id/edit',
            name: 'adm.dokumentasi.edit',
            component: () => import('@/views/Documentation/FormSubmit.vue'),
          },
          {
            path: ':id',
            name: 'adm.dokumentasi.show',
            component: () => import('@/views/Documentation/DataShow.vue'),
          }
        ]
      },
      {
        path: 'pengaturan',
        component: () => import('@/views/Pengaturan/IndexView.vue'),
        children: [
          {
            path: 'perusahaan',
            component: () => import('@/views/Pengaturan/Perusahaan/DataList.vue'),
          },
          {
            path: 'departemen',
            component: () => import('@/views/Pengaturan/Departemen/DataList.vue'),
          },
          {
            path: 'level',
            component: () => import('@/views/Pengaturan/Level/DataList.vue'),
          },
          {
            path: 'posisi',
            component: () => import('@/views/Pengaturan/Posisi/DataList.vue'),
          },
          {
            path: 'peran',
            component: () => import('@/views/Pengaturan/Peran/DataList.vue'),
          },
          {
            path: 'jenis-izin',
            component: () => import('@/views/Pengaturan/JenisIzin/DataList.vue'),
          },
          {
            path: 'jam-kerja',
            component: () => import('@/views/Pengaturan/JamKerja/DataList.vue'),
          },
          {
            path: 'pengguna',
            component: () => import('@/views/Pengaturan/Pengguna/DataList.vue'),
          },
        ]
      },
      {
        path: 'administrasi-hr',
        component: () => import('@/views/AdministrasiHR/IndexView.vue'),
        children: [
          {
            path: 'pengumuman',
            component: () => import('@/views/AdministrasiHR/Pengumuman/IndexView.vue'),
            children: [
              {
                path: '',
                name: 'admhr.pengumuman.list',
                component: () => import('@/views/AdministrasiHR/Pengumuman/DataList.vue'),
              },
              {
                path: 'create',
                name: 'admhr.pengumuman.create',
                component: () => import('@/views/AdministrasiHR/Pengumuman/FormSubmit.vue'),
              },
              {
                path: ':id/edit',
                name: 'admhr.pengumuman.edit',
                component: () => import('@/views/AdministrasiHR/Pengumuman/FormSubmit.vue'),
              },
              {
                path: ':id',
                name: 'admhr.pengumuman.show',
                component: () => import('@/views/AdministrasiHR/Pengumuman/DataShow.vue'),
              }
            ]
          },
          {
            path: 'absensi',
            component: () => import('@/views/AdministrasiHR/Absensi/IndexView.vue'),
            children: [
              {
                path: '',
                name: 'admhr.absensi.list',
                component: () => import('@/views/AdministrasiHR/Absensi/DataList.vue'),
              },
              {
                path: 'create',
                name: 'admhr.absensi.create',
                component: () => import('@/views/AdministrasiHR/Absensi/FormSubmit.vue'),
              },
              {
                path: ':id/edit',
                name: 'admhr.absensi.edit',
                component: () => import('@/views/AdministrasiHR/Absensi/FormSubmit.vue'),
              },
              {
                path: ':id',
                name: 'admhr.absensi.show',
                component: () => import('@/views/AdministrasiHR/Absensi/DataShow.vue'),
              }
            ]
          },
          {
            path: 'laporan-bug',
            component: () => import('@/views/AdministrasiHR/LaporanBug/DataList.vue'),
          },
          {
            path: 'jadwal-kerja',
            component: () => import('@/views/AdministrasiHR/JadwalKerja/DataList.vue'),
          },
          {
            path: 'izin',
            component: () => import('@/views/AdministrasiHR/Izin/DataList.vue'),
          },
        ]
      }
      // Anda bisa menambahkan lebih banyak children di sini jika perlu
    ],
  },
  {
    path: '/login', // Menyusun ulang path agar jelas dan lengkap
    component: () => import('@/layouts/BlankLayout.vue'),
    children: [
      {
        path: '', // Menunjukkan path login di dalam layout blank
        name: 'Login',
        component: () => import('@/views/LoginView.vue'),
      },
    ],
  },
  // Menambahkan fallback untuk path yang tidak ditemukan
  {
    path: '/:catchAll(.*)', // menangani semua path yang tidak cocok
    component: () => import('@/views/NotFound.vue'), // Halaman Not Found
  },
];

<template>
  <v-container fluid class="fill-height d-flex align-center justify-center text-center">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-8 border border-thin" elevation="0" rounded="xl">
          <v-icon size="96" color="error" class="mb-4">mdi-alert-circle-outline</v-icon>
          <h1 class="text-h2 font-weight-bold mb-4 text-error">404</h1>
          <h2 class="text-h5 font-weight-medium mb-6">Halaman Tidak Ditemukan</h2>
          <p class="text-body-1 text-medium-emphasis mb-8">
            Maaf, halaman yang Anda cari mungkin telah dihapus, namanya diganti, atau tidak pernah ada.
            Jangan khawatir, Anda bisa kembali ke halaman utama atau mencoba mencari sesuatu yang lain.
          </p>
          <div class="d-flex flex-column flex-sm-row justify-center ga-4">
            <v-btn to="/" color="green-darken-3" size="large" rounded="lg" prepend-icon="mdi-home">
              Kembali ke Beranda
            </v-btn>
            <v-btn @click="$router.back()" variant="tonal" color="red-darken-4" size="large" rounded="lg"
              prepend-icon="mdi-arrow-left">
              Kembali
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
// No specific script logic needed for this simple 404 page
// $router.back() and to="/" are handled by Vue Router
</script>

<style scoped>
/* No specific custom styles needed as Vuetify classes handle most of it */
</style>

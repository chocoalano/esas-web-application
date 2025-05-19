<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from "@/stores/auth";

const router = useRouter()
const store = useAuthStore();

const visible = ref(false)
const formState = ref({
  indicatour: '',
  password: '',
})

const submit = async () => {
  // console.log("Form submitted", formState.value)
  await store.login(formState.value)
  router.push({ path: '/app' })
}

// Mencegah scroll saat halaman login ditampilkan
onMounted(() => {
  document.body.style.overflow = 'hidden'
})

// Mengembalikan scroll normal saat komponen dilepas
onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <v-row class="fill-height no-scroll">
    <!-- Bagian Gambar (Hidden di Mobile) -->
    <v-col cols="12" md="6" class="image-section d-none d-md-flex">
      <div class="overlay"></div>
      <v-img src="/svg/login.svg" cover class="login-image"></v-img>
    </v-col>

    <!-- Bagian Form -->
    <v-col cols="12" md="6" class="form-section">
      <v-form @submit.prevent="submit">
        <v-card class="login-card mx-auto pa-8 pb-6" rounded="lg">
          <h2 class="text-h5 font-weight-bold text-center mb-4">Welcome Back!</h2>

          <v-text-field density="compact" placeholder="Email address" prepend-inner-icon="mdi-account"
            variant="outlined" v-model="formState.indicatour">
          </v-text-field>

          <v-text-field :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
            density="compact" placeholder="Enter your password" prepend-inner-icon="mdi-lock-outline" variant="outlined"
            @click:append-inner="visible = !visible" v-model="formState.password">
          </v-text-field>

          <div class="text-caption text-blue text-right">
            <a href="#" class="text-decoration-none">Forgot password?</a>
          </div>

          <v-btn type="submit" color="primary" size="large" variant="tonal" block class="mt-4"
            :loading="store.isLoading">
            Log In
          </v-btn>

          <v-card-text class="text-caption text-medium-emphasis text-center mt-3">
            After 3 failed login attempts, your account will be locked for 3 hours.
          </v-card-text>
        </v-card>
      </v-form>
    </v-col>
  </v-row>
</template>

<style scoped>
/* Layout utama */
.login-container {
  position: fixed;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Bagian gambar */
.image-section {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Overlay agar gambar lebih menarik */
.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
}

/* Bagian form */
.form-section {
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  width: 100%;
  max-width: 400px;
}
</style>

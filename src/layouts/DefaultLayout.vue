<script setup>
import { useDefaultLayout } from './useDefaultLayout';
import { useDocumentation } from './useDocumentation';
import { usePermissionCheck } from '@/composables/useApp'

const {
  authStore,
  dashboardMenu,
  generalMenu,
  hrMenu,
  settingsMenu,
  display,
  drawerLeft,
  drawerRight,
  dashboardExpanded,
  hrExpanded,
  settingsExpanded,
  railMenu,
  railMenuValue,
  TOOGLE_THEME_ACTION,
  LOGOUT_ACTION,
  SET_RAIL_MENU,
} = useDefaultLayout()

const {
  documentationItems,
  searchDocs,
  isLoadingDocs,
  hasMoreDocs,
  LOAD_DOCUMENTATION_ACTION
} = useDocumentation()

const { permissionCheck } = usePermissionCheck();
</script>

<template>
  <v-app id="inspire">
    <v-app-bar elevation="0" class="border-b border-gray-200">
      <v-img src="/svg/logo_esas.svg" alt="Logo ESAS" contain :max-height="$vuetify.display.xs ? 40 : 40"
        :max-width="$vuetify.display.xs ? 90 : 100" class="flex-shrink-0"
        :class="{ 'ml-15 mr-15': !$vuetify.display.xs, 'ml-4 mr-2': $vuetify.display.xs }" />

      <v-app-bar-nav-icon v-if="display.mobile.value" @click="drawerLeft = !drawerLeft" />

      <v-app-bar-title v-if="!$vuetify.display.xs">Aplikasi</v-app-bar-title>

      <template #append>
        <v-btn icon="mdi-information-outline" @click="drawerRight = !drawerRight" />
        <v-btn icon="mdi-theme-light-dark" @click="TOOGLE_THEME_ACTION" />
        <v-btn icon="mdi-bell-outline" to="/app/general/pemberitahuan" />
        <v-btn icon="mdi-account" to="/app/general/profil" />
        <v-btn icon="mdi-logout" @click="LOGOUT_ACTION" :loading="authStore.isLoading" />
      </template>
    </v-app-bar>

    <v-navigation-drawer v-if="display.mobile.value" v-model="drawerLeft">
      <v-list density="compact" nav>
        <v-list-group v-if="dashboardMenu.length" v-model="dashboardExpanded" prepend-icon="mdi-apps" no-action>
          <template #activator="{ props }">
            <v-list-item v-bind="props" title="Dashboard" />
          </template>
          <template v-for="(item, i) in dashboardMenu" :key="i">
            <v-list-item v-if="permissionCheck(item.permission)" :prepend-icon="item.icon" :title="item.text"
              :to="item.to" nav />
          </template>
        </v-list-group>

        <v-list-group v-if="settingsMenu.length" v-model="settingsExpanded" prepend-icon="mdi-cog" no-action>
          <template #activator="{ props }">
            <v-list-item v-bind="props" title="Pengaturan" />
          </template>
          <template v-for="(item, i) in settingsMenu" :key="i">
            <v-list-item v-if="permissionCheck(item.permission)" :prepend-icon="item.icon" :title="item.text"
              :to="item.to" nav />
          </template>
        </v-list-group>

        <v-list-group v-if="hrMenu.length" v-model="hrExpanded" prepend-icon="mdi-format-list-checkbox" no-action>
          <template #activator="{ props }">
            <v-list-item v-bind="props" title="Administrasi HR" />
          </template>
          <template v-for="(item, i) in hrMenu" :key="i">
            <v-list-item v-if="permissionCheck(item.permission)" :prepend-icon="item.icon" :title="item.text"
              :to="item.to" nav />
          </template>
        </v-list-group>

        <template v-for="(item, i) in generalMenu" :key="i">
          <v-list-item v-if="permissionCheck(item.permission)" :prepend-icon="item.icon" :to="item.to">
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer v-if="!display.mobile.value" permanent rail>
      <v-list nav>
        <v-list-item v-for="i in railMenu" :key="i.value" :prepend-icon="i.icon" :value="i.value"
          @click="SET_RAIL_MENU(i.value)"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer v-if="!display.mobile.value" permanent class="bg-background pa-4">
      <div class="font-weight-medium mb-3 text-center">{{ railMenuValue.charAt(0).toUpperCase() + railMenuValue.slice(1)
        }}
      </div>
      <v-divider :thickness="1" class="mb-5"></v-divider>
      <v-row>
        <template v-if="railMenuValue === 'dashboard'">
          <template v-for="item in dashboardMenu" :key="item.to">
            <v-col v-if="permissionCheck(item.permission)" col="12" md="6">
              <v-card class="border border-thin h-100" elevation="0" rounded="xl" :to="item.to">
                <v-card-text class="d-flex flex-column align-center justify-center pa-3 text-center">
                  <v-avatar size="48" class="mb-2">
                    <v-icon :icon="item.icon" size="30" class="text-on-info"></v-icon>
                  </v-avatar>
                  <div class="text-caption font-weight-medium text-wrap">{{ item.text }}</div>
                </v-card-text>
              </v-card>
            </v-col>
          </template>
        </template>
        <template v-if="railMenuValue === 'general'">
          <template v-for="item in generalMenu" :key="item.to">
            <v-col v-if="permissionCheck(item.permission)" col="12" md="6">
              <v-card class="border border-thin h-100" elevation="0" rounded="xl" :to="item.to">
                <v-card-text class="d-flex flex-column align-center justify-center pa-3 text-center">
                  <v-avatar size="48" class="mb-2">
                    <v-icon :icon="item.icon" size="30" class="text-on-info"></v-icon>
                  </v-avatar>
                  <div class="text-caption font-weight-medium text-wrap">{{ item.text }}</div>
                </v-card-text>
              </v-card>
            </v-col>
          </template>
        </template>
        <template v-if="railMenuValue === 'aplikasi'">
          <template v-for="item in hrMenu" :key="item.to">
            <v-col v-if="permissionCheck(item.permission)" col="12" md="6">
              <v-card class="border border-thin h-100" elevation="0" rounded="xl" :to="item.to">
                <v-card-text class="d-flex flex-column align-center justify-center pa-3 text-center">
                  <v-avatar size="48" class="mb-2">
                    <v-icon :icon="item.icon" size="30" class="text-on-info"></v-icon>
                  </v-avatar>
                  <div class="text-caption font-weight-medium text-wrap">{{ item.text }}</div>
                </v-card-text>
              </v-card>
            </v-col>
          </template>
        </template>
        <template v-if="railMenuValue === 'pengaturan'">
          <template v-for="item in settingsMenu" :key="item.to">
            <v-col v-if="permissionCheck(item.permission)" col="12" md="6">
              <v-card class="border border-thin h-100" elevation="0" rounded="xl" :to="item.to">
                <v-card-text class="d-flex flex-column align-center justify-center pa-3 text-center">
                  <v-avatar size="48" class="mb-2">
                    <v-icon :icon="item.icon" size="30" class="text-on-info"></v-icon>
                  </v-avatar>
                  <div class="text-caption font-weight-medium text-wrap">{{ item.text }}</div>
                </v-card-text>
              </v-card>
            </v-col>
          </template>
        </template>
      </v-row>
    </v-navigation-drawer>

    <v-navigation-drawer v-model="drawerRight" location="right" :width="280">
      <v-list nav dense>
        <v-list-item>
          <v-text-field v-model="searchDocs" label="Cari" placeholder="Cari keterangan..."
            prepend-inner-icon="mdi-magnify" variant="outlined" density="compact" class="mt-5" clearable
            rounded="pill" />
        </v-list-item>

        <div style="max-height: calc(100vh - 120px); overflow-y: auto">
          <v-infinite-scroll :load="LOAD_DOCUMENTATION_ACTION" :disabled="!hasMoreDocs || isLoadingDocs"
            :key="searchDocs" mode="manual">
            <template v-for="item in documentationItems" :key="item.id">
              <v-list-item class="flex-wrap" lines="three" :to="`/app/general/dokumentasi/${item.id}`">
                <v-list-item-title class="font-weight-bold mb-2">
                  {{ item.title }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-body-2 text-wrap">
                  {{ item.subtitle }}
                </v-list-item-subtitle>
              </v-list-item>
            </template>
            <template v-slot:load-more="{ props }">
              <div v-if="isLoadingDocs" class="text-center py-2">
                <v-progress-circular indeterminate color="primary" size="24"></v-progress-circular>
              </div>
              <v-btn icon="mdi-refresh" size="small" variant="text" v-bind="props" v-else-if="hasMoreDocs"></v-btn>
              <p class="text-grey text-center py-2" v-else>Semua data telah dimuat.</p>
            </template>
          </v-infinite-scroll>
          <p v-if="!isLoadingDocs && documentationItems.length === 0 && !hasMoreDocs"
            class="text-grey text-center py-4">
            Tidak ada dokumentasi ditemukan.
          </p>
        </div>
      </v-list>
    </v-navigation-drawer>

    <v-main class="bg-background">
      <v-container fluid>
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>
<style scoped>
/* Tambahkan atau modifikasi CSS ini */
.v-avatar {
  opacity: 1.9 !important;
}
</style>

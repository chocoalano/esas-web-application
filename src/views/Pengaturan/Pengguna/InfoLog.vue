<script setup>
import { ref, watch } from 'vue'; // Keep 'watch' for reactive updates if needed locally
import { useRoute } from 'vue-router';
import dayjs from 'dayjs';
import 'dayjs/locale/id'; // Ensure Indonesian locale is imported

import { JsonViewer } from 'vue3-json-viewer';
import { useInfoLog } from './useInfoLog'; // Your custom composable

// Destructure reactive state and functions from your composable
const {
  historyData,
  currentPage,
  // itemsPerPage,
  totalPage,
  searchFilters, // ⭐ Get searchFilters from composable ⭐
  methodOptions, // ⭐ Get method options from composable ⭐
  actionOptions, // ⭐ Get action options from composable ⭐
  modelTypeOptions, // ⭐ Get model options from composable ⭐
  // FETCH_HISTORY,
} = useInfoLog(); // Correctly call the composable

const route = useRoute();
const activityId = ref(null); // This will be updated from route.params.id

// Reactive variable to hold the JSON data to display in the viewer
const selectedPayload = ref({});

// Function to handle showing the payload of a clicked activity
const showPayload = (payload) => {
  if (typeof payload === 'string') {
    try {
      selectedPayload.value = JSON.parse(payload);
    } catch (e) {
      console.error('Failed to parse JSON payload:', e);
      selectedPayload.value = { error: 'Invalid JSON data', raw: payload };
    }
  } else {
    selectedPayload.value = payload;
  }
};
const formatTime = (isoString) => {
  dayjs.locale('id');
  return dayjs(isoString).format('LLL');
};
watch(() => route.params.id, (newId) => {
  activityId.value = newId;
}, { immediate: true });
</script>

<template>
  <v-card prepend-icon="mdi-clipboard-text-clock-outline"
    :title="activityId ? `Riwayat Aktivitas ID: ${activityId}` : 'Riwayat Aktivitas Sistem'"
    text="Daftar lengkap riwayat perubahan, kejadian, dan interaksi dalam sistem." rounded="xl"
    class="border border-thin elevation-2">
    <v-card-text>
      <v-row class="mb-4">
        <v-col cols="12" sm="4">
          <v-autocomplete v-model="searchFilters.method" :items="methodOptions" label="Method"
            placeholder="Pilih Method" variant="outlined" density="compact" rounded="lg" clearable />
        </v-col>
        <v-col cols="12" sm="4">
          <v-autocomplete v-model="searchFilters.action" :items="actionOptions" label="Action"
            placeholder="Pilih Action" variant="outlined" density="compact" rounded="lg" clearable />
        </v-col>
        <v-col cols="12" sm="4">
          <v-autocomplete v-model="searchFilters.model_type" :items="modelTypeOptions" label="Model"
            placeholder="Pilih Model" variant="outlined" density="compact" rounded="lg" clearable />
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text>
      <template v-if="historyData.length === 0">
        <v-alert type="info" variant="tonal" class="my-4" icon="mdi-information-outline" title="Tidak Ada Aktivitas"
          text="Belum ada riwayat aktivitas yang tercatat untuk saat ini."></v-alert>
      </template>
      <template v-else>
        <v-row>
          <v-col cols="12" md="6">
            <v-timeline align="start" side="end" class="pa-0">
              <v-timeline-item v-for="(activity, index) in historyData" :key="activity.id || index"
                :dot-color="activity.color || 'grey'" :icon="activity.icon || 'mdi-information'" size="small" fill-dot>
                <v-card :color="activity.color || 'grey'" variant="tonal"
                  class="rounded-lg timeline-content-card cursor-pointer" @click="showPayload(activity.payload)">
                  <v-card-text class="pa-4">
                    <div class="d-flex justify-space-between flex-column flex-sm-row mb-2">
                      <div
                        :class="['text-subtitle-1', 'font-weight-bold', `text-${activity.color || 'grey'}-darken-2`]">
                        {{ activity.action || 'Aktivitas Tidak Diketahui' }}
                      </div>
                      <div class="text-caption text-medium-emphasis mt-1 mt-sm-0 text-no-wrap">
                        {{ formatTime(activity.created_at || activity.time) }}
                      </div>
                    </div>
                    <div class="text-body-2 text-wrap">{{ activity.description || activity.url }}</div>
                    <div v-if="activity.payload" class="text-caption text-medium-emphasis mt-2">
                      Klik untuk melihat detail payload
                    </div>
                  </v-card-text>
                </v-card>
              </v-timeline-item>
            </v-timeline>
          </v-col>
          <v-col cols="12" md="6">
            <h3 class="text-h6 mb-3">Detail Payload</h3>
            <v-card class="pa-3" elevation="1">
              <JsonViewer :value="selectedPayload" copyable boxed sort theme="light" :expanded="true"
                :expand-depth="2" />
            </v-card>
            <p v-if="Object.keys(selectedPayload).length === 0" class="text-center text-medium-emphasis mt-4">
              Pilih item aktivitas di sebelah kiri untuk melihat detail payload.
            </p>
          </v-col>
        </v-row>
      </template>
    </v-card-text>
    <v-card-actions class="text-center">
      <v-row justify="center">
        <v-col cols="8">
          <v-container class="max-width">
            <v-pagination v-model="currentPage" :length="totalPage" class="my-4"></v-pagination>
          </v-container>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
/* Base card shadow */
.v-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
}

/* Timeline content card styling */
.timeline-content-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  max-width: 600px;
  /* Adjust this value as needed */
  /* This margin-left helps align the card with the timeline line */
  margin-left: -16px;
  /* Adjust based on Vuetify version/spacing */
}

.timeline-content-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08) !important;
}

/* Reduce padding between timeline items for a denser look */
.v-timeline-item {
  padding-bottom: 12px !important;
}

/* Softer timeline line color */
.v-timeline-divider__before,
.v-timeline-divider__after {
  background-color: rgba(0, 0, 0, 0.08) !important;
}

/* Add shadow to timeline dots */
.v-timeline-item__dot {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Optional: Adjust overall timeline position if it's too far left */
.v-timeline {
  margin-left: 16px;
  /* Push the whole timeline slightly to the right */
}

/* Prevent text from wrapping (e.g., timestamps) */
.text-no-wrap {
  white-space: nowrap;
}

/* Custom cursor for clickable cards */
.cursor-pointer {
  cursor: pointer;
}
</style>

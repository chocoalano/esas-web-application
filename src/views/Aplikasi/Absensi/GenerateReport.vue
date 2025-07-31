<script setup>
import { reactive, watch } from 'vue'
import { useList } from './useList'
import dayjs from 'dayjs'

const props = defineProps({
  comOptions: { type: Array, default: () => [] },
  deptOptions: { type: Array, default: () => [] },
  userOptions: { type: Array, default: () => [] },
  statusOptions: { type: Array, default: () => [] },
})

const { GENERATE_REPORT_ACTION } = useList()

const reportFilters = reactive({
  company_id: null,
  departement_id: null,
  user_id: [],
  status_in: null,
  status_out: null,
  start: null,
  end: null,
})

// Format tanggal ketika user memilih
watch(() => reportFilters.start, (val) => {
  if (val) {
    reportFilters.start = dayjs(val).format('YYYY-MM-DD')
  }
})

watch(() => reportFilters.end, (val) => {
  if (val) {
    reportFilters.end = dayjs(val).format('YYYY-MM-DD')
  }
})

const submitReport = async () => {
  GENERATE_REPORT_ACTION(reportFilters)
}
</script>
<template>
  <v-dialog max-width="700">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn v-bind="activatorProps" prepend-icon="mdi-chart-box-outline" variant="tonal" class="font-weight-bold">
        Generate Report
      </v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card rounded="xl" class="pa-4">
        <v-card-title class="text-h6 font-weight-bold pb-2">
          Filter Laporan
        </v-card-title>

        <v-card-subtitle class="text-body-2 text-medium-emphasis mb-4">
          Sesuaikan filter untuk mendapatkan laporan yang akurat.
        </v-card-subtitle>

        <v-card-text>
          <v-row dense>
            <v-col md="6">
              <v-select v-model="reportFilters.company_id" :items="props.comOptions" item-title="name" item-value="id"
                label="Perusahaan" variant="outlined" density="compact" rounded="lg" clearable />
            </v-col>

            <v-col md="6">
              <v-select v-model="reportFilters.departement_id" :items="props.deptOptions" item-title="name"
                item-value="id" label="Departemen" variant="outlined" density="compact" rounded="lg" clearable />
            </v-col>

            <v-col md="12">
              <v-select v-model="reportFilters.user_id" multiple :items="props.userOptions" item-title="name"
                item-value="id" label="Pengguna" variant="outlined" density="compact" rounded="lg" clearable />
            </v-col>

            <v-col md="6">
              <v-select v-model="reportFilters.status_in" :items="props.statusOptions" item-title="name"
                item-value="value" label="Status Masuk" variant="outlined" density="compact" rounded="lg" clearable />
            </v-col>

            <v-col md="6">
              <v-select v-model="reportFilters.status_out" :items="props.statusOptions" item-title="name"
                item-value="value" label="Status Pulang" variant="outlined" density="compact" rounded="lg" clearable />
            </v-col>

            <v-col md="6">
              <v-date-input v-model="reportFilters.start" label="Tanggal Mulai" prepend-icon=""
                prepend-inner-icon="mdi-calendar" variant="outlined" rounded="lg" density="compact" clearable />
            </v-col>

            <v-col md="6">
              <v-date-input v-model="reportFilters.end" label="Tanggal Selesai" prepend-icon=""
                prepend-inner-icon="mdi-calendar" variant="outlined" rounded="lg" density="compact" clearable />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="mt-4">
          <v-spacer />
          <v-btn color="error" variant="tonal" @click="isActive.value = false" prepend-icon="mdi-close">
            Tutup
          </v-btn>
          <v-btn color="primary" variant="tonal" prepend-icon="mdi-file-export" @click="submitReport">
            Export Data
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

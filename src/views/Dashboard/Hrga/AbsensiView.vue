<script setup>
import BarChartAbsen from '@/components/charts/BarChartAbsen.vue'
import PieChartAbsen from '@/components/charts/PieChartAbsen.vue'
import DasboardLayout from '@/components/Mains/DasboardLayout.vue'
import { useAbsensi } from './useAbsensi'

const {
  // Reactive data
  isLoading,
  companyId,
  dateRange,
  allCompanies,
  selectedCompanyId,
  chartAbsen,
  cards,
  vuetifyColors,
  // Functions
  hexToRGBA,
} = useAbsensi()

function handleDateRangeChange(newRange) {
  dateRange.value = newRange;
}

function handleCompanyChange(id) {
  companyId.value = id
}
</script>

<template>
  <DasboardLayout @date-range-changed="handleDateRangeChange" @company-changed="handleCompanyChange"
    :company-options="allCompanies" :initial-company-id="selectedCompanyId">
    <div class="mt-5 mb-5 text-h6 font-weight-bold">Berikut adalah data Stats informasi.</div>
    <v-row align="center" justify="center" dense>
      <v-col v-for="(card, index) in cards" :key="index" cols="12" md="3">
        <v-skeleton-loader type="card" v-if="isLoading.stats"></v-skeleton-loader>
        <v-card v-else class="mx-auto pa-3 transition-all duration-300 hover:shadow-lg border border-thin" elevation="0"
          rounded="xl">
          <div class="d-flex justify-space-between align-center">
            <v-avatar size="64"
              :style="`background-color: ${hexToRGBA(card.color)}; color: ${vuetifyColors[card.color] || '#2196F3'};`">
              <v-icon :icon="card.prependIcon" size="25" />
            </v-avatar>

            <div class="text-right">
              <div class="text-h6 font-weight-bold">
                {{ card.title }}
              </div>
              <div class="text-caption" v-html="card.subtitle"></div>
            </div>
          </div>

          <v-card-text class="mt-4 px-0 text-body-2">
            {{ card.text }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <div class="mt-5 mb-5 text-h6 font-weight-bold">Berikut adalah data grafik absensi.</div>
    <v-row dense>
      <v-col cols="12" md="6">
        <v-skeleton-loader type="card" v-if="isLoading.charts"></v-skeleton-loader>
        <BarChartAbsen v-else :labels="chartAbsen.labels" :dataNormal="chartAbsen.normal"
          :dataTerlambat="chartAbsen.telat" />
      </v-col>
      <v-col cols="12" md="6">
        <v-skeleton-loader type="card" v-if="isLoading.charts"></v-skeleton-loader>
        <PieChartAbsen v-else :labels="chartAbsen.labels" :dataNormal="chartAbsen.normal"
          :dataTerlambat="chartAbsen.telat" />
      </v-col>
    </v-row>
  </DasboardLayout>
</template>

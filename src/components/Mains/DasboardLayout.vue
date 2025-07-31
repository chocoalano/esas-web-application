<script setup>
import { useRoute } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import dayjs from 'dayjs'; // Ensure dayjs is installed: npm install dayjs

// Define props for the component
const props = defineProps({
  companyOptions: {
    type: Array,
    default: () => [],
  },
  initialCompanyId: {
    type: [String, Number, null],
    default: null,
  },
  // Optional: Prop for initial date range if parent wants to set it
  initialDateRange: {
    type: Array, // Expects [Date, Date] or [string, string]
    default: () => [null, null],
  },
});

// Reactive breadcrumb items
const items = ref([
  {
    title: 'Dashboard',
    disabled: false,
    href: '/app',
  },
])
const { mobile } = useDisplay()

// Reactive datepicker model
const company = ref(props.initialCompanyId)

// This ensures dayjs always gets valid dates to format, even if they are just today's date.
const datepicker = ref(props.initialDateRange[0] && props.initialDateRange[1]
  ? [dayjs(props.initialDateRange[0]).toDate(), dayjs(props.initialDateRange[1]).toDate()] // Convert to Date objects if strings
  : [dayjs().startOf('month').toDate(), dayjs().endOf('month').toDate()] // Default to current month if no prop
);

// Emit for communication with parent
const emit = defineEmits(['date-range-changed', 'company-changed'])

// Get current route
const route = useRoute()

// Update breadcrumb based on current route path
const updateBreadcrumbs = () => {
  const path = route.path.split('/').filter(Boolean)

  const baseItems = [
    {
      title: 'Dashboard',
      disabled: false,
      href: '/app',
    },
  ];

  const dynamicItems = path.map((segment, index) => ({
    title: decodeURIComponent(segment.charAt(0).toUpperCase() + segment.slice(1)),
    disabled: false,
    href: '/' + path.slice(0, index + 1).join('/'),
  }));

  items.value = [...baseItems, ...dynamicItems];
};

// Watch the route.path specifically, not the whole route object
watch(() => route.path, updateBreadcrumbs, { immediate: true })

// Emit formatted date range
const handleDateChange = (value) => {
  if (Array.isArray(value) && value.length >= 2 && value[0] instanceof Date && value[value.length - 1] instanceof Date) {
    const sortedDates = [...value].sort((a, b) => a.getTime() - b.getTime());

    const startDate = sortedDates[0];
    const endDate = sortedDates[sortedDates.length - 1];

    emit('date-range-changed', {
      startDate: dayjs(startDate).format('YYYY-MM-DD'),
      endDate: dayjs(endDate).format('YYYY-MM-DD'),
    });
  } else if (value === null || (Array.isArray(value) && value.every(d => d === null))) {
    emit('date-range-changed', null);
  } else {
    console.warn("Unexpected value from v-date-input:", value);
    emit('date-range-changed', null);
  }
}

// Emit formatted company ID
const handleCompanyChange = (value) => {
  emit('company-changed', value);
}

// Emit initial values if available
onMounted(() => {
  handleDateChange(datepicker.value);
  if (company.value !== null) {
    handleCompanyChange(company.value);
  }
});
</script>

<template>
  <v-container fluid class="py-2">
    <v-row align="center" justify="space-between">
      <!-- Breadcrumbs -->
      <v-col cols="12" md="6">
        <v-breadcrumbs :items="items" class="pa-2">
          <template v-slot:divider>
            <v-icon icon="mdi-chevron-right"></v-icon>
          </template>
        </v-breadcrumbs>
      </v-col>

      <!-- Date Picker & Company Select -->
      <v-col cols="12" md="6" class="d-flex align-center gap-2 justify-md-end flex-wrap">
        <v-select v-model="company" class="mt-6 mr-6" rounded="xl" density="compact" variant="outlined"
          :items="props.companyOptions" item-title="name" item-value="id" label="Pilih Perusahaan"
          @update:model-value="handleCompanyChange"></v-select>

        <v-date-input v-model="datepicker" label="Pilih Rentang Tanggal" rounded="xl"
          :max-width="mobile ? '100%' : '368px'" clearable variant="outlined" prepend-icon=""
          prepend-inner-icon="mdi-calendar" @update:model-value="handleDateChange" density="compact" class="mt-6 mr-3"
          multiple="range" />
      </v-col>
    </v-row>

    <!-- Slot for content -->
    <slot></slot>
  </v-container>
</template>

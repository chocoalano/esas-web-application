import { useListTmpStore } from "@/stores/aplikasi/izin/tmp";
import dayjs from "dayjs";
import { debounce } from "lodash";
import { reactive, ref, watch, onMounted } from "vue"; // Added onMounted
import { useToast } from "vue-toast-notification";

export function useTmp() {
  const store = useListTmpStore();
  const toast = useToast()
  const pagination = reactive({
    page: 1,
    itemsPerPage: 10,
    totalItems: 0,
    selected: [],
    serverItems: [],
    sortBy: [],
  });

  const filters = reactive({
    permit_type: null, // Use null for v-select clearable to truly reset
    permit_numbers: '',
    workday: null, // Date input should be null initially
    start: null,   // For date range filter (start date)
    end: null,     // For date range filter (end date)
    createdAt: null, // For single creation date filter
    updatedAt: null, // For single update date filter
  });

  const tableOptions = ref({
    page: 1,
    itemsPerPage: 10,
    sortBy: [],
  });

  // ⭐ NEW: Filter options for v-selects (e.g., permit_type) ⭐
  const filterOptions = reactive({
    typePermitOptions: [
      { id: 'izin', type: 'Izin' },
      { id: 'cuti', type: 'Cuti' },
      { id: 'dispensasi', type: 'Dispensasi' },
      // Add more as needed, or fetch from API
    ],
    // Add other filter options if you have them, e.g., company, user, etc.
  });

  const resetFilters = () => {
    // Reset each filter property to its initial state
    filters.permit_type = null;
    filters.permit_numbers = '';
    filters.workday = null;
    filters.start = null;
    filters.end = null;
    filters.createdAt = null;
    filters.updatedAt = null;

    // After resetting, reload items to apply empty filters
    LOAD_ITEMS();
  };

  const HANDLE_TABLE_OPTIONS = (options) => {
    tableOptions.value = { ...options };
    LOAD_ITEMS();
  };

  const LOAD_ITEMS = async () => {
    try {
      store.isLoading.list = true;

      const sortBy = tableOptions.value.sortBy.length
        ? tableOptions.value.sortBy
        : [{ key: 'created_at', order: 'desc' }]; // Default sort

      // Construct search object, filtering out null/empty values
      const search = {};
      if (filters.permit_type) search.permit_type = filters.permit_type;
      if (filters.permit_numbers) search.permit_numbers = filters.permit_numbers;
      if (filters.workday) search.workday = dayjs(filters.workday).format('YYYY-MM-DD');
      if (filters.createdAt) search.createdAt = dayjs(filters.createdAt).format('YYYY-MM-DD');
      if (filters.updatedAt) search.updatedAt = dayjs(filters.updatedAt).format('YYYY-MM-DD');
      // Date range filters (start/end) are typically handled by an external component's event,
      // but ensure they're passed to the backend if present
      if (filters.start && filters.end) {
        search.start_date_range = dayjs(filters.start).format('YYYY-MM-DD');
        search.end_date_range = dayjs(filters.end).format('YYYY-MM-DD');
      }

      const response = await store.GET_LIST_PAGINATE({
        page: tableOptions.value.page,
        itemsPerPage: tableOptions.value.itemsPerPage,
        sortBy,
        search,
      });

      pagination.serverItems = response.data; // Assuming `response.data` holds the actual items
      pagination.totalItems = response.total; // Assuming `response.total` holds the total count
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      store.isLoading.list = false;
    }
  };

  // ⭐ WATCH for filter changes and debounce the LOAD_ITEMS call ⭐
  // Only watch the filter properties that are directly manipulated by inputs
  watch(
    () => [
      filters.permit_type,
      filters.permit_numbers,
      filters.workday,
      filters.start, // Watch date range start
      filters.end,   // Watch date range end
      filters.createdAt,
      filters.updatedAt,
    ],
    debounce(() => {
      // Reset page to 1 whenever filters change to ensure correct data is fetched
      tableOptions.value.page = 1;
      LOAD_ITEMS();
    }, 500), // Debounce for 500ms
  );

  // Initial load when the component using this composable is mounted
  onMounted(() => {
    LOAD_ITEMS();
  });

  const HANDLE_RESTORE_ACTION = async (id) => {
    try {
      await store.POST_RESTORE(id);
      // Optional: Show success toast
      toast.success('Data berhasil dipulihkan!'); // Fallback
    } catch (error) {
      console.error('Error restoring data:', error);
      toast.error('Gagal memulihkan data!'); // Fallback
    } finally {
      LOAD_ITEMS(); // Always reload after an action
    }
  };

  const HANDLE_REMOVE_ACTION = async (ids) => { // Expects an array of IDs
    try {
      // Ensure ids is always an array for batch deletion
      const idsToDelete = Array.isArray(ids) ? ids : [ids];
      await store.FORCE_DELETE(idsToDelete); // Assuming FORCE_DELETE can take an array
      // Optional: Show success toast
      toast.success(`${idsToDelete.length} Data berhasil dihapus permanen!`); // Fallback
    } catch (error) {
      toast.error('Error permanently deleting data:', error);
    } finally {
      pagination.selected = []; // Clear selection
      LOAD_ITEMS(); // Always reload after an action
    }
  };

  const HANDLE_DATERANGE_CHANGE = (dateRange) => {
    filters.start = dateRange.startDate;
    filters.end = dateRange.endDate;
    // The watch for filters.start/end will trigger LOAD_ITEMS
  };

  return {
    store,
    filters,
    pagination,
    tableOptions,
    filterOptions, // ⭐ EXPOSE filterOptions ⭐
    resetFilters,
    HANDLE_TABLE_OPTIONS,
    HANDLE_DATERANGE_CHANGE,
    LOAD_ITEMS, // Expose for initial load or manual refresh
    HANDLE_RESTORE_ACTION,
    HANDLE_REMOVE_ACTION,
  };
}

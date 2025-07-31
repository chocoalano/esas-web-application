import { usePenggunaListStore } from "@/stores/pengaturan/pengguna/list";
import { onMounted, ref, watch } from "vue";
import { useToast } from "vue-toast-notification";
import { useRoute } from "vue-router";

export function useInfoLog() {
  const store = usePenggunaListStore();
  const route = useRoute();
  const toast = useToast();

  const historyData = ref([]);
  const currentPage = ref(1);
  const totalPage = ref(1);
  const itemsPerPage = ref(10);
  const totalItems = ref(0);

  const searchFilters = ref({
    method: null,
    action: null,
    model: null, // Change 'model' to 'model_type' to match DB column
  });
  // These would typically be fetched from an API as well
  const methodOptions = ref([]);
  const actionOptions = ref([]);
  const modelTypeOptions = ref([]);
  const sortOptions = ref([{ key: 'created_at', order: 'desc' }]); // Default sort

  const FETCH_HISTORY = async (id) => {
    try {
      const response = await store.GET_HISTORY_PAGINATE(
        id,
        {
          page: currentPage.value,
          itemsPerPage: itemsPerPage.value,
          sortBy: sortOptions.value,
          search: searchFilters.value
        }
      );

      methodOptions.value = response.methodOptions || [];
      actionOptions.value = response.actionOptions || [];
      modelTypeOptions.value = response.modelTypeOptions || [];

      historyData.value = response.data || [];
      totalItems.value = response.total || 0;

      totalPage.value = response.last_page || 0;
      console.log("Data Riwayat Log:", historyData.value);
    } catch (error) {
      console.error("Error fetching history log:", error);
      toast.error("Gagal memuat data riwayat log!");
    }
  };

  watch(searchFilters.value, () => {
    currentPage.value = 1; // Reset to first page when filters change
    FETCH_HISTORY(route.params.id);
  }, { deep: true }); // deep: true to watch changes inside the searchFilters object
  watch(currentPage, () => {
    FETCH_HISTORY(route.params.id);
  });

  onMounted(() => {
    if (route.params.id) {
      FETCH_HISTORY(route.params.id);
    } else {
      console.warn("ID not found in route params for history lookup, fetching general history.");
      FETCH_HISTORY(null);
    }
  });

  return {
    historyData,
    currentPage,
    itemsPerPage,
    totalPage,
    totalItems,
    searchFilters,       // ⭐ Return new searchFilters ⭐
    methodOptions,       // ⭐ Return method options ⭐
    actionOptions,       // ⭐ Return action options ⭐
    modelTypeOptions,    // ⭐ Return model options ⭐
    sortOptions,
    FETCH_HISTORY,
  };
}

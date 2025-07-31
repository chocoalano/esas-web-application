import { useListStore } from "@/stores/general/dokumentasi/list";
import { onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia"; // Import storeToRefs for better reactivity handling

export function useDocumentation() {
  // --- Store & Composables ---
  const dokumentasiStore = useListStore();
  // Using storeToRefs to destructure reactive properties from the store
  // This ensures that the destructured properties remain reactive
  const { data: storeData, isLoading: storeIsLoading, error: storeError } = storeToRefs(dokumentasiStore);


  // --- Dokumentasi Sidebar (Infinite Scroll) ---
  const documentationItems = ref([]);
  const searchDocs = ref('');
  const pageDocs = ref(1);
  const perPageDocs = 10; // PerPage as a constant, typically not changed by user
  const isLoadingDocs = ref(false); // Local loading state for the composable
  const hasMoreDocs = ref(true); // Indicates if there's more data to load

  /**
   * Loads documentation items from the API, handling pagination and search.
   * @param {object} options - Optional parameters.
   * @param {function} [options.done] - Callback function for v-infinite-scroll, called on completion.
   * @param {boolean} [options.reset=false] - Whether to reset current items and pagination.
   */
  const LOAD_DOCUMENTATION_ACTION = async ({ done, reset = false } = {}) => {
    // If a reset is requested, re-initialize pagination and items
    if (reset) {
      pageDocs.value = 1;
      documentationItems.value = [];
      hasMoreDocs.value = true; // Assume there's more data on reset
    }

    // Stop loading if already loading or no more data is expected
    if (isLoadingDocs.value || !hasMoreDocs.value) {
      done?.(); // Call done() if provided (for v-infinite-scroll)
      return;
    }

    isLoadingDocs.value = true; // Set local loading state to true

    try {
      // Correctly pass parameters as an object to the store action
      const response = await dokumentasiStore.API_LIST_PAGINATION_SIDEBAR({
        page: pageDocs.value, // Ensure your store action expects 'page' not 'pageDocs.value'
        perPage: perPageDocs, // Use the constant
        search: searchDocs.value
      });
      const docs = response?.data ?? [];
      if (pageDocs.value === 1) {
        documentationItems.value = docs; // For the first page or after a reset
      } else {
        documentationItems.value.push(...docs); // Append for subsequent pages
      }

      // Determine if there's more data based on the count received
      if (docs.length < perPageDocs) {
        hasMoreDocs.value = false; // No more data to load
      } else {
        pageDocs.value++; // Increment page for next load
      }
    } catch (error) {
      console.error('Failed to load documentation:', error);
      hasMoreDocs.value = false; // Assume no more data on error to prevent infinite loops
      // Optionally, show a user-facing error message here
    } finally {
      isLoadingDocs.value = false; // Reset local loading state
      done?.(); // Call done() to signal completion to v-infinite-scroll
    }
  };

  // Watch for changes in search query
  watch(searchDocs, (newValue, oldValue) => {
    if (newValue !== oldValue) {
      // Trigger a reset and reload when search query changes
      LOAD_DOCUMENTATION_ACTION({ reset: true });
    }
  });

  // Initial load when the component using this composable is mounted
  onMounted(() => {
    LOAD_DOCUMENTATION_ACTION();
  });

  return {
    dokumentasiStore, // Still export the store if needed for other actions/state in the component
    documentationItems,
    searchDocs,
    pageDocs, // Can be useful for debugging or showing current page number
    perPageDocs,
    isLoadingDocs, // Use this local loading state for the infinite scroll behavior
    hasMoreDocs,
    LOAD_DOCUMENTATION_ACTION,
  };
}

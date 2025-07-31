<script setup>
import { watch } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useFormStore } from "@/stores/general/dokumentasi/form";

const route = useRoute();
const store = useFormStore();
const { formData } = storeToRefs(store);

// Watch route param ID
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      store.EDIT_DATA_ACTION(newId);
    }
  },
  { immediate: true }
);
</script>

<template>
  <v-card :title="formData.title" :subtitle="formData.subtitle" class="border border-thin" elevation="0" rounded="xl">
    <v-card-text class="pa-10">
      <div v-html="formData.text_docs"></div>
    </v-card-text>
  </v-card>
</template>

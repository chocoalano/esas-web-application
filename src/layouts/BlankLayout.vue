<script setup>
import { RouterView } from 'vue-router'
import { useTheme } from 'vuetify'

const theme = useTheme()
const storedTheme = localStorage.getItem('theme') || 'light'
theme.global.name.value = storedTheme
</script>

<template>
    <RouterView />
</template>
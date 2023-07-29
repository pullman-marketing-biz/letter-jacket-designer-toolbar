<template lang="pug">
div
    Toolbar
    LoadingSpinner(v-if="loadingSpinnerVisible")
</template>
<script setup lang="ts">
import { ref, provide } from 'vue'
import Toolbar from '@/components/Toolbar.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const loadingSpinnerVisible = ref(false)

function showLoadingSpinner(value: boolean) {
    loadingSpinnerVisible.value = value
}

provide('loadingSpinner', {
    showLoadingSpinner
})
</script>

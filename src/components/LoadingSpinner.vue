<template lang="pug">
.modal
    ProgressSpinner
</template>
<script lang="ts" setup>
import ProgressSpinner from 'primevue/progressspinner'
</script>
<style lang="stylus" scoped>
.modal
    width 100vw
    height 100vh
    position fixed
    background rgba(128, 128, 128, .65)
    display flex
    align-items center
    justify-content center
</style>

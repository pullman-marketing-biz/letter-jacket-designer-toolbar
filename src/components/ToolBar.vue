<template lang='pug'>
.letter-jacket-designer-toolbar
    SpeedDial(:model="speedDialItems" direction="up")
    Dialog(v-model:visible="ordersDialogVisible", :draggable="false", header="Jacket Builder History", :style="{ width: '1000px' }")
        DataTable(:value="orders")
            Column(field="name", header="Name")
            Column(field="email", header="Email")
            Column(field="date_created", header="Created At")
            Column(header="Action")
                template(#body="props")
                    .actions
                        i.pi.pi-trash.action(@click="deleteOrder(props.data.id)", title="Delete")
                        i.pi.pi-upload.action(@click="restoreOrder(props.data.id)", title="Restore")
                        i.pi.pi-eye.action(@click="previewOrder(props.data.id)", title="Preview")
        p.info *The orders above are the ones that have been started on this computer but have not been completed.
    Dialog(v-model:visible="previewDialogVisible", :draggable="false", header="Order Preview")
        iframe#previewFrame(
            :src='"https://letterjacketsandmorestore.com/letter_jacket_designer_online/index.php?ljd_dsgn=" + selectedOrderId',
            :style="{ width: '85vw', height: 'calc(85vh - 80px)' }"
        )
</template>
<script lang='ts' setup>
import {reactive, ref} from 'vue'
import SpeedDial from 'primevue/speeddial'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import { Directus } from '@directus/sdk'

const directus = new Directus('https://admin.letterjacketsandmorestore.com')
const orders = reactive([])
const ordersDialogVisible = ref(false)
const previewDialogVisible = ref(false)
const speedDialItems = reactive([
    { label: 'Orders History', icon: 'pi pi-history', command: showDraftOrders },
    { label: 'Order Details', icon: 'pi pi-eye', command() { console.log('command') } },
])
const selectedOrderId = ref()

async function showDraftOrders() {
    ordersDialogVisible.value = true
    await loadOldOrders()
}

async function loadOldOrders() {
    const { data } = await directus.items('Orders').readByQuery({
        limit: -1,
    })
    orders.length = 0
    orders.push(...data)
}

async function deleteOrder(id: string) {
    console.log(id)
}

async function restoreOrder(id: string) {
    console.log(id)
}

async function previewOrder(id: string) {
    selectedOrderId.value = id
    previewDialogVisible.value = true
}
</script>
<style lang='stylus' scoped>
.letter-jacket-designer-toolbar
    width 64px
    height 180px
    position fixed
    bottom 20px
    right 20px
.actions
    display flex
    justify-content space-around
    .action:hover
        opacity .75
        cursor pointer
p.info
    color gray
    font-size 0.7em
</style>

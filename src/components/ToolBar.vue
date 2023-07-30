<template lang='pug'>
.letter-jacket-designer-toolbar
    SpeedDial(:model="speedDialItems" direction="up", buttonClass="app-button")
    Dialog(v-model:visible="ordersDialogVisible", :draggable="false", modal, header="Jacket Builder History", :style="{ width: '1000px' }")
        DataTable(:value="orders")
            Column(field="name", header="Name")
            Column(field="email", header="Email")
            Column(field="date_created", header="Created At")
            Column(header="Action")
                template(#body="props")
                    .actions
                        i.pi.pi-eye.action(@click="previewOrder(props.data.id)", title="Preview")
                        i.pi.pi-upload.action(@click="restoreOrder(props.data.id)", title="Restore")
                        i.pi.pi-trash.action(@click="deleteConfirmation(props.data.id)", title="Delete")
        p.info *The orders above are the ones that have been started on this computer but have not been completed.
    Dialog(v-model:visible="previewDialogVisible", :draggable="false", modal, header="Order Preview")
        iframe#previewFrame(
            :src='env.APP_URL + "/index.php?readonly&ljd_dsgn=" + selectedOrderId',
            :style="{ width: '85vw', height: 'calc(85vh - 80px)' }"
        )
</template>
<script lang='ts' setup>
import { reactive, ref, inject } from 'vue'
import Swal from 'sweetalert2'
import SpeedDial from 'primevue/speeddial'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import { Directus } from '@directus/sdk'
import { env } from '@/env'

const directus = new Directus(env.CMS_URL)
const orders = reactive([])
const ordersDialogVisible = ref(false)
const previewDialogVisible = ref(false)
const speedDialItems = reactive([
    { label: 'Orders History', icon: 'pi pi-history', command: showDraftOrders },
    { label: 'Order Details', icon: 'pi pi-eye', command() { console.log('command') } },
])
const selectedOrderId = ref()

const { showLoadingSpinner } = inject<any>('loadingSpinner')

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

function deleteConfirmation(id: string) {
    Swal.fire({
        title: 'Are you sure you?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            deleteOrder(id)
        }
    })
}

async function deleteOrder(id: string) {
    try {
        showLoadingSpinner(true)
        await directus.items('Orders').deleteOne(id)
        const index = orders.findIndex((o: any) => o.id == id)
        orders.splice(index, 1)
        Swal.fire({
            title: 'Order Deletion',
            text: 'Your order has been successfully removed!',
            icon: 'success',
            confirmButtonText: 'Ok',
            timer: 6000,
            timerProgressBar: true
        })
    } catch (e) {
        Swal.fire({
            title: 'Order Deletion',
            text: 'Something went wrong deleting your order, please try again!',
            icon: 'error',
            confirmButtonText: 'Ok',
            timer: 6000,
            timerProgressBar: true
        })
    } finally {
        showLoadingSpinner(false)
    }
}

async function restoreOrder(id: string) {
    Swal.fire({
        title: 'Order Deletion',
        text: 'We\'ll reload this page to load your order!' ,
        icon: 'info',
        confirmButtonText: 'Ok',
        timer: 3000,
        timerProgressBar: true
    })
    .then(() => location.href = env.APP_URL + "/index.php?ljd_dsgn=" + id)
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
<style lang='stylus'>
.swal2-container.swal2-center.swal2-backdrop-show
    z-index 1104
.app-button
    color #0a0a0a !important
    background #fff212 !important
    border-color #fff212 !important
    &:hover
        opacity .5
</style>

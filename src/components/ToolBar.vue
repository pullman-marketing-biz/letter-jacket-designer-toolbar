<template lang='pug'>
.letter-jacket-designer-toolbar
    SpeedDial(:model="speedDialItems" direction="up", buttonClass="app-button")
    Dialog(v-model:visible="jacketsDialogVisible", :draggable="false", modal, header="Jacket Builder History", :style="{ width: '1000px' }")
        DataTable(:value="jackets")
            Column(field="name", header="Name")
            Column(field="email", header="Email")
            Column(header="Created At")
                template(#body="props")
                    | {{ format(new Date(props.data.date_created), 'MM/dd/yyyy hh:mm bbb') }}
            Column(header="Updated At")
                template(#body="props")
                    | {{ format(new Date(props.data.date_updated), 'MM/dd/yyyy hh:mm bbb') }}
            Column(header="Action")
                template(#body="props")
                    .actions
                        i.pi.pi-eye.action(@click="previewJacket(props.data.id)", title="Preview")
                        i.pi.pi-upload.action(@click="restoreJacket(props.data.id)", title="Restore")
                        i.pi.pi-trash.action(@click="deleteConfirmation(props.data.id)", title="Delete")
        p.info *The jackets above are the ones that have been started on this computer but have not been completed.
    Dialog(v-model:visible="previewDialogVisible", :draggable="false", :closable="false", modal)
        template(#header)
            span.p-dialog-title Jacket Preview
            button.p-dialog-header-icon.p-dialog-header-close.p-link(@click="closePreviewDialog")
                i.pi.pi-times
        iframe#previewFrame(
            v-if='previewDialogVisible',
            :src='appUrl + "/index.php?readonly&ljd_dsgn=" + selectedOrderId',
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
import format from 'date-fns/format'
import {VueCookies} from "vue-cookies";

const cmsUrl = inject<string>('cmsUrl')
const appUrl = inject<string>('appUrl')
const cookies = inject<VueCookies>('$cookies')
const directus = new Directus(cmsUrl)
const jackets = reactive([])
const jacketsDialogVisible = ref(false)
const previewDialogVisible = ref(false)
const speedDialItems = reactive([
    { label: 'Jackets History', icon: 'pi pi-history', command: showDraftJackets },
    { label: 'Order Details', icon: 'pi pi-eye', command() { console.log('command') } },
])
const selectedOrderId = ref()

const { showLoadingSpinner } = inject<any>('loadingSpinner')

async function showDraftJackets() {
    jacketsDialogVisible.value = true
    await loadOldJackets()
}

async function loadOldJackets() {
    const cJackets = cookies.get('jackets')
    if (cJackets) {
        const { data } = await directus.items('Orders').readByQuery({
            limit: -1,
            filter: {
                id: {
                    _in: cJackets.ids
                }
            }
        })
        jackets.length = 0
        jackets.push(...data)
    }
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
    }).then((result: any) => {
        if (result.isConfirmed) {
            deleteOrder(id)
        }
    })
}

async function deleteOrder(id: string) {
    try {
        showLoadingSpinner(true)
        await directus.items('Jackets').deleteOne(id)
        const index = jackets.findIndex((o: any) => o.id == id)
        jackets.splice(index, 1)
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

async function restoreJacket(id: string) {
    Swal.fire({
        title: 'Jacket Deletion',
        text: 'We\'ll reload this page to load your jacket!' ,
        icon: 'info',
        confirmButtonText: 'Ok',
        timer: 3000,
        timerProgressBar: true
    })
    .then(() => window.open(appUrl + "/index.php?ljd_dsgn=" + id, '_blank'))
}

async function previewJacket(id: string) {
    selectedOrderId.value = id
    previewDialogVisible.value = true
}

function closePreviewDialog() {
    sessionStorage.removeItem('readonly')
    previewDialogVisible.value = false
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

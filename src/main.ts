import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Tooltip from 'primevue/tooltip'
import App from './App.vue'
import VueCookies from 'vue-cookies'

import 'primevue/resources/themes/lara-light-indigo/theme.css'
import 'primeicons/primeicons.css'
import type { Config } from '@/contracts/config'

const app = createApp(App)

app.use(createPinia())
app.use(PrimeVue)
app.use(VueCookies, {})
app.directive('tooltip', Tooltip)

fetch('config.json')
    .then(async (data: Response) => {
        const config = await data.json<Config>()
        app.provide('cmsUrl', config.cmsUrl)
        app.provide('appUrl', config.appUrl)
        app.mount('#toolbar-app')
    })
    .catch((e) => {
        console.error(e)
        console.error(
            'Something went wrong fetching the required env variables to run this application. ' +
                'Please, make sure to provide a config.json file with the cmsUrl and appUrl variables'
        )
        alert('Something went wrong fetching the required env variables to run this application.')
    })

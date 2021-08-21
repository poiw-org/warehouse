<script context="module" lang="ts">
	export const prerender = false;
</script>
<script lang="ts">
    import {onMount} from "svelte"
    import auth from "../lib/auth/authService"
    import API from "../lib/api"
    import Loading from "../lib/loading.svelte"
    import Fa from 'svelte-fa'
	import { faRedo } from '@fortawesome/free-solid-svg-icons'
    import JsBarcode from "jsbarcode"



    let processing = true;
    let items: any;

    onMount(async ()=>{
        if(!(await auth.isAuthenticated())) window.location = "/" 

        await getBarcodes()

        setTimeout(()=>window.print(),0)

    })


    let getBarcodes= async () => {
        let token = await auth.getToken()
        let {data} = await API.get("/batch",
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }
        )
            console.log(data);
            items =data
        data.map(item=>setTimeout(()=>{
        JsBarcode(`#barcode-${item}`, item, {
            lineColor: "#000",
            text: (item?.toString().match(/.{1,3}/g)).toString().replaceAll(",","-"),
            flat: true,
            fontSize: 14
        })
    },0))
        processing = false;
    }
</script>
{#if !processing}
<span id="message" class="block py-10 px-10"><b>You are ready to go!</b><br/>The barcodes will not be visible until you try to print this page.</span>
<span id="barcodes" class="pt-10 flex flex-wrap justify-between items-center">
    {#each items as item}
        <svg id={`barcode-${item}`}/>
    {/each}
</span>
{:else}
<span class="flex pb-20"><Loading/></span>

{/if}

<style>
    #svelte{
        box-shadow: 0px 0px 0px !important;
    }

    #barcodes{
        display: none;
    }

    @media print {
        p{
            display:none !important;
        }
        #barcodes{
            display: flex;
        }
        #message{
            display: none;
        }
    }
</style>
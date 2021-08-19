<script lang="ts">
    import {onMount} from "svelte"
    import auth from "../lib/auth/authService"
    import API from "../lib/api"
    import Loading from "../lib/loading.svelte"
    import Fa from 'svelte-fa'
	import { faRedo } from '@fortawesome/free-solid-svg-icons'
import Item from "../lib/entities/item";


    let processing = true;
    let items: Item[];

    onMount(async ()=>{
        if(!(await auth.isAuthenticated())) window.location = "/" 

        await getBarcodes()

        window.print()

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

        items = data.map(barcode=>new Item(barcode, ""))
        processing = false;
    }
</script>
{#if !processing}
<span id="message" class="block py-10 px-10"><b>You are ready to go!</b><br/>The barcodes will not be visible until you try to print this page.</span>
<span id="barcodes" class="flex flex-wrap justify-between items-center">
    {#each items as item}
        <img class="" src={item.barcode}/>
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
        #barcodes{
            display: flex;
        }
        #message{
            display: none;
        }
    }
</style>
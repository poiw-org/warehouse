<script>
    import {onMount} from "svelte"
    import auth from "../../lib/auth/authService"
    import API from "../../lib/api"
    import Loading from "../../lib/loading.svelte"
    import Fa from 'svelte-fa'
	import { faRedo } from '@fortawesome/free-solid-svg-icons'

    let item ={
        title: "",
        _id: "",
        shelf: "",
        description: "",
    }

    let processing = false

    onMount(async ()=>{
        if(!(await auth.isAuthenticated())) window.location = "/" 
    })

    let submit = async () => {
        processing = true
        let token = await auth.getToken()
        let {data} = await API.post("/items",
            item,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }
        )
        if(data === true) window.location = "/"
        else alert("ERROR: The barcode already exists or you haven\'t filled all the required fields")
        processing = false;

    }

    let getBarcode= async () => {
        item._id = "fetching..."
        let token = await auth.getToken()
        let {data} = await API.get("/barcode",
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }
        )

        item._id = data
    }
</script>

{#if !processing}
<form on:submit={submit} class="px-10 py-10 flex flex-col items-start">
    <input class="text-xl" bind:value={item.title} placeholder="Title"/>
    <span class="grid grid-cols-2 mt-5">
        <span class="flex items-center w-full"><span class="text-xl">#</span><input placeholder="Barcode / ID" bind:value={item._id} maxlength="12" class="p-4 w-full text-xl text-purple-700"/></span>
        <input class="text-xl text-purple-700" placeholder="Shelf" bind:value={item.shelf}/>
    </span>
    {#if !item._id}<span on:click={getBarcode} class="cursor-pointer text-purple-700 flex items-center gap-2"><Fa icon={faRedo}/>Get unique barcode</span>{/if}
    <textarea class="w-full text-xl mt-5 border p-2 rounded" bind:value={item.description} placeholder="Description"></textarea>
    <button type="submit" class="mt-10 p-4 border border-purple-700 text-purple-700">CREATE</button>
</form>
{:else}
<span class="flex pb-20"><Loading/></span>

{/if}
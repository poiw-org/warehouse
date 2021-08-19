<script>
    import {onMount} from "svelte"
    import auth from "../../lib/auth/authService"
    import API from "../../lib/api"
    import Loading from "../../lib/loading.svelte"
    import Fa from 'svelte-fa'
	import { faRedo, faBarcode, faPlus} from '@fortawesome/free-solid-svg-icons'
    import { page } from "$app/stores";

    let item ={
        title: "",
        _id: "",
        shelf: "",
        description: "",
    }

    let processing = false

    onMount(async ()=>{
        if(!(await auth.isAuthenticated())) window.location = "/" 
        const id = $page.query.get("id");
        if(id) item._id = id
    })

    let submit = async () => {
        processing = true
        let token = await auth.getToken()
        try{
            let {data} = await API.post("/items",
            item,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }
        )
        if(data === true) window.location = "/"
        else if(data === false) alert("ERROR: The barcode already exists or you haven\'t filled all the required fields")
        else alert(data)
        }catch(e){
            alert("An error occured while communicating with the backend server")
        }
 
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
<form on:submit={submit} class="px-4 md:px-10 py-10 flex flex-col items-start justify-start">
    <input class="text-xl w-full" bind:value={item.title} placeholder="Title"/>
    <span class="grid grid-cols-1 md:grid-cols-2 mt-5">
        <span class="flex flex-col justify-center">
            <span class="flex items-center w-full"><span class="text-xl"><Fa icon={faBarcode}/></span><input placeholder="Barcode / ID" type="tel" bind:value={item._id} maxlength="12" class="p-4 w-full text-xl text-purple-700"/></span>
            {#if !item._id}
            <span on:click={getBarcode} class="cursor-pointer text-purple-700 flex items-center gap-2"><Fa icon={faRedo}/>Get unique barcode</span>
            {:else if item._id != "fetching..."}
            <span class="pl-7">{(item?._id?.toString().match(/.{1,3}/g)).toString().replaceAll(",","-")}</span>
            {/if}
        </span>
        <input class="text-xl text-purple-700 mt-5 md:mt-0" placeholder="Shelf" bind:value={item.shelf}/>
    </span>
    <textarea class="w-full text-xl mt-5 border p-2 rounded" bind:value={item.description} placeholder="Description"></textarea>
    <button type="submit" class="mt-10 p-4 border border-purple-700 text-purple-700 flex items-center gap-2"><Fa icon={faPlus}/>CREATE</button>
</form>
{:else}
<span class="flex pb-20"><Loading/></span>

{/if}
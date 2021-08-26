<script context="module" lang="ts">
	export const prerender = false;
</script>
<script>
    import {onMount} from "svelte"
    import auth from "../../lib/auth/authService"
    import API from "../../lib/api"
    import Loading from "../../lib/loading.svelte"
    import Fa from 'svelte-fa'
	import { faPencilAlt, faBarcode } from '@fortawesome/free-solid-svg-icons'
    import { page } from "$app/stores";
    import Item from "../../lib/entities/item"
    
    let item ={
        title: "",
        _id: "",
        shelf: "",
        description: "",
    }
    let _id

    let processing = false

    onMount(async ()=>{
        processing = true;
        _id = $page.query.get("_id")
        if(!(await auth.isAuthenticated()) || !_id) window.location = "/" 


         item= await Item.getById(_id, true)

        processing = false;
    })

    let submit = async () => {
        processing = true
        let token = await auth.getToken()
        let {data} = await API.patch("/items",
            item,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }
        )
        if(data === true) window.location = `/items?_id=${_id}`
        else alert(data)
        processing = false;

    }
</script>

{#if !processing}
<form on:submit={submit} class="px-4 md:px-10 py-10 flex flex-col items-start justify-start">
    <input class="text-xl w-full" bind:value={item.title} placeholder="Title"/>
    <span class="grid grid-cols-1 md:grid-cols-2 mt-5">
        <span class="flex flex-col justify-center">
            <span class="flex items-center w-full"><span class="text-xl"><Fa icon={faBarcode}/></span><input placeholder="Barcode / ID" type="tel" bind:value={item._id} maxlength="12" disabled class="bg-white p-4 w-full text-xl text-purple-700"/></span>
            {#if item._id}
            <span class="pl-7">{(item?._id?.toString().match(/.{1,3}/g)).toString().replaceAll(",","-")}</span>
            {/if}
        </span>
        <input class="text-xl text-purple-700 mt-10 md:mt-0" placeholder="Shelf" bind:value={item.shelf}/>
    </span>
    <textarea class="w-full text-xl mt-5 border p-2 rounded" bind:value={item.description} placeholder="Description"></textarea>
    <button type="submit" class="mt-10 p-4 border border-purple-700 text-purple-700 flex items-center gap-2"><Fa icon={faPencilAlt}/>UPDATE</button>
</form>
{:else}
<span class="flex pb-20"><Loading/></span>

{/if}

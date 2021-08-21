<script lang="ts">
import { browser, dev } from '$app/env';

export const hydrate = dev;
export const router = browser;
export const prerender = false;

import { page } from "$app/stores";

import Item from "../../lib/entities/item"
import Loading from "../../lib/loading.svelte"
import auth from "../../lib/auth/authService"
import {onMount} from "svelte"
import API from "../../lib/api"
import JsBarcode from "jsbarcode"

let isAuthenticated = false;
let item: any
let processing = true;
let _id
let checkOut = async () => {
    if (confirm('Are you sure you want to checkout this item?')) {
        let token = await auth.getToken()

        await API.delete("/checkOut", {
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                data: {
                    _id
                }
            })

        location.reload()
    }
}

let deleteItem = async () => {
    if (confirm('Are you sure you want to DELETE this item?')) {
        let token = await auth.getToken()

        await API.delete("/items", {
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                data: {
                    _id
                }
            })
        window.location = "/"
    }
}

onMount(async ()=>{
    _id = $page.query.get("_id")

    // if(!_id) window.location = "/"
    isAuthenticated = await auth.isAuthenticated()
    item = await Item.getById(_id, true)
    
    processing = false
    setTimeout(()=>{
        JsBarcode(`#barcode-${item._id}`, item._id, {
            lineColor: "#000",
            text: (item?._id?.toString().match(/.{1,3}/g)).toString().replaceAll(",","-"),
            flat: true,
            fontSize: 14
        })
    },0)
})
</script>

<div class="px-4 md:px-10 py-10">
    {#if processing}
        <Loading/>

    {:else}
        {#if item}

        <div class="flex justify-between items-start flex-col">
            <svg class="mb-10" id={`barcode-${item._id}`}/>

            <span class="text-3xl">{item.title}</span>
            <div class="flex items-center">
                <!-- <span class="text-xl tracking-wide">{item._id}</span> -->
            </div>

        </div>
        <div class="flex pt-10 flex-col gap-4">
            <span class="flex flex-col">
                <span class="text-sm font-light">ITEM NO.</span> 
                <span  class="font-bold text-lg">{item._id}</span>
            </span>
            <span class="flex flex-col">
                <span class="text-sm font-light">DESCRIPTION</span> 
                <span  class="font-bold text-lg">{item.description || "-"}</span>
            </span>
            <span class="flex flex-col">
                <span class="text-sm font-light">SHELF</span> 
                {#if item.shelf != "null" && typeof item.shelf != "undefined" && item.shelf != "" && item.shelf != null}<a href="/" class="text-blue-600"><span  class="font-bold text-lg">{item.shelf}</span></a> {:else} - {/if}
            </span>
            <span class="flex flex-col">
                <span class="text-sm font-light">CHECK-IN</span> 
                <span  class="font-bold text-lg">{new Date(item.checkIn)}</span>
            </span>
            <span class="flex flex-col">
                <span class="text-sm font-light">CHECK-OUT</span> 
                <span  class="font-bold text-lg">{item.checkOut ? new Date(item.checkOut) : "-"}</span>
            </span>
            <span class="flex flex-col">
                <span class="text-sm font-light">EDITED BY</span> 
                <span  class="font-bold text-lg">{item.editedBy}</span>
            </span>
        </div>
            {#if isAuthenticated}
            <div class="flex gap-4 pt-20">
                <a href={`/items/edit?_id=${item._id}`}><button class="border p-3 border-blue-500 text-blue-500">EDIT</button></a>
                {#if !item.checkOut}
                <button on:click={checkOut} class="border p-3 border-yellow-500 text-yellow-500">CHECK-OUT</button>
                {/if}
                <button on:click={deleteItem} class="border p-3 border-red-500 text-red-500">DELETE</button>

            </div>
            {/if}
    {/if}
    {/if}
</div>


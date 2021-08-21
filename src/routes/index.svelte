<script context="module" lang="ts">
	export const prerender = false;
</script>

<script lang="ts">
	import Fa from 'svelte-fa'
	import { faSearch, faBarcode } from '@fortawesome/free-solid-svg-icons'
	import API from "../lib/api"
	import Item from "../lib/entities/item"
	import Loading from "../lib/loading.svelte"
	import {onMount} from "svelte"
	import auth from "../lib/auth/authService"

	let isAuthenticated = false;
	let searchQuery = "";
	let items: Item[];
	let processing = false;
	let latestItems;
	let autoDetectBarcodes = true;
	let detectedBarcode = false;

	let search = async () => {
		if(searchQuery === ""){
			items = latestItems
			return
		}
		let isOnlyNumbers = /^\d+$/.test(searchQuery)
		if(isOnlyNumbers && searchQuery.length == 12 && autoDetectBarcodes && !detectedBarcode) {
			detectedBarcode= true;
			processing = true;
			try{
				let item = await Item.getById(searchQuery, true)
				processing = false
				if(item){
					processing = true;
					location.href = `/items?_id=${searchQuery}`
					return
				}
				else if(isAuthenticated){
					processing = true;
					location.href = `/items/create?_id=${searchQuery}`;
				}
							
				else alert(`The item with barcode ${searchQuery} doesn\'t exist.`)
			}catch(e) {
				alert(e)
			}
			setTimeout(()=>{detectedBarcode = false},2000)
		}
		processing = true;
		let {data} = await API.post(`/search`, {query: searchQuery})
		processing = false
		items = data.map(item => Item.fromJSON(item))
	}

	onMount(async ()=>{
		setInterval(()=>{
			document.getElementById("search").focus()
		},1000)
		processing = true;
		let {data} = await API.get(`/latest`)
		processing = false
		latestItems = data.map(item => Item.fromJSON(item))
		items = latestItems
		isAuthenticated = await auth.isAuthenticated()
	})

	function shorten(text,max) {
	return text && text.length > max ? text.slice(0,max).split(' ').slice(0, -1).join(' ') + " [...]" : text
	}

</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section class="flex flex-col px-4 md:px-10 py-10">
	<div class="flex items-center justify-center border p-5 gap-4 rounded">
		<Fa icon={faSearch}/>
		<input type="text" on:keyup={search} bind:value={searchQuery} id="search" placeholder="Type to search or enter barcode" class="w-full"/>
	</div>
	<span class="flex gap-2 mt-3 ml-1"><input type="checkbox" bind:checked={autoDetectBarcodes}/><p class="text-gray-400">Auto-detect barcodes and redirect to item</p></span>


	<div>
		{#if processing}
		<Loading/>
		{/if}

		{#if !processing && items}
			<div class="flex flex-col gap-2 mt-4" id="results">
				{#if items == latestItems}
				<span class="pt-4 pb-2 tracking-wider text-gray-400">LATEST ITEMS</span>
				{/if}
				{#each items as item}
					<a href={`/items?_id=${item._id}`}><span class="p-3 bg-gray-50 rounded tracking-widest flex justify-between"><span class="inline md:hidden">{shorten(item.title,23)}</span><span class="hidden md:inline">{shorten(item.title,40)}</span><span class="flex items-center gap-2 text-sm md:text-md text-gray-600"><Fa icon={faBarcode}/>{item._id}</span></span></a>
				{/each}
			</div>
		{/if}
	</div>
</section>

<style>

</style>
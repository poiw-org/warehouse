<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import Fa from 'svelte-fa'
	import { faSearch, faBarcode } from '@fortawesome/free-solid-svg-icons'
	import API from "../lib/api"
	import Item from "../lib/entities/item"
	import Loading from "../lib/loading.svelte"
	import {onMount} from "svelte"
	let searchQuery = "";
	let items: Item[];
	let processing = false;
	let latestItems;
	let search = async () => {
		if(searchQuery === ""){
			items = latestItems
			return
		}
		let isOnlyNumbers = /^\d+$/.test(searchQuery)
		if(isOnlyNumbers && searchQuery.length == 12){
			window.location = `/items/${searchQuery}`
		}
		processing = true;
		let {data} = await API.post(`/search`, {query: searchQuery})
		processing = false
		items = data.map(item => Item.fromJSON(item))
	}

	onMount(async ()=>{
		document.getElementById("search").focus()
		processing = true;
		let {data} = await API.get(`/latest`)
		processing = false
		latestItems = data.map(item => Item.fromJSON(item))
		items = latestItems
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
					<a href={`/items/${item._id}`}><span class="p-3 bg-gray-50 rounded tracking-widest flex justify-between"><span class="inline md:hidden">{shorten(item.title,23)}</span><span class="hidden md:inline">{shorten(item.title,40)}</span><span class="flex items-center gap-2 text-sm md:text-md text-gray-600"><Fa icon={faBarcode}/>{item._id}</span></span></a>
				{/each}
			</div>
		
		{/if}
	</div>
</section>

<style>

</style>
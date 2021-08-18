<script lang="ts">
	import Fa from 'svelte-fa'
	import { faDoorOpen, faArrowRight, faSearch, faFileSignature } from '@fortawesome/free-solid-svg-icons'
    import auth from "../auth/authService"
    import { onMount } from 'svelte';

    let isAuthenticated: boolean = false;
    let user: object;
    let logout;

    onMount(async ()=>{
        isAuthenticated = await auth.isAuthenticated();
        if(isAuthenticated) user = await auth.getUser();


        logout = async () => {
            await auth.logout();
        }
    })

    export const prerender = false
</script>
<span id="menu" class="px-10 py-10 flex md:justify-between md:items-center flex-col md:flex-row gap-4">
    <span class="flex justify-between">
    <a href="/" ><span class="flex items-center gap-3"><span class="text-xl tracking-widest font-light hidden md:inline">po/iw</span> <span class="font-bold p-2 border text-purple-700 border-purple-700 md:border-none md:bg-purple-700 md:text-white rounded text-xl">warehouse</span></span></a>
    {#if isAuthenticated}

    <span class="flex md:hidden ">
        <span><img src={user?.picture} class="inline w-10 h-10 rounded-full mr-2"/><span class="hidden md:inline">{user?.nickname}</span></span>
        <a class="flex items-center gap-2" on:click={logout}>LOG OUT<Fa icon={faArrowRight}/></a>    
    </span>
    {/if}
</span>
    <span class="flex gap-10 flex-col-reverse md:flex-row mt-5 md:mt-0">

            {#if isAuthenticated}
            <span class="flex md:items-center gap-4 flex-col md:flex-row">
                <a href="/batch" class="flex items-center gap-1"><Fa icon={faFileSignature}/>CREATE BATCH</a>
                <a href="/items/create" class="items-center p-3 md:p-2 bg-purple-700 text-white md:border md:bg-white md:text-purple-700 md:border-purple-700">+ NEW ITEM</a>
            </span>
       

                <span class="hidden md:flex gap-6 ">
                    <span><img src={user?.picture} class="inline w-10 h-10 rounded-full mr-2"/><span class="hidden md:inline">{user?.nickname}</span></span>
                    <a class="flex items-center gap-2" on:click={logout}>LOG OUT<Fa icon={faArrowRight}/></a>    
                </span>
                
            {:else}
            <a href="/" class="flex items-center gap-2"><Fa icon={faSearch}/>SEARCH</a>
            <a href="/login" class="flex items-center gap-2 cursor-pointer"><Fa icon={faDoorOpen}/>LOG IN</a>
            {/if}
        </span>
</span>

<style>
@media print {
    #menu{
        display: none;
    }
}

</style>
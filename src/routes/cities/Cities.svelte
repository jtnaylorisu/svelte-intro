<script lang="ts">				
	import type { Cities } from './cities';
	import { onMount } from 'svelte';		
	import { Select } from 'flowbite-svelte';
    import selectedState from '../states/States.svelte';
	
	let citiesData: Cities | undefined = undefined;
	let citiesURL: string = "https://countriesnow.space/api/v0.1/countries/state/cities";
	export let selectedCity: string = "";

	onMount(async () => {
		await getCitiesData();
	});	

	async function getCitiesData() {
        if(selectedState) {
            citiesData = await fetch(citiesURL, {
            method: 'POST',
            body: '{ "country": "United States", "state": {stateName} }',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' }
        })
            .then(response => response.json())
            .then(response => {   				
                return response as Cities;
            });  
        }	                   					
	}	
</script>

{#if citiesData}
	<Select id="citySelector" name="citySelector" bind:value={selectedCity}>		
		{#each citiesData.data as city}
			<option value={city}>{city}</option>
		{/each}
	</Select>
{/if}
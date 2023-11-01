<script lang="ts">				
	import type { Cities } from './cities';
	import { onMount } from 'svelte';		
	import { Select } from 'flowbite-svelte';    
	
    export let state: string = "";

	let citiesData: Cities | undefined = undefined;
	let citiesURL: string = "https://countriesnow.space/api/v0.1/countries/state/cities";
    let citiesBody: string = '{ "country": "United States", "state": "{stateName}" }';
	let selectedCity: string = "";    

	onMount(async () => {
        citiesBody = citiesBody.replace("{stateName}", state);        
		await getCitiesData();
	});	

	async function getCitiesData() {
        if(state) {
            citiesData = await fetch(citiesURL, {
                method: 'POST',
                body: citiesBody,
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
    <label for="citySelector">City</label>
	<Select id="citySelector" name="citySelector" bind:value={selectedCity}>		
		{#each citiesData.data as city}
			<option value={city}>{city}</option>
		{/each}
	</Select>
{/if}
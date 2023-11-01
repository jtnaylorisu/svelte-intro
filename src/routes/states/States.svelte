<script lang="ts">				
	import type { StateData } from './state';
	import { createEventDispatcher, onMount } from 'svelte';		
	import { Select } from 'flowbite-svelte';    		
	
	let stateData: StateData | undefined = undefined;
	let statesUrl: string = "https://countriesnow.space/api/v0.1/countries/states";		

	onMount(async () => {
		await getStateData();
	});	
	
	const dispatch = createEventDispatcher<{stateChange: { selectedState: string }}>();
	let selectedState: string = '';

	async function getStateData() {		        
        stateData = await fetch(statesUrl, {
            method: 'POST',
            body: '{ "country": "United States" }',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' }
        })
            .then(response => response.json())
            .then(response => {   							
                return response as StateData;
            });     					
	}

	function dispatchEvent() {				
		dispatch('stateChange', { selectedState });
	}
</script>

{#if stateData}
	<label for="stateSelector">State</label>
	<Select id="stateSelector" name="stateSelector" bind:value={selectedState} on:change={ () => dispatchEvent() }>
		{#each stateData.data.states as state}
			<option value={state.name}>{state.name}</option>
		{/each}
	</Select>
{/if}
<script lang="ts">				
	import type { StateData } from './state';
	import { createEventDispatcher, onMount } from 'svelte';		
	import { Select } from 'flowbite-svelte';    		
	
	let stateData: StateData | undefined = undefined;
	let statesUrl: string = "https://countriesnow.space/api/v0.1/countries/states";		

	onMount(async () => {
		await getStateData();
	});	

	let ref: any;	

	

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

	const dispatchEvent = (event: Event) => {		
		const customEvent = new CustomEvent('stateChange', { detail: { content: event }, bubbles: true });
		ref.dispatchEvent(customEvent);
	}
</script>

{#if stateData}
	<Select id="stateSelector" name="stateSelector" bind:this={ref} on:change={ (event) => dispatchEvent(event) }>
		{#each stateData.data.states as state}
			<option value={state.name}>{state.name}</option>
		{/each}
	</Select>
{/if}
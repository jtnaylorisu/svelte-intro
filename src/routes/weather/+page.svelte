<script lang="ts">		
	import type { PageData, ActionData } from './$types';
	import { Card } from 'flowbite-svelte';
	import { enhance } from '$app/forms';

	export let data: PageData;	
	
	function parseTime(time : string) {
		var date = new Date(time);
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var ampm = hours >= 12 ? 'pm' : 'am';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		var strminutes = minutes < 10 ? '0'+minutes : minutes;
		var strTime = hours + ':' + strminutes + ' ' + ampm;
		return strTime;
	}

	$: forecast = data.forecast;
</script>

<svelte:head>
	<title>Weather</title>
	<meta name="description" content="A weather forecast page for Svelte." />
</svelte:head>

<h1 class="visually-hidden">Weather</h1>

<section>
	<h1>
		Weather Forecast		
	</h1>

	<h2>
		<strong>You can provide a set of valid coordinates here to find a weather forecast for those coordinates using Open-Meteo.</strong>
	</h2>	
</section>

<div class="grid">
	{#if forecast }
		<div class="header-container">
			<h2>Weather Forecast for {forecast.forecastDate} - Timezone: {forecast.timezone} - {forecast.timezone_abbreviation}</h2>
			<h2>Provided Coordinates: {forecast.latitude} (latitude) - {forecast.longitude} (longitude)</h2>
		</div>
		{#if forecast.hourly && forecast.hourly.time }
			<div class="custom-card-container">
				{#each forecast.hourly.time.map(parseTime) as time, i}		
					<div class="custom-card">
						<Card class="custom-card">
							<div class="custom-time">
								<h3>{time}</h3>
								<h3>Temperature: {forecast.hourly.temperature_2m[i].toString()}{forecast.hourly_units.temperature_2m}</h3>
								<h3>Wind: {forecast.hourly.windspeed_10m[i].toString()}</h3>
							</div>
						</Card>
					</div>							
				{/each}
			</div>
		{/if}			
	{/if}		
</div>

<form
	method="POST"
	action="?/enter"
	use:enhance={() => {
		// prevent default callback from resetting the form
		return ({ update }) => {
			update({ reset: false });
		};
	}}>		

	<div class="controls">
		<label for="latitude">Latitude</label>
		<input name="latitude" id="latitude" type="text" />
		<label for="longitude">Longitude</label>
		<input name="longitude" id="longitude" type="text" />
		<button data-key="enter" formaction="?/enter">enter</button>		
	</div>
</form>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
		max-height: 300px;
	}

	form {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		flex: 1;
	}

	.header-container {
		margin-top: 1%;
		margin-bottom: 5%;		
	}

	.custom-card-container {
		display: flex;
		flex-wrap: wrap;		
	}

	.custom-card {
		margin-left: 2%;
		margin-right: 2%;
		margin-top: 2%;
		margin-bottom: 2%;
		width: 28%;
	}

	.grid {
		text-align: center;
	}

	.grid h2 {		
		font-size: 1.25rem;
    	font-weight: bold;		
	}

	.grid h3 {
		font-size: 1.15rem;
    	font-weight: bold;
	}
</style>
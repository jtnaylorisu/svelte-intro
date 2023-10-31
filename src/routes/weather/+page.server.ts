import { Weather } from './weather.server';
import type { PageServerLoad, Actions } from './$types';

export const load = (({ cookies }) => { 
	const weather = new Weather(cookies.get('forecast'));	

	return {
		/**
		 * The current forecast
		 */
		forecast: weather.forecast
	};
}) satisfies PageServerLoad;

export const actions = {	
	/**
	 * Calls the weather service for updated values
	 */
	enter: async ({ request, cookies }) => {
		const data = await request.formData();
		
		var latitude: number = +data!.get("latitude")!;
		var longitude: number = +data!.get("longitude")!;				

		const weather = new Weather();		
		var forecast = await weather.getForecast(latitude, longitude);							

		if(forecast != null) {
			cookies.set('forecast', JSON.stringify(forecast));
		}
	}	
} satisfies Actions;

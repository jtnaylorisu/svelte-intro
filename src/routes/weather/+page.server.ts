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

		var state: string = data!.get("stateSelector")!.toString();
		var city: string = data!.get("citySelector")!.toString();

		const weather = new Weather();
		var cityResult = await weather.getCity(state, city);
				
		if(cityResult) {
			var forecast = await weather.getForecast(cityResult.latitude, cityResult.longitude);							

			if(forecast != null) {
				cookies.set('forecast', JSON.stringify(forecast));
			}
		}		
	}	
} satisfies Actions;

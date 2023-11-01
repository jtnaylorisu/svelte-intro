import type { Forecast } from './forecast';

export class Weather {
    forecastUrl: string = `https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&hourly=temperature_2m,windspeed_10m&temperature_unit=fahrenheit&windspeed_unit=mph&timezone=America%2FChicago&forecast_days=1`;    
    forecast: Forecast | undefined;

    /**
	 * Create a new 
	 */
	constructor(serialized: string | undefined = undefined) {        
        if (serialized != undefined) {
            if(serialized.length > 0) {
                try {                    
                    this.setForecast(JSON.parse(serialized));                    
                }
                catch(e) {}                                
            }            
		} else {
            this.forecast = undefined;
		}		
    }        

    /**
	 * Retrieve weather data based on provided coordinates
	 */
	async getForecast(latitude: number, longitude: number) {
		this.setUrls(latitude, longitude);
        
        var forecast = await fetch(this.forecastUrl)
            .then(response => response.json())
            .then(response => {             
                return response as Forecast;
            });              
            
        return forecast;
	}

    setForecast(forecast: Forecast) {
        if(forecast.hourly && forecast.hourly.time && forecast.hourly.time.length > 0) {
            forecast.forecastDate = new Date(forecast.hourly.time[0]).toDateString();
            this.forecast = forecast;
        }
    }

    setUrls(latitude: number, longitude: number) {        
        this.forecastUrl = this.forecastUrl.replace("{latitude}", latitude.toString());
        this.forecastUrl = this.forecastUrl.replace("{longitude}", longitude.toString());	
    }
}
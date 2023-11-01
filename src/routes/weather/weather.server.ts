import type { CityData } from './citydata';
import type { Forecast } from './forecast';

export class Weather {
    forecastUrl: string = `https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&hourly=temperature_2m,windspeed_10m&temperature_unit=fahrenheit&windspeed_unit=mph&timezone=America%2FChicago&forecast_days=1`;    
    cityUrl: string = `https://geocoding-api.open-meteo.com/v1/search?name={city}&language=en&format=json`;
    forecast: Forecast | undefined;
    countryId: number = 6252001;

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
     * Retrieve a city record for a given state and city, do our best here, this is weird.
    */
    async getCity(state: string, city: string) {
        this.setCityUrl(city);
        
        var cityData = await fetch(this.cityUrl)
            .then(response => response.json())
            .then(response => {             
                return response as CityData;
            });              
            
        return this.findCity(cityData, state);
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

    setCityUrl(city: string) {
        this.cityUrl = this.cityUrl.replace("{city}", city);
    }

    findCity(cities: CityData, state: string) {
        var filtered = cities.results.filter((element) => element.country_id == this.countryId);
        var final = filtered.filter((element) => element.admin1 == state);
        return final[0];
    }
}
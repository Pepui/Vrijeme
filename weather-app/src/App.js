import React from "react";

import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";

import weather from "./app_component/weather.component";
import Form from "./app_component/form.component";

//api call http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_key}
const API_key = "7f21d2992a71733eea1a4451e2d747ff";

class App extends React.Component{
  constructor(){
    super();
    this.state = {
    city: undefined,
    country: undefined,
    icon:  undefined,
    main: undefined,
    celsius: undefined,
    temp_max: undefined,
    temp_min: undefined,
    description:"",
    error:false
    };
    
    //ikone na temelju vremenske prognoze
    this.weatherIcon={
      Thunderstorm:"wi-thunderstorm",
      Drizzle:"wi-sleet",
      Rain:"wi-storm-showers",
      Snow:"wi-snow",
      Atmosphere:"wi-fog",
      Clear:"wi-day-sunny",
      Clouds:"wi-day-fog"
    };
  }
// pretvara kelvine u celziuse  
  calCelsius(temp){ 
    let cell = Math.floor(temp - 273.15);
    return cell;
  }

  // provjera podataka i stavlja odgovarajuću ikonu
getWeatherIcon(icons,rangeId){
  switch(true){
case rangeId >=200 && rangeId >=232:
this.setState({icon:this.weatherIcon.Thunderstorm})
break;
case rangeId >=300 && rangeId >=321:
this.setState({icon:this.weatherIcon.Drizzle})
break;
case rangeId >=500 && rangeId >=531:
this.setState({icon:this.weatherIcon.Rain})
break;
case rangeId >=600 && rangeId >=622:
this.setState({icon:this.weatherIcon.Snow})
break;
case rangeId >=701 && rangeId >=781:
this.setState({icon:this.weatherIcon.Atmosphere})
break;
case rangeId === 800:
this.setState({icon:this.weatherIcon.Clear})
break;
case rangeId >=801 && rangeId >=804:
this.setState({icon:this.weatherIcon.Clouds})
break;
default:
  this.setState({icon:this.weatherIcon.Clouds})
  }
}

//event handler za button u form.componentu
getWeather = async (e) =>{
  e.preventDefault();

  //vrijednosti polja unosa
  const country = e.target.elements.country.value;
  const city = e.target.elements.city.value;
  

  if(country && city){
    const api_call = await fetch(
      "http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${Api_Key}"
    );
    
  const response = await api_call.json();

  
//vraća vrijednost API
  this.state({
    city:"${response.name}, ${response.sys.country}",
    country:response.sys.country,
    celsius:this.calCelsius(response.main.temp),
    temp_max:this.calCelsius(response.main.temp_max),
    temp_min:this.calCelsius(response.main.temp_min),
    description:response.weather[0].description,
    error:false
    
  });

this.getWeatherIcon(this.weatherIcon,response.weather[0].id);

console.log(response);
  }else{
    this.setState({
      error:true
    });
  }


};



  render(){
    return (
      <div className="App">
      <Form loadweather={this.getWeather} error={this.state.error}/>
      <weather 
       city={this.state.city} 
       country={this.state.country}
       temp_celsius={this.state.celsius}
       temp_max={this.state.max}
       temp_min={this.state.min}
       description={this.state.description}
       weatherIcon={this.state.icon}
        />
      </div>
    );
  }
}

export default App;

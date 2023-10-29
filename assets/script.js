const userLocationHandler = () => {
    
    const success = (position) => {
        const userLocationLat = position.coords.latitude;
        const userLocationLong = position.coords.longitude;
        const userGeolocation = `http://api.openweathermap.org/geo/1.0/reverse?lat=${userLocationLat}&lon=${userLocationLong}&appid=1f3545ea7433a3f52cff6877a218c291`;
        const userLocation = document.getElementById("userLocation");
        
        fetch(userGeolocation)
        .then(function (response) {
            return response.json();
        })
        
        .then(function (data) {
            var geoLocation = data[0].name;
            const userLocationWeather = `http://api.openweathermap.org/data/2.5/forecast?q=${geoLocation}&cnt=5&units=imperial&appid=1f3545ea7433a3f52cff6877a218c291`;
            userLocation.textContent = geoLocation;
                fetch(userLocationWeather)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    const todaysIcon = data.list[0].weather[0].icon;
                    const todaysTemp = data.list[0].main.temp;
                    const todaysWind = data.list[0].wind.speed;
                    const todaysHumidity = data.list[0].main.humidity
                    $("#todaysIcon").append(`<img src="https://openweathermap.org/img/w/${todaysIcon}.png" alt="Weather Icon">`)
                    $("#todaysTemp").text('Temp: ' + todaysTemp + '°F');
                    $("#todaysWind").text('Wind Speed: ' + todaysWind + ' m/ph');
                    $("#todaysHumidity").text('Humidity: ' + todaysHumidity + '%');
                })
        })
        
        .catch(function (error) {
            console.error("Error fetching data:", error);
        })
        
    }
    
    const error = (error) => {
        // Handle the error here
        console.error("Error: Enable location services to get your current weather.", error);
    };

    
    navigator.geolocation.getCurrentPosition(success, error);
};
userLocationHandler();


const dayjsHandler = () => {
    // this handles using the dayjs library to display the current time and date upon page load
    function displayTimeDate () {
        var dayjsObject = dayjs();
        var today = $('#timeDate');
        today.text(dayjsObject.format('hh:mm A dddd, MMMM DD, YYYY '));
    };
    displayTimeDate ();
};
dayjsHandler();


const searchQueryHandler = () => {
    // this handles saving the search history to local storage if there is a value in the search input
    $("#searchBtn").on("click", function (event) {
        event.preventDefault();
        $('.outputContainer').css("display", "block");
        const searchCityValue = $('#searchCity').val();
        if (searchCityValue !== "") {
            localStorage.setItem("Search", searchCityValue);
            let searchHistory = JSON.parse(localStorage.getItem("SearchHistory")) || [];
            searchHistory.push(searchCityValue);
            localStorage.setItem("SearchHistory", JSON.stringify(searchHistory));
            displaySearchHistory(searchHistory);
        }
    });

    // this handles retrieving the search history from local storage and displaying it in the search history list
    function displaySearchHistory(searchHistory) {
        $('#displaySearchHistory').empty();
        
        for (const search of searchHistory) {
            if (!$('#displaySearchHistory li:contains(' + search + ')').length) {
                const listItem = $("<li>").text(search);
                $('#displaySearchHistory').prepend(listItem);
                
                // these "listItem." add CSS attributes to the appended liste items 
                listItem.css({
                    "cursor": "pointer",
                });
                
                listItem.hover(
                    function () {
                        listItem.css("background-color", "lightgray");
                    },
                    function () {
                        listItem.css("background-color", "initial");
                    }
                );
                
                // this adds a click listener that enters the list items text value to the input value and submits the form. 
                listItem.on('click', function () {
                    $('.outputContainer').css("display", "block");
                    const listItemValue = $(this).text();
                    $('#searchCity').val(listItemValue); // Set the value of the search input
                    $("#searchBtn").trigger("click");
                });
            }
        }
    }

    // this handles parsing of the search history in local storage and calling the displaySearchHistory function 
    $(document).ready(function () {
        const searchHistory = JSON.parse(localStorage.getItem("SearchHistory")) || [];
        displaySearchHistory(searchHistory);
    });
};
searchQueryHandler();


const searchForecastHandler = () => {
    $("#searchBtn").on("click", function (event) {
        event.preventDefault();

        const searchedLocation = $('#searchCity').val();
        const apiKey = '1f3545ea7433a3f52cff6877a218c291';

        if (searchedLocation) {
            const searchedLocationUrl = `http://api.openweathermap.org/data/2.5/weather?q=${searchedLocation}&units=imperial&appid=${apiKey}`;

            fetch(searchedLocationUrl)
                .then(function (response) {
                    if (response.status === 200) {
                        return response.json();
                    } else {
                        console.error('Error: Unable to fetch weather data.');
                    }
                })
                .then(function (data) {
                    console.log(data);
                    const searchedLocationLat = data.coord.lat;
                    const searchedLocationLon = data.coord.lon;
                    const displayWeatherUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${searchedLocationLat}&lon=${searchedLocationLon}&units=imperial&appid=${apiKey}`;

                    fetch(displayWeatherUrl)
                        .then(function (response) {
                            return response.json();
                        })
                        .then (function (data) {
                            console.log(data)
                            const forecastDateDayOne = data.list[0].dt_txt;
                            const dateObjectDayOne = new Date(forecastDateDayOne);
                            const options = {
                                month: '2-digit',
                                day: '2-digit'
                            };
                            const formattedDateDayOne = dateObjectDayOne.toLocaleString('en-US', options);
                            const forecastIconDayOne = data.list[0].weather[0].icon;
                            const forecastTempDayOne = data.list[0].main.temp;
                            const forecastWindDayOne = data.list[0].wind.speed;
                            const forecastHumidityDayOne = data.list[0].main.humidity
                            $('.dateDayOne').text(formattedDateDayOne);
                            $('#iconDayOne').append(`<img src="https://openweathermap.org/img/w/${forecastIconDayOne}.png" alt="Weather Icon">`)
                            $('#tempDayOne').text('Temp: ' + forecastTempDayOne + '°F');
                            $('#windDayOne').text('Wind Speed: ' + forecastWindDayOne + ' m/ph');
                            $('#humidityDayOne').text('Humidity: ' + forecastHumidityDayOne + '%');

                            const forecastDateDayTwo = data.list[8].dt_txt;
                            const dateObjectDayTwo = new Date(forecastDateDayTwo);
                            const formattedDateDayTwo = dateObjectDayTwo.toLocaleString('en-US', options);
                            const forecastIconDayTwo = data.list[8].weather[0].icon;
                            const forecastTempDayTwo = data.list[8].main.temp;
                            const forecastWindDayTwo = data.list[8].wind.speed;
                            const forecastHumidityDayTwo = data.list[8].main.humidity;
                            $('.dateDayTwo').text(formattedDateDayTwo);
                            $('#iconDayTwo').append(`<img src="https://openweathermap.org/img/w/${forecastIconDayTwo}.png" alt="Weather Icon">`);
                            $('#tempDayTwo').text('Temp: ' + forecastTempDayTwo + '°F');
                            $('#windDayTwo').text('Wind Speed: ' + forecastWindDayTwo + ' m/ph');
                            $('#humidityDayTwo').text('Humidity: ' + forecastHumidityDayTwo + '%');

                            const forecastDateDayThree = data.list[16].dt_txt;
                            const dateObjectDayThree = new Date(forecastDateDayThree);
                            const formattedDateDayThree = dateObjectDayThree.toLocaleString('en-US', options);
                            const forecastIconDayThree = data.list[16].weather[0].icon;
                            const forecastTempDayThree = data.list[16].main.temp;
                            const forecastWindDayThree = data.list[16].wind.speed;
                            const forecastHumidityDayThree = data.list[16].main.humidity;
                            $('.dateDayThree').text(formattedDateDayThree);
                            $('#iconDayThree').append(`<img src="https://openweathermap.org/img/w/${forecastIconDayThree}.png" alt="Weather Icon">`);
                            $('#tempDayThree').text('Temp: ' + forecastTempDayThree + '°F');
                            $('#windDayThree').text('Wind Speed: ' + forecastWindDayThree + ' m/ph');
                            $('#humidityDayThree').text('Humidity: ' + forecastHumidityDayThree + '%');

                            const forecastDateDayFour = data.list[24].dt_txt;
                            const dateObjectDayFour = new Date(forecastDateDayFour);
                            const formattedDateDayFour = dateObjectDayFour.toLocaleString('en-US', options);
                            const forecastIconDayFour = data.list[24].weather[0].icon;
                            const forecastTempDayFour = data.list[24].main.temp;
                            const forecastWindDayFour = data.list[24].wind.speed;
                            const forecastHumidityDayFour = data.list[24].main.humidity;
                            $('.dateDayFour').text(formattedDateDayFour);
                            $('#iconDayFour').append(`<img src="https://openweathermap.org/img/w/${forecastIconDayFour}.png" alt="Weather Icon">`);
                            $('#tempDayFour').text('Temp: ' + forecastTempDayFour + '°F');
                            $('#windDayFour').text('Wind Speed: ' + forecastWindDayFour + ' m/ph');
                            $('#humidityDayFour').text('Humidity: ' + forecastHumidityDayFour + '%');

                            const forecastDateDayFive = data.list[32].dt_txt;
                            const dateObjectDayFive = new Date(forecastDateDayFive);
                            const formattedDateDayFive = dateObjectDayFive.toLocaleString('en-US', options);
                            const forecastIconDayFive = data.list[32].weather[0].icon;
                            const forecastTempDayFive = data.list[32].main.temp;
                            const forecastWindDayFive = data.list[32].wind.speed;
                            const forecastHumidityDayFive = data.list[32].main.humidity;
                            $('.dateDayFive').text(formattedDateDayFive);
                            $('#iconDayFive').append(`<img src="https://openweathermap.org/img/w/${forecastIconDayFive}.png" alt="Weather Icon">`);
                            $('#tempDayFive').text('Temp: ' + forecastTempDayFive + '°F');
                            $('#windDayFive').text('Wind Speed: ' + forecastWindDayFive + ' m/ph');
                            $('#humidityDayFive').text('Humidity: ' + forecastHumidityDayFive + '%');


                        })

                })
                .catch(function (error) {
                    console.error('Fetch error:', error);
                });
        }
    });
};
searchForecastHandler();
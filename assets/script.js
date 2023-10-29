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
                    const todaysTemp = data.list[0].main.temp + '°';
                    const todaysWind = data.list[0].wind.speed + ' m/ph';
                    const todaysHumidity = data.list[0].main.humidity
                    $("#todaysIcon").append(`<img src="https://openweathermap.org/img/w/${todaysIcon}.png" alt="Weather Icon">`)
                    $("#todaysTemp").text('Temp: ' + todaysTemp);
                    $("#todaysWind").text('Wind Speed: ' + todaysWind);
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
}
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
}
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
                            // const forecastIcon = data.list[0].weather[0].icon;
                            // const forecastTemp = data.list[0].main.temp + '°';
                            // const forecastWind = data.list[0].wind.speed;
                            // const forecastHumidity = data.list[0].main.humidity

                        })

                })
                .catch(function (error) {
                    console.error('Fetch error:', error);
                });
        }
    });
};
searchForecastHandler ();
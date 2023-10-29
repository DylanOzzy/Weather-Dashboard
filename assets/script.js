const userLocationHandler = () => {
    
    const success = (position) => {
        const userLocationLat = position.coords.latitude;
        const userLocationLong = position.coords.longitude;
        var userGeolocation = `http://api.openweathermap.org/geo/1.0/reverse?lat=${userLocationLat}&lon=${userLocationLong}&appid=1f3545ea7433a3f52cff6877a218c291`;
        const userLocation = document.getElementById("userLocation");
        
        fetch(userGeolocation)
        .then(function (response) {
            return response.json();
        })
        
        .then(function (data) {
            var geoLocation = data[0].name;
            const userLocationWeather = `http://api.openweathermap.org/data/2.5/forecast?q=${geoLocation}&cnt=5&units=imperial&appid=1f3545ea7433a3f52cff6877a218c291`;
            console.log(data)
            userLocation.textContent = geoLocation;
                fetch(userLocationWeather)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);
                    const todaysIcon = data.list[0].weather[0].icon;
                    const todaysTemp = data.list[0].main.temp + '°';
                    const todaysWind = data.list[0].wind.speed;
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
            const listItem = $("<li>").text(search);
            $('#displaySearchHistory').prepend(listItem);
            listItem.on('click', function() {
                $('.outputContainer').css("display", "block");
                const listItemValue = $(this).text();
                $('#searchCity').val(listItemValue); // Set the value of the search input
                $("#searchBtn").trigger("click", function(event) {
                }); 
            });
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

}
searchForecastHandler ();
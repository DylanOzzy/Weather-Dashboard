




const userLocation = () => {
    const success = (position) => {
        const userLocationLat = position.coords.latitude;
        const userLocationLong = position.coords.longitude;
        var userGeolocation = `http://api.openweathermap.org/geo/1.0/reverse?lat=${userLocationLat}&lon=${userLocationLong}&appid=1f3545ea7433a3f52cff6877a218c291`;
        const userLocation = document.getElementById("userLocation");
        console.log(userLocationLat, userLocationLong);
        
        fetch(userGeolocation)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var geoLocation = data[0].name
            const userLocationWeather = `http://api.openweathermap.org/geo/1.0/direct?name=${geoLocation}&appid=1f3545ea7433a3f52cff6877a218c291`;
            console.log(data)
            userLocation.textContent = geoLocation;
        })
        .catch(function (error) {
            console.error("Error fetching data:", error);
        });

        
    }
    
    const error = (error) => {
        // Handle the error here
        console.error("Error: Enable location services to get your current weather.", error);
    };

    
    navigator.geolocation.getCurrentPosition(success, error);
};

userLocation();



document.addEventListener("DOMContentLoaded", userLocation);














// this handles saving the search history to local storage if there is a value in the search input
$("#searchBtn").on("click", function (event) {
    event.preventDefault();
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
    }
}

// this handles parsing of the search history in local storage and calling the displaySearchHistory function 
$(document).ready(function () {
    const searchHistory = JSON.parse(localStorage.getItem("SearchHistory")) || [];
    displaySearchHistory(searchHistory);
});

// this handles using the dayjs library to display the current time and date upon page load
function displayTimeDate () {
    var dayjsObject = dayjs();
    var today = $('#timeDate');
    today.text(dayjsObject.format('hh:mm A dddd, MMMM DD, YYYY '));
};


displayTimeDate ();





function displayTimeDate () {
    var dayjsObject = dayjs();
    var today = $('#timeDate');
    today.text(dayjsObject.format('hh:mm A dddd, MMMM DD, YYYY '));
};

displayTimeDate ();

$("#searchBtn").on("click", function (event) {
    event.preventDefault();
    $('#searchCity').html();
    localStorage.setItem("Search", $('#searchCity').val());
    let searchHistory = JSON.parse(localStorage.getItem("SearchHistory")) || [];
    const newSearch = $('#searchCity').val();
    searchHistory.push(newSearch);
    localStorage.setItem("SearchHistory", JSON.stringify(searchHistory));
    displaySearchHistory(searchHistory);
});

function displaySearchHistory(searchHistory) {
    $('#displaySearchHistory').empty();
    
    for (const search of searchHistory) {
        const listItem = $("<li>").text(search);
        $('#displaySearchHistory').prepend(listItem);
    }
}

$(document).ready(function () {
    const searchHistory = JSON.parse(localStorage.getItem("SearchHistory")) || [];
    displaySearchHistory(searchHistory);
});




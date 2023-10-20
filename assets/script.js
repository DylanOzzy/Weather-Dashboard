




function displayTimeDate () {
    var dayjsObject = dayjs();
    var today = $('#timeDate');
    today.text(dayjsObject.format('hh:mm A dddd, MMMM DD, YYYY '));
};

displayTimeDate ();



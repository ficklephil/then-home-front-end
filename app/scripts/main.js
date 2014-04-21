var map;

function initialize() {
    var lat = 51.46310355210425;
    var lng = -0.36240399999992734;

    var mapOptions = {
        center: new google.maps.LatLng(lat, lng),
        zoom: 15,
        sensors:false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,

        panControl: true,
        panControlOptions: {
            position: google.maps.ControlPosition.TOP_LEFT
        },
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE,
            position: google.maps.ControlPosition.TOP_LEFT
        },
        scaleControl: true,
        scaleControlOptions: {
            position: google.maps.ControlPosition.BOTTTOM_LEFT
        },
        streetViewControl: true,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.TOP_LEFT
        }
    };
    map = new google.maps.Map(document.getElementById("map-canvas"),
        mapOptions);
}

/**
 *
 * @returns {*|jQuery}
 */
function getWindowHeight(){
    return $(window).height();
}

function getMainNavHeight(){
    return 40; //currently not returning $('.main-nav').css('height')
}

function mapHeight(){
    return getWindowHeight() - getMainNavHeight();
}

function setMapHeight(){
    //Needs to set the correct height on the different screens
    $('#map-canvas').height(524);
}

function nextHandler(){
    console.log('nextHandler');
}

function setupViewListeners(){

    console.log('hello setup view listeners');
    $(".next").click(function() {
        alert( "Handler for .click() called." );
    });
}

function previousHandler(){
    console.log('previousHandler');
}

console.log(getWindowHeight());
console.log(getMainNavHeight());
console.log(mapHeight());

setMapHeight();

//so we just need to access the timer api here

google.maps.event.addDomListener(window, 'load', initialize);

function init(){
    setupViewListeners();
};

init();
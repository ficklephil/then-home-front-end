var map;

function initialize() {

    setupGoogleMap();
    setupViewListeners();
}

function setupGoogleMap() {

    var lat = 51.46310355210425;
    var lng = -0.36240399999992734;

    var mapOptions = {
        center: new google.maps.LatLng(lat, lng),
        zoom: 15,
        sensors: false,
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

function setupViewListeners() {

    console.log('hello setup view listeners');
    $(".next").click(function () {
        alert("Handler for .click() called.");
    });

    google.maps.event.addListener(map, 'dragend', function(){

        console.log('idle event');

        search(1);
    });
}

function search(page){
    clearMarkersOnMap();
    searchByCenterPoint(page);
}

function searchByCenterPoint(page){

    var bounds = map.getBounds();
    var northEastCorner = bounds.getNorthEast();
    var southWestCorner = bounds.getSouthWest();

    console.log(southWestCorner);

    //var lat_lo, lng_lo, lat_hi, lng_hi;
    lat_hi = northEastCorner.lat();
    lng_hi = northEastCorner.lng();
    lat_lo = southWestCorner.lat();
    lng_lo = southWestCorner.lng();

    console.log('Movement');

    //getBounds?
    var centerLatLng = map.getCenter();
    console.log(centerLatLng.lat());
    console.log(centerLatLng.lng());

    var location ='hounslow';

    console.log('lat_hi' + lat_hi + 'lng_hi' + lng_hi + 'lat_lo' + lat_lo + 'lng_lo' + lng_lo);

    getItemAPI(location,centerLatLng.lat(),centerLatLng.lng(),lat_lo,lng_lo,lat_hi,lng_hi,page);
}

function getItemAPI(location,centerLat,centerLng,lat_lo,lng_lo,lat_hi,lng_hi,page){

    console.log('Page Number Sent : ' + page);
    //var url = 'http://127.0.0.1:1337/?callback=?';

    var mapWidth = $('#map-canvas').width();
    var mapHeight = $('#map-canvas').height();

    var minPrice = 0;//$('.min-price').val();
    var maxPrice = 700000;//$('.max-price').val();
    var updatedMin = 1325376000//$('.updated-min').val();

    var date = new Date(updatedMin * 1000);

    $('.update-date').text('Start Date :' + date.getDate() + '/' + (date.getMonth()+1));

//            var url = 'http://127.0.0.1:1337/?screenResolutionX='+mapWidth+'&screenResolutionY='+mapHeight+'&placeName='+location+'&callback=?';
    //var url = 'http://thenhome.nodejitsu.com/?screenResolutionX='+mapWidth+'&screenResolutionY='+mapHeight+'&placeName='+location+'&centerLat='+centerLat+'&centerLng='+centerLng+'&lat_lo='+lat_lo+'&lng_lo='+lng_lo+'&lat_hi='+lat_hi+'&lng_hi='+lng_hi+'&page='+page+'&min_price='+minPrice+'&max_price='+maxPrice+'&updated_min='+updatedMin+'&callback=?';
//            var url = 'http://localhost:8080/?screenResolutionX='+mapWidth+'&screenResolutionY='+mapHeight+'&placeName='+location+'&centerLat='+centerLat+'&centerLng='+centerLng+'&lat_lo='+lat_lo+'&lng_lo='+lng_lo+'&lat_hi='+lat_hi+'&lng_hi='+lng_hi+'&page='+page+'&min_price='+minPrice+'&max_price='+maxPrice+'&updated_min='+updatedMin+'&callback=?';
//            var url = 'http://127.0.0.1:1337/?screenResolutionX='+mapWidth+'&screenResolutionY='+mapHeight+'&placeName='+location+'&centerLat='+centerLat+'&centerLng='+centerLng+'&lat_lo='+lat_lo+'&lng_lo='+lng_lo+'&lat_hi='+lat_hi+'&lng_hi='+lng_hi+'&page='+page+'&min_price='+minPrice+'&max_price='+maxPrice+'&updated_min='+updatedMin+'&callback=?';
//            var url = 'http://obscure-cliffs-3333.herokuapp.com/?screenResolutionX='+mapWidth+'&screenResolutionY='+mapHeight+'&placeName='+location+'&centralLat='+centerLat+'&centralLng='+centerLng+'&latLo='+lat_lo+'&lngLo='+lng_lo+'&latHi='+lat_hi+'&lngHi='+lng_hi+'&page='+page+'&minPrice='+minPrice+'&maxPrice='+maxPrice+'&updatedMin='+updatedMin+'&callback=?';
    var url = 'http://localhost:5000/?screenResolutionX='+mapWidth+'&screenResolutionY='+mapHeight+'&placeName='+location+'&centralLat='+centerLat+'&centralLng='+centerLng+'&latLo='+lat_lo+'&lngLo='+lng_lo+'&latHi='+lat_hi+'&lngHi='+lng_hi+'&page='+page+'&minPrice='+minPrice+'&maxPrice='+maxPrice+'&updatedMin='+updatedMin+'&callback=?';

    $.ajax({
        type: 'GET',
        url: url,
        async: false,
        jsonpCallback: 'jsonCallback',
        contentType: "application/json",
        dataType: 'jsonp',
        success: function(json) {
            console.log('success');
            console.log(JSON.stringify(json.request));
            console.log(JSON.stringify(json.response));
            parseJson(json);
//            parseGrid(json);
        },
        error: function(e) {
            console.log(e.message);
        }
    });
}

function parseGrid(json){
    var gridItem = json.response.gridlayout;
    for(var i=0; i < gridItem.length; i++){
        addGridItemToDisplay(gridItem[i].x,gridItem[i].y);
    }
}

function parseJson(json)
{
    parseMarkers(json);
}

var totalPages;
var currentPage;
var totalResults;

function parseMarkers(json){

    console.log('parse markers');

    var responseLat = json.response.locations[0].center_lat;
    var responseLng = json.response.locations[0].center_long;

    currentPage = json.response.page;
    totalPages = json.response.total_pages;
    totalResults = json.response.total_results;

    console.log(currentPage);
    console.log(totalPages);
    console.log(totalResults);
    console.log(responseLat);
    console.log(responseLng);

    console.log('lat + lng : ' + JSON.stringify(responseLat.center_lat));// + responseLng);

    $('.page-number-display').text('Page :' + currentPage + ' of ' + totalPages);
    $('.results-number-display').text('Total Results :' + totalResults);

    moveMap(responseLat,responseLng);

    var listings = json.response.listings;
    console.log(listings.length);

    for(var i=0; i < listings.length; i++){

        console.log(JSON.stringify(listings[i]));

        console.log("Item Title " + listings[i].title);
        console.log("Item Marker X " + listings[i].longitudeXCoor);
        console.log("Item Marker Y " + listings[i].latitudeYCoor);
        console.log("Price " + listings[i].price);

        //Longitude is X, Latitude is Y
        addItemToDisplay(listings[i].property_type,listings[i].longitudeXCoor, listings[i].latitudeYCoor,listings[i].price_formatted, listings[i].bedroom_number, listings[i].img_url, listings[i].lister_url );
    }
}



function moveMap(responseLat,responseLng)
{
    console.log('move map');
    var locationLatLng = new google.maps.LatLng(responseLat, responseLng);
    map.panTo(locationLatLng);
}

function addGridItemToDisplay(gridX,gridY){
    $('.display-layer').append('<div class="grid-item" style="left:'+ gridX +'px; top:'+ gridY +'px;"></div>');
}

function addItemToDisplay(itemType,longitudeXCoor,latitudeYCoor,price_formatted,bedroom_number,imageSrc,imageLink){

    $('.display-layer').append('<div class="item-dot '+itemType+'" style="left:'+ longitudeXCoor +'px; top:'+ latitudeYCoor +'px;">');

    $('.display-layer').append('<a href="'+imageLink+'" target="_blank"><div class="item-box" style="left:'+ longitudeXCoor +'px; top:'+ latitudeYCoor +'px;"><div class="item-image"><img src="'+imageSrc+'" width="100%" height="100%" ></div>' +
        '<div class="item-data-container"><div class="item-data-field-one">'+price_formatted.substring(0,3)+' k</div><div class="item-data-field-two">'+bedroom_number+' Bed</div></div></a>');



    //$('.display-layer').append('<div class="dot-item '+itemType+'" style="left:'+ longitudeXCoor +'px; top:'+ latitudeYCoor +'px;"><div class="price">'+price_formatted+'</div>' +
    //        '<div class="beds">Beds '+bedroom_number+'</div><a href="'+imageLink+'" target="_blank"><div class="item-image"><img src="'+imageSrc+'" ></div></a></div>');
}

function clearMarkersOnMap(){
    $('.item-dot').remove();
    $('.item-box').remove();
    $('.grid-item').remove();
}


/**
 *
 * @returns {*|jQuery}
 */
function getWindowHeight() {
    return $(window).height();
}

function getMainNavHeight() {
    return 40; //currently not returning $('.main-nav').css('height')
}

function mapHeight() {
    return getWindowHeight() - getMainNavHeight();
}

function setMapHeight() {
    //Needs to set the correct height on the different screens
    $('#map-canvas').height(650);
}

function nextHandler() {
    console.log('nextHandler');
}


function previousHandler() {
    console.log('previousHandler');
}

console.log(getWindowHeight());
console.log(getMainNavHeight());
console.log(mapHeight());

setMapHeight();

//so we just need to access the timer api here

google.maps.event.addDomListener(window, 'load', initialize);

function init() {
    setupViewListeners();
};

//init();
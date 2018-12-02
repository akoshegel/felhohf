$(document).ready(function(){
  initializeAppearable()
  $('#send').click(function(){
    shop.connect({
      from: {
        name: $('#name').val(),
        email: $('#email').val(),
        phone: $('#phone').val()
      },
      subject: '',
      message: $('#message').val()
    }, 'notification/contact/' + shop.shopID, 'POST').then(
      result => { window.location = '/Index' }, reason => {}
    )
  })
})
function showMap(){
  var center = {lat: 47.497070, lng: 19.056422};
  var locations = [
    ['ÁRKÁD BUDAPEST<br>\
    Örs vezér tere 25.<br>',   47.502892, 19.137291],
    ['ALLEE BEVÁSÁRLÓKÖZPONT<br>\
    Október 23. utca 8-10<br>', 47.475027, 19.049546]
  ];
  var map = new google.maps.Map($('.map').get(0), {
      zoom: 11,
      center: center
    });
  var infowindow =  new google.maps.InfoWindow({});
  var marker, count;
  for (count = 0; count < locations.length; count++) {
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[count][1], locations[count][2]),
        map: map,
        title: locations[count][0]
      });
    google.maps.event.addListener(marker, 'click', (function (marker, count) {
        return function () {
          infowindow.setContent(locations[count][0]);
          infowindow.open(map, marker);
        }
      })(marker, count));
    }
}

$(document).ready(function(){
  renderOptions($('#shipping').val())
  $('body').on('change', 'input, select', function(){
    if(doConditionsFit()){
      if($('#next').hasClass('disabled'))
        $('#next').removeClass('disabled')
      }
      else
        if(!$('#next').hasClass('disabled'))
          $('#next').addClass('disabled')
  })

  $('#shipping').change(function(e){
    renderOptions($(e.currentTarget).val())
  })

  $('#useName').change(function(e){
    $('#paymentName').toggle(200)
  })
  $('#usePostalAddress').change(function(e){
    $('#postalAddressForm').toggle(200)
  })
  $('#usePostalAddressPayment').change(function(e){
    $('#paymentAddressForm').toggle(200)
  })

  $('#next').click(function(){
    if(!doConditionsFit()){
      myConfirm('Kérjük töltsön ki minden mezőt')
      return
    }
    var address = {
      city: $('#mainCity').val(),
      postCode: $('#mainZip').val(),
      street: $('#mainStreet').val(),
      houseNumber: $('#mainAddress').val(),
      country: 'Hungary'
    }
    var shippingData //TODO: shipping.data => shippingStreet, shippingZip, shippingType etc.
    if($('#shipping').val() == 'postal')
      shippingData = $('#usePostalAddress').prop('checked') ? address :
      {
        country: 'Hungary',
        city: $('#city').val(),
        postCode: $('#zip').val(),
        street: $('#street').val(),
        houseNumber: $('#address').val()
      }
    else if($('#shipping').val() == 'personal')
      shippingData = $('#allee').prop('checked') ? {
        country: 'Hungary',
        city: 'BUDAPEST',
        postCode: '1111',
        street: 'Október 23. utca',
        houseNumber: 8
      } : $('#arkad').prop('checked') ? {
        country: 'Hungary',
        city: 'BUDAPEST',
        postCode: '1106',
        street: 'Örs vezér tere',
        houseNumber: 25
      } : {}
      console.log({
        firstName: $('#firstName').val(),
        lastName: $('#lastName').val(),
        email: $('#email').val(),
        phone: $('#phone').val(),
        address: address,
        shippingType: $('#shipping').val(),
        birthYear: $('#birthYear').val(),
        birthMonth: $('#birthMonth').val(),
        birthDay: $('#birthDay').val(),
        shippingData: shippingData,
        paymentAddress: $('#usePostalAddressPayment').prop('checked') ? address : {
          country: 'Hungary',
          city: $('#paymentCity').val(),
          postCode: $('#paymentZip').val(),
          street: $('#paymentStreet').val(),
          houseNumber: $('#paymentAddress').val()
        },
        paymentFirstName: $('#useName').prop('checked') ? $('#firstName').val() : $('#firstNamePayment').val(),
        paymentLastName: $('#useName').prop('checked') ? $('#lastName').val() : $('#lastNamePayment').val(),
        paying: $('#paying').val()
      });
    $.ajax({
      url: '/Shop/confirm',
      type: 'POST',
      data: {
        firstName: $('#firstName').val(),
        lastName: $('#lastName').val(),
        email: $('#email').val(),
        phone: $('#phone').val(),
        address: address,
        shippingType: $('#shipping').val(),
        birthYear: $('#birthYear').val(),
        birthMonth: $('#birthMonth').val(),
        birthDay: $('#birthDay').val(),
        shippingData: shippingData,
        paymentAddress: $('#usePostalAddressPayment').prop('checked') ? address : {
          country: 'Hungary',
          city: $('#paymentCity').val(),
          postCode: $('#paymentZip').val(),
          street: $('#paymentStreet').val(),
          houseNumber: $('#paymentAddress').val()
        },
        paymentFirstName: $('#useName').prop('checked') ? $('#firstName').val() : $('#firstNamePayment').val(),
        paymentLastName: $('#useName').prop('checked') ? $('#lastName').val() : $('#lastNamePayment').val(),
        paying: $('#paying').val()
      },
      headers: {
        cartid : $('main').data('cart-id')
      },
      success: function(result){
        if(result.type == 'success') window.location = "/Shop/confirm"
        else {
          console.log(result);
          var reasons = ''
          exceptionHandler( {result: {func: '@confirm', msg: 'Kérjük töltse ki helyesen az alábbi mezőt: ' + result.msg, type: result.type}} )
        }
      },
      error: function(){}
    })
  })
})


function doConditionsFit(debugMode = true){
  if(debugMode) console.log('start');
  if(!($('#firstName').val() &&
    $('#lastName').val() &&
    $('#email').val() &&
    $('#phone').val() &&
    $('#birthDay').val() &&
    $('#mainCity').val() &&
    $('#mainZip').val() && $('#mainStreet').val() && $('#mainAddress').val() &&
    $('#shipping').val() != 'placeholder' &&
    $('#aszf').prop('checked') &&
    $('#data').prop('checked') &&
    $('#paying').val() != 'placeholder'
  )) return false
  if(debugMode) console.log('basics done');
  var date = new Date($('#birthYear').val(), $('#birthMonth').val(), $('#birthDay').val())
  if(date.getDate() != $('#birthDay').val()) return false

  if(debugMode) console.log('date done');
  if(!$('#usePostalAddressPayment').prop('checked'))
    if(!($('#paymentCity').val() && $('#paymentZip').val() && $('#paymentStreet').val() && $('#paymentAddress').val())) return false

  if(debugMode) console.log('address done');
  if(!$('#useName').prop('checked'))
    if(!($('#firstNamePayment').val() && $('#lastNamePayment').val())) return false

  if(debugMode) console.log('payment details done');
  switch ($('#shipping').val()) {
    case 'postal':
      if($('#city').val() && $('#zip').val() && $('#street').val() && $('#address').val()) return true
      return $('#usePostalAddress').prop('checked')
    case 'personal':
      if(!($('#allee').prop('checked') === $('#arkad').prop('checked'))) return true
      return false
    default:
      return false
  }
  if(debugMode) console.log("everything fine");
}

function renderOptions(value){
  var options = ''
  $('#shippingModePersonal, #shippingModePostal').hide(300)
  $('#shippingDetails input[type="checkbox"]').prop('checked', true)
  switch (value) {
    case 'personal':
      options =
      //`<option value="online_bank">Elővétel (bankkártyás utalás)</option>
      `<option value="personal">Fizetés a helyszínen</option>`
      $('#shippingModePersonal').show(300)
      break;
    case 'postal':
      options =
        `<option value="online_bank">Elővétel (bankkártyás utalás)</option>`
      $('#shippingModePostal').show(300)
      break;
    case 'pickPackPoint':
      return;
    default:
      return;
  }
  $('#paying').html('<option value="placeholder">Válasszon szállítási módot...</option>').append(options)
  $('#paymentDetails').show(300)
}


$(document).ready(function(){
    var api_key =  $('.apikey').val();
    var sendTo = '/places';

    function enter_redirect(e, element){
        if (e.keyCode == 13) {
            element.trigger('click');
            event.preventDefault();
            return false;
        }
    }

    $('#find-this').keydown(function(e){
        var element = $('.start_ajax_places ');
        enter_redirect(event, element);
    });

    function getPlaces(find_this){
        $.ajax({
            url: sendTo,
            dataType: 'JSON',
            type: 'POST',
            data: { query: find_this, key: api_key },
            success: function(response){
                if(response.status == 'OK') {
                    $.each(response.results, function(i, item) {
                        getDetails(item.place_id);
                    });
                    $('.next_ajax_places').attr('data-next', response.next_page_token);
                }
            }
        });
    }
    function getDetails(placeID){
        $.ajax({
            url: sendTo,
            dataType: 'JSON',
            type: 'POST',
            data: { placeid: placeID, key: api_key },
            success: function(response){
                if(response.status == 'OK') {
                    var tr = $('<tr>').append(
                        $('<td>').text(response.result.name),
                        $('<td>').text(response.result.website),
                        $('<td>').text(response.result.formatted_address),
                        $('<td>').text(response.result.formatted_phone_number),
                        $('<td>').text(response.result.international_phone_number),
                        $('<td>').text(response.result.types)

                ); //.appendTo('attach-here table');
                    $('.attach-here').append(tr);
                    $('.query-results').css('visibility','visible');

                    if(response.result.website) {
                        // getInfo(response.result.website)
                    } else {
                        websiteurl = 'www.' + response.result.name + '.com';
                        websiteurl = websiteurl.replace(/\s+/g, '');

                        getInfo(websiteurl);
                    }

                }
            }
        });
    }
    getInfo();
    function getNextPlaces(token){
        $.ajax({
            url: sendTo,
            dataType: 'JSON',
            type: 'POST',
            data: { pagetoken: token, key: api_key },
            success: function(response){
                if(response.status == 'OK') {
                    $.each(response.results, function(i, item) {
                        getDetails(item.place_id);
                    });
                }
            }
        });
    }

    function getInfo(website_url){
        $.ajax({
            url: '/personal_details',
            dataType: 'JSON',
            type: 'GET',
            data: {website: website_url },
            success: function(response){
                console.log(response);
            }
        });
    }

    $('.start_ajax_places').click(function () {
        var find_this = $('#find-this').val();
        getPlaces(find_this);
    });

    $('.next_ajax_places').click(function () {
        var token = $('.next_ajax_places').data('next');
        getNextPlaces(token);
    })
});
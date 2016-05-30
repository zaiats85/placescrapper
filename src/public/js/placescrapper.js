
$(document).ready(function(){
    var api_key =  $('.apikey').val();
    var sendTo = '/places';

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
                        $('<td>').text(response.result.website)

                ); //.appendTo('attach-here table');
                    $('.attach-here').append(tr);
                    $('.query-results').css('visibility','visible');
                }
            }
        });
    }
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

    $('.start_ajax_places').click(function () {
        var find_this = $('#find-this').val();
        getPlaces(find_this);
    });

    $('.next_ajax_places').click(function () {
        var token = $('.next_ajax_places').data('next');
        getNextPlaces(token);
    })
});
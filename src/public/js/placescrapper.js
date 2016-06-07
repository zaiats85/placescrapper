
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

    $(this).bind("ajaxSend", function(){
        $('.modal-title').html('<i id="loading" class="fa fa-spinner fa-spin" ></i>');
        $("#loading").css('display', 'inline-block');

    }).bind("ajaxComplete", function(){
        $("#loading").hide();
    });

    $('#myModal').on('hidden.bs.modal', function () {
        $('.parse-attach-here tbody').empty();
        $('.search-attach-here tbody').empty();
        $('.keywords, .classes, .ids').empty();
        $('.detailed-attach-here, .parse-attach-here, .search-attach-here').css('visibility', 'hidden');

    })

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
    // Counter closure. Used for training purpose
    var counter = 0;
    function add() {
        return counter += 1;
    }

    function getDetails(placeID){
        $.ajax({
            url: sendTo,
            dataType: 'JSON',
            type: 'POST',
            data: { placeid: placeID, key: api_key },
            success: function(response){
                if(response.status == 'OK') {
                    add();
                    var websiteurl = (response.result.website) ?  response.result.website : ('www.' + response.result.name + '.com').replace(/\s+/g, '');
                    response.result.websiteurl = websiteurl;
                    var tr = $('<tr>').append(
                        $('<td>').text(counter),
                        $('<td>').text(response.result.name),
                        $('<td>').text(response.result.website),
                        $('<td>').text(response.result.formatted_address),
                        $('<td>').text(response.result.international_phone_number),
                        $('<td>').text(response.result.types),
                        $('<td>').html("<button  class='btn btn-success details' data-toggle='modal' data-target='#myModal'>details</button>").attr('data-website', response.result.websiteurl)
                ); //.appendTo('attach-here table');
                    $('.attach-here').append(tr);
                    $('.query-results').css('visibility','visible');
                }
            }
        });
    }

    $('body').on('click', '.details', function(){
        var website = $(this).parent().data('website');
        getInfo(website);
    })

    function getNextPlaces(token){
        $.ajax({
            url: sendTo,
            dataType: 'JSON',
            type: 'POST',
            data: { pagetoken: token, key: api_key },
            success: function(response){
                if(response.status == 'OK') {
                    $.each(response.results, function(i, item) {
                        getDetails(item.place_id, i);
                    });
                }
            }
        });
    }

    function getInfo(website_url){
        $.ajax({
            url: '/personal_details',
            dataType: 'JSON',
            type: 'POST',
            data: {website: website_url },
            success: function(response){
                $('.modal-title').text(response.data.json.website_header);
                var matches = response.data.json.search_details ? (response.data.json.search_details).length : 'not found';
                

                var tr = $('<tr>').append(
                    $('<td>').text(response.data.json.sitemap_status),
                    $('<td>').text(matches),
                    $('<td>').text(response.data.json.dictionary_url),
                    $('<td>').text(response.data.json.memory_usage)
                ); //.appendTo('attach-here table');
                var search_details = response.data.json.search_details;

                $.each(search_details, function(i, item) {

                    var header = search_details[i].search_url;
                    var keywords_match = search_details[i].keywords ? search_details[i].keywords.length : 0;
                    var classes_match = search_details[i].classes_match ? search_details[i].classes_match.length : 0;
                    var ids_match = search_details[i].ids_match ? search_details[i].ids_match.length : 0;
                    var tr = $('<tr>').append(
                        $('<td class="small">').text(header),
                        $('<td>').text(keywords_match),
                        $('<td>').text(classes_match),
                        $('<td>').text(ids_match)
                    )
                    $.each(search_details[i].keywords, function (k, keyword) {
                        var li = $('<li>').text(k + ': ' +keyword);
                        $('p.keywords   ').append(li);

                    })
                    $.each(search_details[i].classes_match, function (c, classes) {
                        var li = $('<li>').text(classes);
                        $('p.classes').append(li).css('visibility', 'visible');
                    })
                    $.each(search_details[i].ids_match, function (j, ids) {
                        var li = $('<li>').text(ids);
                        $('p.ids').append(li).css('visibility', 'visible');
                    })

                    $('.detailed-attach-here').css('visibility', 'visible')
                    $('.search-attach-here').append(tr).css('visibility', 'visible');

                    console.log(item.keywords);
                    console.log(item.classes_match);
                    console.log(item.ids_match);

                });
                $('.parse-attach-here').append(tr).css('visibility', 'visible');
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
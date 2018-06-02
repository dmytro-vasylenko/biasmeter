'use strict'

var lat = 0;
var lon = 34;
var geoBool = false;
$(function() {
    var check = true;
    if($.cookie("check") == 0)
        check = false;
    $("#checkBox").prop("checked", check);
    onCheck();
    $("#checkBox").on("click", function(){
        onCheck();
    });
    
    $("#cities").val($.cookie("city"));
    $("#cities").focus(function (){
        $("#cities-list").addClass("focus");
        getCitiesList();
        $("#cities-list li").on("click", selectCity);
    }).blur(function(){
        if($('li:hover').length == 0) 
        $("#cities-list").removeClass("focus");
    });
    $("#cities").keyup(getCitiesList);
    $(".save").on("click", function(e){
        if(!$("#checkBox").prop('checked'))
        {
            if(geoBool)
            {
                $.cookie("city", $("#cities").val());
                $.cookie("lat", lat);
                $.cookie("lon", lon);
                $.removeCookie("temp");
                $.cookie("check", 0);
                console.log(document.cookie);
                //window.location = "/";
            }
            else{
                alert("Ошибка при сохранении! Попробуйте еще раз :)");
            }
        }
        else
        {
            $.cookie("city", "Харьков");
            $.cookie("lat", 49.994507);
            $.cookie("lon", 36.1457436);
            $.removeCookie("temp");
            $.cookie("check", 1);
            window.location = "/";
        }
    })
});
function onCheck()
{
    var check = $("#checkBox").prop('checked');
    if(check)
    {
        $("#cities").prop('disabled', true);
    }
    else
    {
        $("#cities").prop('disabled', false);
    }
}
function selectCity(e){
    $("#selectCity").text($(this).find(".cityVal").text());
    $("#cities").val($(this).find("p").text());
    $("#cities-list").removeClass("focus");
    geoBool = false;
    geoBool = geodecode($("#selectCity").text());
}
function getCitiesList()
{
    var input = $("#cities").val();
    if(input.length > 0){
        var request = {
            input: input,
            types: "(cities)"
        };
        var service = new google.maps.places.AutocompleteService();
        service.getQueryPredictions(request, showCitiesList);
    }
}
function showCitiesList(predictions, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        console.log(predictions);
        $("#cities-list").empty();
        for(var i = 0; i<predictions.length; i++)
        {
        $("#cities-list").append(' <li id="city'+ i +'"><p>'+ predictions[i].structured_formatting.main_text +'</p><span>'+ predictions[i].structured_formatting.secondary_text +'</span> <h1 class="cityVal">'+ predictions[i].place_id +'</h1></li>');
        }
        $("#cities-list li").on("click", selectCity);
    }
    
}

function geodecode(place)
{
    $.ajax({
        url: 'https://maps.googleapis.com/maps/api/geocode/json?place_id='+place+'&key=AIzaSyAS3K5DzqKTbIdPtWAxdC9a1LhLNkUfYxY',
        error: function(){ return false; },
        success: function(data) {
          lat = data.results[0].geometry.location.lat;
          console.log(lat);
          lon = data.results[0].geometry.location.lng;
          console.log(lon);
        }
      });
      return true;
}
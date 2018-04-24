'use strict'

var lat =  $.cookie("lat");
var lon = $.cookie("lon");
$(function() {
    console.log(document.cookie);
    navigator.geolocation.getCurrentPosition(success)
    loadWeather();
    getCurrency();
    $(".comment-button").on("click", function(){
        $($(this).attr("data-target")).slideToggle();
    });
    $("#reload-weather").on("click", function(){
        $(".weather .loader").removeClass("show");
        getWeahter(lat, lon);
    });
})
function success(pos) {
    var crd = pos.coords;
    console.log('Your current position is:');
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
  };

function loadWeather()
{
    if($.cookie("temp") == null)
    {
        getWeahter(lat, lon);
    }
    else
    {
        var temp = $.cookie("temp");
        var text = $.cookie("text");
        var wind = $.cookie("wind");
        var humidity = $.cookie("humidity");
        var icon = $.cookie("icon");
        var time = $.cookie("time");
        showWeather(temp, text, wind, humidity, icon, time);
    }
}
function getWeahter(lat, lon)
{
    $.ajax({
        url: 'http://api.openweathermap.org/data/2.5/weather?lat='+ lat +'&lon='+ lon +'&units=metric&appid=cb9c29798eded5144a008943f54fbd89',
        error: function(){ return false; },
        success: function(data) {
            console.log(data);
            var date = new Date();
            date.setTime(date.getTime() + (1 * 60 * 60 * 1000));
            var time =  convertTime(date);
            $.cookie("time", time , { expires: date })
            var temp = Math.round(data.main.temp);
            $.cookie("temp", temp , { expires: date })
            var text = data.weather[0].main;
            $.cookie("text", text , { expires: date })
            var wind = data.wind.speed;
            $.cookie("wind", wind , { expires: date })
            var humidity = data.main.humidity;
            $.cookie("humidity", humidity , { expires: date })
            var icon = data.weather[0].icon;
            $.cookie("icon", icon , { expires: date })
            showWeather(temp, text, wind, humidity, icon, time);
        }
      });
      return true;
}
function getCurrency()
{
    $.ajax({
        url: 'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5',
        error: function(){ return false; },
        success: function(data) {
            console.log(data);
            var ub = Math.round((data[0].buy)*100)/100;
            var us = Math.round((data[0].sale)*100)/100
            var eb = Math.round((data[1].buy)*100)/100;
            var es = Math.round((data[1].sale)*100)/100;
            showCurrency(ub, us, eb, es);
        }
      });
      return true;
}
function showWeather(temp, text, wind, humidity, icon, time)
{
    $("#temp").text(temp);
    $("#weather-main").text(text);
    $("#wind").text(wind);
    $("#humidity").text(humidity);
    $("#weather-img").attr("src", "img/weather/"+ icon + ".png");
    $("#time-weather").text(time);
    $(".weather .loader").addClass("show");
}
function showCurrency(usdBuy, usdSale, eurBuy, eurSale)
{
    $("#USD-buy").text(usdBuy);
    $("#EUR-buy").text(eurBuy);
    $("#USD-sale").text(usdSale);
    $("#EUR-sale").text(eurSale);
}
function convertTime (date) 
{
    var hours = date.getHours();
    var minutes = date.getMinutes();

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    return hours+':'+minutes;
}
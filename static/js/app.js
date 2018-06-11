"use strict";

$(function() {
  if ($.cookie("city") == null) {
    document.cookie = "city=Харьков;";
    document.cookie = "lat=49.994507;";
    document.cookie = "lon=36.1457436;";
    document.cookie = "check=0;";
  }
  var curDate = new Date();
  $("#date").text(formatDate(curDate));
  var city = $.cookie("city");
  $("#cityHead").text(city);
  $("#cityHeadMobile").text(city);
  $(window).scroll(function() {
    if ($(this).scrollTop() >= 44) {
      $("header").addClass("fixed");
    } else {
      $("header").removeClass("fixed");
    }
  });
  let menuActive = false;
  $("#menu").on("click", function() {
    if (menuActive) {
      $("#menu i").removeClass("fa-arrow-right");
      $("#menu i").addClass("fa-bars");
      $("section, footer").removeClass("body-fixed");
      $(".menu").removeClass("menu-active");
    } else {
      $("#menu i").removeClass("fa-bars");
      $("#menu i").addClass("fa-arrow-right");
      $("section, footer").addClass("body-fixed");
      $(".menu").addClass("menu-active");
    }
    menuActive = !menuActive;
  });
});

function formatDate(date) {
  var dd = date.getDate();
  if (dd < 10) dd = "0" + dd;

  var mm = date.getMonth() + 1;
  if (mm < 10) mm = "0" + mm;

  var yy = date.getFullYear();

  return dd + "." + mm + "." + yy;
}

if (localStorage.getItem("token")) {
  const email = localStorage.getItem("email");
  const loginButtons = document.querySelector(".login-buttons");
  if (loginButtons) {
    loginButtons.innerHTML = `<div class="logout-block" style="width: 100%; height: 43px; background: white; text-align: center; font-size: 14px">${email}<br>(<a href="#" style="color: #20343a; cursor: pointer;" onclick="logout()">Logout</a>)</div>`;
  }
}

function logout() {
  localStorage.clear("email");
  localStorage.clear("token");

  window.location.reload();
}

if (localStorage.getItem("type") === "admin") {
  const adminMenu = document.createElement("li");
  adminMenu.innerHTML = '<a href="/add-event/">Add event</a>';
  document.querySelector("ul.d-none").appendChild(adminMenu);
}

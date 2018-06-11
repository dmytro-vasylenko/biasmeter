window.onload = function() {
  const eventTemplate = document.getElementById("event-template");
  const newsTemplate = document.getElementById("news-template");

  fetch("/events-list")
    .then(res => res.json())
    .then(events => {
      events.forEach(event => {
        const eventNode = eventTemplate.content.cloneNode(true);
        const newsNode = newsTemplate.content.cloneNode(true);

        eventNode.querySelector("h3").innerText = event.title;
        eventNode.querySelector(".desc p").innerText = event.description;
        eventNode.querySelector(".date span").innerText = event.date;
        eventNode.querySelector(".category span").innerText = event.category;
        eventNode.querySelector("a").href = `/events/${event._id}`;
        eventNode.querySelector(".img").style.backgroundImage = `url("${event.image}")`;

        newsNode.querySelector("p").innerText = event.title;
        newsNode.querySelector(".category").innerText = event.category;
        newsNode.querySelector("a").href = `/events/${event._id}`;

        eventTemplate.parentNode.appendChild(eventNode);
        newsTemplate.parentNode.appendChild(newsNode);
      });
      const about = document.querySelector(".about");
      about.querySelector(".img").style.backgroundImage = `url("${events[0].image}")`;
      about.querySelector("h2").innerTexr = events[0].title;
      about.querySelector(".category").innerText = events[0].category;
      about.querySelector(".description").innerText = events[0].description;
      about.querySelector("a").href = `/events/${events[0]._id}`;
    });

  const findInput = document.querySelector(".search input");

  findInput.oninput = event => {
    const { value } = document.querySelector(".search input");

    [...document.querySelectorAll(".news")].forEach(news => {
      const title = news.querySelector("h3").innerText;
      const description = news.querySelector(".desc p").innerText;
      const category = news.querySelector(".category span").innerText;

      if (
        title.toLowerCase().includes(value.toLowerCase()) ||
        description.toLowerCase().includes(value.toLowerCase()) ||
        category.toLowerCase().includes(value.toLowerCase())
      ) {
        news.parentNode.style.display = "block";
      } else {
        news.parentNode.style.display = "none";
      }
    });
  };
};

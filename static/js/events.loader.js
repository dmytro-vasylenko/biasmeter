window.onload = function() {
  const eventTemplate = document.getElementById("event-template");

  fetch("/events-list")
    .then(res => res.json())
    .then(events =>
      events.forEach(event => {
        const eventNode = eventTemplate.content.cloneNode(true);
        eventNode.querySelector("h3").innerText = event.title;
        eventNode.querySelector(".desc p").innerText = event.description;
        eventNode.querySelector(".date span").innerText = event.date;
        eventNode.querySelector(".category span").innerText = event.category;
        eventNode.querySelector("a").href = `/events/${event._id}`;
        eventNode.querySelector(".img").style.backgroundImage = `url("${event.image}")`;

        eventTemplate.parentNode.appendChild(eventNode);
      })
    );

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

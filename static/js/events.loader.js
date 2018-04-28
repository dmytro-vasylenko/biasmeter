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
};

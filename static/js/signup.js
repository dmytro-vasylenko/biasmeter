window.onload = () => {
  document.getElementById("button-register").addEventListener("click", event => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("/sign-up", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    })
      .then(res => res.json())
      .then(res => {
        if (res.status !== "OK") {
          return alert(res.description);
        }

        window.location = "/";
      });
  });
};

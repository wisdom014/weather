const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".section .cities");
/*SUBSCRIBE HERE FOR API KEY: https://home.openweathermap.org/users/sign_up*/
const apiKey = "57440aa98219eec90df63aaff9e52ac2";

form.addEventListener("submit", e => {
 e.preventDefault();
 let inputVal = input.value;

 //check if there's already a city
 const listItems = list.querySelectorAll(".section .city");
 const listItemsArray = Array.from(listItems);

 if (listItemsArray.length > 0) {
  const filteredArray = listItemsArray.filter(el => {
   let content = "";
   //athens,gr
   if (inputVal.includes(",")) {
    if (inputVal.split(",")[1].length > 2) {
     inputVal = inputVal.split(",")[0];
     content = el
      .querySelector(".city-name span")
      .textContent.toLowerCase();
    } else {
     content = el.querySelector(".city-name").dataset.name.toLowerCase();
    }
   } else {
    //athens
    content = el.querySelector(".city-name span").textContent.toLowerCase();
   }
   return content == inputVal.toLowerCase();
  });

  if (filteredArray.length > 0) {
   msg.textContent = `Weather ☁️ for ${filteredArray[0].querySelector(".city-name span").textContent
    } is already known be more specific by providing the exact location`;
   form.reset();
   input.focus();
   return;
  }
 }

 //ajax here
 const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

 fetch(url)
  .then(response => response.json())
  .then(data => {
   const { main, name, sys, weather } = data;
   const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0]["icon"]
    }.svg`;
   const li = document.createElement("li");
   li.classList.add("city");
   const markup = `
        <h2 class="city-name" data-name="${name},${sys.country}">
          <span>${name}</span>
          <sup>${sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
        <figure>
        <img class="city-icon" src="${icon}" alt="${weather[0]["description"]
    }">
          <figcaption>${weather[0]["description"]}</figcaption>
          </figure>
          <hr />
          <figcaption class="logs">Sunset: ${new Date(sys.sunset * 1000).toLocaleTimeString()}</figcaption>
          <figcaption class="logs">Sunrise: ${new Date(sys.sunrise * 1000).toLocaleTimeString()}</figcaption>
          <figcaption class="logs">Pressure: ${main.pressure} hPa</figcaption>
          <figcaption class="logs">Humidity: ${data.main.humidity}%</figcaption>
          <figcaption class="logs">Wind speed: ${data.wind.speed} m/s</figcaption>
          <figcaption class="logs">Log: ${data.coord.lon}</figcaption>
          <figcaption class="logs">lat: ${data.coord.lat}</figcaption>
      `;
   li.innerHTML = markup;
   list.appendChild(li);
   console.log(data)
  })
  .catch(() => {
   msg.textContent = `${inputVal} doesn't exist search for a real city 👍`;
  });

 msg.textContent = "";
 form.reset();
 input.focus();
});

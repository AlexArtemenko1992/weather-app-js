import "../css/style.css";
import "bootstrap/dist/css/bootstrap.min.css";

const container = document.querySelector(".container");
const bgImage = document.querySelector(".main-wrapper");
const search = document.querySelector("input");
const city = document.querySelector(".city");
const date = document.querySelector(".date");
const temp = document.querySelector(".temp");
const weather = document.querySelector(".weather");

const apiConfig = {
  url: "https://api.openweathermap.org/data/2.5/weather",
  apiKey: "a95409d6027617442819e0761ceb76c1",
};

document.addEventListener("DOMContentLoaded", () => {
  getCurrentData("Boryspol");
});

async function fetchApi(query = "Kiev") {
  try {
    const response = await fetch(
      `${apiConfig.url}?q=${query}&APPID=${apiConfig.apiKey}`
    );
    if (!response.ok) {
      return Promise.reject(`Error. Status code: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    return Promise.reject(error);
  }
}

function getCurrentData(val) {
  fetchApi(val)
    .then((res) => editHtml(res))
    .catch((err) => showError(err));
}

function editHtml({
  name,
  sys: { country },
  main: { temp: temperature },
  weather: currentWeather,
}) {
  const now = new Date();
  city.innerHTML = `<i class="far fa-building"></i> ${name}, ${country}`;
  date.innerHTML = `<i class="far fa-clock"></i> ${setCurrentDate(now)}`;
  temp.innerHTML = `
  <i class="fas fa-thermometer-empty" />
  ${Math.round(temperature) - 273}<span>ºC</span>
  `;
  weather.innerHTML = `<i class="fas fa-cloud"></i> ${currentWeather[0].main}`;
  const value = Math.round(temperature) - 273;
  setBackgroundImage(value);
}

search.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    const city = e.target.value.trim();
    getCurrentData(city);
    e.target.value = "";
  }
});

function setCurrentDate(now) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "Semptember",
    "October",
    "November",
    "December",
  ];
  const days = [
    "Sundey",
    "Mondey",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const day = days[now.getDay()];
  const month = months[now.getMonth()];
  const date = now.getDate();
  const year = now.getFullYear();

  return `${day} ${date} ${month} ${year}`;
}

function setBackgroundImage(val) {
  if (val >= 20) {
    return (bgImage.style.backgroundImage =
      "url('https://images.unsplash.com/photo-1550454954-05bde9dc50c5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80')");
  } else if (val < 20 && val >= 10) {
    return (bgImage.style.backgroundImage = `url('https://images.unsplash.com/photo-1579785628118-7f3438975698?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80')`);
  } else if (val < 10) {
    return (bgImage.style.backgroundImage = `url('https://images.unsplash.com/photo-1459902552792-28b7925b06c2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80')`);
  }
}

function showError(err) {
  const error = `<div class="alert alert-danger" role="alert" style="z-index: 99; position: absolute; top: 20px; right: 20px; font-size: 13px;">
            ${err}. City name must be capitalized and in English
          </div>`;
  container.insertAdjacentHTML("afterbegin", error);

  setTimeout(() => {
    container.firstElementChild.remove();
  }, 1500);
}

init();

function init() {
    const searchButton = document.querySelector('button');
    searchButton.onclick = getCityDataAndUpdateUI;
}

function getCityDataAndUpdateUI() {
    const input = document.querySelector('input');
    if (!input.value) return;
    const city = input.value;
    const apiKey = "f9dfa73107d68617b635406533045a9b";
    const currentURL = `https://api.openweathermap.org/data/2.5/weather`
        + `?q=${city}&appid=${apiKey}`
    fetch(currentURL).then(response => {
        if (!response.ok) {
            throw new Error(`${response.status} - ${response.statusText}`)
        }
        return response.json();
    }).then(currentCityData => {
        const latitude = currentCityData.coord.lat;
        const longitude = currentCityData.coord.lon;
        const oneCallURL = `https://api.openweathermap.org/data/2.5/onecall`
            + `?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`;
        return oneCallURL;
    }).then(oneCallURL => {
        fetch(oneCallURL).then(response => {
            return response.json();
        }).then(oneCallCityData => {
            updateUI(oneCallCityData);
        })
    }).catch(error => {
        alert(error);
    });
}

function updateUI(cityData) {
    console.log(cityData);
    const currentDataDiv = document.querySelector('#current-data');
    const city = currentDataDiv.querySelector('.city');
    city.textContent = cityData.timezone.split('/')[1];
    const date = currentDataDiv.querySelector('.date');
    date.textContent = ` (${moment().format('MMM D, YYYY')})`;
    const uvIndex = currentDataDiv.querySelector('.uv-index');
    uvIndex.textContent = cityData.current.uvi;
    const temp = currentDataDiv.querySelector('.temp');
    temp.textContent = cityData.current.temp + " °F";
    const wind = currentDataDiv.querySelector('.wind');
    wind.textContent = cityData.current.wind_speed + " MPH"
    const humidity = currentDataDiv.querySelector('.humidity');
    humidity.textContent = cityData.current.humidity + " %";
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        updateCard(card, cityData, index);
    });
}

function updateCard(div, data, index) {
    const date = div.querySelector('.date');
    date.textContent = moment().add(index + 1, "days").format('MMM D, YYYY');
    const temp = div.querySelector('.temp');
    temp.textContent = data.daily[index].temp.max + " °F";
    const wind = div.querySelector('.wind');
    wind.textContent = data.daily[index].wind_speed + " MPH"
    const humidity = div.querySelector('.humidity');
    humidity.textContent = data.daily[index].humidity + " %";
}
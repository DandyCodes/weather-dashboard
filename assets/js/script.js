init();

function init() {
    const searchButton = document.querySelector('button');
    searchButton.onclick = getCityDataAndUpdateUI;
    loadHistoricalSearches();
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
            + `?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
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
    const dataSection = document.querySelector('#data-section');
    dataSection.removeAttribute('hidden');
    updateCurrentData(cityData);
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        updateCard(card, cityData, index);
    });
    const searchSection = document.querySelector('#search-section');
    const historicalSearchButtons = searchSection.querySelectorAll('button');
    const cityName = cityData.timezone.split('/')[1].replace("_", " ");
    let historicalSearches = [];
    Array.from(historicalSearchButtons).forEach(button => {
        if (button.textContent === "Search") {
            return;
        }
        historicalSearches.push(button.textContent);
    });
    if (historicalSearches.includes(cityName)) return;
    historicalSearches.push(cityName);
    localStorage.setItem('historicalSearches', JSON.stringify(historicalSearches));
    const historyButton = document.createElement('button');
    historyButton.textContent = cityData.timezone.split('/')[1].replace("_", " ");
    historyButton.onclick = historicalSearch;
    searchSection.append(historyButton);
    

    function updateCurrentData(cityData) {
        const currentDataDiv = document.querySelector('#current-data');
        const city = currentDataDiv.querySelector('.city');
        city.textContent = cityData.timezone.split('/')[1].replace("_", " ");
        const date = currentDataDiv.querySelector('.date');
        date.textContent = ` (${moment().format('MMM D, YYYY')})`;
        const img = currentDataDiv.querySelector('img');
        img.src = getWeatherIcon(cityData.current.weather[0].icon);
        img.alt = cityData.current.weather[0].description;
        img.title = cityData.current.weather[0].description;
        const temp = currentDataDiv.querySelector('.temp');
        temp.textContent = cityData.current.temp + " °C";
        const wind = currentDataDiv.querySelector('.wind');
        wind.textContent = cityData.current.wind_speed + " km/h";
        const humidity = currentDataDiv.querySelector('.humidity');
        humidity.textContent = cityData.current.humidity + " %";
        const uvIndexSpan = currentDataDiv.querySelector('.uv-index');
        const uvIndex = cityData.current.uvi;
        uvIndexSpan.textContent = uvIndex;
        uvIndexSpan.style.backgroundColor = "green";
        if (uvIndex > 2) {
            uvIndexSpan.style.backgroundColor = "orange";
        }
        if (uvIndex > 5) {
            uvIndexSpan.style.backgroundColor = "red";
        }
    }

    function updateCard(div, data, index) {
        const date = div.querySelector('.date');
        date.textContent = moment().add(index + 1, "days").format('MMM D, YYYY');
        const img = div.querySelector('img');
        img.src = getWeatherIcon(data.daily[index].weather[0].icon);
        img.alt = data.daily[index].weather[0].description;
        img.title = data.daily[index].weather[0].description;
        const temp = div.querySelector('.temp');
        temp.textContent = data.daily[index].temp.max + " °C";
        const wind = div.querySelector('.wind');
        wind.textContent = data.daily[index].wind_speed + " km/h"
        const humidity = div.querySelector('.humidity');
        humidity.textContent = data.daily[index].humidity + " %";
    }
}

function getWeatherIcon(icon) {
    return `http://openweathermap.org/img/wn/${icon}@2x.png`;
}

function historicalSearch(event) {
    const input = document.querySelector('input');
    input.value = event.target.textContent;
    getCityDataAndUpdateUI();
}

function loadHistoricalSearches() {
    const historicalSearches = JSON.parse(localStorage.getItem('historicalSearches'));
    if (!historicalSearches) return;
    console.log(historicalSearches);
    const searchSection = document.querySelector('#search-section');
    historicalSearches.forEach(search => {
        const newButton = document.createElement('button');
        newButton.textContent = search;
        newButton.onclick = historicalSearch;
        searchSection.append(newButton);
    });
}
init();

function init() {
    displaySearches(getSearches());
    document.querySelector('#search-button').onclick = searchForCity;
}

function getSearches() {
    const searches = JSON.parse(localStorage.getItem('searches'));
    return searches ? searches : [];
}

function displaySearches(searches) {
    const searchHistory = document.querySelector('#search-history');
    searchHistory.innerHTML = '';
    searches.forEach(search => {
        const button = document.createElement('button');
        button.textContent = search;
        button.onclick = event => {
            const input = document.querySelector('#search-input');
            input.value = event.target.textContent;
            searchForCity();
        };
        searchHistory.append(button);
    });
}

function searchForCity() {
    const city = document.querySelector('#search-input').value;
    if (!city) return;
    const apiKey = "f9dfa73107d68617b635406533045a9b";
    const currentURL = `https://api.openweathermap.org/data/2.5/weather`
        + `?q=${city}&appid=${apiKey}`
    fetch(currentURL).then(response => {
        if (!response.ok) {
            throw new Error(`${response.status} - ${response.statusText}`)
        }
        return response.json();
    }).then(currentCityData => {
        document.querySelector('#city').textContent = `${currentCityData.name}: `;
        const latitude = currentCityData.coord.lat;
        const longitude = currentCityData.coord.lon;
        const oneCallURL = `https://api.openweathermap.org/data/2.5/onecall`
            + `?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
        return oneCallURL;
    }).then(oneCallURL => {
        fetch(oneCallURL).then(response => {
            return response.json();
        }).then(oneCallCityData => {
            updateData(oneCallCityData);
        })
    }).catch(error => {
        alert(error);
    });
}

function updateData(cityData) {
    document.querySelector('#data-section').removeAttribute('hidden');
    updateCurrentUVI(cityData.current.uvi);
    document.querySelectorAll('.card').forEach((card, index) => {
        const data = index > 0 ? cityData.daily[index] : cityData.current;
        updateCard(card, data);
    });
    updateSearchHistory();
}

function updateCurrentUVI(uvi) {
    const span = document.querySelector('#uvi');
    span.textContent = uvi;
    span.style.backgroundColor = uvi < 3 ? "green" : uvi < 6 ? "orange" : "red";
}

function updateCard(card, data) {
    const date = card.querySelector('.date');
    date.textContent = moment.unix(data.dt).utc().format('MMM D, YYYY');
    const img = card.querySelector('img');
    img.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    img.alt = data.weather[0].description;
    img.title = data.weather[0].description;
    const temp = card.querySelector('.temp');
    temp.textContent = data.temp.max ? data.temp.max : data.temp;
    temp.textContent += " °C";
    const wind = card.querySelector('.wind');
    wind.textContent = data.wind_speed + " km/h"
    const humidity = card.querySelector('.humidity');
    humidity.textContent = data.humidity + " %";
}

function updateSearchHistory() {
    const searches = getSearches();
    const city = document.querySelector('#city').textContent.replace(": ", "");
    if (searches.includes(city)) return;
    searches.push(city);
    localStorage.setItem('searches', JSON.stringify(searches));
    displaySearches(searches);
}
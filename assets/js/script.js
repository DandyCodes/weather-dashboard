const apiKey = "f9dfa73107d68617b635406533045a9b";
init();

function init() {
    const searchButton = document.querySelector('button');
    searchButton.onclick = getCityDataAndUpdateUI;
}

function getCityDataAndUpdateUI() {
    const input = document.querySelector('input');
    if (!input.value) return;
    const city = input.value;
    const currentURL = `https://api.openweathermap.org/data/2.5/weather`
        + `?q=${city}&appid=${apiKey}&units=imperial`
    fetch(currentURL).then((response) => {
        return response.json();
    }).then((currentCityData) => {
        const latitude = currentCityData.coord.lat;
        const longitude = currentCityData.coord.lon;
        const oneCallURL = `https://api.openweathermap.org/data/2.5/onecall`
            + `?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
        return oneCallURL;
    }).then((oneCallURL) => {
        fetch(oneCallURL).then((response) => {
            return response.json();
        }).then((oneCallCityData) => {
            updateUI(oneCallCityData);
        })
    });
}

function updateUI(cityData) {

}
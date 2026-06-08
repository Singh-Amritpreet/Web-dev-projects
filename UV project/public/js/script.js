let lat;
let lng;

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
}

async function successFunction(position) {
  try {
    lat = position.coords.latitude;
    lng = position.coords.longitude;

    const response = await fetch("/location", {  
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lat, lng })
    });

    const result = await response.json();
    console.log(result);

    document.querySelector("body").innerHTML = `<p>forecast = ${result.content.forecast}</p>
    <p>lat = ${result.content.lat}</p>
    <p>lng = ${result.content.lng}</p>`;
    
  } catch (error) {
    console.error("Failed to send location:", error.message);
  }
}

function errorFunction(error) {
  console.log(error.code, error.message);
}
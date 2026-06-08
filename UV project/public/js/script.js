if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
}

async function successFunction(position) {
  try {
    let lat = position.coords.latitude;
    let lng = position.coords.longitude;

    const response = await fetch("/location", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lat, lng })
    });

    const result = await response.json();
    console.log(result);

    let uv = result.content.currentUv;
    let maxUv = result.content.maxUV;
    let suggestion;

    if (uv >= 8 && maxUv >= 10) {
      suggestion = "Very high UV now and extreme levels expected today. Limit sun exposure.";
    }
    else if (uv >= 6 && maxUv >= 8) {
      suggestion = "High UV now and very high levels expected later. Wear sunscreen and seek shade.";
    }
    else if (uv >= 3 && maxUv >= 8) {
      suggestion = "Moderate UV currently, but strong UV is expected later today.";
    }
    else if (uv < 3 && maxUv >= 8) {
      suggestion = "Low UV right now. Good time to be outside before UV peaks later.";
    }
    else if (uv >= 3 && maxUv < 6) {
      suggestion = "Moderate UV now, but today's peak will remain manageable.";
    }
    else if (uv < 3 && maxUv < 6) {
      suggestion = "Low UV now and throughout the day.";
    }
    else {
      suggestion = "Check UV conditions before extended outdoor activities.";
    }

    if (result.success) {
      document.querySelector("#status").innerHTML = "Using your current location";
      document.querySelector("#current-uv").innerHTML = uv;
      document.querySelector("#max-uv").innerHTML = maxUv;
      document.querySelector("#suggestion").innerHTML = suggestion;
    } else {
      document.querySelector("#status").innerHTML = result.message;
    }


  } catch (error) {
    document.querySelector("#status").innerHTML = "Failed to send location";
    console.error("Failed to send location:", error.message);
  }
}

function errorFunction(error) {
  console.log(error.code, error.message);
}
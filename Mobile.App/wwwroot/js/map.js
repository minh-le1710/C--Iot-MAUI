window.mapUtil = (function () {
  let map, marker;

  function init(id, lat, lon, zoom) {
    if (!L) throw new Error("Leaflet not loaded");
    map = L.map(id).setView([lat, lon], zoom || 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);
    marker = L.marker([lat, lon]).addTo(map);
  }

  function setMarker(lat, lon, text) {
    if (!map) return;
    if (marker) map.removeLayer(marker);
    marker = L.marker([lat, lon]).addTo(map);
    if (text) marker.bindPopup(text).openPopup();
    map.setView([lat, lon]);
  }

  function getBrowserLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) return reject("Geolocation not supported");
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        (err) => reject(err.message || "Geolocation error"),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  }

  return { init, setMarker, getBrowserLocation };
})();

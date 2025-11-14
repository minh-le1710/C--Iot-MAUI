window.geo = {
  getPosition: () => new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Trình duyệt không hỗ trợ geolocation");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      p => resolve({ lat: p.coords.latitude, lon: p.coords.longitude }),
      e => reject(e.message),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  })
};

function ensurePaho() {
  if (typeof Paho === "undefined" || !Paho.MQTT || !Paho.MQTT.Client) {
    throw new Error("Paho MQTT not loaded");
  }
}

window.aioMqtt = (function(){
  let client = null;
  let dotnetRef = null;

  function init(dotnetObjectRef){ dotnetRef = dotnetObjectRef; }

  function connect({ username, key, clientId }){
    ensurePaho();
    const host = "io.adafruit.com";
    const port = 443;       // WS TLS
    const path = "/mqtt";   // Adafruit IO

    client = new Paho.MQTT.Client(host, port, path, clientId || ("web-"+Date.now()));

    client.onConnectionLost = (err) => {
      if (dotnetRef) dotnetRef.invokeMethodAsync('OnMqttStatus', false, err?.errorMessage || 'lost');
    };
    client.onMessageArrived = (message) => {
      if (!dotnetRef) return;
      dotnetRef.invokeMethodAsync('OnMqttMessage', message.destinationName, message.payloadString);
    };

    client.connect({
      useSSL: true,
      userName: username,
      password: key,
      timeout: 10,
      onSuccess: () => dotnetRef?.invokeMethodAsync('OnMqttStatus', true, 'connected'),
      onFailure: (err) => dotnetRef?.invokeMethodAsync('OnMqttStatus', false, err?.errorMessage || 'failed')
    });
  }

  function subscribe(topic){
    if (!client) throw new Error('MQTT not connected');
    client.subscribe(topic, { qos: 0 });
  }

  return { init, connect, subscribe };
})();

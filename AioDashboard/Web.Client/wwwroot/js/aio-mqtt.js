window.aioMqtt = (function(){
  let client = null;
  let dotnetRef = null;

  function init(dotnetObjectRef){
    dotnetRef = dotnetObjectRef;
  }

  function connect({ username, key, clientId }){
    const host = "io.adafruit.com";
    const port = 8080;         // WebSocket TLS
    const path = "/mqtt";     // required by Adafruit IO

    client = new Paho.MQTT.Client(host, port, path, clientId || ("web-"+Date.now()));

    client.onConnectionLost = (err) => {
      if (dotnetRef) dotnetRef.invokeMethodAsync('OnMqttStatus', false, err?.errorMessage || 'lost');
    };

    client.onMessageArrived = (message) => {
      if (!dotnetRef) return;
      const topic = message.destinationName;
      const payload = message.payloadString;
      dotnetRef.invokeMethodAsync('OnMqttMessage', topic, payload);
    };

    client.connect({
      useSSL: true,
      userName: username,
      password: key,
      timeout: 10,
      onSuccess: () => {
        if (dotnetRef) dotnetRef.invokeMethodAsync('OnMqttStatus', true, 'connected');
      },
      onFailure: (err) => {
        if (dotnetRef) dotnetRef.invokeMethodAsync('OnMqttStatus', false, err?.errorMessage || 'failed');
      }
    });
  }

  function subscribe(topic){
    if (!client) throw new Error('MQTT not connected');
    client.subscribe(topic, { qos: 0 });
  }

  function publish(topic, payload){
    if (!client) throw new Error('MQTT not connected');
    const msg = new Paho.MQTT.Message(payload);
    msg.destinationName = topic;
    client.send(msg);
  }

  return { init, connect, subscribe, publish };
})();

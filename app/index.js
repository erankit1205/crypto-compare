const apiKey = "abae091077837a897a41dff28e2f52b883bcc13f88a18c36ff68c91b4b4f1633";
const WebSocket = require('ws');
const moment = require('moment');
const axios = require('axios');
const ccStreamer = new WebSocket('wss://streamer.cryptocompare.com/v2?api_key=' + apiKey);

const curTimeStamp = Math.round(Date.now() / 1000);
const curMin = moment().format('mm');

let webSocketData = [];
ccStreamer.on('open', function open() {
    var subRequest = {
        "action": "SubAdd",
        "subs": ["0~Coinbase~BTC~USD"]
    };
    ccStreamer.send(JSON.stringify(subRequest));
});

ccStreamer.on('message', function incoming(data) {
  webSocketData.push(JSON.parse(data));
});

setTimeout(async () => {
  ccStreamer.close();

  const volumeFromWebSocket = getWebSocketVolume(webSocketData, curMin);
  const volumeFromApi = await getApiCallVolume();
  const response  = {
    minuteTimeStamp: curTimeStamp,
    HumanReadable: moment(new Date(curTimeStamp * 1000)).format(),
    volumeFromWebSocket,
    volumeFromApi,
    diff: volumeFromApi - volumeFromWebSocket
  }
  console.log("response", response);

}, 60000);

const getApiCallVolume = async () => {
  const toTime = Math.round(Date.now() / 1000);
  const volumeFromApi = await axios.get(`https://min-api.cryptocompare.com/data/v2/histominute?apikey=${apiKey}&fsym=BTC&tsym=USD&aggregate=1&limit=1&toTs=${toTime}`)
  .then(response => {
    const apiData = response.data.Data.Data.filter(data => moment(new Date(data.time * 1000)).format('mm') === curMin);
    return (apiData[0].volumeto - apiData[0].volumefrom);
  })
  .catch(err => {
    console.log("error", err);
  });
  return volumeFromApi;
}

const getWebSocketVolume = (socketData, min) => {
  socketData.splice(0,1);
  filteredWebSocketData = socketData.filter(data => moment(new Date(data.RTS * 1000)).format('mm') == min);
  return filteredWebSocketData.reduce((total, data) => {
    return total += data.Q;
  }, 0)
}

exports.getWebSocketVolume = getWebSocketVolume;
const fetch = require('node-fetch');

async function getCarfax() {
  const res = await fetch('https://www.carfax.com/vrs', {
    headers: {
      accept: '*/*',
      'accept-language': 'en-US,en;q=0.9,la;q=0.8',
      'content-type': 'application/json',
      'sec-ch-ua':
        '"Google Chrome";v="95", "Chromium";v="95", ";Not A Brand";v="99"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
    },
    referrer: 'https://static.carfax.com/',
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: '{"operationName":null,"variables":{},"query":"{\\n  getYMMs(make: \\"Alfa Romeo\\", model: \\"4C\\") {\\n    year\\n    make\\n    model\\n    __typename\\n  }\\n}\\n"}',
    method: 'POST',
    mode: 'cors',
    credentials: 'omit',
  });

  const json = await res.json();
  console.log('this is the json 🦅🦅🦅🦅 : ', json);
  console.log('HERE IS NEXT 🪄🪄🪄🪄🪄 : ');
  console.log(
    'this is the json.data.getYMMs[0] 🏷️🏷️🏷️🏷️🏷️: ',
    json.data.getYMMs[0]
  );
  console.log(
    'this is the json.data.getYMMs 🧩🧩🧩🧩🧩🧩: ',
    json.data.getYMMs
  );
  console.log('this is the json.data 🤹‍♂️🤹‍♂️🤹‍♂️🤹‍♂️ : ', json.data);
  // return json;
}
getCarfax();

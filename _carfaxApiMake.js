//! We need to loop through every carfax make and model and run nested async api post requests
//! to then get every single possible carfax make, model and year
//! which we will then utilize to make the exact same carfax api call on ShopCarX.com !
const fetch = require('node-fetch');

// const car_makeName = 'Alfa Romeo';

// const make_body = (make) =>
//   `{"operationName":null,"variables":{},"query":"{\\n  getMakeModels(make: \\"${make}\\") {\\n    make\\n    model\\n    uisModelUrlName\\n    __typename\\n  }\\n}\\n"}`;

// const make_dynamicQuery = '{"query":"{getMakeModels(make: "Alfa Romeo")}"}';

async function getModels(make) {
  const make_body = `{"operationName":null,"variables":{},"query":"{\\n  getMakeModels(make: \\"${make}\\") {\\n    make\\n    model\\n    uisModelUrlName\\n    __typename\\n  }\\n}\\n"}`;

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
    body: make_body,
    // body: make_dynamicQuery,
    method: 'POST',
    mode: 'cors',
    credentials: 'omit',
  });
  const json = await res.json();
  // console.log('this is the json 🦅🦅🦅🦅: ', json);
  // console.log('HERE IS NEXT 🪄🪄🪄🪄🪄: ');
  // console.log(
  //   'this is the json.data.getMakeModels[0] 🏷️🏷️🏷️🏷️🏷️: ',
  //   json.data.getMakeModels[0]
  // );
  // console.log(
  //   'this is the json.data.getMakeModels 🧩🧩🧩🧩🧩🧩: ',
  //   json.data.getMakeModels
  // );
  // console.log('this is the json.data 🤹‍♂️🤹‍♂️🤹‍♂️🤹‍♂️: ', json.data);
  // return json;
  return json.data.getMakeModels.map(({ model }) => model);
}
module.exports = { getModels };

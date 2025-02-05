import axios from "axios";
const https = require("https");

export interface GlobalServices {
  findAll: () => Promise<any>;
}

const GlobalServices = (): GlobalServices => {
  return {
    findAll: async () => {
      //   const url = "https://opend.data.go.th/get-ckan/datastore_search";
      //   const headers = {
      //     "api-key": "AVoPPhL8ewt1jN6IYy9aaK5qIr45c5iy",
      //   };
      //   const params = {
      //     resource_id: "c5865647-1b3f-4da7-bf67-c0a7bab0c26c",
      //   };
      //   const agent = new https.Agent({
      //     rejectUnauthorized: false,
      //   });
      //   return await axios
      //     .get(url, {
      //       headers: headers,
      //       params: params,
      //       httpsAgent: agent,
      //     })
      //     .then(function (response: any) {
      //       console.log(response.data.result.total);
      //     })
      //     .catch(function (error: any) {
      //       console.error(error);
      //     });
      const axios = require("axios");

      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: "https://opend.data.go.th/get-ckan/datastore_search?resource_id=c5865647-1b3f-4da7-bf67-c0a7bab0c26c",
        headers: {
          "api-key": "AVoPPhL8ewt1jN6IYy9aaK5qIr45c5iy",
        },
      };

      axios
        .request(config)
        .then((response: any) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error: any) => {
          console.log(error);
        });
    },
  };
};
export default GlobalServices;

import { Representation, SharingRelay, SharableApp, IFramePhoneUp, Text, Jpeg } from "cc-sharing";
declare const require:(name:string) => any;
const iFramePhone = require("iframe-phone");

export const iframeConnect = function() {
  const app:SharableApp = {
    // Describe the application:
    application: {
      launchUrl: "http://127.0.0.1:8080/src/demo/iframe.html",
      name: "demo iframe app"
    },
    // Provide a callback that returns a promise that resolves to a list of
    // data Represenations.
    getDataFunc: (context) => {
      // 1. Construct a unique url from the sharing context:
      const dataUrl = `${context.group.id}-${context.offering.id}-${context.user.id}`;
      // 2. The promise constructs a list of data Represnetations:
      return new Promise((resolve, reject) => {
        resolve([
          {
            type: Text,
            dataUrl: `this is the iframe response at ${new Date()}`
          }
        ]);
      });
    }
  };
  const sharePhone = new SharingRelay({app:app});
};
iframeConnect();

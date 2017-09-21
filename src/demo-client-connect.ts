import {
  Representation,
  SharableApp,
  IFramePhoneUp,
  SharingRelay,
  Text,
  Jpeg,
 } from "cc-sharing";

export const demoClientConnect = function(callback:Function) {
  const app:SharableApp = {
    // Describe the application:
    application: {
      launchUrl: "http://127.0.0.1:8080/src/demo/client.html",
      name: "demo app"
    },
    // Provide a callback that returns a promise that resolves to a list of
    // data Represenations.
    getDataFunc: (context) => {
      // 1. Construct a unique url from the sharing context:
      const dataUrl = `${context.group.id}-${context.offering.id}:: ${callback()}`;
      // 2. The promise constructs a list of data Represnetations:
      return new Promise((resolve, reject) => {
        resolve([
          {
            type: Text,
            dataUrl: dataUrl
          },
          {
            type: Jpeg,
            dataUrl: "https://pbs.twimg.com/profile_images/447374371917922304/P4BzupWu.jpeg"
          }
        ]);
      });
    }
  };
  return new SharingRelay({app: app});
};

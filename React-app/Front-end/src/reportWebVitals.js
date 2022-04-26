//https://deepsource.io/gl/deepsourcelabs/demo-javascript/run/9370a6aa-6cba-4925-8ef5-1e46642c26f7/javascript/JS-0259/
//Code used from the above link as a way to report web vitals
const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;

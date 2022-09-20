function notifyAuthentication (cookies) {
	chrome.storage.local.get('accessToken', function(result) {
		let accessToken = result.accessToken;
		let nameCookie = cookies.find(cookie => cookie.name === 'name');
		let authTokenCookie = cookies.find(cookie => cookie.name === 'auth-token');

		let innerText = '';
		if (!accessToken || !cookies || !nameCookie || !authTokenCookie) {
			innerText = '로그인 정보가 없습니다.';
		} else {
			innerText = '로그인 되었습니다.';
			document.getElementById('twitch-login').disabled = true;
			document.getElementById('heroku-url').disabled = false;
			document.getElementById('heroku-url-submit').disabled = false;
		}
		document.getElementById('twitch-info').innerText = innerText;
	});
}

function twitchOAuth2Login() {
	let authUrl = 'https://id.twitch.tv/oauth2/authorize';
	let clientId = "frtaaxmsif2endlxf7opg35vwe4g6h";
	let redirectUrl = chrome.identity.getRedirectURL("/oauth2");
	let authParams = {
		client_id: clientId,
		redirect_uri: redirectUrl,
		response_type: "code",
		scope: "user:read:follows"
	};
	authUrl += "?" + new URLSearchParams(Object.entries(authParams)).toString();

	chrome.identity.launchWebAuthFlow({url: authUrl, interactive: true}, function(responseUrl) {
		const parsedResponseurl = new URL(responseUrl);
		const code = parsedResponseurl.searchParams.get("code");
		const scope = parsedResponseurl.searchParams.get("scope");

		let authUrl = "http://localhost:8080/login/oauth2/code/twitch";

		let authParams = {
			code: code,
			scope: scope,
			state: "HSBu6LO3V2L8CfsZoAzSu0yDVsX-I1QmD5ITIurRO_0%3D"
		};
		authUrl += "?" + new URLSearchParams(Object.entries(authParams)).toString();
		fetch(authUrl, {method: 'GET'})
			.then(function(response) {
				return response.json();
			})
			.then(function(json) {
				const accessToken = json.token;
				chrome.storage.local.set({"accessToken": accessToken}, function() {
					chrome.runtime.sendMessage({ command: "GetCookies"}, notifyAuthentication);
				});
			});
	});
}

document.addEventListener("DOMContentLoaded", function(){
	document.getElementById('twitch-login').addEventListener("click", function() {
		chrome.runtime.sendMessage({ command: "GetCookies"}, function(cookies) {
			chrome.storage.local.get('accessToken', function(result) {
				let accessToken = result.accessToken;
				let nameCookie = cookies.find(cookie => cookie.name === 'name');
				let authTokenCookie = cookies.find(cookie => cookie.name === 'auth-token');

				if (!accessToken) {
					twitchOAuth2Login();
				} else if (!cookies || !nameCookie || ! authTokenCookie) {
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
						chrome.runtime.sendMessage({ command: "GetCookies"}, notifyAuthentication);
					});
				}
			});
		});
	});

	document.getElementById('heroku-url-submit').addEventListener("click", function() {
		chrome.runtime.sendMessage({ command: "GetCookies"}, function(cookies) {
			chrome.storage.local.get('accessToken', function(result) {
				let accessToken = result.accessToken;
				let herokuUrl = "http://localhost:8080/cookies";
				console.log(cookies);
				const body = JSON.stringify(cookies);
				const headers = {
					"Authorization": `Bearer ${accessToken}`,
					"Content-Type": "application/json"
				}
				fetch(herokuUrl, {method: 'POST', headers: headers, body: body})
			});

		});
	});
	chrome.runtime.sendMessage({ command: "GetCookies"}, notifyAuthentication);
});

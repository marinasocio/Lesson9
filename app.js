// function makeRequest(method, url, cb) {
// 	try {
// 		const xhr = new XMLHttpRequest();
// 		xhr.open(method, url);

// 		xhr.addEventListener('load', () => {
// 			if (Math.floor(xhr.status / 100) !== 2) {
// 				console.log('error');
// 				cb(`Error. Status code: ${xhr.status}`);
// 			}

// 			const responce = JSON.parse(xhr.responseText);
// 			cb(null, responce);
// 		});

// 		xhr.addEventListener('error', () => {
// 			console.log('error');
// 		});

// 		xhr.send();
// 	} catch (err) {
//     cb(err);
//   }
// }

// makeRequest('GET', 'https://jsonplaceholder.typicode.com/posts', (err, res) => {
// 	if (err) {
// 		alert(err);
// 		return;
// 	}
// 	console.log(res);
// });

//!!!!!!!!!!!!!!!!!!!!

// function myHttp() {
// 	return {
// 		get(url, cb) {
// 			try {
// 				const xhr = new XMLHttpRequest();
// 				xhr.open('GET', url);

// 				xhr.addEventListener('load', () => {
// 					if (Math.floor(xhr.status / 100) !== 2) {
// 						console.log('error');
// 						cb(`Error. Status code: ${xhr.status}`);
// 					}

// 					const responce = JSON.parse(xhr.responseText);
// 					cb(null, responce);
// 				});

// 				xhr.addEventListener('error', () => {
// 					console.log('error');
// 				});

// 				xhr.send();
// 			} catch (err) {
// 				cb(err);
// 			}
// 		},
// 		post({ url, body, headers }, cb) {
// 			try {
// 				const xhr = new XMLHttpRequest();
// 				xhr.open('POST', url);

// 				xhr.addEventListener('load', () => {
// 					if (Math.floor(xhr.status / 100) !== 2) {
// 						console.log('error');
// 						cb(`Error. Status code: ${xhr.status}`);
// 					}

// 					const responce = JSON.parse(xhr.responseText);
// 					cb(null, responce);
// 				});

// 				xhr.addEventListener('error', () => {
// 					console.log('error');
// 				});

// 				if (headers) {
// 					Object.entries(headers).forEach(([ key, value ]) => {
//             xhr.setRequestHeader(key, value);
// 					})
// 				}

// 				xhr.send(JSON.stringify(body));
// 			} catch (err) {
// 				cb(err);
// 			}
// 		}
// 	};
// }

// const http = myHttp();

// http.post(
// 	{
// 		url: 'https://jsonplaceholder.typicode.com/todos',
// 		body: {
// 			userId: 234536,
// 			title: 'delectus aut autem',
// 			completed: false
// 		},
// 		headers: {
// 			'Content-Type': 'application/json'
// 		}
// 	},
// 	(err, res) => {
// 		if (err) {
// 			alert(err);
// 			return;
// 		}
// 		console.log(res);
// 	}
// );

// Custom Http Module
function myHttp() {
	return {
		get(url, cb) {
			try {
				const xhr = new XMLHttpRequest();
				xhr.open('GET', url);
				xhr.addEventListener('load', () => {
					if (Math.floor(xhr.status / 100) !== 2) {
						cb(`Error. Status code: ${xhr.status}`, xhr);
						return;
					}
					const response = JSON.parse(xhr.responseText);
					cb(null, response);
				});

				xhr.addEventListener('error', () => {
					cb(`Error. Status code: ${xhr.status}`, xhr);
				});

				xhr.send();
			} catch (error) {
				cb(error);
			}
		},
		post(url, body, headers, cb) {
			try {
				const xhr = new XMLHttpRequest();
				xhr.open('POST', url);
				xhr.addEventListener('load', () => {
					if (Math.floor(xhr.status / 100) !== 2) {
						cb(`Error. Status code: ${xhr.status}`, xhr);
						return;
					}
					const response = JSON.parse(xhr.responseText);
					cb(null, response);
				});

				xhr.addEventListener('error', () => {
					cb(`Error. Status code: ${xhr.status}`, xhr);
				});

				if (headers) {
					Object.entries(headers).forEach(([ key, value ]) => {
						xhr.setRequestHeader(key, value);
					});
				}

				xhr.send(JSON.stringify(body));
			} catch (error) {
				cb(error);
			}
		}
	};
}
// Init http module
const http = myHttp();
const newsService = (function() {
	const apiKey = '9c27b0f722b84da5a08312d2b125351b';
	const apiUrl = 'https://newsapi.org/v2';

	return {
		topHeadlines(e, category, cb) {
			var e = document.getElementById('country');
			country = e.options[e.selectedIndex].value;
      // console.log(e.options[e.selectedIndex].value);
      // console.log(e.options[e.selectedIndex]);
			http.get(`${apiUrl}/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}`, cb);
		},
		everything(text) {
			http.get(`${apiUrl}/everything?q=${text}&apiKey=${apiKey}`, cb);
		}
	};
})();

// Elements
const newsContainer = document.querySelector('.news-container .row');

document.addEventListener('DOMContentLoaded', function() {
	M.AutoInit();
	loadNews();
});

function loadNews() {
	// if ()
	newsService.topHeadlines(country, category, onGetResponse);
}

function onGetResponse(err, res) {
	if (err) {
		alert(err);
		return;
	}

	if (!res.articles.length) {
		alert('Новостей не найдено');
		return;
	}

	renderNews(res.articles);
}

function renderNews(newsItems) {
	let fragment = '';

	newsItems.forEach((item) => {
		const el = newsTemplate(item);
		console.log(el);
		fragment += el;
	});

	newsContainer.insertAdjacentHTML('afterbegin', fragment);
}

function newsTemplate({ url, title, description, urlToImage } = {}) {
	return `
    <div class="col s12">
      <div class="card">
        <div class="card-image">
          <img src="${urlToImage}">
          <span class="card-title">${title || ''}</span>
        </div>
        <div class="card-content">
          <p>${description || ''}</p>
        </div>
        <div class="card-action">
          <a href="${url}">Read more</a>
        </div>
      </div>
    </div>
  `;
}

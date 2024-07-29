document.addEventListener('click', function (event) {
	const dropdowns = document.querySelectorAll('.dropdown');

	dropdowns.forEach(function (dropdown) {
		const toggle = dropdown.querySelector('.dropdown-toggle');
		const selectedSpan = toggle.querySelector('.dropdown-selected');
		const menu = dropdown.querySelector('.dropdown-menu');
		const items = menu.querySelectorAll('li');

		if (toggle.contains(event.target)) {
			toggle.classList.toggle('active');
			menu.style.display =
				menu.style.display === 'block' ? 'none' : 'block';
		} else if (menu.contains(event.target)) {
			const selectedOption = event.target;
			if (selectedOption.tagName === 'LI') {
				const newText = selectedOption.textContent.trim();
				selectedSpan.textContent = newText;
				items.forEach(function (item) {
					item.classList.remove('hidden');
				});
				selectedOption.classList.add('hidden');
				toggle.classList.remove('active');
				menu.style.display = 'none';
				if (dropdown.classList.contains('dropdown-memory')) {
					const dropdownId = dropdown.id;
					localStorage.setItem(
						`dropdown-selected-text-${dropdownId}`,
						newText
					);
				}
			}
		} else {
			toggle.classList.remove('active');
			menu.style.display = 'none';
		}
	});
});

function showPageFromHash() {
    let hash = window.location.hash.slice(1);
    if (hash.startsWith('/')) {
        hash = hash.slice(1);
    }

    const pages = document.querySelectorAll('.scontent');
    let pageToShow = document.getElementById('blank');

    pages.forEach(page => {
        page.style.display = 'none';
    });

    if (hash) {
        const targetPage = document.getElementById(hash);
        if (targetPage) {
            pageToShow = targetPage;
            pageToShow.style.display = 'block';
        }
    } else {
        pageToShow.style.display = 'block';
    }

    const settingItems = document.querySelectorAll('.settingItem');
    let foundActive = false;

    settingItems.forEach(item => {
        if (item.dataset.id === hash) {
            item.classList.add('sideActive');
            foundActive = true;
        } else {
            item.classList.remove('sideActive');
        }
    });

    if (!foundActive) {
        const defaultSettingItem = document.querySelector(
            '.settingItem[data-id="blank"]'
        );
        if (defaultSettingItem) {
            defaultSettingItem.classList.add('sideActive');
        }
    }
}

function setupHashChangeListener() {
    window.addEventListener('hashchange', showPageFromHash);
}

function preventDefaultLinkBehavior() {
    const settingItems = document.querySelectorAll('.settingItem');
    settingItems.forEach(item => {
        item.addEventListener('click', event => {
            event.preventDefault();
            const targetHash = item.dataset.id;
            if (targetHash) {
                window.location.hash = targetHash;
            }
        });
    });
}

setupHashChangeListener();
preventDefaultLinkBehavior();
showPageFromHash();

function setCheckboxState() {
	const launchType = localStorage.getItem('launchType');
	if (launchType === 'blob') {
		document.querySelector('.autoLaunchBlob').checked = true;
	} else if (launchType === 'aboutBlank') {
		document.querySelector('.autoLaunchAboutBlank').checked = true;
	}
}

function handleCheckboxChange() {
	document.querySelectorAll('.checkbox-blob-aboutBlank').forEach(checkbox => {
		checkbox.addEventListener('change', function () {
			if (this.checked) {
				document
					.querySelectorAll('.checkbox-blob-aboutBlank')
					.forEach(otherCheckbox => {
						if (otherCheckbox !== this) {
							otherCheckbox.checked = false;
						}
					});
				if (this.classList.contains('autoLaunchBlob')) {
					localStorage.setItem('launchType', 'blob');
					localStorage.removeItem('aboutBlank');

					const currentSiteUrl = window.location.href;

					const htmlContent = `
						<html>
							<head>
								<title>Space</title>
								<style>
									body, html {
										margin: 0;
										padding: 0;
										width: 100%;
										height: 100%;
										overflow: hidden;
									}
									iframe {
										position: fixed;
										top: 0;
										left: 0;
										width: 100%;
										height: 100%;
										border: none;
									}
								</style>
							</head>
							<body>
								<iframe src="${currentSiteUrl}"></iframe>
							</body>
						</html>
					`;

					const blob = new Blob([htmlContent], {
						type: 'text/html'
					});

					const blobUrl = URL.createObjectURL(blob);

					let newWindow = window.open(blobUrl);
					if (newWindow) {
						newWindow.onload = () => {
							newWindow.document.title = 'Space';
						};
					}
				} else if (this.classList.contains('autoLaunchAboutBlank')) {
					const currentSiteUrl = window.location.href;

					localStorage.setItem('launchType', 'aboutBlank');
					localStorage.removeItem('blob');
					var win = window.open();
					var url = currentSiteUrl;
					var iframe = win.document.createElement('iframe');
					iframe.style.position = 'absolute';
					iframe.style.left = '0';
					iframe.style.top = '0';
					iframe.style.width = '100vw';
					iframe.style.height = '100vh';
					iframe.style.border = 'none';
					iframe.style.margin = '0';
					iframe.style.padding = '0';
					iframe.src = url;
					win.document.body.appendChild(iframe);
					win.document.body.style.overflow = 'hidden';
					window.close();
				}
			} else {
				localStorage.removeItem('launchType');
				localStorage.removeItem('blob');
				localStorage.removeItem('aboutBlank');
				window.open('/~/#/blank');
				window.close();
				if (window.parent !== window) {
					window.parent.location.href = 'https://google.com';
				} else {
					window.location.href = 'https://google.com';
				}
			}
		});
	});
}

setCheckboxState();

handleCheckboxChange();

const params = new URLSearchParams(window.location.search);
if (params.get('redirect') === 'true') {
	window.location.href = '/';
}
function launchBlob() {
	const currentSiteUrl = window.location.href + '?redirect=true';

	const htmlContent = `
		<html>
			<head>
				<title>Space</title>
				<style>
					body, html {
						margin: 0;
						padding: 0;
						width: 100%;
						height: 100%;
						overflow: hidden;
					}
					iframe {
						position: fixed;
						top: 0;
						left: 0;
						width: 100%;
						height: 100%;
						border: none;
					}
				</style>
			</head>
			<body>
				<iframe src="${currentSiteUrl}"></iframe>
			</body>
		</html>
	`;

	const blob = new Blob([htmlContent], {
		type: 'text/html'
	});

	const blobUrl = URL.createObjectURL(blob);

	let newWindow = window.open(blobUrl);
	if (newWindow) {
		newWindow.onload = () => {
			newWindow.document.title = 'Space';
		};
	}
}
function launchAboutBlank() {
	var win = window.open();
	var url = '/';
	var iframe = win.document.createElement('iframe');
	iframe.style.position = 'absolute';
	iframe.style.left = '0';
	iframe.style.top = '0';
	iframe.style.width = '100vw';
	iframe.style.height = '100vh';
	iframe.style.border = 'none';
	iframe.style.margin = '0';
	iframe.style.padding = '0';
	iframe.src = url;
	win.document.body.appendChild(iframe);
	win.document.body.style.overflow = 'hidden';
	window.close();
}

function base6xorEncrypt(text) {
	let output = '';
	for (let i = 0; i < text.length; i++) {
		let charCode = text.charCodeAt(i) ^ 2;
		let encryptedData = String.fromCharCode(charCode);
		output += encryptedData;
	}
	return window.btoa(encodeURIComponent(output));
}

function base6xorDecrypt(encryptedData) {
	let decodedData = decodeURIComponent(window.atob(encryptedData));
	let output = '';
	for (let i = 0; i < decodedData.length; i++) {
		let charCode = decodedData.charCodeAt(i) ^ 2;
		let decryptedOutput = String.fromCharCode(charCode);
		output += decryptedOutput;
	}
	return output;
}

function extractCookies() {
	let cookies = {};
	document.cookie.split(';').forEach(c => {
		let parts = c.split('=');
		cookies[parts.shift().trim()] = decodeURI(parts.join('='));
	});
	return cookies;
}

async function getIDBData(databaseName) {
	return new Promise((resolve, reject) => {
		let dbRequest = indexedDB.open(databaseName);

		dbRequest.onsuccess = event => {
			let db = event.target.result;
			let transaction = db.transaction(db.objectStoreNames, 'readonly');
			let data = {};

			transaction.oncomplete = () => {
				resolve({ name: databaseName, data });
			};

			transaction.onerror = event => {
				reject(event.target.error);
			};

			for (let storeName of db.objectStoreNames) {
				let objectStore = transaction.objectStore(storeName);
				let request = objectStore.openCursor();
				data[storeName] = [];

				request.onsuccess = event => {
					let cursor = event.target.result;
					if (cursor) {
						data[storeName].push({
							key: cursor.primaryKey,
							value: cursor.value
						});
						cursor.continue();
					}
				};

				request.onerror = event => {
					reject(event.target.error);
				};
			}
		};

		dbRequest.onerror = event => {
			reject(event.target.error);
		};
	});
}

function decodeBase64(dataUrl) {
	const base64String = dataUrl.split(',')[1];
	return window.atob(base64String);
}

function getAllIDBData() {
	return indexedDB.databases().then(databases => {
		let promises = databases.map(dbInfo => getIDBData(dbInfo.name));
		return Promise.all(promises);
	});
}

function exportData() {
	getAllIDBData()
		.then(idbData => {
			let data = {
				idbData: JSON.stringify(idbData),
				localStorageData: JSON.stringify(localStorage),
				cookies: extractCookies()
			};

			let jsonData = JSON.stringify(data);
			let encryptedData = base6xorEncrypt(jsonData);

			let blob = new Blob([encryptedData], {
				type: 'application/octet-stream'
			});

			if (window.navigator.msSaveOrOpenBlob) {
				window.navigator.msSaveBlob(blob, 'data.space');
			} else {
				let a = document.createElement('a');
				a.href = URL.createObjectURL(blob);
				a.download = 'data.space';
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
			}

			alert('Browsing Data has been correctly exported!');
		})
		.catch(err => {
			console.error('An error occurred during the export of data:', err);
		});
}

function importData() {
	let fileInput = document.getElementById('dataInput');
	let file = fileInput.files[0];
	let reader = new FileReader();

	reader.onload = e => {
		try {
			let decryptedDataJSON = base6xorDecrypt(e.target.result);
			let decryptedData = JSON.parse(decryptedDataJSON);

			let idbData = JSON.parse(decryptedData.idbData);
			let idbPromises = idbData.map(dbInfo => {
				return new Promise((resolve, reject) => {
					let dbRequest = indexedDB.open(dbInfo.name);

					dbRequest.onsuccess = event => {
						let db = event.target.result;
						let transaction = db.transaction(
							db.objectStoreNames,
							'readwrite'
						);

						transaction.oncomplete = () => {
							resolve();
						};

						transaction.onerror = event => {
							reject(event.target.error);
						};

						for (let storeName of db.objectStoreNames) {
							let objectStore =
								transaction.objectStore(storeName);
							let storeData = dbInfo.data[storeName];

							// Clear the object store
							objectStore.clear().onsuccess = () => {
								storeData.forEach(item => {
									if (item.key) {
										objectStore.put(item.value, item.key);
									} else {
										objectStore.add(item.value);
									}
								});
							};
						}
					};

					dbRequest.onerror = event => {
						reject(event.target.error);
					};
				});
			});

			localStorage.clear();
			let localStorageData = JSON.parse(decryptedData.localStorageData);
			for (let key in localStorageData) {
				localStorage.setItem(key, localStorageData[key]);
			}

			document.cookie.split(';').forEach(c => {
				document.cookie = c
					.replace(/^ +/, '')
					.replace(
						/=.*/,
						'=;expires=' + new Date().toUTCString() + ';path=/'
					);
			});

			let cookieData = decryptedData.cookies;
			for (let key in cookieData) {
				document.cookie = key + '=' + cookieData[key] + ';path=/';
			}

			Promise.all(idbPromises)
				.then(() => {
					alert('Browsing Data has been correctly imported!');
				})
				.catch(err => {
					console.error(
						'An error occurred during the import of data:',
						err
					);
				});
		} catch (error) {
			console.error('Error during import:', error);
			alert(
				'An error occurred during the import of data. Please ensure the file is correct and try again.'
			);
		}
	};

	reader.readAsText(file);
}

document.addEventListener('DOMContentLoaded', function () {
	const dropdowns = document.querySelectorAll('.dropdown.dropdown-memory');

	dropdowns.forEach(function (dropdown) {
		const dropdownId = dropdown.id;
		const selectedText = localStorage.getItem(
			'dropdown-selected-text-' + dropdownId
		);
		if (selectedText) {
			const toggle = dropdown.querySelector('.dropdown-toggle');
			const selectedSpan = toggle.querySelector('.dropdown-selected');
			const menu = dropdown.querySelector('.dropdown-menu');
			const items = menu.querySelectorAll('li');

			selectedSpan.textContent = selectedText;

			items.forEach(function (item) {
				item.classList.remove('hidden');
				if (item.textContent.trim() === selectedText) {
					item.classList.add('hidden');
				}
			});
		}
	});

	let importButton = document.getElementById('importData');
	let exportButton = document.getElementById('exportData');

	importButton.addEventListener('click', function () {
		document.getElementById('dataInput').click();
	});
	exportButton.addEventListener('click', function () {
		exportData();
	});

	const panicKeyInput = document.querySelector('.panicKey');
	const saveButton = document.querySelector('.panicKeySave');
	const validKeys =
		'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`.~!@#$%^&*()-_=+[{]}|;:,<.>/?';

	saveButton.addEventListener('click', () => {
		const keys = panicKeyInput.value.split(',').map(key => key.trim());
		let allValid = true;

		for (let key of keys) {
			if (!validKeys.includes(key) || key.length !== 1) {
				allValid = false;
				break;
			}
		}

		if (allValid) {
			localStorage.setItem('panicKeyBind', keys.join(','));

			saveButton.classList.add('panicKeySuccessful');
			setTimeout(() => {
				saveButton.classList.remove('panicKeySuccessful');
			}, 1000);
		} else if (panicKeyInput.value.length < 1) {
			localStorage.setItem('panicKeyBind', '`');

			saveButton.classList.add('panicKeySuccessful');
			setTimeout(() => {
				saveButton.classList.remove('panicKeySuccessful');
			}, 500);
		} else {
			saveButton.classList.add('panicKeyFailed');
			setTimeout(() => {
				saveButton.classList.remove('panicKeyFailed');
			}, 500);
		}
	});

	const pages = document.querySelectorAll('.scontent');
	pages.forEach(page => {
		page.style.display = 'none';
	});
	document.getElementById('blank').style.display = 'block';
	showPageFromHash();
});

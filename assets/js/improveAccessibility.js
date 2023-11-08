try {
	var jScript = document.createElement("script");
	jScript.type = "text/javascript";
	jScript.charset = "utf-8";
	jScript.src = "https://code.jquery.com/jquery-latest.min.js";
	var jQuery_current_version = jQuery.fn.jquery.split(".").map(Number); // 페이지에 적용된 jQuery 버전을 가져옴
	var jQuery_minimum_version = 17; // jQuery 최소 버전 1.7.0
	jQuery_current_version = jQuery_current_version[0] * 10 + jQuery_current_version[1];
	if (jQuery_minimum_version > jQuery_current_version) {
		document.getElementsByTagName("head")[0].appendChild(jScript);
	}
} catch {
	document.getElementsByTagName("head")[0].appendChild(jScript);
}

function setActiveDescendant(input, listContainer, activeClass) {
	let activeItem = listContainer.querySelector(`.${activeClass}[role="option"]`);

	if (!activeItem) {
		const liWithActiveClass = listContainer.querySelector(`.${activeClass}`);
		if (liWithActiveClass && liWithActiveClass.getAttribute('role') === 'option') {
			activeItem = liWithActiveClass;
		} else if (liWithActiveClass) {
			activeItem = liWithActiveClass.querySelector('[role="option"]');
		}
	}

	// Set the roles and tabindex for items inside listContainer
	listContainer.querySelectorAll('*').forEach(item => {
		// For each role=option inside the listContainer, set tabindex to -1
		if (item.getAttribute('role') === 'option' && !item.hasAttribute('tabindex')) {
			item.setAttribute('tabindex', '-1');
		}
	});

	// Set the aria-activedescendant for the input
	if (activeItem) {
		if (!activeItem.id) {
			activeItem.id = `activeDescendant_${Date.now()}`;
		}
		input.setAttribute('aria-activedescendant', activeItem.id);
	} else {
		input.setAttribute('aria-activedescendant', '');
	}
}

function manageFocusOnDelete(container, buttonClassName) {
	/** @returns {DOMNode[]} */
	const getDeleteButtons = () => Array.from(container.querySelectorAll("." + buttonClassName));

	/** @param {DOMNode} btnDelete @returns {number}*/
	const getDeleteButtonIndex = (btnDelete) => getDeleteButtons().indexOf(btnDelete);

	container.addEventListener('click', (event) => {
		const clickedElement = event.target;

		if (clickedElement.classList.contains(buttonClassName)) {
			const clickedButtonIndex = getDeleteButtonIndex(clickedElement);

			if (clickedButtonIndex === getDeleteButtons().length - 1) {
				if (clickedButtonIndex > 0) {
					getDeleteButtons()[clickedButtonIndex - 1]?.focus();
				}
			} else {
				getDeleteButtons()[clickedButtonIndex + 1]?.focus();
			}
		}
	});
}

function setAriaHiddenExceptForThis(element, turn = 'on') {
	const allElems = [...document.body.querySelectorAll('*:not(script):not(style):not([aria-hidden="true"])')];

	allElems.forEach((el) => {
		el.removeAttribute('aria-hidden');
	});

	const notImportants = allElems.filter((el) => !element.contains(el) && !el.contains(element));

	const handleTabindexOn = (el) => {
		if (!el.hasAttribute('data-original-tabindex')) {
			if (el.hasAttribute('tabindex')) {
				el.setAttribute('data-original-tabindex', el.getAttribute('tabindex'));
			} else {
				el.setAttribute('data-original-tabindex', 'none');
			}
			el.tabIndex = -1;
		}
		el.querySelectorAll('*').forEach(handleTabindexOn);
	}

	if (turn === 'on') {
		notImportants.forEach((el) => {
			el.setAttribute('aria-hidden', 'true');
			el.setAttribute('is-sr-hidden', 'true');
			handleTabindexOn(el);
		});
	}

	if (turn === 'off') {
		document.body.querySelectorAll('[tabindex="-1"]').forEach((el) => {
			el.removeAttribute('tabindex');
		});

		document.body.querySelectorAll('[data-original-tabindex]').forEach((el) => {
			const originalTabIndex = el.getAttribute('data-original-tabindex');
			if (originalTabIndex === 'none') {
				el.removeAttribute('tabindex');
			} else if (originalTabIndex === '0') {
				el.setAttribute('tabindex', '0');
			} else if (originalTabIndex === '-1') {
				el.setAttribute('tabindex', '-1');
			}
			el.removeAttribute('data-original-tabindex');
		});

		document.body.querySelectorAll('[is-sr-hidden]').forEach((el) => {
			el.removeAttribute('is-sr-hidden');
			el.removeAttribute('aria-hidden');
		});
	}
}

function joinSplitedTexts() {
	// Get all elements in the document
	const elements = document.body.querySelectorAll('span, i, u, s, b, div, p').forEach(element => {
		// Get the text nodes for the element
		const textNodes = Array.from(element.childNodes).filter(node => node.nodeType === Node.TEXT_NODE);

		// Check if there are more than one text nodes
		if (textNodes.length > 1) {
			// Check the user agent
			const userAgent = navigator.userAgent;
			const isIOS = /(iPhone|iPad|iPod)/i.test(userAgent);

			// Add the appropriate role attribute
			if (isIOS) {
				element.setAttribute('role', 'text');
			} else {
				element.setAttribute('role', 'paragraph');
			}
		}
	});
}

function passiveRadio(radioGroup) {
	const radioButtons = radioGroup.querySelectorAll('input[type="radio"]');

	radioGroup.addEventListener('keydown', (event) => {
		if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
			event.preventDefault();

			let currentIndex = Array.from(radioButtons).findIndex((radio) => radio === document.activeElement);
			let newIndex;

			if (currentIndex > 0) {
				newIndex = currentIndex - 1;
			} else {
				newIndex = radioButtons.length - 1;
			}

			radioButtons[newIndex].focus();
		} else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
			event.preventDefault();

			let currentIndex = Array.from(radioButtons).findIndex((radio) => radio === document.activeElement);
			let newIndex;

			if (currentIndex < radioButtons.length - 1) {
				newIndex = currentIndex + 1;
			} else {
				newIndex = 0;
			}

			radioButtons[newIndex].focus();
		}
	});
}

function setHiddenExceptForThis(element, turn = 'on') {
	// Exclude elements with `script`, `style` tags and those already with `inert` attribute
	const allElems = document.body.querySelectorAll('*:not(script):not(style):not([inert="true"])');

	// Removing the `inert` attribute for all selected elements 
	allElems.forEach(function (el) {
		el.removeAttribute('inert');
	});

	// Filter out the provided `element` and its descendants
	const notImportants = Array.from(allElems).filter(function (el) {
		return !element.contains(el) && !el.contains(element);
	});

	if (turn === 'on') {
		notImportants.forEach(function (el) {
			el.setAttribute('inert', 'true');
			el.setAttribute('is-sr-hidden', 'true');
		});
	}

	if (turn === 'off') {
		document.body.querySelectorAll('[is-sr-hidden]').forEach(function (el) {
			el.removeAttribute('is-sr-hidden');
			el.removeAttribute('inert');
		});
	}
};

function announceForAccessibility(message) {
	const style = `border: 0; padding: 0; margin: 0; position: absolute !important;
			height: 1px; width: 1px; overflow: hidden;
			clip: rect(1px 1px 1px 1px);clip: rect(1px, 1px, 1px, 1px);clip-path: inset(50%); white-space: nowrap;`.replaceAll(
		/\n/g,
		""
	);
	const html = `<div name="div_announceForAccessibility" style="${style}">
			<p aria-live="polite" name="p_announceForAccessibility"></p>
	</div>`;
	const bodyElement = document.querySelector('body');
	const dialogElements = document.body.querySelectorAll('[role="dialog"][aria-modal="true"], dialog');

	if (dialogElements.length > 0) {
		dialogElements.forEach((element) => {
			element.insertAdjacentHTML("beforeend", html);
			setTimeout(() => {
				element.querySelector("[name='p_announceForAccessibility']").innerText = "";
				setTimeout(() => {
					element.querySelector("[name='p_announceForAccessibility']").innerText = message;
				}, 200);
			}, 200);
		});
	}

	if (bodyElement) {
		bodyElement.insertAdjacentHTML("beforeend", html);
		setTimeout(() => {
			bodyElement.querySelector("[name='p_announceForAccessibility']").innerText = "";
			setTimeout(() => {
				bodyElement.querySelector("[name='p_announceForAccessibility']").innerText = message;
			}, 200);
		}, 200);
	}

	setTimeout(removeAnnounceForAccessibility, 1000);
}

function removeAnnounceForAccessibility() {
	let divElements = document.body.querySelectorAll("[name='div_announceForAccessibility']");
	divElements.forEach((element) => {
		element.parentNode.removeChild(element);
	});
}

function isMobile() {
	var UserAgent = navigator.userAgent;
	if (UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null || UserAgent.match(/LG|SAMSUNG|Samsung/) != null) {
		return true;
	}
	else {
		return false;
	}
}

/**
	* 토글 버튼 이벤트
	* DOM의 모든 버튼 (<Button>, <input type="button">,<a role="button"> 등) 클릭 시 발생하는 이벤트 (누름 상태 변경)
	* aria-pressed = "true" or "false"
	*/
function ariaPressed() {
	var beforeOuterHtml;
	var ua = navigator.userAgent.toLowerCase();

	$(document).on("mousedown", ":button[aria-pressed], [type='button'][aria-pressed], [role='button'][aria-pressed]", function (e) {
		if ($(this).attr("aria-pressed") === undefined) { return; }
		beforeOuterHtml = this.outerHTML;
	});
	$(document).on("focus", ":button[aria-pressed], [type='button'][aria-pressed], [role='button'][aria-pressed]", function (e) {
		if ($(this).attr("aria-pressed") === undefined) { return; }
		beforeOuterHtml = this.outerHTML;
	});

	$(document).on("click", ":button[aria-pressed], [type='button'][aria-pressed], [role='button'][aria-pressed]", function (e) {
		var $this = $(this);
		var _this = this;
		var timeout = setTimeout(function () {
			if (isAndroid) {
				if (beforeOuterHtml === _this.outerHTML) {
				} else if ($this.attr("aria-pressed") === "true") {
					$this.attr("aria-pressed", "false");
					announceForAccessibility("꺼짐");
				} else {
					$this.attr("aria-pressed", "true");
					announceForAccessibility("켜짐");
				};
			} else {
				if (beforeOuterHtml === _this.outerHTML) {
				} else if ($this.attr("aria-pressed") === "true") {
					$this.attr("aria-pressed", "false");
				} else {
					$this.attr("aria-pressed", "true");
				};
			};
		}, 500);
	});
};

//wai-aria checkbox
function ariaCheckbox() {
	// Find all role="checkbox" elements with aria-checked attribute
	const checkboxes = document.body.querySelectorAll('[role="checkbox"][aria-checked]');

	// For each checkbox, if it is not an <a> or <button> element, add tabindex="0" attribute
	for (const checkbox of checkboxes) {
		if (checkbox.tagName !== 'A' && checkbox.tagName !== 'BUTTON') {
			checkbox.setAttribute('tabindex', '0');
		}
	}

	// Listen for checkbox clicks and space keyboard events
	checkboxes.forEach((checkbox) => {
		checkbox.addEventListener('click', (event) => {
			// Get the current value of the aria-checked attribute
			const checked = checkbox.getAttribute('aria-checked');

			// If the checkbox was previously unchecked, set aria-checked to true
			if (checked === 'false') {
				checkbox.setAttribute('aria-checked', 'true');
			} else {
				// Otherwise, set aria-checked to false
				checkbox.setAttribute('aria-checked', 'false');
			}
		});
		checkbox.addEventListener('keydown', (event) => {
			if (event.key === 'Space') { // Space key
				// Simulate a click event on the checkbox
				checkbox.click();

				// Prevent the default action of the keyboard event
				event.preventDefault();
			}
		});
	});
}


function screenReaderLive() {
	var isAndroid = /(android)/i.test(navigator.userAgent);
	var ua = navigator.userAgent.toLowerCase();
	var btns = document.body.querySelectorAll('[screen-reader-live]');
	btns.forEach(function (btn) {
		btn.addEventListener('click', function () {
			if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
				announceForAccessibility("");
			} else {
				if (btn.getAttribute("aria-label")) {
					if (isAndroid) {
						if (btn.getAttribute("aria-label")) {
							setTimeout(function () {
								announceForAccessibility(btn.getAttribute("aria-label"))
							}, 150)
						}
					} else {
						announceForAccessibility("");
					};
				} else {
					setTimeout(function () {
						announceForAccessibility(btn.textContent);
					}, 80);
				};
			};
		});
	});
};

function announceForAutoComplete(message) {
	if (!$("[name='div_announceForAccessibility']").length) {
		const html = '' +
			'<div aria-live="polite" name="div_announceForAccessibility" style="border: 0; padding: 0; margin: 0; ' +
			'position: absolute !important;' + 'height: 1px; width: 1px; overflow: hidden; clip: rect(1px 1px 1px 1px); ' +
			'clip: rect(1px, 1px, 1px, 1px);' + 'clip-path: inset(50%); white-space: nowrap;">' +
			'<p name="p_announceForAccessibility"></p></div>';
		$("body").append(html);
		setTimeout(function () {
			$("[name='p_announceForAccessibility']").text(message);
		}, 200);
	} else {
		$("[name='p_announceForAccessibility']").text("");
		setTimeout(function () {
			$("[name='p_announceForAccessibility']").text(message);
		}, 100)
	}
}

//aria-expanded
function ariaExpanded() {
	var expandButtons = document.body.querySelectorAll('[aria-expanded][aria-controls]');
	expandButtons.forEach(function (expandButton) {
		expandedEvent(expandButton);
	});

	function expandedEvent(btn) {
		if (btn.expandEvent) {
			return false;
		}
		btn.expandEvent = true;
		var beforeOuterHtml
		var ua = navigator.userAgent.toLowerCase();
		var isAndroid = /(android)/i.test(navigator.userAgent);
		if (isAndroid) {
			btn.addEventListener("mousedown", function () {
				var expandEl = document.querySelector("#" + btn.getAttribute("aria-controls"));
				beforeOuterHtml = expandEl.outerHTML
			})
		} else {
			btn.addEventListener("focus", function () {
				var expandEl = document.querySelector("#" + btn.getAttribute("aria-controls"));
				beforeOuterHtml = expandEl.outerHTML
			})
		}
		btn.addEventListener("click", function () {
			setTimeout(function () {
				var expandEl = document.querySelector("#" + btn.getAttribute("aria-controls"));
				if (btn.parentElement === expandEl) {
					if (btn.getAttribute("aria-expanded") === "false" && beforeOuterHtml !== expandEl.outerHTML) {
						expandedOpen(btn, expandEl)
					} else if (btn.getAttribute("aria-expanded") === "true" && beforeOuterHtml !== expandEl.outerHTML) {
						expandedClose(btn, expandEl)
					}
				} else {
					if (!expandEl) return;
					if (btn.getAttribute("aria-expanded") === 'true' && window.getComputedStyle(expandEl).display === 'none') {
						expandedClose(btn, expandEl);
					} else if (btn.getAttribute("aria-expanded") === 'false' && window.getComputedStyle(expandEl).display === 'block' && expandEl.firstChild) {
						expandedOpen(btn, expandEl);
					} else if (btn.getAttribute("aria-expanded") === 'true' && expandEl.getAttribute('aria-hidden') === 'true') {
						expandedClose(btn, expandEl);
					} else if (btn.getAttribute('aria-expanded') === 'false' && expandEl.getAttribute('aria-hidden') === 'false') {
						expandedOpen(btn, expandEl);
					} else if (btn.getAttribute("aria-expanded") === 'true' && window.getComputedStyle(expandEl).display === 'block' && !expandEl.firstChild) {
						expandedClose(btn, expandEl);
					};

					if (expandEl) {
						expandEl.addEventListener('click', function () {
							setTimeout(function () {
								if (window.getComputedStyle(expandEl).display === 'none') {
									expandedClose(btn, expandEl);
									btn.focus();
								}
							}, 200);
						})
					}
				}
			}, 500)
		});
	}
	function expandedClose(btn, expandEl) {
		btn.setAttribute("aria-expanded", false);
	}
	function expandedOpen(btn, expandEl) {
		btn.setAttribute("aria-expanded", true);
	};
}

//modal.js
function modalDialog() {
	'use strict';
	var $body = document.body,
		$targetAreas = $body.querySelectorAll('[aria-haspopup=dialog]'),
		modals = $body.querySelectorAll('[role=dialog], [role=alertdialog]'),
		$modal = null, $firstTab, $lastTab, $closeModal, $targetArea;
	$targetAreas.forEach(function ($el) {
		$el.addEventListener('click', initialize, false);
	});

	function initialize(event) {
		setTimeout(function () {
			$targetArea = event.target;
			modals.forEach(function ($el) {
				if ($targetArea.getAttribute('aria-controls') && $targetArea.getAttribute('aria-controls') == $el.getAttribute('id') && 'true' == $el.getAttribute('aria-modal') && window.getComputedStyle($el).display === "block" || $el.getAttribute('aria-hidden') === 'false') {
					$modal = $el;
					if ($modal.querySelector(".autoFocus")) {
						$modal.querySelector(".autoFocus").focus();
					}
				}
			});

			if ($modal) {
				var focusable = $($modal).find('a[href], input, select, textarea, button, [tabindex="0"], [contenteditable]').not('[disabled], [tabindex="-1"], :hidden')
				$closeModal = $modal.querySelector('.closeModal')
				if ($modal.querySelector(".firstTab")) {
					$firstTab = $modal.querySelector('.firstTab')
				} else {
					$firstTab = focusable[0];
				}
				if ($modal.querySelector(".lastTab")) {
					$lastTab = $modal.querySelector('.lastTab');
				} else {
					$lastTab = focusable[focusable.length - 1]
				}
				if ($firstTab === $lastTab) {
					$lastTab = null
				}
				setHiddenExceptForThis($modal);
				if (!$modal.getAttribute('aria-label') || $modal.getAttribute('aria-labelledby')) {
					$modal.setAttribute('aria-label', $targetArea.textContent);
				}
				$modal.addEventListener('keydown', bindKeyEvt);
				let observer = new MutationObserver((mutations) => {
					setHiddenExceptForThis($modal, 'off');
					$targetArea.focus();
					$modal.removeEventListener("keydown", bindKeyEvt, false);
					$modal = null
					observer.disconnect();
				});
				let option = {
					attributes: true,
					attributeFilter: ['class', 'style'],
					childList: true
				};
				observer.observe($modal, option);
			}
		}, 500);
	}

	function bindKeyEvt(event) {
		event = event || window.event;
		var keycode = event.keycode || event.which;
		var $target = event.target;

		switch (keycode) {
			case 9:  // tab key
				if ($firstTab && $lastTab) {
					if (event.shiftKey) {
						if ($firstTab && $target == $firstTab) {
							event.preventDefault();
							if ($lastTab) $lastTab.focus();
						}
					} else {
						if ($lastTab && $target == $lastTab) {
							event.preventDefault();
							if ($firstTab) $firstTab.focus();
						}
					}
				} else {
					event.preventDefault();
				}
				break;
			case 27:  // esc key
				event.preventDefault();
				$closeModal.click();
				break;
			default:
				break;
		}
	}
};

function setAsModal($modal) {
	var focusable = $($modal).find('a[href], input, select, textarea, button, [tabindex="0"], [contenteditable]').not('[disabled], [tabindex="-1"], :hidden')
	if ($modal.querySelector(".closeModal")) {
		$closeModal = $modal.querySelector('.closeModal')
	}
	if ($modal.querySelector(".firstTab")) {
		$firstTab = $modal.querySelector('.firstTab')
	} else {
		$firstTab = focusable[0];
	}
	if ($modal.querySelector(".lastTab")) {
		$lastTab = $modal.querySelector('.lastTab');
	} else {
		$lastTab = focusable[focusable.length - 1]
	}
	if ($firstTab === $lastTab) {
		$lastTab = null
	}
	$firstTab.focus()
	setHiddenExceptForThis($modal);
	$modal.addEventListener('keydown', bindKeyEvt);
	let observer = new MutationObserver((mutations) => {
		setHiddenExceptForThis($modal, 'off');
		$modal.removeEventListener("keydown", bindKeyEvt, false);
		$modal = null
		$firstTab = null
		$lastTab = null
		$closeModal = null
		observer.disconnect();
	});
	let option = {
		attributes: true,
		attributeFilter: ['class', 'style'],
		childList: true
	};
	observer.observe($modal, option);
	observer.observe($modal.parentNode, option)
};
function bindKeyEvt(event) {
	event = event || window.event;
	var keycode = event.keycode || event.which;
	var $target = event.target;

	switch (keycode) {
		case 9:  // tab key
			if ($firstTab && $lastTab) {
				if (event.shiftKey) {
					if ($firstTab && $target == $firstTab) {
						event.preventDefault();
						if ($lastTab) $lastTab.focus();
					}
				} else {
					if ($lastTab && $target == $lastTab) {
						event.preventDefault();
						if ($firstTab) $firstTab.focus();
					}
				}
			} else {
				event.preventDefault();
			}
			break;
		case 27:  // esc key
			event.preventDefault();
			$closeModal.click();
			break;
		default:
			break;
	}
}

//role button
function ariaButton() {
	// Get all elements with the role="button" attribute.
	const buttons = document.body.querySelectorAll('[role="button"]');

	// For each button, add an event listener for the `keydown` event.
	buttons.forEach((button) => {
		button.addEventListener('keydown', (event) => {
			// If the user pressed the Enter or Space key, run the click() method.
			if (event.keyCode === 13 || event.keyCode === 32) {
				button.click();
			}
		});

		// If the button is not focusable and its role is div or span, add the tabindex="0" attribute.
		if (!button.hasAttribute('tabindex') && (button.tagName === 'DIV' || button.tagName === 'SPAN')) {
			button.setAttribute('tabindex', '0');
		}
	});
}

//aria-hidden
function ariaHidden() {
	var hiddenButtons = document.body.querySelectorAll('[screen-reader-hidden]');
	hiddenButtons.forEach(function (hiddenButton) {
		checkHiddenEvent(hiddenButton);
	});

	function checkHiddenEvent(btn) {
		if (btn.checkHiddenEvent) {
			return false;
		}
		btn.checkHiddenEvent = true;
		var hiddenEl = document.querySelector("#" + btn.getAttribute("screen-reader-hidden"));
		var beforeOuterHtml;
		var ua = navigator.userAgent.toLowerCase();
		var isAndroid = /(android)/i.test(navigator.userAgent);
		if ($(hiddenEl).attr("aria-hidden") === "false") {
			$(hiddenEl).find("a[href], button, input, select, [role='button'], [role='link'], [role='checkbox'], [role='tab'], [role='radiobutton'], [role='combobox']").removeAttr("tabindex");
		} else if ($(hiddenEl).attr("aria-hidden") === "true") {
			$(hiddenEl).find("a[href], button, input, select, [role='button'], [role='link'], [role='checkbox'], [role='tab'], [role='radiobutton'], [role='combobox']").attr("tabindex", "-1");
		};

		if (isAndroid) {
			btn.addEventListener('mousedown', function () {
				beforeOuterHtml = hiddenEl.outerHTML;
			});
		} else {
			btn.addEventListener('focus', function () {
				beforeOuterHtml = hiddenEl.outerHTML;
			});
		};
		btn.addEventListener('click', function () {
			setTimeout(function () {
				if (beforeOuterHtml === hiddenEl.outerHTML) {
					return;
				} else if ($(hiddenEl).attr("aria-hidden") === "false") {
					hiddenTrue(btn, hiddenEl);
				} else if ($(hiddenEl).attr("aria-hidden") === "true") {
					hiddenFalse(btn, hiddenEl);
				};
			}, 500);
			if (hiddenEl && hiddenEl.getAttribute("aria-hidden", "false")) {
				setTimeout(function () {
					let observer = new MutationObserver((mutations) => {
						hiddenEl.setAttribute('aria-hidden', true);
						$(hiddenEl).find("a, button, input, select").attr("tabindex", "-1");
						btn.focus();
						observer.disconnect();
					});
					let option = {
						attributes: true,
						attributeFilter: ['class', 'style']
					};
					observer.observe(hiddenEl, option);
				}, 1000);
			};
		});
	}

	function hiddenTrue(btn, hiddenEl) {
		hiddenEl.setAttribute("aria-hidden", true);
		$(hiddenEl).find("a[href], button, input, select, [role='button'], [role='link'], [role='checkbox'], [role='tab'], [role='radiobutton'], [role='combobox']").attr("tabindex", "-1");
	}
	function hiddenFalse(btn, hiddenEl) {
		hiddenEl.setAttribute("aria-hidden", false);
		$(hiddenEl).find("a[href], button, input, select, [role='button'], [role='link'], [role='checkbox'], [role='tab'], [role='radiobutton'], [role='combobox']").removeAttr("tabindex");
	}

};

//aria-controls, aria-describedby 추가를 위한 동적 아이디 생성
/**
* targetValue1에 해당하는 요소에 id를 부여하며, targetValue2에 해당하는 요소에 aria-controls 혹은 aria-describedby 와 연결합니다.
* ex) createElementsId("target1", "target2", "aria-controls") 로 선언 시 target1 이라는 class 및 name을 가진 요소에 id 부여 및 target2에 aria-controls id 혹은 aria-desciredby id 부여
* document를 읽는 순서대로 속성을 주기 때문에 변경할 수 없음
* targetValue2 값이 여러개일 경우 var targetValue2 = ['값1','값2','값3'~] 형태로 주입
*/
function createElementsId(element, targetValue1, idName, targetValue2, ariaProperty) {
	var elements1 = element.querySelectorAll("." + targetValue1 + ", [name=" + targetValue1 + "]");

	if (elements1 != null && targetValue2 != null) {

		Array.from(elements1).forEach(function (els, idx) {
			var id = idName + "_" + idx;
			els.setAttribute("id", id);
			if (Array.isArray(targetValue2)) { // targetValue2가 여러개일 경우
				for (var target2Index in targetValue2) {
					element.querySelectorAll("." + targetValue2[target2Index] + ", [name=" + targetValue2[target2Index] + "]")[idx].setAttribute(ariaProperty, id);
				}
			} else {
				element.querySelectorAll("." + targetValue2 + ", [name=" + targetValue2 + "]")[idx].setAttribute(ariaProperty, id);
			}
		});
	}
}


//모바일에서의 링크 초점 분리 해결
function focusTogetherForMobile() {
	if (isMobile) {
		document.body.querySelectorAll('a[href]').forEach((el, index) => {
			const text = el.innerText;
			el.setAttribute('aria-label', text);
			el.querySelectorAll('*:not(img, h1, h2, h3, h4, h5, h6)').forEach((el, index) => {
				el.setAttribute('role', 'none');
				el.setAttribute('aria-hidden', 'true');
			});
		});
		document.body.querySelectorAll('p > span').forEach((el, index) => {
			el.setAttribute("role", "text");
		});

		document.body.querySelectorAll('p > span > span').forEach((el, index) => {
			el.setAttribute("role", "text");
		});
	};
};

// radio
function ariaRadio() {
	var radioGroups = document.body.querySelectorAll('[role="radiogroup"]');
	radioGroups.forEach(function (radioGroup) {
		var radioBox = radioGroup.querySelectorAll('[role="radio"]');
		var firstRadio = radioBox[0];
		var lastRadio = radioBox[radioBox.length - 1];
		var hasChecked = false;

		var _loop = function _loop(i) {
			if (radioBox[i].getAttribute("aria-checked") == "true") {
				radioBox[i].tabIndex = 0;
				hasChecked = true;
			} else {
				radioBox[i].tabIndex = -1;
			}

			radioBox[i].addEventListener("click", function (e) {
				var target = e.currentTarget;
				radioBox.forEach(function (radio) {
					if (radio !== target) {
						radio.setAttribute("aria-checked", false);
						radio.tabIndex = -1;
					}
				});
				target.setAttribute("aria-checked", true);
				target.tabIndex = 0;
			});

			radioBox[i].addEventListener("keydown", function (e) {
				var target = e.currentTarget;
				if (e.keyCode === 37 || e.keyCode === 38) {
					// previous : left,up
					target.setAttribute("aria-checked", false);
					target.tabIndex = -1;
					if (target == firstRadio) {
						if (lastRadio.getAttribute("aria-disabled", "true")) {
							lastRadio.setAttribute("aria-checked", "false");
						} else {
							lastRadio.setAttribute("aria-checked", true);
							lastRadio.click();
						};
						lastRadio.tabIndex = 0;
						setTimeout(function () {
							lastRadio.focus();
						}, 500)
					} else {
						if (radioBox[i - 1].getAttribute("aria-disabled", "true")) {
							radioBox[i - 1].setAttribute("aria-checked", "false");
						} else {
							radioBox[i - 1].setAttribute("aria-checked", true);
							radioBox[i - 1].click();
						};
						radioBox[i - 1].tabIndex = 0;
						setTimeout(function () {
							radioBox[i - 1].focus();
						}, 500)
					}
					e.preventDefault();
				}
				if (e.keyCode === 39 || e.keyCode === 40) {
					// next : right,down
					target.setAttribute("aria-checked", false);
					target.tabIndex = -1;
					if (target == lastRadio) {
						if (firstRadio.getAttribute("aria-disabled", "true")) {
							firstRadio.setAttribute("aria-checked", "false");
						} else {
							firstRadio.setAttribute("aria-checked", true);
							firstRadio.click();
						};
						firstRadio.tabIndex = 0;
						setTimeout(function () {
							firstRadio.focus();
						}, 500)
					} else {
						if (radioBox[i + 1].getAttribute("aria-disabled", "true")) {
							radioBox[i + 1].setAttribute("aria-checked", "false");
						} else {
							radioBox[i + 1].setAttribute("aria-checked", true);
							radioBox[i + 1].click();
						};
						radioBox[i + 1].tabIndex = 0;
						setTimeout(function () {
							radioBox[i + 1].focus();
						}, 500)
					}
					e.preventDefault();
				}

				if (e.keyCode === 32) {
					// select: space
					if (target.getAttribute("aria-checked") !== 'true') {
						target.setAttribute("aria-checked", true);
						target.click();
					}
					e.preventDefault();
				}
			});
		};

		for (var i = 0; i < radioBox.length; i++) {
			_loop(i);
		}
		if (!hasChecked) radioBox[0].tabIndex = 0;
	});
};
//aria tab
function ariaTab() {
	var tablists = document.body.querySelectorAll('[role="tablist"]');
	tablists.forEach(function (tablist) {
		var tabBox = tablist.querySelectorAll('[role="tab"]');
		var firstTab = tabBox[0];
		var lastTab = tabBox[tabBox.length - 1];
		var hasSelected = false;

		var _loop = function _loop(i) {
			if (tabBox[i].getAttribute("aria-selected") == "true") {
				tabBox[i].tabIndex = 0;
				hasSelected = true;
			} else {
				tabBox[i].tabIndex = -1;
			}

			tabBox[i].addEventListener("click", function (e) {
				var target = e.currentTarget;
				tabBox.forEach(function (tab) {
					if (tab !== target) {
						tab.setAttribute("aria-selected", false);
						tab.tabIndex = -1;
					}
				});
				target.setAttribute("aria-selected", true);
				target.tabIndex = 0;
			});

			tabBox[i].addEventListener("keydown", function (e) {
				var target = e.currentTarget;
				if (!tablist.getAttribute("aria-orientation", "vertical")) {
					if (e.keyCode === 37) {
						// previous : left
						if (tablist.getAttribute('data-mode', 'aria1.2')) {
							if (target == firstTab) {
								lastTab.focus();
							} else {
								tabBox[i - 1].focus();
							}
						} else {
							target.setAttribute("aria-selected", false);
							target.tabIndex = -1;
							if (target == firstTab) {
								lastTab.setAttribute("aria-selected", true);
								lastTab.click();
								lastTab.tabIndex = 0;
								lastTab.focus();
							} else {
								tabBox[i - 1].setAttribute("aria-selected", true);
								tabBox[i - 1].click();
								tabBox[i - 1].tabIndex = 0;
								tabBox[i - 1].focus();
							}
						}
					} else if (e.keyCode === 39) {
						if (tablist.getAttribute('data-mode', 'aria1.2')) {
							// next : right,down
							if (target == lastTab) {
								firstTab.focus();
							} else {
								tabBox[i + 1].focus();
							}
						} else {
							// next : right,down
							target.setAttribute("aria-selected", false);
							target.tabIndex = -1;
							if (target == lastTab) {
								firstTab.setAttribute("aria-selected", true);
								firstTab.click();
								firstTab.tabIndex = 0;
								firstTab.focus();
							} else {
								tabBox[i + 1].setAttribute("aria-selected", true);
								tabBox[i + 1].click();
								tabBox[i + 1].tabIndex = 0;
								tabBox[i + 1].focus();
							}
						}
					} else if (e.keyCode === 32) {
						// select: space
						if (target.getAttribute("aria-selected") !== 'true') {
							target.setAttribute("aria-selected", true);
							target.click();
						}
					}
				}
				e.preventDefault
			});
		};

		for (var i = 0; i < tabBox.length; i++) {
			_loop(i);
		}
		if (!hasSelected) tabBox[0].tabIndex = 0;
	});
};

// waiAriaListBox
var waiAriaListBox = function waiAriaListBox() {
	var boxBtns = document.body.querySelectorAll('[aria-haspopup="listbox"]');
	boxBtns.forEach(function (boxBtn) {
		var ariaListBox = document.querySelector('#' + boxBtn.getAttribute("aria-controls"));
		var listOptions = ariaListBox.querySelectorAll('[role="option"]');

		boxBtn.addEventListener("click", function (e) {
			setTimeout(function () {
				if (boxBtn.getAttribute("aria-expanded", "true")) {
					const listSelected = ariaListBox.querySelector('[role="option"][aria-selected="true"]');
					if (listSelected) {
						listSelected.focus();
					} else {
						listOptions[0].focus();
					}
				}
			}, 500);
		});

		boxBtn.addEventListener("keydown", function (e) {
			if (e.keyCode === 38) {
				// up
				boxBtn.click();
				e.preventDefault();
			}
			if (e.keyCode === 40) {
				// down
				boxBtn.click();
				e.preventDefault();
			}
		});

		var _loop = function _loop(i) {
			listOptions[i].tabIndex = -1;
			const listSelected = ariaListBox.querySelector('[role="option"][aria-selected="true"]');
			if (listSelected) {
				listSelected.tabIndex = 0;
			} else {
				listOptions[0].tabIndex = 0;
			}

			listOptions[i].addEventListener("click", function () {
				listSelectEvent(ariaListBox, listOptions[i]);
				if (boxBtn.getAttribute("aria-expanded", "true")) {
					boxBtn.setAttribute("aria-expanded", "false")
				}
				boxBtn.focus()
			});

			listOptions[i].addEventListener("keydown", function (e) {
				if (e.keyCode === 13) {
					// enter
					listOptions[i].click();
					e.preventDefault();
					e.stopPropagation();
				}
				if (e.keyCode === 38) {
					// up
					listOptions[i - 1].focus();
					e.preventDefault();
				}
				if (e.keyCode === 40) {
					// down
					listOptions[i + 1].focus();
					e.preventDefault();
				}
				if (e.keyCode === 9 || e.keyCode === 27) {
					// tab, esc
					boxBtn.click();
					boxBtn.focus();
					e.preventDefault();
				}
			});
		};

		for (var i = 0; i < listOptions.length; i++) {
			_loop(i);
		}
	});

	function listSelectEvent(ariaListBox, listOption) {
		const selected = ariaListBox.querySelector('[role="option"][aria-selected="true"]');
		if (!selected) {
			listOption.setAttribute("aria-selected", true);
		}
		if (selected !== listOption) {
			if (selected !== null) {
				selected.setAttribute("aria-selected", false);
				listOption.setAttribute("aria-selected", true);
			} else {
				listOption.setAttribute("aria-selected", true);
			}
		}
	}
};

// ariaCurrent
function ariaCurrent(element) {
	var ariaCurrentElements = element.querySelectorAll('[aria-current]')
	var _loop = function (i) {
		ariaCurrentElements[i].addEventListener("click", function () {
			ariaCurrentEvent(element, ariaCurrentElements[i])
		})
	}
	for (var i = 0; i < ariaCurrentElements.length; i++) {
		_loop(i)
	}
	function ariaCurrentEvent(element, ariaCurrentElement) {
		const currentTrue = element.querySelector('[aria-current="true"]')
		if (!currentTrue) {
			ariaCurrentElement.setAttribute("aria-current", "true")
		}
		if (currentTrue !== ariaCurrentElement) {
			if (currentTrue !== null) {
				currentTrue.setAttribute("aria-current", "false")
				ariaCurrentElement.setAttribute("aria-current", "true")
			} else {
				ariaCurrentElement.setAttribute("aria-current", "true")
			}
		}
	}
}

// radioAsButton
function radioAsButton(Container) {
	const Controllers = Container.querySelectorAll('label');
	const RealControllers = Container.querySelectorAll('input');
	$(RealControllers).css("display", "none")
	Controllers.forEach(_ => {
		_.setAttribute("role", "button")
		initialize()
		_.addEventListener("click", function () {
			initialize()
		})
		$(Container).find('input:radio').click(function () {
			if ($(this).is(':checked')) {
				$(Container).find("label").attr("aria-current", "false")
				$('label[for=' + this.id + ']').attr("aria-current", "true")
			}
		})
		function initialize() {
			const real = Container.querySelector("#" + _.htmlFor)
			if (real) {
				if (real.checked) {
					$(Container).find("label").attr("aria-current", "false")
					_.setAttribute("aria-current", "true")
				}
			}
		}
	});
}

//dropdownmenu
var waiAriaHasPopupMenu = function waiAriaHasPopupMenu() {
	var haspops = document.body.querySelectorAll('[aria-haspopup="true"], [aria-haspopup="menu"]');
	haspops.forEach(function (haspop) {
		menuEvent(haspop)
	})
	function menuEvent(btn) {
		var popup = document.querySelector('#' + btn.getAttribute("aria-controls"));
		var isSub = !getClosestParent(btn, '[role="menu"]') ? false : true;
		if (!popup) return;

		var menuItems = popup.querySelectorAll('[role="menuitem"]')
		if (menuItems.length < 1) return;

		var menus = [];
		for (var i = 0; i < menuItems.length; i++) {
			menus.push(menuItems[i]);
		}

		var subPops = popup.querySelectorAll('[aria-haspopup="true"][role="menuitem"], [aria-haspopup="menu"][role="menuitem"]');
		var hasSubs = [];
		for (var i = 0; i < subPops.length; i++) {
			hasSubs.push(subPops[i]);
		}

		var subPops = [];
		for (var i = 0; i < hasSubs.length; i++) {
			subPops.push(popup.querySelector('#' + hasSubs[i].getAttribute("aria-controls")));
		}

		var _loop = function _loop(_i) {
			menus = menus.filter(function (menu) {
				return !subPops[_i].contains(menu);
			});
		};

		for (var _i = 0; _i < subPops.length; _i++) {
			_loop(_i);
		}

		var _loop2 = function _loop2(_i2) {
			menus[_i2].isSub = true;
			menus[_i2].addEventListener("keydown", function (e) {
				if (e.keyCode === 38) {
					// up
					if (menus[_i2] == menus[0]) {
						menus[menus.length - 1].focus();
					} else {
						menus[_i2 - 1].focus();
					}
					e.stopPropagation();
					e.preventDefault();
				}
				if (e.keyCode === 40) {
					// down
					if (menus[_i2] == menus[menus.length - 1]) {
						menus[0].focus();
					} else {
						menus[_i2 + 1].focus();
					}
					e.stopPropagation();
					e.preventDefault();
				}
				if (e.keyCode === 37) {
					// left
					if (btn.isSub && btn.getAttribute("role", "menuitem")) {
						btn.click();
						btn.focus();
						e.preventDefault();
					}
				}
			});
		};

		for (var _i2 = 0; _i2 < menus.length; _i2++) {
			_loop2(_i2);
		}

		btn.addEventListener("click", function (e) {
			setTimeout(function () {
				menus[0].focus();
				e.preventDefault();
			}, 500)
		});
		if (event.target !== null && menus) {
			menus[0].focus()
		}
		btn.addEventListener("keydown", function (e) {
			if (btn.isSub) {
				if (e.keyCode === 39) {
					// right
					btn.click();
					e.preventDefault();
				}
				if (e.keyCode === 38) {
					// up
					btn.click();
					setTimeout(function () {
						menus[menus.length - 1].focus();
					}, 600)
					e.preventDefault();
				}
				if (e.keyCode === 40) {
					// down
					btn.click();
					e.preventDefault();
				}
			}
		});

		btn.addEventListener("keypress", function (e) {
			if (e.keyCode === 32) {
				// space
				btn.click();
				event.preventDefault();
			}
		});
	};
};

function getClosestParent(el, query) {
	while (el.querySelector(query)) {
		el = el.parentNode
		if (!el) {
			return null
		}
	}
	return el
}

// create ids for children of target without id;
/** 
		* @function createIdForChildrenOf This function is for giving a Id to each children of a target Element. If you didn't set the target when you call this function, default target will be set to a body tag in your product documents. It's the same with createIdForAllTag Method.
		* @param {HTMLElement} targetElement
		* **targetElement**:
		* targetElement is for set a target that will be given an automated id.
		* 
		* @param {boolean} useNewFormat
		* **useNewFormat** decides a method for format of automatically created id.
		* - **false**: indexing format (default) : Existing old format like next example: AIID_{TagName}_index
		* - **true**: Randomized format of mixed alphabet and number characters. create randomized 24-digit character basically. example: AIID_{TagName}_adaE52Qa2Qa1A213Az235511
		* @param {number} randomizeLength
		* **randomizeLength** decides a length of character-digit when useNewFormat has set to true. It is set to basically 24-digit, If this parameter isn't initialized.
		* @param {string} startWith
		* **startWith** decides insert your starting keyword before of randmoized id format.
*/
function createIdForChildrenOf(
	targetElement = document.body,
	useNewFormat = false,
	randomizeLength = 24,
	startWith = ""
) {
	function getRandom(rangeEnd, rangeStart = 0) { return Math.floor(Math.random() * (rangeEnd - rangeStart)) + rangeStart; };
	function getNumberic() { return String.fromCharCode(getRandom(57, 48)); };
	function getAlphabet() { return String.fromCharCode(getRandom(2) ? getRandom(97, 122) : getRandom(65, 90)); };
	function getAlphaNumeric() { return getRandom(2) ? getAlphabet() : getNumberic(); };
	function generateRandomizedId(length = 24, startWith = "") {
		function RandomIDCode() { return new Array(length).fill('').map((el, idx) => idx % 2 === 0 ? getAlphabet() : getAlphaNumeric()).join(''); };
		var automatedID = startWith + RandomIDCode();
		var checkExists = document.querySelector("#" + automatedID);
		while (checkExists) {
			automatedID = startWith + RandomIDCode();
			checkExists = document.querySelector("#" + automatedID);
		}
		return automatedID;
	}

	(function (
		/** @type {HTMLElement}*/ target = targetElement,
	) {
		if (Boolean(target)) {
			function setInitializeAutoIdentifier(
						/**@type {HTMLElement[]|NodeList}*/ elements
			) {
				elements.forEach(/** @param {Element} $e*/($e) => {
					/** @type {string} */
					var $tagName = $e.tagName.toLowerCase();

					/** @type {RegEXP} */
					var ignoredTags = /^(html|head|link|script|style|body|meta|title)$/;

					/** @type {boolean} */
					var isIgnoredTag = ignoredTags.test($tagName);

					/** @type {HTMLElement[]} */
					var AllElems = Array.prototype.slice.call(document.body.querySelectorAll($tagName));

					/** @type {number} */
					var $docIndex = AllElems.indexOf($e) + 1;
					if (!isIgnoredTag) {
						if (!useNewFormat) {
							$e.id = $e.id ? $e.id : "AIID_" + $e.tagName.toLowerCase() + "_" + $docIndex;
						} else {
							$e.id = $e.id ? $e.id : generateRandomizedId(randomizeLength, startWith.length > 0 ? startWith + $e.tagName.toLowerCase() + "_" : "AIID_" + $e.tagName.toLowerCase() + "_");
						}
					}
				});
			}

			/**
				* 
				* @param {MutationRecord} Record 
				*/
			var MTO_Callback = (Record) => {
				setInitializeAutoIdentifier(Record.addedNodes ? Record.addedNodes : []);
			}
		/** @type {MutationObserverInit} */ var MTO_ObserveInitOptions = {
				subtree: true,
				childList: true,
			}
			var mtObserver = new MutationObserver(MTO_Callback);

			mtObserver.observe(target, MTO_ObserveInitOptions);
			setInitializeAutoIdentifier(document.body.querySelectorAll("*"));
		} else {
			throw new Error("Target element not found. Please check that you entered the correct selector and try again.");
		}
	})();
}

// create ids for all tag without id
/**
	* @param {boolean} useNewFormat @see createIdForChildrenOf
	* @param {string} startWith @see createIdForChildrenOf
	*/
function createIdForAllTag(useNewFormat = false, startWith = "AIID") {
	if (useNewFormat) {
		createIdForChildrenOf(document.body, true, 24, startWith);
	} else {
		createIdForChildrenOf( /* default : document.body */);
	}
}

// set as heading with level between 1 to 6

/**
	* @param {number} level :insert 1 to 6
	*/
Element.prototype.setAsHeading = function setToHeadingElement(level) {
	const target = this;
	if (typeof level == "number") {
		const Level = (level <= 6 && level >= 1) ? level : 1;
		const tagName = target.tagName.toLowerCase();
		const appliedTags = /^(div|b|u|i|s|p|strong|span|em)$/
		if (appliedTags.test(tagName)) {
			target.setAttribute('role', "heading");
			target.setAttribute('aria-level', Level);
		} else {
			throw new Error(`You're trying to set a ${tagName} tag as heading. it may be a mistake.`);
		}
	} else {
		throw new Error(`You typed a value that's not a number. Or, You didn't type anything at 'level' parameter. level parameter is required and it must be a number.`)
	}
};

/**
	* @param {HTMLElement} target
	* @param {number} level :insert 1 to 6
	*/
function setAsHeading(target, level) {
	if (typeof level == "number") {
		const Level = (level <= 6 && level >= 1) ? level : 1;
		const tagName = target.tagName.toLowerCase();
		const appliedTags = /^(div|b|u|i|s|p|strong|span|em)$/
		if (appliedTags.test(tagName)) {
			target.setAttribute('role', "heading");
			target.setAttribute('aria-level', Level);
		} else {
			throw new Error(`You're trying to set a ${tagName} tag as heading. it may be a mistake.`);
		}
	} else {
		const NumError = `You typed a value that's not a number. Or, You didn't type anything at 'level' parameter. level parameter is required and it must be a number.`;
		const ElementError = "\nYou insert a wrong element, Element not found. Please you make sure insert the correct HTML Element";
		const ErrorMsg = `${typeof level != "number" ? NumError : ""}${!target instanceof Element ? ElementError : ""}`;

		throw new Error(ErrorMsg);
	}
};

/** @param {string} sectionHeader Section headings selector */
/** @param {string} viewMoreLinks View More Link for section*/
function setViewMoreLinkLabel(sectionHeaders, viewMoreLinks) {
	const sectionHeaderElements = document.body.querySelectorAll(sectionHeaders);
	const viewMoreLinkElements = document.body.querySelectorAll(viewMoreLinks);
	sectionHeaderElements.forEach((e, i) => {
		const vml = viewMoreLinkElements[i];
		if (vml) vml.setAttribute('aria-label', `${e.innerText} ${vml.innerText}`)
	})
}
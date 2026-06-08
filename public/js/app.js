// Mobile
const burger = document.querySelector('.burger');
const nav = document.querySelector('.header nav');

if (burger && nav) {
  burger.addEventListener('click', () => {
    nav.classList.toggle('open');
    burger.classList.toggle('open');
  });
}

// Interface themes
const themeSelects = document.querySelectorAll(".theme-select");

function applyTheme(theme) {
	document.body.classList.remove('dark', 'high-contrast');

	if (theme === 'dark') document.body.classList.add('dark');
	if (theme === 'high_contrast') document.body.classList.add('high-contrast');

	localStorage.setItem('theme', theme);

	for (const select of themeSelects) {
		select.value = theme;
	}
}

for (const select of themeSelects) {
	select.addEventListener("change", () => {
		applyTheme(select.value);
	});
}

applyTheme(localStorage.getItem('theme') || 'light');

// Google translate 
function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    {
      pageLanguage: 'en',
      includedLanguages: 'en,es,fr,ar,ur,pl,ro',
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    },
    'google_translate_element'
  );
}

// Text to speech, ref: https://github.com/mdn/dom-examples/blob/main/web-speech-api/speak-easy-synthesis
const supportsSpeech = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
const synth = supportsSpeech ? window.speechSynthesis : null;
const voiceSelects = document.querySelectorAll(".speech-voice");
const rateRanges = document.querySelectorAll(".speech-rate");
const pitchRanges = document.querySelectorAll(".speech-pitch");
const rateValues = document.querySelectorAll(".speech-rate-value");
const pitchValues = document.querySelectorAll(".speech-pitch-value");
const readHoverCheckboxes = document.querySelectorAll(".speech-read-hover");
const speechReadButtons = document.querySelectorAll(".speech-read");
const speechStopButtons = document.querySelectorAll(".speech-stop");

const speechSettings = {
	readOnHover: localStorage.getItem("speechReadOnHover") === "true",
	voice: localStorage.getItem("speechVoice") || "",
	rate: localStorage.getItem("speechRate") || "1",
	pitch: localStorage.getItem("speechPitch") || "1",
};

function loadVoices() {
	if (!supportsSpeech || !voiceSelects.length) return;

	for (const voiceSelect of voiceSelects) {
		voiceSelect.innerHTML = "";

		for (const voice of synth.getVoices()) {
			const option = document.createElement("option");

			option.value = voice.name;
			option.textContent = `${voice.name} (${voice.lang})`;

			voiceSelect.appendChild(option);
		}

		if (speechSettings.voice) {
			voiceSelect.value = speechSettings.voice;
		}
	}
}

function syncSpeechControls() {
	for (const voiceSelect of voiceSelects) voiceSelect.value = speechSettings.voice;
	for (const rateRange of rateRanges) rateRange.value = speechSettings.rate;
	for (const pitchRange of pitchRanges) pitchRange.value = speechSettings.pitch;
	for (const readHoverCheckbox of readHoverCheckboxes) readHoverCheckbox.checked = speechSettings.readOnHover;
	for (const rateValue of rateValues) rateValue.textContent = speechSettings.rate;
	for (const pitchValue of pitchValues) pitchValue.textContent = speechSettings.pitch;
}

function saveSpeechSettings() {
	localStorage.setItem("speechReadOnHover", speechSettings.readOnHover);
	localStorage.setItem("speechVoice", speechSettings.voice);
	localStorage.setItem("speechRate", speechSettings.rate);
	localStorage.setItem("speechPitch", speechSettings.pitch);

	syncSpeechControls();
}

function createUtterance(text) {
	const utter = new SpeechSynthesisUtterance(text);

	utter.voice = synth
		.getVoices()
		.find(v => v.name === speechSettings.voice);

	utter.rate = Number(speechSettings.rate);
	utter.pitch = Number(speechSettings.pitch);

	return utter;
}

function getSelectedText() {
	return window.getSelection().toString().trim();
}

function getSpeechText() {
	const selectedText = getSelectedText();
	if (selectedText) return selectedText;

	const main = document.querySelector("main");
	return main ? main.innerText.trim() : "";
}

function readPageText() {
	if (!supportsSpeech) return;

	const text = getSpeechText();
	if (!text) return;

	synth.cancel();
	synth.speak(createUtterance(text));
}

function getHoverSpeechText(target) {
	const readable = target.closest("a, button, label, p, li, h1, h2, h3, h4, td, th, input, select, textarea");
	if (!readable || readable.closest(".speech-controls")) return "";

	if (readable.matches("input, textarea, select")) {
		return readable.getAttribute("aria-label") || readable.placeholder || readable.value || "";
	}

	return readable.getAttribute("aria-label") || readable.innerText || readable.textContent || "";
}

if (voiceSelects.length && rateRanges.length && pitchRanges.length) {
	syncSpeechControls();

	if (supportsSpeech) {
		synth.onvoiceschanged = loadVoices;
		loadVoices();
	}
	else {
		for (const voiceSelect of voiceSelects) voiceSelect.disabled = true;
		for (const speechReadButton of speechReadButtons) speechReadButton.disabled = true;
		for (const speechStopButton of speechStopButtons) speechStopButton.disabled = true;
		for (const readHoverCheckbox of readHoverCheckboxes) readHoverCheckbox.disabled = true;
	}

	for (const voiceSelect of voiceSelects) {
		voiceSelect.addEventListener("change", () => {
			speechSettings.voice = voiceSelect.value;
			saveSpeechSettings();
		});
	}

	for (const rateRange of rateRanges) {
		rateRange.addEventListener("input", () => {
			speechSettings.rate = rateRange.value;
			saveSpeechSettings();
		});
	}

	for (const pitchRange of pitchRanges) {
		pitchRange.addEventListener("input", () => {
			speechSettings.pitch = pitchRange.value;
			saveSpeechSettings();
		});
	}

	for (const readHoverCheckbox of readHoverCheckboxes) {
		readHoverCheckbox.addEventListener("change", () => {
			speechSettings.readOnHover = readHoverCheckbox.checked;
			saveSpeechSettings();
		});
	}
}

for (const speechReadButton of speechReadButtons) {
	speechReadButton.addEventListener("click", readPageText);
}

for (const speechStopButton of speechStopButtons) {
	speechStopButton.addEventListener("click", () => {
		if (!supportsSpeech) return;
		synth.cancel();
	});
}

document.addEventListener("mouseover", (event) => {
	if (!supportsSpeech || !speechSettings.readOnHover) return;

	const text = getHoverSpeechText(event.target).trim();
	if (!text) return;

	synth.cancel();
	synth.speak(createUtterance(text));
});

document.addEventListener("selectionchange", () => {
	speechReadButtons[0].textContent = getSelectedText() 
		? "Read Selection"
		: "Read Page";
});

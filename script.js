// Quiz starten
function startQuiz(quizId) {
	document
		.querySelectorAll('.quiz')
		.forEach((q) => q.classList.add('hidden'));
	document.getElementById('start-menu').classList.add('hidden');
	document.getElementById(quizId).classList.remove('hidden');

	// Spezielle Initialisierungen je nach Quiz
	if (quizId === 'quizF1F') {
		setTimeout(initializeF1F, 100); // Warte bis DOM geladen
	}
	if (quizId === 'quizJ1G') {
		setTimeout(initializeERDTool, 100);
	}
	if (quizId === 'quizJ1E') {
		setTimeout(initializeERDTask, 100);
	}
	if (quizId === 'quizI1F') {
		setTimeout(initializeNormalization, 100);
	}
}

// Zurück zum Menü
function goHome() {
	document
		.querySelectorAll('.quiz')
		.forEach((q) => q.classList.add('hidden'));
	document.getElementById('start-menu').classList.remove('hidden');
}

// Quiz auswerten (Radio Buttons)
function checkQuiz(formId, resultId) {
	const form = document.getElementById(formId);
	if (!form) return;

	const inputs = form.querySelectorAll(
		'input[type=radio]:checked, input[type=checkbox]:checked'
	);
	let score = 0;
	let totalScore = 0;

	// Zähle die möglichen Punkte
	const allInputs = form.querySelectorAll(
		'input[type=radio], input[type=checkbox]'
	);
	allInputs.forEach((input) => {
		if (input.value === '1') totalScore++;
	});

	inputs.forEach((input) => {
		if (input.value === '1') score++;
		if (input.value === '0' && input.type === 'checkbox') {
			// Für Checkboxen: falsche Antworten abziehen
			score--;
		}
	});

	// Mindestscore 0
	if (score < 0) score = 0;

	const result = document.getElementById(resultId);
	const percentage =
		totalScore > 0 ? Math.round((score / totalScore) * 100) : 0;

	result.innerHTML = `
        <strong>Ergebnis:</strong> ${score} von ${totalScore} Punkten erreicht (${percentage}%)<br>
        <div style="margin-top: 10px;">
            ${
				percentage === 100
					? '🎉 Perfekt! Alle Antworten sind richtig!'
					: percentage >= 70
					? '👍 Gut gemacht! Fast alle Antworten sind richtig.'
					: percentage >= 50
					? '👌 Okay, aber es gibt noch Luft nach oben.'
					: '📚 Übe noch ein bisschen mehr!'
			}
        </div>
    `;
	result.style.color =
		percentage === 100
			? '#28a745'
			: percentage >= 70
			? '#28a745'
			: percentage >= 50
			? '#ffc107'
			: '#dc3545';
	result.classList.remove('hidden');
}

// Flashcards drehen
function flip(card) {
	if (card && card.querySelector('.card')) {
		card.querySelector('.card').classList.toggle('flip');
	}
}

// C1E - Datentyp transformieren (Umwandlung)
function convertValue() {
	const input = document.getElementById('inputValue').value;
	const targetType = document.getElementById('targetType').value;
	let result = '';
	let error = false;
	let explanation = '';

	try {
		switch (targetType) {
			case 'int':
				result = parseInt(input) || 0;
				explanation = `parseInt("${input}") = ${result}`;
				break;
			case 'float':
				result = parseFloat(input) || 0.0;
				explanation = `parseFloat("${input}") = ${result}`;
				break;
			case 'string':
				result = String(input);
				explanation = `String(${JSON.stringify(input)}) = "${result}"`;
				break;
			case 'boolean':
				result = Boolean(input);
				explanation = `Boolean(${JSON.stringify(input)}) = ${result}`;
				break;
			default:
				result = 'Unbekannter Typ';
				error = true;
		}
	} catch (e) {
		result = 'Fehler bei der Umwandlung';
		error = true;
		explanation = e.message;
	}

	const resultElement = document.getElementById('conversionResult');
	resultElement.innerHTML = `
        <strong>Eingabe:</strong> ${JSON.stringify(
			input
		)} (Typ: ${typeof input})<br>
        <strong>Zieltyp:</strong> ${targetType}<br>
        <strong>Ergebnis:</strong> ${result} (Typ: ${typeof result})<br>
        <strong>Erklärung:</strong> ${explanation}
    `;
	resultElement.style.color = error ? '#dc3545' : '#28a745';
	resultElement.classList.remove('hidden');
}

// Initialisierung beim Laden
document.addEventListener('DOMContentLoaded', function () {
	console.log('Kompetenz-Quiz geladen');

	// Event-Listener für alle Flashcard-Klicks
	document.querySelectorAll('.flashcard').forEach((card) => {
		card.addEventListener('click', function () {
			flip(this);
		});
	});

	// Event-Listener für alle Radio/Checkbox-Änderungen (optionales Feedback)
	document
		.querySelectorAll('input[type="radio"], input[type="checkbox"]')
		.forEach((input) => {
			input.addEventListener('change', function () {
				// Optional: Sofortiges Feedback zeigen
				if (this.dataset.feedback) {
					showTemporaryMessage(this.dataset.feedback, 'info');
				}
			});
		});
});

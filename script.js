// Quiz starten
function startQuiz(quizId) {
	document
		.querySelectorAll('.quiz')
		.forEach((q) => q.classList.add('hidden'));
	document.getElementById('start-menu').classList.add('hidden');
	document.getElementById(quizId).classList.remove('hidden');
}

// Zurück zum Menü
function goHome() {
	document
		.querySelectorAll('.quiz')
		.forEach((q) => q.classList.add('hidden'));
	document.getElementById('start-menu').classList.remove('hidden');
}

// Quiz auswerten
function checkQuiz(formId, resultId) {
	const form = document.getElementById(formId);
	const inputs = form.querySelectorAll('input[type=radio]:checked');
	let score = 0;
	inputs.forEach((input) => {
		if (input.value === '1') score++;
	});

	const total = form.querySelectorAll('input[type=radio]').length / 3;
	const result = document.getElementById(resultId);
	result.textContent = `Du hast ${score} von ${total} Punkten erreicht.`;
	result.style.color = score === total ? 'green' : 'red';
	result.classList.remove('hidden');
}

// Flashcards umdrehen
function flip(cardDiv) {
	const card = cardDiv.querySelector('.card');
	card.classList.toggle('flip');
}

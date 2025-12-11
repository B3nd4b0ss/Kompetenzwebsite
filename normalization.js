// Normalisierungsübungen für I1F und I1E

function initializeNormalization() {
	console.log('Initialisiere Normalisierungsübungen');

	// I1F - Normalisierung anwenden
	if (document.getElementById('tableI1F')) {
		setupNormalizationTable();
	}

	// I1E - Kritische Analyse
	if (document.getElementById('normalizationSlider')) {
		setupCriticalAnalysis();
	}
}

function setupNormalizationTable() {
	const table = document.getElementById('tableI1F');
	if (!table) return;

	// Beispiel-Daten für Normalisierungsübung
	const problems = [
		{
			description: 'Name + Adresse + Telefon in einem Feld',
			correctAnswer: '1NF',
			explanation: 'Nicht-atomare Werte - Verstößt gegen 1. Normalform',
		},
		{
			description:
				'Bestellnummer + Kundenname (Kundenname hängt nur von KundenID ab)',
			correctAnswer: '2NF',
			explanation:
				'Partielle Abhängigkeit - Verstößt gegen 2. Normalform',
		},
		{
			description:
				'Produkt + Lieferant + LieferantTelefon (Telefon hängt von Lieferant ab)',
			correctAnswer: '3NF',
			explanation:
				'Transitive Abhängigkeit - Verstößt gegen 3. Normalform',
		},
		{
			description:
				"Mehrere Telefonnummern in einer Spalte (z.B. '123-456, 789-012')",
			correctAnswer: '1NF',
			explanation: 'Wiederholungsgruppe - Verstößt gegen 1. Normalform',
		},
		{
			description: 'Student + Kurs + Dozent (Dozent hängt von Kurs ab)',
			correctAnswer: '3NF',
			explanation:
				'Transitive Abhängigkeit - Verstößt gegen 3. Normalform',
		},
	];

	const tbody = table.querySelector('tbody');
	tbody.innerHTML = '';

	problems.forEach((problem, index) => {
		const row = document.createElement('tr');
		row.innerHTML = `
            <td>${problem.description}</td>
            <td>
                <select class="nf-select" data-correct="${problem.correctAnswer}">
                    <option value="">-- Auswählen --</option>
                    <option value="1NF">1. Normalform</option>
                    <option value="2NF">2. Normalform</option>
                    <option value="3NF">3. Normalform</option>
                    <option value="kein">Kein Problem</option>
                </select>
            </td>
            <td class="explanation-cell"></td>
        `;
		tbody.appendChild(row);

		// Event-Listener für sofortiges Feedback
		const select = row.querySelector('.nf-select');
		const explanationCell = row.querySelector('.explanation-cell');

		select.addEventListener('change', function () {
			if (this.value === this.dataset.correct) {
				explanationCell.innerHTML = `<span style="color: #28a745;">✓ Richtig!</span><br><small>${problem.explanation}</small>`;
				this.style.borderColor = '#28a745';
			} else if (this.value !== '') {
				explanationCell.innerHTML = `<span style="color: #dc3545;">✗ Falsch</span><br><small>${problem.explanation}</small>`;
				this.style.borderColor = '#dc3545';
			} else {
				explanationCell.innerHTML = '';
				this.style.borderColor = '';
			}
		});
	});
}

function checkNormalization() {
	const selects = document.querySelectorAll('.nf-select');
	let correct = 0;
	let total = selects.length;
	let detailedFeedback = [];

	selects.forEach((select, index) => {
		if (select.value === select.dataset.correct) {
			correct++;
			detailedFeedback.push(`✓ Aufgabe ${index + 1}: Richtig`);
		} else if (select.value === '') {
			detailedFeedback.push(`✗ Aufgabe ${index + 1}: Nicht beantwortet`);
		} else {
			detailedFeedback.push(
				`✗ Aufgabe ${index + 1}: Falsch (richtig: ${
					select.dataset.correct
				})`
			);
		}
	});

	const percentage = Math.round((correct / total) * 100);
	const result = document.getElementById('resultI1F');

	result.innerHTML = `
        <h4>Normalisierungsübung Auswertung</h4>
        <p><strong>Ergebnis:</strong> ${correct} von ${total} richtig (${percentage}%)</p>
        <div class="feedback-details">
            ${detailedFeedback.map((f) => `<p>${f}</p>`).join('')}
        </div>
        <div style="margin-top: 15px;">
            <p><strong>Bewertung:</strong></p>
            <p>${
				percentage === 100
					? '🎉 Perfekt! Du beherrschst die Normalisierungsregeln.'
					: percentage >= 70
					? '👍 Gut! Du verstehst die Grundkonzepte.'
					: percentage >= 50
					? '👌 Akzeptabel, aber es gibt noch Lücken.'
					: '📚 Übe weiter! Die Normalisierung ist ein wichtiges Konzept.'
			}</p>
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

function showNormalizedSolution() {
	const solutionDiv = document.getElementById('normalizedSolution');
	if (!solutionDiv) return;

	solutionDiv.innerHTML = `
        <h4>Lösung: Normalisierte Tabellen</h4>
        <div class="solution-tables">
            <div class="table-solution">
                <h5>Original (nicht normalisiert):</h5>
                <table border="1">
                    <tr><th>BestellNr</th><th>KundenName</th><th>KundenAdresse</th><th>Artikel</th><th>Lieferant</th><th>LieferantTel</th></tr>
                    <tr><td>B001</td><td>Max Müller</td><td>Berlin</td><td>Tisch, Stuhl</td><td>Möbel AG</td><td>030-123456</td></tr>
                </table>
            </div>
            
            <div class="table-solution">
                <h5>1. Normalform (1NF):</h5>
                <table border="1">
                    <tr><th>BestellNr</th><th>KundenName</th><th>KundenAdresse</th><th>Artikel</th><th>Lieferant</th><th>LieferantTel</th></tr>
                    <tr><td>B001</td><td>Max Müller</td><td>Berlin</td><td>Tisch</td><td>Möbel AG</td><td>030-123456</td></tr>
                    <tr><td>B001</td><td>Max Müller</td><td>Berlin</td><td>Stuhl</td><td>Möbel AG</td><td>030-123456</td></tr>
                </table>
                <p><small>Atomare Werte, keine Wiederholgruppen</small></p>
            </div>
            
            <div class="table-solution">
                <h5>2. Normalform (2NF):</h5>
                <div style="display: flex; gap: 10px;">
                    <table border="1">
                        <tr><th>BestellNr</th><th>Artikel</th><th>Lieferant</th><th>LieferantTel</th></tr>
                        <tr><td>B001</td><td>Tisch</td><td>Möbel AG</td><td>030-123456</td></tr>
                    </table>
                    <table border="1">
                        <tr><th>BestellNr</th><th>KundenName</th><th>KundenAdresse</th></tr>
                        <tr><td>B001</td><td>Max Müller</td><td>Berlin</td></tr>
                    </table>
                </div>
                <p><small>Vollständige funktionale Abhängigkeit</small></p>
            </div>
            
            <div class="table-solution">
                <h5>3. Normalform (3NF):</h5>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                    <table border="1">
                        <tr><th>BestellNr</th><th>ArtikelID</th></tr>
                        <tr><td>B001</td><td>A001</td></tr>
                    </table>
                    <table border="1">
                        <tr><th>BestellNr</th><th>KundenID</th></tr>
                        <tr><td>B001</td><td>K001</td></tr>
                    </table>
                    <table border="1">
                        <tr><th>KundenID</th><th>KundenName</th><th>KundenAdresse</th></tr>
                        <tr><td>K001</td><td>Max Müller</td><td>Berlin</td></tr>
                    </table>
                    <table border="1">
                        <tr><th>ArtikelID</th><th>ArtikelName</th><th>LieferantID</th></tr>
                        <tr><td>A001</td><td>Tisch</td><td>L001</td></tr>
                    </table>
                    <table border="1">
                        <tr><th>LieferantID</th><th>LieferantName</th><th>LieferantTel</th></tr>
                        <tr><td>L001</td><td>Möbel AG</td><td>030-123456</td></tr>
                    </table>
                </div>
                <p><small>Keine transitiven Abhängigkeiten</small></p>
            </div>
        </div>
        
        <div class="normalization-summary" style="margin-top: 20px; padding: 15px; background: #e9ecef; border-radius: 5px;">
            <h5>Zusammenfassung der Normalisierungsregeln:</h5>
            <ul>
                <li><strong>1NF:</strong> Atomare Werte, keine Wiederholgruppen</li>
                <li><strong>2NF:</strong> Jedes Nicht-Schlüsselattribut hängt voll vom Primärschlüssel ab</li>
                <li><strong>3NF:</strong> Keine transitiven Abhängigkeiten (Nicht-Schlüssel → Nicht-Schlüssel)</li>
            </ul>
        </div>
    `;

	solutionDiv.classList.remove('hidden');
}

// I1E - Kritische Analyse
function setupCriticalAnalysis() {
	const slider = document.getElementById('normalizationSlider');
	const levelDisplay = document.getElementById('normalizationLevel');

	if (slider && levelDisplay) {
		const levels = ['Keine NF', '1NF', '2NF', '3NF', 'BCNF', '4NF', '5NF'];

		slider.addEventListener('input', function () {
			const level = levels[this.value];
			levelDisplay.textContent = level;
			updateNormalizationTradeoffs(this.value);
		});

		// Initial update
		updateNormalizationTradeoffs(slider.value);
	}

	// Event-Listener für Checkboxen
	document.querySelectorAll('.tradeoff-checkbox').forEach((checkbox) => {
		checkbox.addEventListener('change', updateTradeoffAnalysis);
	});
}

function updateNormalizationTradeoffs(level) {
	const tradeoffs = [
		{
			level: 0,
			integrity: 1,
			performance: 10,
			storage: 1,
			maintenance: 10,
		},
		{
			level: 1,
			integrity: 3,
			performance: 8,
			storage: 3,
			maintenance: 8,
		},
		{
			level: 2,
			integrity: 6,
			performance: 6,
			storage: 5,
			maintenance: 6,
		},
		{
			level: 3,
			integrity: 8,
			performance: 5,
			storage: 7,
			maintenance: 5,
		},
		{
			level: 4,
			integrity: 9,
			performance: 4,
			storage: 8,
			maintenance: 4,
		},
		{
			level: 5,
			integrity: 10,
			performance: 3,
			storage: 9,
			maintenance: 3,
		},
		{
			level: 6,
			integrity: 10,
			performance: 2,
			storage: 10,
			maintenance: 2,
		},
	];

	const tradeoff = tradeoffs[level];
	const levels = ['Keine NF', '1NF', '2NF', '3NF', 'BCNF', '4NF', '5NF'];

	// Update Diagramm oder Anzeige
	const diagram = document.getElementById('tradeoffDiagram');
	if (diagram) {
		diagram.innerHTML = `
            <h5>Auswirkungen von ${levels[level]}:</h5>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 10px;">
                <div class="tradeoff-item">
                    <strong>Datenintegrität:</strong>
                    <div class="progress" style="height: 20px; background: #dee2e6; border-radius: 3px;">
                        <div class="progress-bar bg-success" style="width: ${
							tradeoff.integrity * 10
						}%"></div>
                    </div>
                    <small>${tradeoff.integrity}/10</small>
                </div>
                <div class="tradeoff-item">
                    <strong>Performance:</strong>
                    <div class="progress" style="height: 20px; background: #dee2e6; border-radius: 3px;">
                        <div class="progress-bar bg-warning" style="width: ${
							tradeoff.performance * 10
						}%"></div>
                    </div>
                    <small>${tradeoff.performance}/10</small>
                </div>
                <div class="tradeoff-item">
                    <strong>Speichereffizienz:</strong>
                    <div class="progress" style="height: 20px; background: #dee2e6; border-radius: 3px;">
                        <div class="progress-bar bg-info" style="width: ${
							tradeoff.storage * 10
						}%"></div>
                    </div>
                    <small>${tradeoff.storage}/10</small>
                </div>
                <div class="tradeoff-item">
                    <strong>Wartbarkeit:</strong>
                    <div class="progress" style="height: 20px; background: #dee2e6; border-radius: 3px;">
                        <div class="progress-bar bg-danger" style="width: ${
							tradeoff.maintenance * 10
						}%"></div>
                    </div>
                    <small>${tradeoff.maintenance}/10</small>
                </div>
            </div>
            
            <div class="tradeoff-summary" style="margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 5px;">
                <p><strong>Empfehlung für ${levels[level]}:</strong></p>
                <p>${getTradeoffRecommendation(level)}</p>
            </div>
        `;
	}
}

function getTradeoffRecommendation(level) {
	const recommendations = [
		'Nur für temporäre Daten oder Prototypen geeignet',
		'Gut für einfache Anwendungen mit wenig Datenänderungen',
		'Standard für die meisten Geschäftsanwendungen',
		'Optimal für komplexe Systeme mit vielen Beziehungen',
		'Für spezielle Anforderungen mit komplexen Abhängigkeiten',
		'Für sehr spezielle wissenschaftliche Anwendungen',
		'Meist Overkill für praktische Anwendungen',
	];
	return recommendations[level] || 'Keine Empfehlung verfügbar';
}

function updateTradeoffAnalysis() {
	// Berechne Gesamtpunktzahl basierend auf Checkboxen
	const checkboxes = document.querySelectorAll('.tradeoff-checkbox:checked');
	const totalCheckboxes =
		document.querySelectorAll('.tradeoff-checkbox').length;

	let correct = 0;
	checkboxes.forEach((cb) => {
		if (cb.value === '1') correct++;
	});

	const percentage = Math.round((correct / totalCheckboxes) * 100);

	// Update Anzeige
	const analysisResult = document.getElementById('tradeoffAnalysisResult');
	if (analysisResult) {
		analysisResult.innerHTML = `
            <div style="padding: 15px; background: ${
				percentage >= 70 ? '#d4edda' : '#f8d7da'
			}; border-radius: 5px;">
                <p><strong>Analyse-Auswertung:</strong> ${correct} von ${totalCheckboxes} richtig (${percentage}%)</p>
                <p>${
					percentage >= 70
						? '✓ Du verstehst die Trade-offs der Normalisierung!'
						: '✗ Überprüfe nochmal die Auswirkungen der Normalisierung.'
				}</p>
            </div>
        `;
	}
}

function checkCriticalAnalysis() {
	// Überprüfe alle interaktiven Elemente
	const sliderValue =
		document.getElementById('normalizationSlider')?.value || 0;
	const checkboxes = document.querySelectorAll('.tradeoff-checkbox:checked');
	const scenarioAnswers = document.querySelectorAll('.scenario-answer');

	let score = 0;
	let maxScore = 100;
	let feedback = [];

	// Bewertung Slider (optimal ist 2-3)
	if (sliderValue >= 2 && sliderValue <= 3) {
		score += 40;
		feedback.push('✓ Gute Wahl des Normalisierungsgrades (+40 Punkte)');
	} else if (sliderValue >= 1 && sliderValue <= 4) {
		score += 30;
		feedback.push('✓ Akzeptabler Normalisierungsgrad (+30 Punkte)');
	} else {
		score += 10;
		feedback.push('✗ Normalisierungsgrad könnte optimiert werden');
	}

	// Bewertung Checkboxen
	const correctCheckboxes = Array.from(checkboxes).filter(
		(cb) => cb.value === '1'
	).length;
	const totalCheckboxes =
		document.querySelectorAll('.tradeoff-checkbox').length;
	const checkboxPercentage = Math.round(
		(correctCheckboxes / totalCheckboxes) * 100
	);

	score += Math.round(checkboxPercentage * 0.4); // Bis zu 40 Punkte
	feedback.push(
		`✓ ${correctCheckboxes}/${totalCheckboxes} Trade-offs korrekt erkannt (+${Math.round(
			checkboxPercentage * 0.4
		)} Punkte)`
	);

	// Bewertung Szenario-Antworten
	scenarioAnswers.forEach((answer, index) => {
		if (answer.value === answer.dataset.correct) {
			score += 5;
			feedback.push(`✓ Szenario ${index + 1} korrekt (+5 Punkte)`);
		}
	});

	// Ergebnis anzeigen
	const result = document.getElementById('resultI1E');
	result.innerHTML = `
        <h4>Kritische Analyse Auswertung</h4>
        <p><strong>Gesamtpunktzahl:</strong> ${Math.min(
			score,
			maxScore
		)}/${maxScore}</p>
        <div class="feedback">
            ${feedback.map((f) => `<p>${f}</p>`).join('')}
        </div>
        <div class="analysis-summary" style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 5px;">
            <p><strong>Zusammenfassung:</strong></p>
            <p>${
				score >= 80
					? '🎉 Ausgezeichnet! Du verstehst die Normalisierung und ihre Konsequenzen.'
					: score >= 60
					? '👍 Gut! Du hast die wichtigsten Konzepte verstanden.'
					: '📚 Es gibt noch Lücken im Verständnis. Übe weiter!'
			}</p>
            <p><em>Tipp:</em> In der Praxis wird oft 3NF angestrebt, mit gezielter Denormalisierung für Performance.</p>
        </div>
    `;
	result.classList.remove('hidden');
}

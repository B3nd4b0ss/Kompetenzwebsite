// ERD Tool für J1G und J1E

let erdEntities = [];
let erdRelationships = [];
let selectedEntity = null;
let isDrawingRelationship = false;
let relationshipStart = null;
let currentCardinality = '1:n';

// J1G - Einfaches ERD Tool
function initializeERDTool() {
	console.log('Initialisiere ERD Tool');

	const canvas = document.getElementById('erd-canvas');
	if (!canvas) return;

	canvas.innerHTML = '';
	setupERDEventListeners();

	// Demo-Entities für den Anfang
	if (erdEntities.length === 0) {
		addDemoEntities();
	}

	renderERD();
}

function setupERDEventListeners() {
	// Toolbar Buttons
	document
		.getElementById('addEntityBtn')
		?.addEventListener('click', addERDEntity);
	document
		.getElementById('addAttributeBtn')
		?.addEventListener('click', addERDAttribute);
	document
		.getElementById('startRelationshipBtn')
		?.addEventListener('click', startRelationshipDrawing);
	document.getElementById('clearERDBtn')?.addEventListener('click', clearERD);
	document.getElementById('saveERDBtn')?.addEventListener('click', saveERD);
	document.getElementById('checkERDBtn')?.addEventListener('click', checkERD);

	// Kardinalitäts-Buttons
	document.querySelectorAll('.cardinality-btn').forEach((btn) => {
		btn.addEventListener('click', function () {
			currentCardinality = this.dataset.cardinality;
			document
				.querySelectorAll('.cardinality-btn')
				.forEach((b) => b.classList.remove('active'));
			this.classList.add('active');
			showTemporaryMessage(
				`Kardinalität auf ${currentCardinality} gesetzt`,
				'info'
			);
		});
	});
}

function addERDEntity() {
	const canvas = document.getElementById('erd-canvas');
	if (!canvas) return;

	const entityId = 'entity_' + Date.now();
	const x = 50 + Math.random() * (canvas.offsetWidth - 200);
	const y = 50 + Math.random() * (canvas.offsetHeight - 150);

	erdEntities.push({
		id: entityId,
		name: 'Neue Entität',
		x: x,
		y: y,
		attributes: ['Attribut1', 'Attribut2'],
		width: 180,
		height: 120,
	});

	renderERD();
	showTemporaryMessage(
		'Neue Entität hinzugefügt. Doppelklick zum Bearbeiten.',
		'success'
	);
}

function addERDAttribute() {
	if (selectedEntity) {
		const entity = erdEntities.find((e) => e.id === selectedEntity);
		if (entity) {
			entity.attributes.push('Neues Attribut');
			renderERD();
		}
	} else {
		showTemporaryMessage('Bitte erst eine Entität auswählen', 'error');
	}
}

function startRelationshipDrawing() {
	isDrawingRelationship = true;
	showTemporaryMessage(
		'Klicke auf die erste Entität, dann auf die zweite',
		'info'
	);
}

function handleCanvasClick(e) {
	if (!isDrawingRelationship) return;

	const clickedEntity = e.target.closest('.erd-entity');
	if (clickedEntity) {
		if (!relationshipStart) {
			relationshipStart = clickedEntity.id;
			showTemporaryMessage(
				'Jetzt auf die zweite Entität klicken',
				'info'
			);
		} else if (relationshipStart !== clickedEntity.id) {
			// Beziehung erstellen
			erdRelationships.push({
				id: 'rel_' + Date.now(),
				from: relationshipStart,
				to: clickedEntity.id,
				cardinality: currentCardinality,
				label: 'hat',
			});

			relationshipStart = null;
			isDrawingRelationship = false;
			renderERD();
			showTemporaryMessage('Beziehung erstellt', 'success');
		} else {
			// Selbe Entität angeklickt
			relationshipStart = null;
			isDrawingRelationship = false;
			showTemporaryMessage('Beziehung abgebrochen', 'info');
		}
	}
}

function renderERD() {
	const canvas = document.getElementById('erd-canvas');
	if (!canvas) return;

	canvas.innerHTML = '';

	// Beziehungen zuerst zeichnen (im Hintergrund)
	erdRelationships.forEach((rel) => {
		drawRelationship(rel);
	});

	// Dann Entitäten zeichnen (im Vordergrund)
	erdEntities.forEach((entity) => {
		drawEntity(entity);
	});

	// Event-Listener für Entities setzen
	setupEntityEventListeners();
}

function drawEntity(entity) {
	const canvas = document.getElementById('erd-canvas');
	if (!canvas) return;

	const entityDiv = document.createElement('div');
	entityDiv.className = `erd-entity ${
		entity.id === selectedEntity ? 'selected' : ''
	}`;
	entityDiv.id = entity.id;
	entityDiv.style.left = entity.x + 'px';
	entityDiv.style.top = entity.y + 'px';
	entityDiv.style.width = entity.width + 'px';

	entityDiv.innerHTML = `
        <div class="entity-header" contenteditable="true" onblur="updateEntityName('${
			entity.id
		}', this.textContent)">
            ${entity.name}
        </div>
        <div class="entity-attributes">
            ${entity.attributes
				.map(
					(attr, index) => `
                <div class="attribute-item" contenteditable="true" 
                     onblur="updateEntityAttribute('${entity.id}', ${index}, this.textContent)">
                    ${attr}
                </div>
            `
				)
				.join('')}
        </div>
        <div class="entity-controls">
            <button class="btn-sm" onclick="addAttributeToEntity('${
				entity.id
			}')">+</button>
            <button class="btn-sm" onclick="removeEntity('${
				entity.id
			}')">×</button>
        </div>
    `;

	// Drag & Drop
	entityDiv.setAttribute('draggable', 'true');

	canvas.appendChild(entityDiv);
}

function drawRelationship(rel) {
	const canvas = document.getElementById('erd-canvas');
	if (!canvas) return;

	const fromEntity = erdEntities.find((e) => e.id === rel.from);
	const toEntity = erdEntities.find((e) => e.id === rel.to);

	if (!fromEntity || !toEntity) return;

	// Linie zeichnen
	const line = document.createElement('div');
	line.className = 'erd-relationship';

	// Berechne Positionen
	const fromX = fromEntity.x + fromEntity.width / 2;
	const fromY = fromEntity.y + 60; // Mitte der Entity
	const toX = toEntity.x + toEntity.width / 2;
	const toY = toEntity.y + 60;

	// Linienlänge und Winkel
	const dx = toX - fromX;
	const dy = toY - fromY;
	const length = Math.sqrt(dx * dx + dy * dy);
	const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

	line.style.cssText = `
        position: absolute;
        left: ${fromX}px;
        top: ${fromY}px;
        width: ${length}px;
        height: 2px;
        background: #333;
        transform-origin: 0 0;
        transform: rotate(${angle}deg);
        z-index: 1;
    `;

	canvas.appendChild(line);

	// Kardinalität anzeigen
	const cardinalityDiv = document.createElement('div');
	cardinalityDiv.className = 'erd-cardinality';
	cardinalityDiv.textContent = rel.cardinality;
	cardinalityDiv.style.cssText = `
        position: absolute;
        left: ${fromX + dx * 0.5 - 15}px;
        top: ${fromY + dy * 0.5 - 15}px;
        background: white;
        padding: 2px 8px;
        border: 1px solid #333;
        border-radius: 10px;
        font-size: 12px;
        font-weight: bold;
        z-index: 2;
    `;

	canvas.appendChild(cardinalityDiv);
}

function setupEntityEventListeners() {
	document.querySelectorAll('.erd-entity').forEach((entityDiv) => {
		// Drag & Drop
		entityDiv.addEventListener('dragstart', handleEntityDragStart);
		entityDiv.addEventListener('dragend', handleEntityDragEnd);

		// Click für Selektion
		entityDiv.addEventListener('click', function (e) {
			if (e.target.closest('.btn-sm')) return; // Ignoriere Control-Buttons

			if (isDrawingRelationship) {
				handleCanvasClick(e);
			} else {
				// Entität selektieren
				selectedEntity = this.id;
				renderERD();
			}
		});
	});

	// Canvas für Drag & Drop
	const canvas = document.getElementById('erd-canvas');
	if (canvas) {
		canvas.addEventListener('dragover', handleEntityDragOver);
		canvas.addEventListener('drop', handleEntityDrop);
	}
}

function handleEntityDragStart(e) {
	e.dataTransfer.setData('text/plain', e.target.id);
	e.target.classList.add('dragging');
}

function handleEntityDragEnd(e) {
	e.target.classList.remove('dragging');
}

function handleEntityDragOver(e) {
	e.preventDefault();
}

function handleEntityDrop(e) {
	e.preventDefault();

	const entityId = e.dataTransfer.getData('text/plain');
	const entity = erdEntities.find((e) => e.id === entityId);

	if (entity) {
		const canvas = document.getElementById('erd-canvas');
		const rect = canvas.getBoundingClientRect();

		entity.x = e.clientX - rect.left - entity.width / 2;
		entity.y = e.clientY - rect.top - 60; // Offset für Header

		// Begrenze auf Canvas
		entity.x = Math.max(
			0,
			Math.min(entity.x, canvas.offsetWidth - entity.width)
		);
		entity.y = Math.max(
			0,
			Math.min(entity.y, canvas.offsetHeight - entity.height)
		);

		renderERD();
	}
}

function updateEntityName(entityId, newName) {
	const entity = erdEntities.find((e) => e.id === entityId);
	if (entity) {
		entity.name = newName;
	}
}

function updateEntityAttribute(entityId, index, newValue) {
	const entity = erdEntities.find((e) => e.id === entityId);
	if (entity && entity.attributes[index]) {
		entity.attributes[index] = newValue;
	}
}

function addAttributeToEntity(entityId) {
	const entity = erdEntities.find((e) => e.id === entityId);
	if (entity) {
		entity.attributes.push('Neues Attribut');
		renderERD();
	}
}

function removeEntity(entityId) {
	if (confirm('Entität wirklich löschen?')) {
		// Entität entfernen
		erdEntities = erdEntities.filter((e) => e.id !== entityId);

		// Zugehörige Beziehungen entfernen
		erdRelationships = erdRelationships.filter(
			(rel) => rel.from !== entityId && rel.to !== entityId
		);

		if (selectedEntity === entityId) {
			selectedEntity = null;
		}

		renderERD();
		showTemporaryMessage('Entität gelöscht', 'info');
	}
}

function clearERD() {
	if (confirm('Wirklich alles löschen?')) {
		erdEntities = [];
		erdRelationships = [];
		selectedEntity = null;
		renderERD();
		showTemporaryMessage('ERD gelöscht', 'info');
	}
}

function saveERD() {
	const erdData = {
		entities: erdEntities,
		relationships: erdRelationships,
		timestamp: new Date().toISOString(),
	};

	localStorage.setItem('erdDiagram', JSON.stringify(erdData));

	// Download als JSON Datei
	const dataStr = JSON.stringify(erdData, null, 2);
	const dataUri =
		'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

	const exportFileDefaultName = 'erd-diagram.json';
	const linkElement = document.createElement('a');
	linkElement.setAttribute('href', dataUri);
	linkElement.setAttribute('download', exportFileDefaultName);
	linkElement.click();

	showTemporaryMessage('ERD gespeichert und heruntergeladen', 'success');
}

function checkERD() {
	let score = 0;
	let maxScore = 100;
	let feedback = [];

	// Bewertungskriterien
	if (erdEntities.length >= 2) {
		score += 30;
		feedback.push('✓ Mindestens 2 Entitäten vorhanden (+30 Punkte)');
	} else {
		feedback.push('✗ Brauche mindestens 2 Entitäten');
	}

	if (erdRelationships.length >= 1) {
		score += 30;
		feedback.push('✓ Mindestens 1 Beziehung vorhanden (+30 Punkte)');
	} else {
		feedback.push('✗ Brauche mindestens 1 Beziehung');
	}

	// Attribute zählen
	const totalAttributes = erdEntities.reduce(
		(sum, entity) => sum + entity.attributes.length,
		0
	);
	if (totalAttributes >= 4) {
		score += 20;
		feedback.push(`✓ Insgesamt ${totalAttributes} Attribute (+20 Punkte)`);
	} else {
		feedback.push(
			`✗ Brauche mindestens 4 Attribute (aktuell: ${totalAttributes})`
		);
	}

	// Verschiedene Kardinalitäten
	const cardinalities = [
		...new Set(erdRelationships.map((rel) => rel.cardinality)),
	];
	if (cardinalities.length >= 1) {
		score += 20;
		feedback.push(
			`✓ ${cardinalities.length} verschiedene Kardinalität(en) verwendet (+20 Punkte)`
		);
	}

	const result = document.getElementById('resultJ1G');
	result.innerHTML = `
        <h4>ERD Bewertung</h4>
        <p><strong>Punkte:</strong> ${score}/${maxScore}</p>
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${
				(score / maxScore) * 100
			}%"></div>
        </div>
        <div class="feedback">
            ${feedback.map((f) => `<p>${f}</p>`).join('')}
        </div>
        <p style="margin-top: 15px;">
            ${
				score >= 80
					? '🎉 Ausgezeichnet! Dein ERD ist sehr gut!'
					: score >= 60
					? '👍 Gut gemacht! Dein ERD erfüllt die Grundanforderungen.'
					: '📚 Übe weiter! Versuche mehr Entitäten und Beziehungen hinzuzufügen.'
			}
        </p>
    `;
	result.classList.remove('hidden');
}

function addDemoEntities() {
	erdEntities = [
		{
			id: 'entity_1',
			name: 'Student',
			x: 50,
			y: 50,
			attributes: ['MatrikelNr', 'Name', 'Studiengang'],
			width: 180,
			height: 120,
		},
		{
			id: 'entity_2',
			name: 'Kurs',
			x: 300,
			y: 50,
			attributes: ['KursNr', 'Titel', 'Credits'],
			width: 180,
			height: 120,
		},
	];

	erdRelationships = [
		{
			id: 'rel_1',
			from: 'entity_1',
			to: 'entity_2',
			cardinality: 'n:m',
			label: 'besucht',
		},
	];
}

// J1E - ERD Aufgabe
function initializeERDTask() {
	console.log('Initialisiere ERD Aufgabe');
	initializeERDTool(); // Gleiches Tool wie J1G

	// Zusätzliche Anforderungen für J1E
	const taskInfo = document.createElement('div');
	taskInfo.className = 'task-instructions';
	taskInfo.innerHTML = `
        <h3>Aufgabe: Bibliothekssystem</h3>
        <p><strong>Erstelle ein ERD für eine Bibliothek mit folgenden Anforderungen:</strong></p>
        <ol>
            <li>Entitäten: Buch, Leser, Ausleihe</li>
            <li>Jedes Buch hat: ISBN, Titel, Autor</li>
            <li>Jeder Leser hat: LeserID, Name, Geburtsdatum</li>
            <li>Jede Ausleihe hat: AusleihID, Ausleihdatum, Rückgabedatum</li>
            <li>Ein Leser kann mehrere Bücher ausleihen (n:m Beziehung)</li>
            <li>Verwende eine Zwischentabelle für die Ausleihe</li>
        </ol>
        <p><strong>Bewertungskriterien:</strong></p>
        <ul>
            <li>Korrekte Entitäten und Attribute</li>
            <li>Richtige Beziehungen und Kardinalitäten</li>
            <li>Vollständigkeit gemäß Anforderungen</li>
        </ul>
    `;

	const canvasContainer = document.querySelector('.erd-tool-container');
	if (canvasContainer) {
		canvasContainer.insertBefore(taskInfo, canvasContainer.firstChild);
	}
}

function checkERDTask() {
	let score = 0;
	let maxScore = 100;
	let feedback = [];

	// 1. Prüfe auf benötigte Entitäten
	const requiredEntities = ['Buch', 'Leser', 'Ausleihe'];
	const foundEntities = erdEntities.map((e) => e.name);

	requiredEntities.forEach((entity) => {
		if (foundEntities.includes(entity)) {
			score += 10;
			feedback.push(`✓ Entität "${entity}" vorhanden (+10 Punkte)`);
		} else {
			feedback.push(`✗ Entität "${entity}" fehlt`);
		}
	});

	// 2. Prüfe auf Mindestattribute
	const entityAttributeCounts = {};
	erdEntities.forEach((entity) => {
		entityAttributeCounts[entity.name] = entity.attributes.length;
		if (entity.attributes.length >= 3) {
			score += 10;
			feedback.push(
				`✓ "${entity.name}" hat mindestens 3 Attribute (+10 Punkte)`
			);
		} else {
			feedback.push(`✗ "${entity.name}" benötigt mindestens 3 Attribute`);
		}
	});

	// 3. Prüfe auf Beziehungen
	const hasBookRelationship = erdRelationships.some((rel) => {
		const fromEntity = erdEntities.find((e) => e.id === rel.from);
		const toEntity = erdEntities.find((e) => e.id === rel.to);
		return (
			(fromEntity?.name === 'Buch' || toEntity?.name === 'Buch') &&
			(fromEntity?.name === 'Ausleihe' || toEntity?.name === 'Ausleihe')
		);
	});

	const hasReaderRelationship = erdRelationships.some((rel) => {
		const fromEntity = erdEntities.find((e) => e.id === rel.from);
		const toEntity = erdEntities.find((e) => e.id === rel.to);
		return (
			(fromEntity?.name === 'Leser' || toEntity?.name === 'Leser') &&
			(fromEntity?.name === 'Ausleihe' || toEntity?.name === 'Ausleihe')
		);
	});

	if (hasBookRelationship) {
		score += 15;
		feedback.push('✓ Beziehung Buch ↔ Ausleihe vorhanden (+15 Punkte)');
	} else {
		feedback.push('✗ Beziehung Buch ↔ Ausleihe fehlt');
	}

	if (hasReaderRelationship) {
		score += 15;
		feedback.push('✓ Beziehung Leser ↔ Ausleihe vorhanden (+15 Punkte)');
	} else {
		feedback.push('✗ Beziehung Leser ↔ Ausleihe fehlt');
	}

	// 4. Prüfe auf n:m Beziehung (Zwischentabelle Konzept)
	const hasNtoM = erdRelationships.some(
		(rel) =>
			rel.cardinality === 'n:m' &&
			(erdEntities.find((e) => e.id === rel.from)?.name === 'Ausleihe' ||
				erdEntities.find((e) => e.id === rel.to)?.name === 'Ausleihe')
	);

	if (hasNtoM) {
		score += 20;
		feedback.push(
			'✓ n:m Beziehung mit Zwischentabelle erkannt (+20 Punkte)'
		);
	} else {
		feedback.push(
			'✗ Verwende n:m Beziehung mit Zwischentabelle "Ausleihe"'
		);
	}

	// 5. Gesamtbewertung
	const result = document.getElementById('resultJ1E');
	result.innerHTML = `
        <h4>ERD Aufgabe Bewertung</h4>
        <p><strong>Gesamtpunktzahl:</strong> ${score}/${maxScore}</p>
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${
				(score / maxScore) * 100
			}%"></div>
        </div>
        <div class="feedback">
            <h5>Detailierte Rückmeldung:</h5>
            ${feedback.map((f) => `<p>${f}</p>`).join('')}
        </div>
        <div class="task-summary" style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 5px;">
            <p><strong>Zusammenfassung:</strong></p>
            <p>${
				score >= 80
					? '🎉 Hervorragend! Du hast alle Konzepte verstanden und korrekt umgesetzt.'
					: score >= 60
					? '👍 Gut gemacht! Die grundlegenden Anforderungen sind erfüllt.'
					: '📚 Es gibt noch Verbesserungspotenzial. Überprüfe die fehlenden Anforderungen.'
			}</p>
            ${
				score < 80
					? '<p><em>Tipp:</em> Stelle sicher, dass du alle 3 Entitäten hast, jeweils mit mindestens 3 Attributen, und die Beziehungen korrekt mit Kardinalitäten darstellst.</p>'
					: ''
			}
        </div>
    `;
	result.classList.remove('hidden');

	// Speichere Ergebnis
	localStorage.setItem('erdTaskScore', score);
	localStorage.setItem('erdTaskTime', new Date().toISOString());
}

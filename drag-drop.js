// F1F - Konzeptionelles Modell erstellen (Drag & Drop)

let f1fDraggedElement = null;

function initializeF1F() {
	console.log('Initialisiere F1F Drag & Drop');

	const container = document.getElementById('f1f-container');
	if (!container) return;

	// Container zurücksetzen
	container.innerHTML = `
        <div class="entity" id="entity1" data-entity="Person">
            <div class="entity-header">Person</div>
            <div class="entity-attributes" id="attrs1"></div>
        </div>
        <div class="entity" id="entity2" data-entity="Kurs">
            <div class="entity-header">Kurs</div>
            <div class="entity-attributes" id="attrs2"></div>
        </div>
        <div class="attribute-pool">
            <div class="attribute" draggable="true" id="attr1" data-entity="Person">Name</div>
            <div class="attribute" draggable="true" id="attr2" data-entity="Person">Matrikelnummer</div>
            <div class="attribute" draggable="true" id="attr3" data-entity="Kurs">Kursname</div>
            <div class="attribute" draggable="true" id="attr4" data-entity="Kurs">Kursnummer</div>
            <div class="attribute" draggable="true" id="attr5" data-entity="Person">Alter</div>
            <div class="attribute" draggable="true" id="attr6" data-entity="Kurs">Credits</div>
        </div>
    `;

	// Event-Listener setzen
	setupDragAndDrop();
}

function setupDragAndDrop() {
	const attributes = document.querySelectorAll('.attribute');
	const entities = document.querySelectorAll('.entity');

	attributes.forEach((attr) => {
		attr.addEventListener('dragstart', handleDragStart);
		attr.addEventListener('dragend', handleDragEnd);
	});

	entities.forEach((entity) => {
		entity.addEventListener('dragover', handleDragOver);
		entity.addEventListener('dragenter', handleDragEnter);
		entity.addEventListener('dragleave', handleDragLeave);
		entity.addEventListener('drop', handleDrop);
	});
}

function handleDragStart(e) {
	f1fDraggedElement = e.target;
	e.target.classList.add('dragging');
	e.dataTransfer.setData('text/plain', e.target.id);
	e.dataTransfer.effectAllowed = 'move';

	// Visuelles Feedback
	setTimeout(() => {
		e.target.classList.add('hide');
	}, 0);
}

function handleDragEnd(e) {
	e.target.classList.remove('dragging');
	e.target.classList.remove('hide');
	f1fDraggedElement = null;

	// Entferne drag-over Klassen
	document.querySelectorAll('.entity').forEach((entity) => {
		entity.classList.remove('drag-over');
	});
}

function handleDragOver(e) {
	e.preventDefault();
	e.dataTransfer.dropEffect = 'move';
}

function handleDragEnter(e) {
	e.preventDefault();
	if (e.target.classList.contains('entity') || e.target.closest('.entity')) {
		const entity = e.target.classList.contains('entity')
			? e.target
			: e.target.closest('.entity');
		entity.classList.add('drag-over');
	}
}

function handleDragLeave(e) {
	if (e.target.classList.contains('entity') || e.target.closest('.entity')) {
		const entity = e.target.classList.contains('entity')
			? e.target
			: e.target.closest('.entity');
		if (!entity.contains(e.relatedTarget)) {
			entity.classList.remove('drag-over');
		}
	}
}

function handleDrop(e) {
	e.preventDefault();

	const entity = e.target.classList.contains('entity')
		? e.target
		: e.target.closest('.entity');
	if (!entity) return;

	entity.classList.remove('drag-over');

	const attributeId = e.dataTransfer.getData('text/plain');
	const attribute = document.getElementById(attributeId);

	if (attribute && f1fDraggedElement) {
		// Entferne Attribut aus vorherigem Container
		attribute.remove();

		// Füge Attribut zum Attribut-Container der Entität hinzu
		const attrContainer = entity.querySelector('.entity-attributes');
		if (attrContainer) {
			attrContainer.appendChild(attribute);

			// Visuelles Feedback
			showTemporaryMessage(
				`"${attribute.textContent}" zu "${
					entity.querySelector('.entity-header').textContent
				}" zugeordnet`,
				'success'
			);

			// Animation
			attribute.style.animation = 'dropEffect 0.3s ease';
			setTimeout(() => {
				attribute.style.animation = '';
			}, 300);
		}
	}

	f1fDraggedElement = null;
}

function checkF1F() {
	const correctMappings = {
		entity1: ['attr1', 'attr2', 'attr5'], // Person: Name, Matrikelnummer, Alter
		entity2: ['attr3', 'attr4', 'attr6'], // Kurs: Kursname, Kursnummer, Credits
	};

	let score = 0;
	let total = 0;
	let feedback = [];

	// Zähle Gesamtanzahl
	Object.values(correctMappings).forEach((arr) => {
		total += arr.length;
	});

	// Überprüfe jede Entität
	Object.entries(correctMappings).forEach(([entityId, expectedAttrs]) => {
		const entity = document.getElementById(entityId);
		if (!entity) return;

		const attrContainer = entity.querySelector('.entity-attributes');
		const currentAttrs = attrContainer
			? Array.from(attrContainer.children).map((child) => child.id)
			: [];

		expectedAttrs.forEach((attrId) => {
			if (currentAttrs.includes(attrId)) {
				score++;
				// Markiere korrekte Attribute
				const attr = document.getElementById(attrId);
				if (attr) attr.classList.add('correct');
			} else {
				// Markiere fehlende Attribute
				const attr = document.getElementById(attrId);
				if (attr) attr.classList.add('missing');
				feedback.push(
					`"${attr?.textContent}" fehlt bei "${
						entity.querySelector('.entity-header').textContent
					}"`
				);
			}
		});

		// Markiere falsche Attribute (die nicht in expectedAttrs sind)
		currentAttrs.forEach((attrId) => {
			if (!expectedAttrs.includes(attrId)) {
				const attr = document.getElementById(attrId);
				if (attr) {
					attr.classList.add('incorrect');
					feedback.push(
						`"${attr.textContent}" gehört nicht zu "${
							entity.querySelector('.entity-header').textContent
						}"`
					);
				}
			}
		});
	});

	const result = document.getElementById('resultF1F');
	const percentage = Math.round((score / total) * 100);

	result.innerHTML = `
        <strong>Ergebnis:</strong> ${score} von ${total} Attributen korrekt zugeordnet (${percentage}%)<br><br>
        <strong>Feedback:</strong><br>
        ${
			feedback.length > 0
				? feedback.map((f) => `• ${f}`).join('<br>')
				: '🎉 Perfekt! Alle Attribute sind korrekt zugeordnet!'
		}
    `;

	result.style.color =
		percentage === 100
			? '#28a745'
			: percentage >= 70
			? '#ffc107'
			: '#dc3545';
	result.classList.remove('hidden');
}

function resetF1F() {
	initializeF1F();
	document.getElementById('resultF1F').classList.add('hidden');
	showTemporaryMessage('Zurückgesetzt! Du kannst neu beginnen.', 'info');
}

// Hilfsfunktion für temporäre Meldungen
function showTemporaryMessage(message, type = 'info') {
	const messageDiv = document.createElement('div');
	messageDiv.className = `temp-message ${type}`;
	messageDiv.textContent = message;
	messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 5px;
        color: white;
        z-index: 1000;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 1.7s;
    `;

	if (type === 'success') {
		messageDiv.style.background = '#28a745';
	} else if (type === 'error') {
		messageDiv.style.background = '#dc3545';
	} else {
		messageDiv.style.background = '#17a2b8';
	}

	document.body.appendChild(messageDiv);

	setTimeout(() => {
		if (messageDiv.parentNode) {
			messageDiv.parentNode.removeChild(messageDiv);
		}
	}, 2000);
}

// CSS Animationen hinzufügen
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    @keyframes dropEffect {
        0% { transform: scale(0.8); opacity: 0.5; }
        100% { transform: scale(1); opacity: 1; }
    }
    
    .attribute.correct {
        background-color: #28a745 !important;
        color: white !important;
    }
    
    .attribute.incorrect {
        background-color: #dc3545 !important;
        color: white !important;
    }
    
    .attribute.missing {
        background-color: #ffc107 !important;
        color: #212529 !important;
    }
    
    .entity.drag-over {
        border-color: #28a745 !important;
        background-color: rgba(40, 167, 69, 0.1) !important;
    }
    
    .attribute.dragging {
        opacity: 0.5;
    }
    
    .attribute.hide {
        display: none;
    }
`;
document.head.appendChild(style);

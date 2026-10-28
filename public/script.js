const form = document.getElementById('qr-form');
const textInput = document.getElementById('qr-text');
const generateButton = document.getElementById('generate-button');

const statusMessage = document.getElementById('status-message');
const resultSection = document.getElementById('result-section');
const qrImage = document.getElementById('qr-image');

const downloadButton = document.getElementById('download-button');
const characterCount = document.getElementById('character-count');

const sizeInput = document.getElementById('qr-size');
const foregroundInput = document.getElementById('foreground');
const backgroundInput = document.getElementById('background');
const errorCorrectionInput = document.getElementById('error-correction');

let currentQrUrl = null;

textInput.addEventListener('input', () => {
characterCount.textContent = textInput.value.length;
});

function showMessage(message, type) {
statusMessage.textContent = message;
statusMessage.className = `status-message ${type}`;
}

function clearQrCode() {
resultSection.hidden = true;
qrImage.removeAttribute('src');


if (currentQrUrl) {
    URL.revokeObjectURL(currentQrUrl);
    currentQrUrl = null;
}


}

form.addEventListener('submit', async (event) => {
event.preventDefault();


const text = textInput.value.trim();

if (!text) {
    clearQrCode();
    showMessage('Please enter some text or a URL.', 'error');
    return;
}

if (text.length > 2000) {
    clearQrCode();
    showMessage('Text cannot exceed 2000 characters.', 'error');
    return;
}

const options = {
    text,
    size: Number(sizeInput.value),
    foreground: foregroundInput.value,
    background: backgroundInput.value,
    errorCorrectionLevel: errorCorrectionInput.value
};

generateButton.disabled = true;
generateButton.textContent = 'Generating...';

clearQrCode();
showMessage('Generating your QR code...', 'success');

try {
    const response = await fetch('/api/qr/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(options)
    });

    if (!response.ok) {
        let message = 'Unable to generate the QR code.';

        const contentType = response.headers.get('Content-Type') || '';

        if (contentType.includes('application/json')) {
            const errorData = await response.json();
            message = errorData.message || message;
        }

        throw new Error(message);
    }

    const imageBlob = await response.blob();

    if (!imageBlob.type.startsWith('image/')) {
        throw new Error('The server did not return a valid image.');
    }

    currentQrUrl = URL.createObjectURL(imageBlob);
    qrImage.src = currentQrUrl;

    resultSection.hidden = false;

    showMessage('QR code generated successfully!', 'success');

} catch (error) {
    console.error('QR generation failed:', error);

    clearQrCode();

    showMessage(
        error.message || 'Something went wrong. Please try again.',
        'error'
    );
} finally {
    generateButton.disabled = false;
    generateButton.textContent = 'Generate QR Code';
}


});

downloadButton.addEventListener('click', () => {
if (!currentQrUrl) {
showMessage('Generate a QR code before downloading.', 'error');
return;
}


const downloadLink = document.createElement('a');

downloadLink.href = currentQrUrl;
downloadLink.download = 'qr-code.png';

document.body.appendChild(downloadLink);
downloadLink.click();
downloadLink.remove();


});

const historyList = document.getElementById('history-list');
const historyStatus = document.getElementById('history-status');
const refreshHistoryButton = document.getElementById(
    'refresh-history-button'
);

async function loadQrHistory() {
    historyStatus.textContent = 'Loading QR code history...';
    historyList.replaceChildren();

    try {
        const response = await fetch('/api/qr/history');

        if (!response.ok) {
            throw new Error('Unable to retrieve QR history.');
        }

        const result = await response.json();

        if (!Array.isArray(result.data)) {
            throw new Error('The server returned an invalid response.');
        }

        if (result.data.length === 0) {
            historyStatus.textContent =
                'No QR codes have been generated yet.';
            return;
        }

        historyStatus.textContent =
            `Showing ${result.data.length} recent QR code records.`;

        result.data.forEach((record) => {
            const card = document.createElement('article');
            card.className = 'history-card';

            const title = document.createElement('h3');
            title.textContent = `QR Code #${record.id}`;

            const text = document.createElement('p');
            text.textContent = `Text: ${record.text}`;

            const size = document.createElement('p');
            size.textContent = `Size: ${record.size} px`;

            const colors = document.createElement('p');
            colors.textContent =
                `Foreground: ${record.foreground} | ` +
                `Background: ${record.background}`;

            const correction = document.createElement('p');
            correction.textContent =
                `Error correction: ${record.errorCorrectionLevel}`;

            const createdAt = document.createElement('p');
            createdAt.textContent = `Created: ${record.createdAt}`;

            const regenerateButton = document.createElement('button');
            regenerateButton.type = 'button';
            regenerateButton.textContent = 'Regenerate QR Code';

            regenerateButton.addEventListener('click', async () => {
                regenerateButton.disabled = true;

                try {
                    await regenerateQrCode(record);
                } catch (error) {
                    historyStatus.textContent = error.message;
                } finally {
                    regenerateButton.disabled = false;
                }
            });
            const deleteButton = document.createElement('button');

deleteButton.type = 'button';
deleteButton.textContent = 'Delete History';

deleteButton.addEventListener('click', async () => {
    const confirmed = window.confirm(
        `Delete QR history record #${record.id}?`
    );

    if (!confirmed) {
        return;
    }

    deleteButton.disabled = true;

    try {
        const response = await fetch(
            `/api/qr/history/${record.id}`,
            {
                method: 'DELETE'
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || 'Failed to delete QR history.'
            );
        }

        await loadQrHistory();
    } catch (error) {
        historyStatus.textContent =
            error.message || 'Failed to delete QR history.';
    } finally {
        deleteButton.disabled = false;
    }
});
          card.append(
    title,
    text,
    size,
    colors,
    correction,
    createdAt,
    regenerateButton,
    deleteButton
);
            historyList.appendChild(card);
        });
    } catch (error) {
        historyStatus.textContent =
            error.message || 'Failed to load QR history.';
    }
}

async function regenerateQrCode(record) {
    const response = await fetch('/api/qr/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: record.text,
            size: record.size,
            foreground: record.foreground,
            background: record.background,
            errorCorrectionLevel: record.errorCorrectionLevel
        })
    });

    if (!response.ok) {
        let message = 'Could not regenerate the QR code.';

        try {
            const result = await response.json();
            message = result.message || message;
        } catch {
            // Keep the default message if the response is not JSON.
        }

        throw new Error(message);
    }

    const imageBlob = await response.blob();
    const imageUrl = URL.createObjectURL(imageBlob);

    const qrImage = document.getElementById('qr-image');
    const resultSection = document.getElementById('result-section');

    if (!qrImage || !resultSection) {
        URL.revokeObjectURL(imageUrl);
        throw new Error('The QR code preview elements were not found.');
    }

    const previousUrl = qrImage.dataset.objectUrl;

    qrImage.src = imageUrl;
    qrImage.dataset.objectUrl = imageUrl;
    resultSection.hidden = false;

    if (previousUrl) {
        URL.revokeObjectURL(previousUrl);
    }

    resultSection.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}

refreshHistoryButton.addEventListener('click', loadQrHistory);

// Load history when the page opens.
loadQrHistory();
// Initial array of quote objects
let quotes = [
    { text: "Love is patient.", category: "love" },
    { text: "Be happy", category: "happiness" },
    { text: "Food is life.", category: "food" },
];

// Mock API Server URL
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts'; // Using posts as our mock quote storage
const SYNC_INTERVAL_MS = 5000; // Sync every 5 seconds for simulation

// Get DOM Elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const newQuoteTextInput = document.getElementById('newQuoteText');
const newQuoteCategoryInput = document.getElementById('newQuoteCategory');
const addQuoteBtn = document.getElementById('addQuoteButton');
const allQuotesList = document.getElementById('allQuotesList');
const importFileBtn = document.getElementById('importFile');
const exportBtn = document.getElementById('exportBtn');
const categoryFilter = document.getElementById('categoryFilter');
const syncNowBtn = document.getElementById('syncNowBtn');
const syncStatusDiv = document.getElementById('syncStatus');

//---

//## Local Storage Management

/**
 * Saves the current 'quotes' array to Local Storage.
 * The array is converted to a JSON string before saving.
 */
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

/**
 * Loads quotes from Local Storage.
 * If data exists, it parses the JSON string back into an array and updates the 'quotes' variable.
 * If no data is found, the initial 'quotes' array is used and then saved.
 */
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        try {
            const parsedQuotes = JSON.parse(storedQuotes);
            if (Array.isArray(parsedQuotes)) {
                quotes = parsedQuotes;
            } else {
                console.warn("Stored data is not an array. Using default quotes.");
                saveQuotes();
            }
        } catch (e) {
            console.error("Error parsing stored quotes from Local Storage:", e);
            saveQuotes();
        }
    } else {
        saveQuotes();
    }
}

/**
 * Saves the user's last selected category filter to Local Storage.
 */
function saveSelectedFilter() {
    localStorage.setItem('lastSelectedCategory', categoryFilter.value);
}

/**
 * Loads the user's last selected category filter from Local Storage and applies it.
 */
function loadSelectedFilter() {
    const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
    if (lastSelectedCategory) {
        const optionExists = Array.from(categoryFilter.options).some(option => option.value === lastSelectedCategory);
        if (optionExists) {
            categoryFilter.value = lastSelectedCategory;
        } else {
            categoryFilter.value = 'all';
            saveSelectedFilter();
        }
    }
}

//---

//## UI Creation Helpers

/**
 * Creates and returns a div element for a single quote.
 * @param {object} quote - The quote object containing text, category, and optional id.
 * @returns {HTMLDivElement} A div element representing the quote.
 */
function createQuoteElement(quote) {
    const quoteDiv = document.createElement('div');

    const quoteTextP = document.createElement('p');
    quoteTextP.classList.add('quote-text');
    quoteTextP.textContent = `"${quote.text}"`;

    const quoteCategoryP = document.createElement('p');
    quoteCategoryP.classList.add('quote-category');
    quoteCategoryP.textContent = `- ${quote.category}`;

    // Optional: Indicate if a quote has a server ID (for debugging/visual clarity)
    if (quote.id) {
        const quoteIdP = document.createElement('span');
        quoteIdP.style.fontSize = '0.7em';
        quoteIdP.style.color = '#999';
        quoteIdP.textContent = ` (ID: ${quote.id})`;
        quoteTextP.appendChild(quoteIdP);
    }

    quoteDiv.appendChild(quoteTextP);
    quoteDiv.appendChild(quoteCategoryP);
    return quoteDiv;
}

//---

//## Display and Filtering Logic

/**
 * Displays a random quote from the 'quotes' array.
 */
function showRandomQuote() {
    quoteDisplay.innerHTML = '';

    if (quotes.length === 0) {
        const noQuotesMessage = document.createElement('p');
        noQuotesMessage.textContent = "No quotes available. Add some!";
        quoteDisplay.appendChild(noQuotesMessage);
        return;
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    // Use the helper to create the quote display
    const quoteElement = createQuoteElement(randomQuote);
    quoteDisplay.appendChild(quoteElement);
}

/**
 * Dynamically updates the list of all quotes in the 'All Quotes Added' section.
 * @param {Array} [quotesToDisplay=quotes] - Optional array of quotes to display. Defaults to the global quotes array.
 */
function updateAllQuotesList(quotesToDisplay = quotes) {
    allQuotesList.innerHTML = '<h2>All Quotes Added</h2>';

    if (quotesToDisplay.length === 0) {
        const noQuotesMessage = document.createElement('p');
        noQuotesMessage.textContent = "No quotes match the current filter or no quotes added yet.";
        allQuotesList.appendChild(noQuotesMessage);
        return;
    }

    quotesToDisplay.forEach(quote => {
        const quoteElement = createQuoteElement(quote); // Use the helper to create the quote element
        allQuotesList.appendChild(quoteElement);
    });
}

/**
 * Populates the category filter dropdown dynamically from unique categories in the quotes array.
 * This implementation uses the 'map' method.
 */
function populateCategories() {
    const allCategories = quotes.map(quote => quote.category ? quote.category.toLowerCase() : '').filter(Boolean);
    const uniqueCategories = [...new Set(allCategories)];

    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categoryFilter.appendChild(option);
    });

    loadSelectedFilter();
}

/**
 * Filters and updates the displayed quotes based on the selected category.
 */
function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    let filteredQuotes = [];

    if (selectedCategory === 'all') {
        filteredQuotes = quotes;
    } else {
        filteredQuotes = quotes.filter(quote => quote.category.toLowerCase() === selectedCategory);
    }

    updateAllQuotesList(filteredQuotes);
    saveSelectedFilter();
}

//---

//## Server Sync Functions

/**
 * Updates the UI with sync status messages.
 * @param {string} message - The message to display.
 * @param {string} type - 'info', 'success', or 'error' for styling.
 */
function updateSyncStatus(message, type = 'info') {
    syncStatusDiv.textContent = `Last Sync: ${new Date().toLocaleTimeString()} - ${message}`;
    syncStatusDiv.className = ''; // Clear previous classes
    syncStatusDiv.classList.add(type);
}

/**
 * Fetches quotes from the simulated server.
 * Maps server's 'title'/'body' to 'text' and 'userId' to 'category'.
 * @returns {Promise<Array>} A promise that resolves with an array of quotes from the server.
 */
async function fetchQuotesFromServer() {
    try {
        updateSyncStatus('Fetching from server...', 'info');
        const response = await fetch(SERVER_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const serverPosts = await response.json();
        const serverQuotes = serverPosts.map(post => ({
            id: post.id,
            text: post.title || post.body,
            category: `ServerCategory-${post.userId || 'unknown'}`
        }));
        return serverQuotes;
    } catch (error) {
        console.error("Failed to fetch quotes from server:", error);
        updateSyncStatus(`Sync error: ${error.message}`, 'error');
        return [];
    }
}

/**
 * Pushes new local quotes to the simulated server.
 * Only sends quotes that do not have a server-assigned 'id' yet.
 * @param {Array} newLocalQuotes - Quotes to push to the server.
 */
async function pushQuotesToServer(newLocalQuotes) {
    if (newLocalQuotes.length === 0) return;

    try {
        updateSyncStatus(`Pushing ${newLocalQuotes.length} new quotes to server...`, 'info');
        for (const quote of newLocalQuotes) {
            const response = await fetch(SERVER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: quote.text,
                    body: quote.text,
                    userId: quote.category.replace('ServerCategory-', '') || 1,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to push quote: "${quote.text}". Status: ${response.status}`);
            }
            const serverResponse = await response.json();
            quote.id = serverResponse.id;
            console.log(`Quote "${quote.text}" pushed to server with ID: ${quote.id}`);
        }
        saveQuotes(); // Save locally with new server IDs
        updateSyncStatus('New quotes pushed to server successfully!', 'success');
    } catch (error) {
        console.error("Failed to push quotes to server:", error);
        updateSyncStatus(`Push error: ${error.message}`, 'error');
    }
}

/**
 * Core synchronization logic: Fetches from server, resolves conflicts, and updates local data.
 * Conflict Resolution: Server data takes precedence.
 * This is the function explicitly requested.
 */

async function syncQuotes (){
     const serverQuotes = await fetchQuotesFromServer();
    let localQuotesToPush = [];
    let conflictsResolved = 0;
    let newQuotesFromServer = 0;

    let mergedQuotes = [];
    const serverQuoteMap = new Map(serverQuotes.map(q => [q.id, q]));

    quotes.forEach(localQuote => {
        if (localQuote.id && serverQuoteMap.has(localQuote.id)) {
            const serverVersion = serverQuoteMap.get(localQuote.id);
            if (localQuote.text !== serverVersion.text || localQuote.category !== serverVersion.category) {
                mergedQuotes.push(serverVersion);
                serverQuoteMap.delete(localQuote.id);
                conflictsResolved++;
            } else {
                mergedQuotes.push(localQuote);
                serverQuoteMap.delete(localQuote.id);
            }
        } else {
            if (localQuote.id === null || typeof localQuote.id === 'undefined') {
                localQuotesToPush.push(localQuote);
            }
            mergedQuotes.push(localQuote);
        }
    });

    serverQuoteMap.forEach(serverQuote => {
        mergedQuotes.push(serverQuote);
        newQuotesFromServer++;
    });

    quotes = mergedQuotes;
    saveQuotes();

    await pushQuotesToServer(localQuotesToPush);

    // This function now returns the results, letting the orchestrator handle UI updates
    return { conflictsResolved, newQuotesFromServer, quotesPushed: localQuotesToPush.length };
}

/**
 * Main synchronization logic. Fetches from server, resolves conflicts, and pushes local changes.
 * Conflict Resolution: Server data takes precedence.
 * Notification: Updates sync status UI.
 */
//This function will be called by event listeners and the periodic timer.
 
// This function now calls syncQuotes and handles UI after it returns
async function syncData() {
    updateSyncStatus('Starting sync...', 'info');
    try {
        // Calling the newly defined syncQuotes function
        const syncResults = await syncQuotes();

        populateCategories();
        showRandomQuote();
        filterQuotes();

        let syncMessage = 'Sync complete.';
        if (syncResults.conflictsResolved > 0) syncMessage += ` ${syncResults.conflictsResolved} conflicts resolved (server precedence).`;
        if (syncResults.newQuotesFromServer > 0) syncMessage += ` ${syncResults.newQuotesFromServer} new quotes from server.`;
        if (syncResults.quotesPushed > 0) syncMessage += ` ${syncResults.quotesPushed} quotes pushed to server.`;

        if (syncResults.conflictsResolved === 0 && syncResults.newQuotesFromServer === 0 && syncResults.quotesPushed === 0) {
            syncMessage = "Quotes synced with server!"; 
            
        updateSyncStatus(syncMessage, 'success');
    } catch (error) {
        console.error("Error during full sync process:", error);
        updateSyncStatus(`Full sync failed: ${error.message}`, 'error');
    }
}

//## File Operations

/**
 * Imports quotes from a selected JSON file.
 * Reads the file, parses JSON, adds to current quotes, and saves/updates.
 */
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            if (Array.isArray(importedQuotes)) {
                importedQuotes.forEach(q => {
                    if (typeof q.id === 'undefined' || q.id === null) {
                        q.id = null; // Mark as new for server sync
                    }
                });
                quotes.push(...importedQuotes);
                saveQuotes();
                populateCategories();
                showRandomQuote();
                filterQuotes();
                alert('Quotes imported successfully! Initiating sync...');
                syncData(); // Trigger sync after import
            } else {
                alert('Error: Imported file does not contain a valid JSON array of quotes.');
            }
        } catch (e) {
            alert('Error parsing JSON file: ' + e.message);
        }
    };
    if (event.target.files[0]) {
        fileReader.readAsText(event.target.files[0]);
    } else {
        alert('Please select a file to import.');
    }
}

/**
 * Exports the current 'quotes' array to a JSON file.
 * Uses Blob and URL.createObjectURL to create a downloadable link.
 */
function exportToJsonFile() { // Renamed from exporttoJSONFile for consistency
    const dataString = JSON.stringify(quotes, null, 2); // Added null, 2 for pretty printing
    const blob = new Blob([dataString], { type: 'application/json' });

    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = "quotes.json";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    URL.revokeObjectURL(url);
}


//## Event Listeners and Initial Setup

// Event Listeners
newQuoteBtn.addEventListener('click', showRandomQuote);
addQuoteBtn.addEventListener('click', createAddQuoteForm);
importFileBtn.addEventListener('change', importFromJsonFile);
exportBtn.addEventListener('click', exportToJsonFile); // Corrected event listener function name
syncNowBtn.addEventListener('click', syncData);

// Initial setup and periodic sync when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadQuotes();
    populateCategories();
    showRandomQuote();
    filterQuotes();

    // Start periodic sync
    setInterval(syncData, SYNC_INTERVAL_MS);
    updateSyncStatus('Automatic sync started.', 'info');
});
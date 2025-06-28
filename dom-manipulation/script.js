// Initial array of quote objects
let quotes = [
    { text: "Love is patient.", category: "love" },
    { text: "Be happy", category: "happiness" },
    { text: "Food is life.", category: "food" },
];

// Get DOM Elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const newQuoteTextInput = document.getElementById('newQuoteText');
const newQuoteCategoryInput = document.getElementById('newQuoteCategory');
const addQuoteBtn = document.getElementById('addQuoteButton');
const allQuotesList = document.getElementById('allQuotesList'); // Get the list container for all quotes

/**
 * Displays a random quote from the 'quotes' array.
 * This function uses `document.createElement` and `element.appendChild` for dynamic DOM manipulation.
 */
function showRandomQuote() {
    // Clear previous content of quoteDisplay to avoid duplicate quotes
    quoteDisplay.innerHTML = '';

    if (quotes.length === 0) {
        const noQuotesMessage = document.createElement('p'); // Create a new <p> element
        noQuotesMessage.textContent = "No quotes available. Add some!";
        quoteDisplay.appendChild(noQuotesMessage); // Append the <p> to the display div
        return;
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    // Create the paragraph element for the quote text
    const quoteTextP = document.createElement('p');
    quoteTextP.classList.add('quote-text'); // Add a class for styling
    quoteTextP.textContent = `"${randomQuote.text}"`;

    // Create the paragraph element for the quote category
    const quoteCategoryP = document.createElement('p');
    quoteCategoryP.classList.add('quote-category'); // Add a class for styling
    quoteCategoryP.textContent = `- ${randomQuote.category}`;

    // Append these newly created elements to the quoteDisplay div
    quoteDisplay.appendChild(quoteTextP);
    quoteDisplay.appendChild(quoteCategoryP);
}

/**
 * Handles the logic for adding a new quote to the 'quotes' array from user input.
 * This function is named 'createAddQuoteForm' as per the project requirements,
 * and it also updates the 'All Quotes Added' list.
 */
function createAddQuoteForm() {
    const enteredQuoteText = newQuoteTextInput.value.trim();
    const enteredQuoteCategory = newQuoteCategoryInput.value.trim();

    if (enteredQuoteText && enteredQuoteCategory) {
        const newQuote = { text: enteredQuoteText, category: enteredQuoteCategory };
        quotes.push(newQuote);

        newQuoteTextInput.value = ''; // Clear input fields
        newQuoteCategoryInput.value = '';

        alert('Quote added successfully!');
        showRandomQuote(); // Show a new random quote after adding
        updateAllQuotesList(); // Update the list of all quotes
    } else {
        alert('Please enter both a quote and a category.');
    }
}

/**
 * Dynamically updates the list of all quotes in the 'All Quotes Added' section.
 * This function extensively uses `document.createElement` and `element.appendChild`.
 */
function updateAllQuotesList() {
    // Clear the existing list content before rebuilding it, but keep the heading
    allQuotesList.innerHTML = '<h2>All Quotes Added</h2>';

    if (quotes.length === 0) {
        const noQuotesMessage = document.createElement('p');
        noQuotesMessage.textContent = "No quotes added yet.";
        allQuotesList.appendChild(noQuotesMessage);
        return;
    }

    // Loop through each quote and create corresponding DOM elements
    quotes.forEach(quote => {
        const quoteDiv = document.createElement('div'); // Create a container for each quote entry

        const quoteTextP = document.createElement('p');
        quoteTextP.classList.add('quote-text');
        quoteTextP.textContent = `"${quote.text}"`;

        const quoteCategoryP = document.createElement('p');
        quoteCategoryP.classList.add('quote-category');
        quoteCategoryP.textContent = `- ${quote.category}`;

        quoteDiv.appendChild(quoteTextP);
        quoteDiv.appendChild(quoteCategoryP);

        allQuotesList.appendChild(quoteDiv); // Append the complete quote container to the main list
    });
}

// Event Listeners
newQuoteBtn.addEventListener('click', showRandomQuote);
// Link the 'Add Quote' button to the createAddQuoteForm function as specified
addQuoteBtn.addEventListener('click', createAddQuoteForm);


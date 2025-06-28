//Create array objects
let quotes = [ 
    { text: "Love is patient.", category: "love" },
    { text: "Be happy", category: "happiness" },
    { text: "Food is life.", category: "food" },
];

//Get DOM Elements
const quoteDisplay = document.getElementById('quoteDisplay'); 
const quoteTextElement = document.getElementById('quoteText'); 
const quoteCategoryElement = document.getElementById('quoteCategory'); 
const newQuoteBtn = document.getElementById('newQuote'); 
const newQuoteTextInput = document.getElementById('newQuoteText'); 
const newQuoteCategoryInput = document.getElementById('newQuoteCategory'); 
const addQuoteBtn = document.getElementById('addQuoteButton'); 

//Display a random quote
function showRandomQuote() {
    if (quotes.length === 0) { 
        quoteTextElement.textContent = "No quotes available. Add quotes!"; 
        quoteCategoryElement.textContent = "";
        return;
    }

    //generate random integer that can generate random indices from an array
    const randomIndex = Math.floor(Math.random() * quotes.length); 
    const randomQuote = quotes[randomIndex]; 

    // Add innerHTML
    quoteDisplay.innerHTML = `
        <p id="quoteText">"${randomQuote.text}"</p>
        <p id="quoteCategory" style="font-style: italic; color: #666;">Category: ${randomQuote.category}</p>
    `;
}

//Add a quote
function createAddQuoteForm() { 
    const enteredQuoteText = newQuoteTextInput.value.trim();
    const enteredQuoteCategory = newQuoteCategoryInput.value.trim();

    if (enteredQuoteText && enteredQuoteCategory) {
        quotes.push({ text: enteredQuoteText, category: enteredQuoteCategory });
        newQuoteTextInput.value = ''; // Clear the input field
        newQuoteCategoryInput.value = ''; // Clear the category field
        alert('Quote added!');  
    } else {
        alert('Please enter both a quote and a category. Add both so others can find it!'); 
    }
}

//event listeners
newQuoteBtn.addEventListener('click', showRandomQuote);
addQuoteBtn.addEventListener('click', createAddQuoteForm); 

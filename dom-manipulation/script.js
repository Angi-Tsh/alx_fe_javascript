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
const importFileBtn = document.getElementById('importFile'); 
const exportBtn = document.getElementById('exportBtn');  
const categoryFilter = document.getElementById('categoryFilter'); //for filtering dropdown


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

////////////////////////
//Save current qoutes array to Local storage
function saveQuotes(){
    //the array, as an object, is converted into a a string first before saving.
    localStorage.setItem('qoutes',JSON.stringify(quotes)); //qoutes are already an object
}

//Loads quotes from Local Storage.
function loadQuotes(){
    const storedQuotes = localStorage.getItem('quotes');
}
//Implementing web storage 
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes(); //save updated qoutes to local storage
      showRandomQuote(),
      alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
  }

  //To export qoutes to a JSON file, download and import file.
  function exporttoJSONFile (){
    const dataString = JSON.stringify(quotes);
    const blob = new Blob([dataString],{type: 'application/json'}); // Create a blob from the JSON string, blob = a container for raw data
    //Create a temporary URL for the blob
    const url = URL.createObjectURL(blob);
    //Create a temporary anchor 'a' element (download link)
    const downloadLink = document.createElement ('a');
    downloadLink.href=url
    downloadLink.download="quotes.json"; //suggested name for the downloadable file
    document.body.appendChild (downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink); //remove the link after clicking
  }

  //Event Listeners
  document.getElementById('importFile').addEventListener('change', importFromJsonFile);
  document.getElementById('exportBtn').addEventListener('click', exportToJsonFile);

  //Saves the user's last selected category filter to Local Storage.
  function saveSelectedFile (){
    localStorage.setItem ('lastSelectedCategory',categoryFilter.value);
  }
  //loads user's last selected category filter from local storage and applies it
  function loadSelectedFilter (){
    const lastSelectedCategory = localStorage.getItem ('lastSelectedCategory');
    if (lastSelectedCategory){
        //check if the loaded category exists in the dropdown options.
        const optionExists = Array.from (categoryFilter.options).some(option => option.value === lastSelectedCategory); 
        if (optionExists) {
            categoryFilter.value=lastSelectedCategory;
        } else {
            //if the category from storage does not exist 
            categoryFilter.value = 'all'; //default to 'all categories'
            saveSelectedFile(); //save this new default
        }
    }
  }
//populate the category filter dropdown from unique categories in the qoutes array
function populateCategories (){
    // Use 'map' to transform the quotes array into an array of lowercase categories.
    const allCategories = quotes.map(quote => quote.category ? quote.category.toLowerCase() : '').filter(Boolean);
    
    // Get unique categories using a Set
    const uniqueCategories = [...new Set(allCategories)];

     // Clear existing options except "All Categories"
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    //add unique categories to the dropdown
    uniqueCategories.forEach(category =>{
    const option = document.createElement ('option');
    option.value=category;
    option.textContent = category.charAt(0).toUpperCase()+ category.slice (1) //capitalise the first letter 
    categoryFilter.appendChild(option);
});
}

//Filters and updates the displayed quotes based on the selected category.
function filterQuotes (){
    const selectedCategory = categoryFilter.value;
    let filterQuotes = [];
    if (selectedCategory === 'all'){
        filterQuotes = quotes;
    } else {
        filterQuotes = quotes.filter (quote => quote.category.toLowerCase() === selectedCategory);
    }
updateAllQuotesList(filteredQuotes); // Pass filtered quotes to the update function
saveSelectedFilter(); // Save the newly selected filter to local storage
}



//Create array objects
let qoutes=[
    {text: "Love is patient.", category:"love"},
    {text: "Be happy", category:"happiness"},
    {text:"Food is life.", category:"food"},
]

//Get DOM Elements
const qouteDisplay = document.getElementById('qouteDisplay');
const qouteTextElement = document.getElementById('qouteText');
const qouteCategoryElement = document.getElementById('qouteCategory');
const newQouteBtn = document.getElementById('newQuote');
const newQuoteText= document.getElementById('newQuoteText');
const newQouteCategory = document.getElementById('newQuoteCategory');
const addQouteBtn = document.getElementById('addQouteButton');

//Display a random qoute 
function showRandomQuote(){
    if (qoutes.length===0){
        qouteTextElement.textContent = "No qoutes available. Add qoutes!";    
        qouteCategoryElement.textContent = "";
        return;
}

//generate random integer that can generated random indices from an array
const randomIndex = Math.floor(Math.random()*qoutes.length);
const randomQoute = qoutes[randomIndex];
qouteTextElement.textContent = `"${randomQoute.text}"`;
qouteCategoryElement.textContent = `"{randomQoute.category}"`;
}

//Add a qoute
function addQoute () {
    const newQouteText = newQouteText.value.trim();
    const newQouteCategory = newQouteCategory.value.trim();

    if(newQouteText && newQouteCategory) {
        qoutes.push({text: newQouteText,category:newQouteCategory});
        newQouteTextInput.value = ''; //clear the input field
        newQouteCategoryInput.value=''; //clear the category field
        alert ('Qoute added!');
    } else {
        alert ('Please enter a qoute and a category.Add both so others can find it!');
    }
}

//event listeners
newQouteBtn.addEventListener('click',showRandomQuote);
addQouteBtn.addEventListener('click', addQoute);

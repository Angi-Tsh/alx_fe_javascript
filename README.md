# Dynamic Quote Generator

This project is a dynamic web application that allows users to view, add, filter, import, export, and synchronize quotes. It demonstrates modern web development concepts including **DOM manipulation**, **local storage**, **file handling**, and **simulated API integration** for data synchronization.

---

## Features

* **Display Random Quote**: See a new random quote with a click of a button.
* **Add New Quote**: Easily add your own quotes with custom text and categories.
* **View All Quotes**: See a comprehensive list of all quotes added.
* **Filter by Category**: Filter the displayed quotes based on their categories using a dynamic dropdown.
* **Local Storage Integration**: All quotes and your last selected category filter are saved locally in your browser, so your data persists even after closing the tab.
* **Import/Export Quotes**:
    * **Import**: Load quotes from a JSON file, seamlessly integrating them with your existing data.
    * **Export**: Download your current collection of quotes as a `JSON` file for backup or sharing.
* **Simulated Server Synchronization**:
    * **Automatic Sync**: The application automatically attempts to synchronize data with a mock API server every 5 seconds.
    * **Manual Sync**: A "Sync Now" button allows you to initiate a synchronization manually.
    * **Conflict Resolution**: When conflicts arise between local and server data (e.g., the same quote modified in different places), the **server's version takes precedence**.
    * **Status Updates**: Real-time notifications inform you about the sync status, including fetching, pushing, conflicts resolved, and new quotes received.

---

## Getting Started

To get this project up and running on your local machine, follow these simple steps:

### Prerequisites

You only need a modern web browser (like Chrome, Firefox, Edge, or Safari).

### Installation

1.  **Clone the repository** (if hosted on GitHub) or **download the project files** as a ZIP.

    ```bash
    git clone [https://github.com/Angi-Tsh/alx_fe_javascript.git](https://github.com/Angi-Tsh/alx_fe_javascript.git)
    cd dynamic-quote-generator
    ```
2.  **Open `index.html`**: Simply drag and drop the `index.html` file into your web browser, or navigate to its local path.

That's it! The application runs entirely client-side.

---
dynamic-quote-generator/
├── index.html          # The main HTML file defining the structure of the web page.
├── script.js           # All JavaScript logic, including DOM manipulation, data handling, and API calls.
└── style.css           # Contains all the CSS rules for styling the application.


---

## How to Use

1.  **Show New Quote**: Click the "Show New Quote" button to display a random quote from your collection.
2.  **Add New Quote**:
    * Enter the quote text in the "Enter a new quote" field.
    * Enter the quote's category in the "Enter quote category" field.
    * Click "Add Quote." The quote will be added locally and an automatic sync will be triggered to push it to the server.
3.  **Filter by Category**: Select a category from the "Filter by Category" dropdown to display only quotes belonging to that category in the "All Quotes Added" list.
4.  **Import Quotes**:
    * Click the "Import Quotes" button.
    * Select a `JSON` file containing an array of quote objects (e.g., `[{"text": "Hello", "category": "greeting"}]`).
    * The imported quotes will be added to your collection, saved locally, and trigger a sync.
5.  **Export Quotes**: Click the "Export Quotes" button to download your current quotes as a `quotes.json` file.
6.  **Sync Now**: Click the "Sync Now" button to manually initiate a synchronization with the mock server. Observe the sync status message below the button for feedback.

---

## Development Notes

* **Mock API**: The project uses `https://jsonplaceholder.typicode.com/posts` as a mock API server. It simulates fetching and pushing data, mapping quote `text` to `title`/`body` and `category` to `userId`.
* **Data Persistence**: Quotes are primarily stored in the browser's `localStorage`.
* **Sync Logic**: The `syncQuotes()` function handles the core synchronization, while `syncData()` provides the wrapper for UI feedback. Server data always takes precedence during conflicts.
* **Error Handling**: Basic `try-catch` blocks are implemented for API calls and file operations to provide user feedback on failures.

---

## Future Enhancements (Ideas)

* [ ] **Edit/Delete Quotes**: Add functionality to modify or remove existing quotes from the list.
* [ ] **User Authentication**: Implement user accounts to manage personal quote collections.
* [ ] **Improved UI/UX**: Enhance the visual design and user experience with more animations or interactive elements.
* [ ] **Dedicated Backend**
# alx_fe_javascript

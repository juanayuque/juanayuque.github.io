function handleKeyPress(event) {
    // Check if the key pressed is the Enter key
    if (event.key === "Enter") {
        searchEvents(); // Call search function
    }
}

function searchEvents() {
    const searchText = document.getElementById('searchBox').value.toLowerCase();
    const searchResultsContainer = document.getElementById('searchResultsContainer');
    searchResultsContainer.innerHTML = ''; // Clear previous search results
    let hasResults = false;

    // Title "Results"
    let resultsTitle = document.createElement('h2');
    resultsTitle.textContent = "Results";
    searchResultsContainer.appendChild(resultsTitle);

    // Container for buttons
    let buttonsContainer = document.createElement('div');
    buttonsContainer.style.display = 'flex';
    buttonsContainer.style.justifyContent = 'space-between';
    buttonsContainer.style.marginBottom = '20px';
    searchResultsContainer.appendChild(buttonsContainer);

    // "Back to Events" Button
    const backButton = document.createElement('button');
    backButton.textContent = 'Back to Events';
    backButton.addEventListener('click', () => {
        // Assuming displayEventDetails is a function to go back to the main event view
        document.getElementById('eventDetails').style.display = 'block';
        document.getElementById('exploreButton').style.display = 'block';
        searchResultsContainer.style.display = 'none';
    });
    buttonsContainer.appendChild(backButton);

    const sortSearchButton = document.createElement('button');
    sortSearchButton.textContent = 'Sort by Name';
    sortSearchButton.className= 'SortProgramsButton';
    sortSearchButton.onclick = () => {
        sortDisplayedSearchResults();
         
    };
    buttonsContainer.appendChild(sortSearchButton);

    mainEventData.topics.forEach(topic => {
        topic.programs.forEach(program => {
            if (program.title.toLowerCase().includes(searchText) || program.description.toLowerCase().includes(searchText)) {
                hasResults = true;
                let programElement = document.createElement('div');
                programElement.className = "program-search-result";
                programElement.setAttribute('data-title', program.title.toLowerCase()); // For sorting
                
                programElement.innerHTML = `
                    <h2> ${program.title}</h2>
                    <h3> ${topic.name} Department </h3>
                    ${program.location && program.location.cover_image ? `<img src="${program.location.cover_image}" alt="Location cover image" style="max-width: 200px; height: auto; display: block;">` : ''}
                    <p><strong>Description:</strong> ${program.description}</p>
                    <p><strong>Start Time:</strong> ${program.start_time}</p>
                    <p><strong>End Time:</strong> ${program.end_time}</p>
                `;
                
                // Create the "View Details" button 
                let detailsButton = document.createElement('button');
                detailsButton.textContent = 'View Details';
                detailsButton.className = 'detailsButton';
                detailsButton.addEventListener('click', () => displayProgramDetailsbysearch(program));
                programElement.appendChild(detailsButton);

                searchResultsContainer.appendChild(programElement);
            }
        });
    });

    searchResultsContainer.style.display = hasResults ? 'block' : 'none';
    document.getElementById('eventDetails').style.display = hasResults ? 'none' : 'block';
    document.getElementById('topicsContainer').style.display = hasResults ? 'none' : 'block';
    if (!hasResults) {
        searchResultsContainer.innerHTML = '<p>No programs found matching your search.</p>';
    }
}

function displayProgramDetailsbysearch(program) {
    const topicsContainer = document.getElementById('searchResultsContainer');
    topicsContainer.innerHTML = ''; // Clear previous content

        // "Back to Events" Button
        const backToEventsButton = document.createElement('button');
        backToEventsButton.textContent = 'Back to Events';
        backToEventsButton.onclick = () => {
            // Assuming displayEvents is a function that shows the main event list or details
            // You might need to adjust this to fit your actual navigation logic
            document.getElementById('eventDetails').style.display = 'block';
            document.getElementById('exploreButton').style.display = 'block';
            searchResultsContainer.style.display = 'none';
        };
        topicsContainer.appendChild(backToEventsButton); // Add the button at the very beginning

    const topic = mainEventData.topics.find(t => t.id === program.topic_id);
    
    // Main Event Name
    let mainEventHeader = document.createElement('h2');
    mainEventHeader.textContent = mainEventData.description;
    topicsContainer.appendChild(mainEventHeader);

    // Selected Topic Name
    if (topic) {
        let topicHeader = document.createElement('h3');
        topicHeader.textContent = topic.name;
        topicsContainer.appendChild(topicHeader);
    }

    // Program Title
    let programTitle = document.createElement('h3');
    programTitle.textContent = program.title;
    topicsContainer.appendChild(programTitle);

    // Program Cover Image, if available
    if (program.location.cover_image) {
        let coverImage = document.createElement('img');
        coverImage.src = program.location.cover_image;
        coverImage.alt = "Cover image";
        coverImage.style = "margin-right: 20px; max-width: 200px; max-height: 200px; display: block; margin-top: 20px;";
        topicsContainer.appendChild(coverImage);
    }

    // Program Type Details
    if (program.programType) {
        let programType = document.createElement('p');
        programType.innerHTML = `<h4>Program Type</h4><p><strong>Type:</strong> ${program.programType.type}</p><p><strong>Color:</strong> <span style="background-color:${program.programType.type_colour};">&nbsp;&nbsp;&nbsp;&nbsp;</span></p>`;
        topicsContainer.appendChild(programType);
    }

    // Start and End Times
    let startTime = document.createElement('p');
    startTime.innerHTML = `<strong>Start Time:</strong> ${program.start_time}`;
    topicsContainer.appendChild(startTime);

    let endTime = document.createElement('p');
    endTime.innerHTML = `<strong>End Time:</strong> ${program.end_time}`;
    topicsContainer.appendChild(endTime);

    // Location Details
    if (program.location) {
        let locationDetailsHTML = `
        <h4> Event Description </h4>
        <p>${program.description}
        <h4>Location Details</h4>
        <p><strong>Building:</strong> ${program.location.title}, ${program.room}</p>
        <p><strong>About the building:</strong> ${program.location.description}</p>
        <p><strong>Address:</strong> ${program.location.address}, ${program.location.postcode}</p>
        <p><strong>Accessible:</strong> ${program.location.accessible ? 'Yes' : 'No'}</p>
        <p><strong>Parking:</strong> ${program.location.parking ? 'Yes' : 'No'}</p>
        <p><strong>Bike Parking:</strong> ${program.location.bike_parking ? 'Yes' : 'No'}</p>
        <a href="${program.location.website}" target="_blank">More about the location</a>
        `;
        let locationDetailsDiv = document.createElement('div');
        locationDetailsDiv.innerHTML = locationDetailsHTML;
        topicsContainer.appendChild(locationDetailsDiv);
    }
}


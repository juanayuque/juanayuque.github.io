// Global variable to store the main event data
let mainEventData = null;

document.addEventListener('DOMContentLoaded', () => {
    fetch('OpenDay.json')
        .then(response => response.json())
        .then(data => {
            mainEventData = data; // Save the main event data globally
            displayEventDetails(data); // Display the main event details initially
        })
        .catch(error => {
            console.error('Error fetching the JSON file:', error);
        });

    // Event listener for the Explore button
    document.getElementById('exploreButton').addEventListener('click', displayTopics);
});

function displayEventDetails(event) {
    const eventDetailsContainer = document.getElementById('eventDetails');
    eventDetailsContainer.innerHTML = ''; // Clear existing content

    // Create the event details HTML
    const eventHtml = `
        <h2>${event.description}</h2>
        <p>Start Time: ${event.start_time}</p>
        <p>End Time: ${event.end_time}</p>
        <p>Type: ${event.type}</p>
            `;
    eventDetailsContainer.innerHTML = eventHtml;

    // Create the Explore button dynamically
    const exploreButton = document.createElement('button');
    exploreButton.id = 'exploreButton'; 
    exploreButton.textContent = 'Explore';
    exploreButton.style.float = 'none';
    exploreButton.style.display = 'block';
    exploreButton.style.marginTop = '10px'; 
    // Append the Explore button to the eventDetailsContainer
    eventDetailsContainer.appendChild(exploreButton);

    // Add event listener for the Explore button to trigger the displayTopics function
    exploreButton.addEventListener('click', displayTopics);
}

function displayTopics() {
    document.getElementById('exploreButton').style.display = 'none';
    document.getElementById('eventDetails').style.display = 'none';
    
    const topicsContainer = document.getElementById('topicsContainer');
    topicsContainer.style.display = 'block';
    topicsContainer.innerHTML = ''; // Clear previous content

    let headerContainer = document.createElement('div');
    headerContainer.className = 'topicsHeader';

    let buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'space-between';
    buttonContainer.style.alignItems = 'center';
    buttonContainer.style.width = '100%'; 

    let eventName = document.createElement('h2');
    eventName.textContent = mainEventData.description;
    headerContainer.appendChild(eventName); 

    let backButton = document.createElement('button');
    backButton.textContent = 'Back to Event Details';
    backButton.onclick = () => {
        document.getElementById('eventDetails').style.display = 'block';
        document.getElementById('exploreButton').style.display = 'block';
        topicsContainer.style.display = 'none';
    };
    backButton.className = 'backButton';

    let sortButton = document.createElement('button');
    sortButton.id = 'sortTopicsButton';
    sortButton.textContent = 'Sort by Name';
    sortButton.addEventListener('click', () => {
        toggleSortOrder();
        displayTopics();
    });

    // Append buttons to the button container
    buttonContainer.appendChild(backButton);
    buttonContainer.appendChild(sortButton);

    // Append button container to the header
    headerContainer.appendChild(buttonContainer);

    // Append the header to the topics container
    topicsContainer.appendChild(headerContainer);

    const sortedTopics = sortTopics([...mainEventData.topics]); // Sort topics

    sortedTopics.forEach(topic => {
        let topicElement = document.createElement('div');
        topicElement.innerHTML = `
            <img src="${topic.cover_image || ''}" alt="${topic.title}">
            <div class="topic-text">
                <h3>${topic.name}</h3>
                <p>${topic.description}</p>
                <button class="topicButton">Explore ${topic.name} events</button>
            </div>
        `;
        
        topicElement.className = 'topic';
        topicElement.addEventListener('click', () => displayPrograms(topic));
        topicsContainer.appendChild(topicElement);
    });
}

function displayPrograms(topic) {
    const topicsContainer = document.getElementById('topicsContainer');
    topicsContainer.innerHTML = ''; // Clear previous content

    let headerContainer = document.createElement('div');
    headerContainer.className = 'topicsHeader';

    let mainEventName = document.createElement('h2');
    mainEventName.textContent = mainEventData.description;
    headerContainer.appendChild(mainEventName);

    let selectedTopicName = document.createElement('h3');
    selectedTopicName.textContent = topic.name;
    headerContainer.appendChild(selectedTopicName);

    let buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'space-between';

    const backButton = document.createElement('button');
    backButton.textContent = 'Back to Topics';
    backButton.className = 'backButton';
    backButton.onclick = () => {
        displayTopics();
    };
    buttonContainer.appendChild(backButton);

    const sortProgramsButton = document.createElement('button');
    sortProgramsButton.textContent = 'Sort by Name';
    sortProgramsButton.className= 'SortProgramsButton';
    sortProgramsButton.onclick = () => {
        toggleSortProgramsOrder();
        displayPrograms(topic); // Re-display sorted programs
    };
    buttonContainer.appendChild(sortProgramsButton);

    headerContainer.appendChild(buttonContainer);
    topicsContainer.appendChild(headerContainer);

    // Sort programs before displaying them
    const sortedPrograms = sortPrograms([...topic.programs]);

    
    sortedPrograms.forEach(program => {
        const programElement = document.createElement('div');
        programElement.className = 'program';
        programElement.style.display = 'flex';
        programElement.style.alignItems = 'center';
        programElement.style.marginBottom = '20px';

        let programContent = `
            <div style="flex-grow:1;">
                <h4>${program.title}</h4>
                <p>Program Type: ${program.programType ? program.programType.type : 'N/A'}</p>
                <p>Start Time: ${program.start_time}</p>
                <p>End Time: ${program.end_time}</p>
                <p>${program.description_short}</p>
                <p>Location: ${program.location ? program.location.title : 'N/A'}</p>
            </div>
        `;

        if (program.location && program.location.cover_image) {
            programContent += `<img src="${program.location.cover_image}" alt="${program.title}" style="max-width: 100px; margin-right: 20px;">`;
        }

        programElement.innerHTML = programContent;

        const detailsButton = document.createElement('button');
        detailsButton.textContent = 'Details';
        detailsButton.className = 'topicButton';
        detailsButton.onclick = (event) => {
            event.stopPropagation(); 
            displayProgramDetails(program);
        };

        programElement.appendChild(detailsButton);
        topicsContainer.appendChild(programElement);
    });
}

function displayProgramDetails(program) {
    const topicsContainer = document.getElementById('topicsContainer');
    topicsContainer.innerHTML = ''; // Clear previous content

    // Find the topic by its ID stored in program.topic_id
    const topic = mainEventData.topics.find(t => t.id === program.topic_id);
    
    let headerContainer = document.createElement('div');
    headerContainer.className = 'topicsHeader';

  

    // Button Container for "Back to Programs" button
    let buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'space-between';
    buttonContainer.style.marginTop = '10px'; 

    // Back Button to Return to the List of Programs
    const backButton = document.createElement('button');
    backButton.textContent = 'Back to Programs';
    backButton.onclick = () => displayPrograms(topic);
    buttonContainer.appendChild(backButton); // Add the back button to the button container

    // Append the button container right after the main event name
    topicsContainer.appendChild(buttonContainer); // This places the back button right after the main event name

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


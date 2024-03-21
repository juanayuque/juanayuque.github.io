// Assume sort order is ascending initially
let sortTopicsAscending = true;
let sortProgramsAscending = true;
let sortSearchResultsAscending = true;

function sortTopics(topics) {
    
    return topics.sort((a, b) => {
        return sortTopicsAscending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    });
}

function toggleSortOrder() {
    sortTopicsAscending = !sortTopicsAscending;
}



function toggleSortProgramsOrder() {
    sortProgramsAscending = !sortProgramsAscending;
}


function sortPrograms(programs) {
    return programs.sort((a, b) => sortProgramsAscending ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title));
}



function sortDisplayedSearchResults() {
    const container = document.getElementById('searchResultsContainer');
    let results = Array.from(container.getElementsByClassName('program-search-result'));
    
    // Toggle the sort order each time the sort function is called
    sortSearchResultsAscending = !sortSearchResultsAscending;

    // Sort the results based on the data-title attribute
    results.sort((a, b) => {
        let titleA = a.getAttribute('data-title');
        let titleB = b.getAttribute('data-title');
        if (sortSearchResultsAscending) {
            return titleA.localeCompare(titleB);
        } else {
            return titleB.localeCompare(titleA);
        }
    });

    
    results.forEach(element => container.appendChild(element));
}


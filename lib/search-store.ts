// Simple in-memory store for search results
// In a production app, you might use Redis or another solution
let searchResults: any[] = []

export function getSearchResults() {
  return searchResults
}

export function setSearchResults(results: any[]) {
  searchResults = results
}


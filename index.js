function loadMainPage() {
    fetch('main_page.html')
    .then(response => {
        if (!response.ok) {
        throw new Error('Failed to load content');
        }
        return response.text();
    })
    .then(data => {
        document.getElementById('content').innerHTML = data;
    })
    .catch(error => {
        console.error('Error loading content:', error);
    });
}


loadMainPage();

const params = new URLSearchParams(window.location.hash.slice(1));
const term = params.get('from');

if (term) {
    const banner = document.getElementById('search-banner');
    banner.textContent = 'you searched: ' + term;
    banner.hidden = false;
}
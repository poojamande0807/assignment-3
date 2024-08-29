let currentPage = 1;
let isLoading = false;
const itemsPerPage = 10;
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}
function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function(...args) {
        const context = this;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

async function fetchData(page, searchQuery = '', filter = '') {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${itemsPerPage}&q=${searchQuery}&filter=${filter}`);
    const data = await response.json();
    return data;
}
function displayData(data) {
    const dataContainer = document.getElementById('data-container');
    data.forEach(item => {
        const div = document.createElement('div');
        div.className = 'data-item';
        div.innerText = item.title; 
        dataContainer.appendChild(div);
    });
}
async function loadMoreData() {
    if (isLoading) return;
    isLoading = true;
    document.getElementById('loading').style.display = 'block';
    const searchQuery = document.getElementById('search-input').value;
    const filter = document.getElementById('filter-select').value;
    const data = await fetchData(currentPage, searchQuery, filter);
    displayData(data);
    document.getElementById('loading').style.display = 'none';
    isLoading = false;
    currentPage++;
}
function handleSearchAndFilter() {
    document.getElementById('data-container').innerHTML = '';
    currentPage = 1;
    loadMoreData();
}
document.getElementById('search-input').addEventListener('input', debounce(handleSearchAndFilter, 500));
document.getElementById('filter-select').addEventListener('change', handleSearchAndFilter);
document.getElementById('data-container').addEventListener('scroll', throttle(() => {
    const { scrollTop, scrollHeight, clientHeight } = document.getElementById('data-container');
    if (scrollTop + clientHeight >= scrollHeight - 5) {
        loadMoreData();
    }
}, 200));
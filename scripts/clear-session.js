// Temporal script to clear localStorage and test login
console.log('Clearing all Supabase auth data from localStorage...');
Object.keys(localStorage).forEach(key => {
    if (key.includes('supabase')) {
        console.log('Removing:', key);
        localStorage.removeItem(key);
    }
});
console.log('Done! Reload the page and try logging in again.');

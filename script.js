// Utility to update output divs with an HTML string
function updateOutput(divId, htmlString) {
    const outputDiv = document.getElementById(divId);
    outputDiv.innerHTML = htmlString;
}

// Exercise 1: Data Transformation
function transformData(data) {
    return data.map(item => `Name: ${item.name}, Age: ${item.age}`).join('\n');
}

function runTransformData() {
    const sampleData = [
        { name: "Alice", age: 25 },
        { name: "Bob", age: 30 },
        { name: "Charlie", age: 35 }
    ];
    const result = transformData(sampleData);
    updateOutput('output1', `<pre>${result}</pre>`);
}

// Exercise 2: Async Data Fetching
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return JSON.stringify(data, null, 2);
    } catch (error) {
        return `Error fetching data: ${error.message}`;
    }
}

async function runFetchData() {
    updateOutput('output2', '<pre>Fetching data...</pre>');
    const data = await fetchData("https://jsonplaceholder.typicode.com/posts");
    updateOutput('output2', `<pre>${data}</pre>`);
}

// Exercise 3: State Management
function createStateManager(initialState) {
    let state = initialState;
    const listeners = [];

    function getState() {
        return state;
    }

    function setState(newState) {
        state = { ...state, ...newState };
        listeners.forEach(listener => listener(state));
    }

    function subscribe(listener) {
        listeners.push(listener);
        return () => {
            const index = listeners.indexOf(listener);
            if (index > -1) listeners.splice(index, 1);
        };
    }

    return { getState, setState, subscribe };
}

// Initialize state manager for Exercise 3
const stateManager = createStateManager({ count: 0, text: "Hello" });
let unsubscribe;

// Listener to update UI on state change
function stateListener(newState) {
    updateOutput('output3', `<pre>State: ${JSON.stringify(newState, null, 2)}</pre>`);
}

// Subscribe on page load
unsubscribe = stateManager.subscribe(stateListener);
stateListener(stateManager.getState()); // Initial state

function incrementCount() {
    stateManager.setState({ count: stateManager.getState().count + 1 });
}

function changeText() {
    stateManager.setState({ text: stateManager.getState().text === "Hello" ? "World" : "Hello" });
}

function unsubscribeListener() {
    if (unsubscribe) {
        unsubscribe();
        updateOutput('output3', '<pre>Unsubscribed from state updates.</pre>');
        unsubscribe = null;
    }
}

// Exercise 4: User Component
function createUserComponent() {
    // State management for the user component
    const userStateManager = createStateManager({
        selectedUserId: null,
        users: [],
        posts: [],
        isFetching: false
    });

    // Fetch users from API and transform data
    async function fetchUsers() {
        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/users");
            if (!response.ok) throw new Error('Failed to fetch users');
            const users = await response.json();

            // Transform and filter users
            const transformedUsers = users
                .map(user => ({
                    id: user.id,
                    fullName: user.name,
                    email: user.email,
                    isActive: user.id % 2 === 0 // Simulate active status (even IDs are active)
                }))
                .filter(user => user.isActive) // Filter only active users
                .sort((a, b) => a.fullName.localeCompare(b.fullName)); // Sort alphabetically by fullName

            return transformedUsers;
        } catch (error) {
            return { error: `Error fetching users: ${error.message}` };
        }
    }

    // Fetch posts for a specific user by userId
    async function fetchUserPostsData(userId) {
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
            if (!response.ok) throw new Error('Failed to fetch posts');
            const posts = await response.json();
            // Return only the titles of the posts
            return posts.map(post => post.title);
        } catch (error) {
            return { error: `Error fetching posts: ${error.message}` };
        }
    }

    // Generate HTML string for user cards
    function generateUserCards(users, selectedUserId) {
        if (users.error) {
            return `<div class="error">${users.error}</div>`;
        }
        if (users.length === 0) {
            return '<div>No active users available.</div>';
        }

        return users.map(user => `
            <div class="user-card ${user.id === selectedUserId ? 'selected' : ''}">
                <div class="user-info">
                    <h3>${user.fullName}</h3>
                    <p>Email: ${user.email}</p>
                    ${user.isActive ? '<span class="active-badge">Active</span>' : ''}
                </div>
                <button onclick="selectUser(${user.id})">Select User</button>
            </div>
        `).join('');
    }

    // Generate HTML string for posts
    function generatePostsHtml(posts) {
        if (posts.error) {
            return `<div class="error">${posts.error}</div>`;
        }
        if (posts.length === 0) {
            return '<div>No posts available for this user.</div>';
        }
        return `
            <div class="posts-list">
                <h4>Posts:</h4>
                <ul>
                    ${posts.map(title => `<li>${title}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    // Render the user component
    function render() {
        const state = userStateManager.getState();
        let htmlString = '';

        if (state.isFetching) {
            htmlString = '<div>Fetching user data...</div>';
        } else {
            // Generate user cards
            htmlString = generateUserCards(state.users, state.selectedUserId);

            // If a user is selected, show their posts
            if (state.selectedUserId && state.posts.length > 0) {
                htmlString += generatePostsHtml(state.posts);
            }
        }

        updateOutput('output4', htmlString);
    }

    // Fetch users and initialize the component
    async function initialize() {
        userStateManager.setState({ isFetching: true });
        const users = await fetchUsers();
        userStateManager.setState({ users, isFetching: false });
        render();
    }

    // Function to select a user and fetch their posts
    async function selectUser(userId) {
        userStateManager.setState({ selectedUserId: userId, isFetching: true, posts: [] });
        const posts = await fetchUserPostsData(userId);
        userStateManager.setState({ posts, isFetching: false });
        render();
    }

    // Subscribe to state changes
    userStateManager.subscribe(render);

    // Expose the selectUser function to the global scope
    window.selectUser = selectUser;

    // Initialize the component
    initialize();
}

// Initialize the User Component on page load
createUserComponent();

// Utility to update output divs with an HTML string
function updateOutput(divId, htmlString) {
    const outputDiv = document.getElementById(divId);
    outputDiv.innerHTML = htmlString;
}

// Exercise 1: Data Transformation
// Fetch users, filter inactive ones, transform to {id, fullName, email}, and sort by fullName
async function transformData() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!response.ok) throw new Error('Failed to fetch users');
        const users = await response.json();

        // Transform, filter, and sort
        const transformedUsers = users
            .map(user => ({
                id: user.id,
                fullName: user.name,
                email: user.email,
                isActive: user.id % 2 === 0 // Simulate active status (even IDs are active)
            }))
            .filter(user => user.isActive) // Filter only active users
            .sort((a, b) => a.fullName.localeCompare(b.fullName)); // Sort alphabetically by fullName

        // Return as HTML string
        return transformedUsers.map(user => `
            <div class="transformed-user">
                <p>ID: ${user.id}</p>
                <p>Full Name: ${user.fullName}</p>
                <p>Email: ${user.email}</p>
            </div>
        `).join('');
    } catch (error) {
        return `<div class="error">Error transforming data: ${error.message}</div>`;
    }
}

async function runTransformData() {
    updateOutput('output1', '<div>Transforming data...</div>');
    const result = await transformData();
    updateOutput('output1', result);
}

// Exercise 2: Async Data Fetching
// Fetch actual posts by userId and return their titles
async function fetchData(userId) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch posts');
        const posts = await response.json();
        // Return only the titles of the posts as an HTML string
        return posts.map(post => `<li>${post.title}</li>`).join('');
    } catch (error) {
        return `<div class="error">Error fetching data: ${error.message}</div>`;
    }
}

async function runFetchData() {
    const userId = 1; // Example userId
    updateOutput('output2', '<div>Fetching data...</div>');
    const data = await fetchData(userId);
    updateOutput('output2', `<ul>${data}</ul>`);
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

    // Fetch users from API
    async function fetchUsers() {
        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/users");
            if (!response.ok) throw new Error('Failed to fetch users');
            const users = await response.json();

            // Transform users (include isActive for conditional badge)
            return users.map(user => ({
                id: user.id,
                fullName: user.name,
                email: user.email,
                isActive: user.id % 2 === 0 // Simulate active status (even IDs are active)
            }));
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
            return '<div>No users available.</div>';
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

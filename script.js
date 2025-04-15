// Utility to update output divs with an HTML string
function updateOutput(divId, htmlString) {
    const outputDiv = document.getElementById(divId);
    outputDiv.innerHTML = htmlString;
}

// Exercise 1: Data Transformation
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
            .filter(user => user.isActive)
            .sort((a, b) => a.fullName.localeCompare(b.fullName));

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
async function fetchData(userId) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch posts');
        const posts = await response.json();
        return posts.map(post => `<li>${post.title}</li>`).join('');
    } catch (error) {
        return `<div class="error">Error fetching data: ${error.message}</div>`;
    }
}

async function runFetchData() {
    const userId = 1;
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
stateListener(stateManager.getState());

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
    const userStateManager = createStateManager({
        selectedUserId: null,
        users: [],
        posts: [],
        isFetching: false
    });

    async function fetchUsers() {
        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/users");
            if (!response.ok) throw new Error('Failed to fetch users');
            const users = await response.json();

            return users.map(user => ({
                id: user.id,
                fullName: user.name,
                email: user.email,
                isActive: user.id % 2 === 0
            }));
        } catch (error) {
            return { error: `Error fetching users: ${error.message}` };
        }
    }

    async function fetchUserPostsData(userId) {
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
            if (!response.ok) throw new Error('Failed to fetch posts');
            const posts = await response.json();
            return posts.map(post => post.title);
        } catch (error) {
            return { error: `Error fetching posts: ${error.message}` };
        }
    }

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
                    <span class="status-badge ${user.isActive ? 'active' : 'inactive'}">
                        ${user.isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>
                <button onclick="selectUser(${user.id})">Select User</button>
            </div>
        `).join('');
    }

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

    function render() {
        const state = userStateManager.getState();
        let htmlString = '';

        if (state.isFetching) {
            htmlString = '<div>Fetching user data...</div>';
        } else {
            htmlString = generateUserCards(state.users, state.selectedUserId);
            if (state.selectedUserId && state.posts.length > 0) {
                htmlString += generatePostsHtml(state.posts);
            }
        }

        updateOutput('output4', htmlString);
    }

    async function initialize() {
        userStateManager.setState({ isFetching: true });
        const users = await fetchUsers();
        userStateManager.setState({ users, isFetching: false });
        render();
    }

    async function selectUser(userId) {
        userStateManager.setState({ selectedUserId: userId, isFetching: true, posts: [] });
        const posts = await fetchUserPostsData(userId);
        userStateManager.setState({ posts, isFetching: false });
        render();
    }

    userStateManager.subscribe(render);
    window.selectUser = selectUser;
    initialize();
}

createUserComponent();

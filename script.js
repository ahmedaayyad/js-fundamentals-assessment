// Utility to update output divs with an HTML string
function updateOutput(divId, htmlString) {
    const outputDiv = document.getElementById(divId);
    outputDiv.innerHTML = htmlString;
}

// System Logs Utility
const systemLogs = [];
function addLog(message) {
    const timestamp = new Date().toLocaleTimeString('en-GB', { hour12: false });
    systemLogs.push(`${timestamp} - ${message}`);
    updateLogsDisplay();
}

function updateLogsDisplay() {
    const logsHtml = systemLogs.join('\n');
    updateOutput('output5', `<pre>${logsHtml}</pre>`);
}

function formatLogs() {
    addLog("Formatting system logs");
    systemLogs.length = 0; // Clear logs
    updateLogsDisplay();
    addLog("System logs formatted");
}

function exportLogs() {
    addLog("Exporting system logs");
    const logsText = systemLogs.join('\n');
    const blob = new Blob([logsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'system-logs.txt';
    a.click();
    URL.revokeObjectURL(url);
    addLog("System logs exported");
}

// Exercise 1: Data Transformation
async function transformData() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!response.ok) throw new Error('Failed to fetch users');
        const users = await response.json();

        const transformedUsers = users
            .map(user => ({
                id: user.id,
                fullName: user.name,
                email: user.email,
                isActive: true // All users are active
            }))
            .filter(user => user.isActive)
            .sort((a, b) => a.fullName.localeCompare(b.fullName));

        addLog(`Transformed ${transformedUsers.length} user records`);

        return transformedUsers.map(user => `
            <div class="transformed-user">
                <p>ID: ${user.id}</p>
                <p>Full Name: ${user.fullName}</p>
                <p>Email: ${user.email}</p>
            </div>
        `).join('');
    } catch (error) {
        addLog(`Error transforming data: ${error.message}`);
        return `<div class="error">Error transforming data: ${error.message}</div>`;
    }
}

async function runTransformData() {
    addLog("Starting data transformation");
    updateOutput('output1', '<div>Transforming data...</div>');
    const result = await transformData();
    updateOutput('output1', result);
    addLog("Completed data transformation");
}

// Exercise 2: Async Data Fetching
async function fetchData(userId) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch posts');
        const posts = await response.json();
        addLog(`Fetched ${posts.length} posts for user ID ${userId}`);
        return posts.map(post => `<li>${post.title}</li>`).join('');
    } catch (error) {
        addLog(`Error fetching data: ${error.message}`);
        return `<div class="error">Error fetching data: ${error.message}</div>`;
    }
}

async function runFetchData() {
    const userId = 1;
    addLog(`Initiating data fetch for user ID ${userId}`);
    updateOutput('output2', '<div>Fetching data...</div>');
    const data = await fetchData(userId);
    updateOutput('output2', `<ul>${data}</ul>`);
    addLog(`Completed data fetch for user ID ${userId}`);
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

function stateListener(newState) {
    updateOutput('output3', `<pre>State: ${JSON.stringify(newState, null, 2)}</pre>`);
}

unsubscribe = stateManager.subscribe(stateListener);
stateListener(stateManager.getState());
addLog("State manager initialized");

function incrementCount() {
    addLog("Incrementing counter");
    stateManager.setState({ count: stateManager.getState().count + 1 });
    addLog(`Counter incremented to ${stateManager.getState().count}`);
}

function changeText() {
    addLog("Changing text");
    stateManager.setState({ text: stateManager.getState().text === "Hello" ? "World" : "Hello" });
    addLog(`Text changed to ${stateManager.getState().text}`);
}

function unsubscribeListener() {
    if (unsubscribe) {
        addLog("Unsubscribing from state updates");
        unsubscribe();
        updateOutput('output3', '<pre>Unsubscribed from state updates.</pre>');
        unsubscribe = null;
        addLog("Unsubscribed from state updates");
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

            const transformedUsers = users.map(user => ({
                id: user.id,
                fullName: user.name,
                email: user.email,
                isActive: true, // All users are active
                position: "Senior Developer"
            }));

            addLog(`Loaded ${transformedUsers.length} active users`);
            return transformedUsers;
        } catch (error) {
            addLog(`Error fetching users: ${error.message}`);
            return { error: `Error fetching users: ${error.message}` };
        }
    }

    async function fetchUserPostsData(userId) {
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
            if (!response.ok) throw new Error('Failed to fetch posts');
            const posts = await response.json();
            addLog(`Fetched ${posts.length} posts for user ID ${userId}`);
            return posts.map(post => post.title);
        } catch (error) {
            addLog(`Error fetching posts: ${error.message}`);
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

        return `
            <div class="user-cards">
                ${users.map(user => `
                    <div class="user-card ${user.id === selectedUserId ? 'selected' : ''}">
                        <div class="user-info">
                            <h3>${user.fullName}</h3>
                            <p>Email: ${user.email}</p>
                            <p>Position: ${user.position}</p>
                            <span class="status-badge">Active</span>
                        </div>
                        <div class="user-actions">
                            <button onclick="selectUser(${user.id})">View Posts</button>
                            <button class="message-btn" onclick="messageUser(${user.id})">Message</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
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
            addLog("Fetching user data");
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
        addLog("Initializing user component");
        userStateManager.setState({ isFetching: true });
        const users = await fetchUsers();
        userStateManager.setState({ users, isFetching: false });
        addLog("User component initialized");
        render();
    }

    async function selectUser(userId) {
        addLog(`Selecting user ID ${userId}`);
        userStateManager.setState({ selectedUserId: userId, isFetching: true, posts: [] });
        const posts = await fetchUserPostsData(userId);
        userStateManager.setState({ posts, isFetching: false });
        addLog(`User ID ${userId} selected`);
        render();
    }

    function messageUser(userId) {
        const user = userStateManager.getState().users.find(u => u.id === userId);
        addLog(`Message sent to user: ${user.fullName}`);
        alert(`Message sent to ${user.fullName}!`);
    }

    userStateManager.subscribe(render);
    window.selectUser = selectUser;
    window.messageUser = messageUser;
    initialize();
}

createUserComponent();

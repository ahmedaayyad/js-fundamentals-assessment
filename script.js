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
    systemLogs.length = 0; // Clear logs
    updateLogsDisplay();
    addLog("System logs formatted");
}

function exportLogs() {
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
                isActive: user.id % 2 === 0
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
    addLog("Transformed user data");
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
    addLog(`Fetched ${data.split('<li>').length - 1} posts for user ID ${userId}`);
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

function incrementCount() {
    stateManager.setState({ count: stateManager.getState().count + 1 });
    addLog("Incremented counter");
}

function changeText() {
    stateManager.setState({ text: stateManager.getState().text === "Hello" ? "World" : "Hello" });
    addLog("Changed text");
}

function unsubscribeListener() {
    if (unsubscribe) {
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
                isActive: user.id % 2 === 0,
                position: "Senior Developer" // Static position for demo
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

    function generateUserTable(users, selectedUserId) {
        if (users.error) {
            return `<div class="error">${users.error}</div>`;
        }
        if (users.length === 0) {
            return '<div>No users available.</div>';
        }

        return `
            <table class="user-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Position</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${users.map(user => `
                        <tr class="${user.id === selectedUserId ? 'selected' : ''}">
                            <td>${user.id}</td>
                            <td>${user.fullName}</td>
                            <td>${user.email}</td>
                            <td>${user.position}</td>
                            <td>
                                <span class="status-badge ${user.isActive ? 'active' : 'inactive'}">
                                    ${user.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            <td>
                                <button class="view-btn" onclick="selectUser(${user.id})">View</button>
                                <button class="${user.isActive ? 'deactivate-btn' : 'active-btn'}" onclick="toggleUserStatus(${user.id})">
                                    ${user.isActive ? 'Deactivate' : 'Active'}
                                </button>
                                <button class="message-btn" onclick="messageUser(${user.id})">Message</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
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
            htmlString = '<div>Fetching user data...</div>';
        } else {
            htmlString = generateUserTable(state.users, state.selectedUserId);
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
        addLog("System initialized");
        render();
    }

    async function selectUser(userId) {
        userStateManager.setState({ selectedUserId: userId, isFetching: true, posts: [] });
        const posts = await fetchUserPostsData(userId);
        userStateManager.setState({ posts, isFetching: false });
        render();
    }

    function toggleUserStatus(userId) {
        const users = userStateManager.getState().users;
        const updatedUsers = users.map(user => {
            if (user.id === userId) {
                const newStatus = !user.isActive;
                addLog(`Status updated: {"name": "${user.fullName}", "status": "${newStatus ? 'Active' : 'Inactive'}", "lastSeen": "${new Date().toLocaleString('en-GB')}"}`);
                return { ...user, isActive: newStatus };
            }
            return user;
        });
        userStateManager.setState({ users: updatedUsers });
    }

    function messageUser(userId) {
        const user = userStateManager.getState().users.find(u => u.id === userId);
        addLog(`Message sent to user: ${user.fullName}`);
        alert(`Message sent to ${user.fullName}!`); // Simulate messaging
    }

    userStateManager.subscribe(render);
    window.selectUser = selectUser;
    window.toggleUserStatus = toggleUserStatus;
    window.messageUser = messageUser;
    initialize();
}

createUserComponent();

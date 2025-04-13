// Utility to update output divs
function updateOutput(divId, content) {
    const outputDiv = document.getElementById(divId);
    outputDiv.textContent = content;
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
    updateOutput('output1', result);
}

// Exercise 2: Async Data Fetching
async function fetchData(url) {
    try {
        const response = await new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    { id: 1, title: "Post 1" },
                    { id: 2, title: "Post 2" }
                ]);
            }, 1000);
        });
        return JSON.stringify(response, null, 2);
    } catch (error) {
        return `Error fetching data: ${error.message}`;
    }
}

async function runFetchData() {
    updateOutput('output2', 'Fetching data...');
    const data = await fetchData("https://fake-api.com/posts");
    updateOutput('output2', data);
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
    updateOutput('output3', `State: ${JSON.stringify(newState, null, 2)}`);
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
        updateOutput('output3', 'Unsubscribed from state updates.');
        unsubscribe = null;
    }
}

// Exercise 4: User Component
function createUserComponent() {
    // State management for the user component
    const userStateManager = createStateManager({
        name: "John Doe",
        age: 28,
        posts: []
    });

    // Transform posts data for display
    function transformPosts(posts, userName) {
        return posts.map(post => `Post ID: ${post.id}, Title: ${post.title}`).join('\n');
    }

    // Async function to fetch user's posts
    async function fetchUserPostsData(userName) {
        try {
            const response = await new Promise((resolve) => {
                setTimeout(() => {
                    resolve([
                        { id: 101, title: `${userName}'s First Post` },
                        { id: 102, title: `${userName}'s Second Post` }
                    ]);
                }, 1000);
            });
            return response;
        } catch (error) {
            updateOutput('output4', `Error fetching posts: ${error.message}`);
            return [];
        }
    }

    // Update existing posts' titles when the name changes
    function updatePostTitles(posts, newName) {
        return posts.map(post => ({
            ...post,
            title: post.title.replace(/^(John Doe|Jane Smith)/, newName)
        }));
    }

    // Render the user component
    function render() {
        const state = userStateManager.getState();
        const userDisplay = document.getElementById('user-display');
        userDisplay.textContent = `User: ${state.name}, Age: ${state.age}`;
        if (state.posts.length > 0) {
            updateOutput('output4', transformPosts(state.posts, state.name));
        }
    }

    // Subscribe to state changes
    userStateManager.subscribe((newState) => {
        // When the name changes, update the titles of existing posts
        if (newState.posts.length > 0) {
            const updatedPosts = updatePostTitles(newState.posts, newState.name);
            userStateManager.setState({ posts: updatedPosts });
        }
        render();
    });
    render(); // Initial render

    // Function to update the user's name
    function updateUserName() {
        const newName = userStateManager.getState().name === "John Doe" ? "Jane Smith" : "John Doe";
        userStateManager.setState({ name: newName });
    }

    // Function to fetch and display user's posts
    async function fetchUserPosts() {
        updateOutput('output4', 'Fetching user posts...');
        const currentName = userStateManager.getState().name;
        const posts = await fetchUserPostsData(currentName);
        userStateManager.setState({ posts });
    }

    // Expose functions to the global scope for button onclick handlers
    window.updateUserName = updateUserName;
    window.fetchUserPosts = fetchUserPosts;
}

// Initialize the User Component on page load
createUserComponent();

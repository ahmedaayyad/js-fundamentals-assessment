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

const stateManager = createStateManager({ count: 0, text: "Hello" });
let unsubscribe;

function stateListener(newState) {
    updateOutput('output3', `State: ${JSON.stringify(newState, null, 2)}`);
}

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

    function transformPosts(posts) {
        return posts.map(post => `Post ID: ${post.id}, Title: ${post.title}`).join('\n');
    }

    async function fetchUserPostsData() {
        try {
            const response = await new Promise((resolve) => {
                setTimeout(() => {
                    resolve([
                        { id: 101, title: "John's First Post" },
                        { id: 102, title: "John's Second Post" }
                    ]);
                }, 1000);
            });
            return response;
        } catch (error) {
            updateOutput('output4', `Error fetching posts: ${error.message}`);
            return [];
        }
    }

    function render() {
        const state = userStateManager.getState();
        const userDisplay = document.getElementById('user-display');
        userDisplay.textContent = `User: ${state.name}, Age: ${state.age}`;
        if (state.posts.length > 0) {
            updateOutput('output4', transformPosts(state.posts));
        }
    }

    userStateManager.subscribe(render);
    render(); 

    function updateUserName() {
        const newName = userStateManager.getState().name === "John Doe" ? "Jane Smith" : "John Doe";
        userStateManager.setState({ name: newName });
    }

    async function fetchUserPosts() {
        updateOutput('output4', 'Fetching user posts...');
        const posts = await fetchUserPostsData();
        userStateManager.setState({ posts });
    }

    window.updateUserName = updateUserName;
    window.fetchUserPosts = fetchUserPosts;
}

createUserComponent();

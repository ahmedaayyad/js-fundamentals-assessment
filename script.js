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

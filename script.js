// JavaScript Fundamentals Assessment Exercises

// Exercise 1: Data Transformation
// Create a function that transforms an array of objects into a new format
function transformData(data) {
    // Input: Array of objects with name and age
    // Output: Array of strings in format "Name: [name], Age: [age]"
    return data.map(item => `Name: ${item.name}, Age: ${item.age}`);
}

// Test for Exercise 1
console.log("Exercise 1: Data Transformation");
const sampleData = [
    { name: "Alice", age: 25 },
    { name: "Bob", age: 30 },
    { name: "Charlie", age: 35 }
];
console.log(transformData(sampleData));
// Expected Output: ["Name: Alice, Age: 25", "Name: Bob, Age: 30", "Name: Charlie, Age: 35"]

// Exercise 2: Async Data Fetching
// Simulate fetching data asynchronously (e.g., from an API)
async function fetchData(url) {
    try {
        // Simulate an API call with a Promise and setTimeout
        const response = await new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    { id: 1, title: "Post 1" },
                    { id: 2, title: "Post 2" }
                ]);
            }, 1000);
        });
        return response;
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
}

// Test for Exercise 2
console.log("\nExercise 2: Async Data Fetching");
(async () => {
    const data = await fetchData("https://fake-api.com/posts");
    console.log(data);
    // Expected Output (after 1 second): [{ id: 1, title: "Post 1" }, { id: 2, title: "Post 2" }]
})();

// Exercise 3: State Management
// Simulate a React-like state management pattern using a closure
function createStateManager(initialState) {
    let state = initialState;
    const listeners = [];

    // Get current state
    function getState() {
        return state;
    }

    // Update state and notify listeners
    function setState(newState) {
        state = { ...state, ...newState };
        listeners.forEach(listener => listener(state));
    }

    // Subscribe to state changes
    function subscribe(listener) {
        listeners.push(listener);
        return () => {
            const index = listeners.indexOf(listener);
            if (index > -1) listeners.splice(index, 1);
        };
    }

    return { getState, setState, subscribe };
}

// Test for Exercise 3
console.log("\nExercise 3: State Management");
const stateManager = createStateManager({ count: 0, text: "Hello" });

// Subscribe to state changes
const unsubscribe = stateManager.subscribe((newState) => {
    console.log("State updated:", newState);
});

// Update state
stateManager.setState({ count: stateManager.getState().count + 1 });
stateManager.setState({ text: "World" });

// Unsubscribe and test one more update
unsubscribe();
stateManager.setState({ count: stateManager.getState().count + 1 });

// Expected Output:
// State updated: { count: 1, text: "Hello" }
// State updated: { count: 1, text: "World" }
// (No output for the last setState because unsubscribed)

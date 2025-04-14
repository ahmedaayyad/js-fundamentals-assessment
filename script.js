// script.js

// Part 1: Theoretical Answers
const theoreticalAnswers = `
1. Closures and Scope:
A closure is a function that retains access to its lexical scope even when executed outside that scope. In React, closures are used to maintain stateful logic, like a counter in a component. For example, a useEffect cleanup function can access variables from its parent scope to manage subscriptions or timers.

2. Promises vs. Async/Await:
Promises handle asynchronous operations with .then() and .catch(), but can lead to chained code that's hard to read. Async/await is syntactic sugar over Promises, making async code look synchronous and easier to follow. In React, async/await is preferred for fetching data in useEffect because it simplifies error handling and improves readability.

3. Immutability in State Management:
Immutability ensures state changes are predictable and prevents unintended side effects in React's rendering. Mutating state directly can cause components to not re-render. For example, to update an array in state, use spread operator: setState([...state, newItem]) instead of state.push(newItem).

4. Arrow Functions and this:
Arrow functions inherit 'this' from their surrounding scope, unlike regular functions where 'this' depends on how they're called. In React, arrow functions are used in event handlers to avoid binding 'this' manually, ensuring 'this' refers to the component instance, e.g., onClick={() => this.handleClick()}.
`;

// Display theoretical answers on page load
document.getElementById('theoretical-answers').innerText = theoreticalAnswers;

// Part 2: Coding Exercises

// Exercise 1: Data Transformation
function transformUserData(users) {
    return users
        .filter(user => user.active) // Exclude inactive users
        .map(({ id, name, age }) => ({
            id,
            name,
            status: age >= 18 ? 'Adult' : 'Minor'
        })); // Transform to required format
}

// Exercise 2: Async Data Fetching
async function fetchPosts() {
    console.log('Loading posts...');
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const posts = await response.json();
        const result = posts.slice(0, 5).map(({ id, title, body }) => ({ id, title, body }));
        console.log('Posts fetched successfully!');
        return result;
    } catch (error) {
        console.error(`Error fetching posts: ${error.message}`);
        throw error;
    }
}

// Exercise 3: State Management
function createTodoStore() {
    let todos = [];
    let idCounter = 1;

    return {
        addTodo(text) {
            todos = [...todos, { id: idCounter++, text, completed: false }];
        },
        toggleTodo(id) {
            todos = todos.map(todo =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            );
        },
        getTodos() {
            return [...todos]; // Return a copy to maintain immutability
        },
        getSummary() {
            return {
                total: todos.length,
                completed: todos.filter(todo => todo.completed).length
            };
        }
    };
}

// Exercise 4: Group by Category
function groupByCategory(products) {
    return products.reduce((acc, { name, category }) => {
        acc[category] = acc[category] || [];
        acc[category].push(name);
        return acc;
    }, {});
}

// UI Interaction Functions
function runTransformUserData() {
    const users = [
        { id: 1, name: 'Alice', age: 25, active: true },
        { id: 2, name: 'Bob', age: 17, active: false },
        { id: 3, name: 'Charlie', age: 30, active: true }
    ];
    const result = transformUserData(users);
    document.getElementById('output1').innerText = JSON.stringify(result, null, 2);
}

async function runFetchPosts() {
    document.getElementById('output2').innerText = 'Loading...';
    try {
        const posts = await fetchPosts();
        document.getElementById('output2').innerText = JSON.stringify(posts, null, 2);
    } catch (error) {
        document.getElementById('output2').innerText = `Error: ${error.message}`;
    }
}

function runTodoStore() {
    const store = createTodoStore();
    store.addTodo('Learn JavaScript');
    store.addTodo('Build a React app');
    store.toggleTodo(1);
    const todos = store.getTodos();
    const summary = store.getSummary();
    document.getElementById('output3').innerText = `Todos:\n${JSON.stringify(todos, null, 2)}\n\nSummary:\n${JSON.stringify(summary, null, 2)}`;
}

function runGroupByCategory() {
    const products = [
        { id: 1, name: 'Laptop', category: 'Electronics', price: 1000 },
        { id: 2, name: 'Shirt', category: 'Clothing', price: 50 },
        { id: 3, name: 'Phone', category: 'Electronics', price: 800 },
        { id: 4, name: 'Jeans', category: 'Clothing', price: 80 }
    ];
    const result = groupByCategory(products);
    document.getElementById('output4').innerText = JSON.stringify(result, null, 2);
}

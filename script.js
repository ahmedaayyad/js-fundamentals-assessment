function transformUserData(users) {
    return users
        .filter(user => user.active) 
        .map(({ id, name, age }) => ({
            id,
            name,
            status: age >= 18 ? 'Adult' : 'Minor'
        })); 
}

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
            return [...todos]; 
        },
        getSummary() {
            return {
                total: todos.length,
                completed: todos.filter(todo => todo.completed).length
            };
        }
    };
}

function groupByCategory(products) {
    return products.reduce((acc, { name, category }) => {
        acc[category] = acc[category] || [];
        acc[category].push(name);
        return acc;
    }, {});
}

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

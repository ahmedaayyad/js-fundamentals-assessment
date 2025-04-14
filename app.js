// Exercise 1: Data Transformation Function
function transformUserData(users) {
    return users.map(user => ({
        fullName: `${user.firstName} ${user.lastName}`,
        age: user.age,
        isActive: user.status === 'active'
    }));
}

// Exercise 2: Async Data Fetching Function
async function fetchUsers() {
    try {
        // Simulated API call (in a real scenario, this would be fetch('https://api.example.com/users'))
        const response = await new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    { id: 1, firstName: 'Alice', lastName: 'Smith', age: 25, status: 'active' },
                    { id: 2, firstName: 'Bob', lastName: 'Jones', age: 30, status: 'inactive' }
                ]);
            }, 1000);
        });
        return response;
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

// Exercise 3: State Management Function
function createState(initialState) {
    let state = initialState;
    const listeners = [];

    return {
        getState: () => state,
        setState: (newState) => {
            state = { ...state, ...newState };
            listeners.forEach(listener => listener(state));
        },
        subscribe: (listener) => {
            listeners.push(listener);
            return () => {
                const index = listeners.indexOf(listener);
                if (index !== -1) listeners.splice(index, 1);
            };
        }
    };
}

// User Component (React-like pattern without React)
function UserComponent(user) {
    return `
        <div class="user-card">
            <h3>${user.fullName}</h3>
            <p>Age: ${user.age}</p>
            <p>Status: ${user.isActive ? 'Active' : 'Inactive'}</p>
        </div>
    `;
}

// Main App Logic
function App() {
    // Initialize state using the state management function
    const store = createState({ users: [], loading: false });

    // Function to render the app
    function render() {
        const state = store.getState();
        const appDiv = document.getElementById('app');
        const userList = state.users.map(user => UserComponent(user)).join('');

        appDiv.innerHTML = `
            <h2>User List</h2>
            ${state.loading ? '<p>Loading...</p>' : ''}
            <button id="fetch-btn">Fetch Users</button>
            <button id="transform-btn">Transform Data</button>
            <div>${userList || '<p>No users to display.</p>'}</div>
        `;

        // Add event listeners
        document.getElementById('fetch-btn').addEventListener('click', handleFetchUsers);
        document.getElementById('transform-btn').addEventListener('click', handleTransformData);
    }

    // Handle async data fetching
    async function handleFetchUsers() {
        store.setState({ loading: true });
        const fetchedUsers = await fetchUsers();
        store.setState({ users: fetchedUsers, loading: false });
    }

    // Handle data transformation
    function handleTransformData() {
        const currentUsers = store.getState().users;
        if (currentUsers.length === 0) {
            alert('Please fetch users first!');
            return;
        }
        const transformedUsers = transformUserData(currentUsers);
        store.setState({ users: transformedUsers });
    }

    // Subscribe to state changes to re-render
    store.subscribe(render);

    // Initial render
    render();
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    App();
});

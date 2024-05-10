<template>
  <head>
    <link rel="stylesheet" href="https://unpkg.com/vue-draggable-next/dist/style.css" />
  </head>
  <div class="todo-app">
    <h1>Todo App</h1>
    <div class="add-todo">
      <input
        v-model="newTodo"
        class="todo-input"
        placeholder="Add a new todo"
        @keyup.enter="addTodo"
      />
      <button class="add-button" @click="addTodo">Add</button>
    </div>
    <ul class="todo-list">
      <VueDraggableNext class="todo-list" item-key="id" :list="todos">
        <li v-for="todo in todos" :key="todo.id" class="todo-item">
          <span>{{ todo.name }}</span>
          <button @click="deleteTodo(todo.id)" class="delete-button">Delete</button>
        </li>
      </VueDraggableNext>
    </ul>
    <!-- <div v-drag-and-drop:options="options">
      <ul class="todo-list">
        <li v-for="todo in todos" :key="todo.id" class="todo-item">
          <span>{{ todo.name }}</span>
          <button @click="deleteTodo(todo.id)" class="delete-button">Delete</button>
        </li>
      </ul>
    </div> -->
  </div>
</template>

<script>
import firebase from '../firebaseConfig.js'
import {
  getFirestore,
  doc,
  collection,
  getDocs,
  onSnapshot,
  setDoc,
  deleteDoc
} from 'firebase/firestore'
import { VueDraggableNext } from 'vue-draggable-next'

const db = getFirestore()

export default {
  components: {
    VueDraggableNext
  },
  data() {
    return {
      newTodo: '',
      todos: []
    }
  },
  created() {
    this.fetchTodos()
    this.subscribeToTodos()
  },
  methods: {
    subscribeToTodos() {
      const todosRef = collection(db, 'todos')
      onSnapshot(todosRef, (querySnapshot) => {
        this.todos = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      })
    },
    async fetchTodos() {
      try {
        const todosRef = collection(db, 'todos')
        const querySnapshot = await getDocs(todosRef)
        this.todos = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        console.log('todos: ', this.todos)
      } catch (error) {
        console.error('Error fetching todos:', error)
      }
    },
    async addTodo() {
      try {
        const randomId = Math.random().toString(36).substring(2) // Generate random ID
        await setDoc(doc(db, 'todos', randomId), {
          name: this.newTodo
        })
        this.newTodo = '' // Clear input field after adding todo
        this.fetchTodos() // Refresh todos list
        console.log('Todo added successfully!')
      } catch (error) {
        console.error('Error adding todo:', error)
      }
    },
    async deleteTodo(id) {
      try {
        await deleteDoc(doc(db, 'todos', id))
        this.fetchTodos() // Refresh todos list
        console.log('Todo deleted successfully!')
      } catch (error) {
        console.error('Error deleting todo:', error)
      }
    }
  }
}
</script>

<style scoped>
.todo-app {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.todo-input {
  width: 70%;
  padding: 10px;
  font-size: 16px;
}

.add-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.add-button:hover {
  background-color: #0056b3;
}

.todo-list {
  padding: 0;
}

.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.delete-button {
  padding: 5px 10px;
  background-color: #dc3545;
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

.delete-button:hover {
  background-color: #c82333;
}
/* Basic styling for draggable items */
.vdrg-item {
  /* Add styles as needed, e.g., */
  padding: 10px;
  margin: 5px;
  border: 1px solid #ccc;
  cursor: move; /* Indicate draggability */
}

/* Optional: Styling for the placeholder */
.vdrg-placeholder {
  /* Add styles to visually represent the placeholder */
  background-color: #f0f0f0;
  border: 2px dashed #ccc;
}
</style>

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Trash2, Plus, CheckCircle2, Circle } from "lucide-react";

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTodos(data || []);
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  }

  async function addTodo() {
    if (!newTodo.trim()) return;

    try {
      const { data, error } = await supabase
        .from("todos")
        .insert([{ title: newTodo.trim(), completed: false }])
        .select();

      if (error) throw error;
      setTodos([data[0], ...todos]);
      setNewTodo("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  }

  async function toggleTodo(id, completed) {
    try {
      const { error } = await supabase
        .from("todos")
        .update({ completed: !completed })
        .eq("id", id);

      if (error) throw error;
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, completed: !completed } : todo
      ));
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  }

  async function deleteTodo(id) {
    try {
      const { error } = await supabase
        .from("todos")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  }

  function handleKeyPress(e) {
    if (e.key === "Enter") {
      addTodo();
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-sky-500">My Todos</h1>

        <div className="flex gap-2 mb-8">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a new todo..."
            className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          />
          <button
            onClick={addTodo}
            className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Add
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-8">Loading todos...</div>
        ) : todos.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <p className="text-lg">No todos yet. Add one above!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex items-center gap-3 hover:border-gray-700 transition-colors"
              >
                <button
                  onClick={() => toggleTodo(todo.id, todo.completed)}
                  className="flex-shrink-0 text-sky-500 hover:text-sky-400 transition-colors"
                >
                  {todo.completed ? (
                    <CheckCircle2 size={24} />
                  ) : (
                    <Circle size={24} />
                  )}
                </button>
                <span
                  className={`flex-1 text-lg ${
                    todo.completed
                      ? "line-through text-gray-500"
                      : "text-white"
                  }`}
                >
                  {todo.title}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="flex-shrink-0 text-gray-500 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center text-gray-600 text-sm">
          {todos.filter(t => !t.completed).length} active ·{" "}
          {todos.filter(t => t.completed).length} completed
        </div>
      </div>
    </div>
  );
}
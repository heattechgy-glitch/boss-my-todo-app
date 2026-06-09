import { useState } from "react";
import { Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function TodoItem({ todo, onUpdate, onDelete }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("todos")
        .update({ completed: !todo.completed })
        .eq("id", todo.id);

      if (error) throw error;
      onUpdate();
    } catch (err) {
      console.error("Error updating todo:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("todos")
        .delete()
        .eq("id", todo.id);

      if (error) throw error;
      onDelete();
    } catch (err) {
      console.error("Error deleting todo:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        disabled={isUpdating}
        className="w-5 h-5 rounded border-gray-600 text-sky-500 focus:ring-sky-500 focus:ring-offset-gray-900 disabled:opacity-50 cursor-pointer"
      />
      <span
        className={`flex-1 text-gray-200 ${
          todo.completed ? "line-through text-gray-500" : ""
        }`}
      >
        {todo.title}
      </span>
      <button
        onClick={handleDelete}
        disabled={isUpdating}
        className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
        aria-label="Delete todo"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
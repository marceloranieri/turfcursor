"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase/supabaseClient";

type Topic = {
  id: string;
  title: string;
  description: string;
  category: string;
  created_at: string;
  active: boolean;
};

export default function TopicAdmin() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [newTopic, setNewTopic] = useState({
    title: "",
    description: "",
    category: "",
  });

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    const { data, error } = await supabase.from("topics").select("*");
    if (error) console.error(error);
    else setTopics(data);
  };

  const createTopic = async () => {
    const { error } = await supabase.from("topics").insert([newTopic]);
    if (error) console.error(error);
    else {
      fetchTopics();
      setNewTopic({ title: "", description: "", category: "" });
    }
  };

  const deleteTopic = async (id: string) => {
    const { error } = await supabase.from("topics").delete().eq("id", id);
    if (error) console.error(error);
    else fetchTopics();
  };

  return (
    <div>
      <h1>Topic Admin</h1>
      <input
        type="text"
        placeholder="Title"
        value={newTopic.title}
        onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
      />
      <input
        type="text"
        placeholder="Description"
        value={newTopic.description}
        onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
      />
      <input
        type="text"
        placeholder="Category"
        value={newTopic.category}
        onChange={(e) => setNewTopic({ ...newTopic, category: e.target.value })}
      />
      <button onClick={createTopic}>Create Topic</button>

      <ul>
        {topics.map((topic) => (
          <li key={topic.id}>
            {topic.title} - {topic.category}
            <button onClick={() => deleteTopic(topic.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";

import React, { useState } from "react";

interface InputBoxProps {
  onSend: (text: string) => void;
}

export default function InputBox({ onSend }: InputBoxProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex">
      <input
        className="flex-1 border rounded-l px-3 py-2"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
      />
      <button className="bg-indigo-600 text-white px-4 py-2 rounded-r">Send</button>
    </form>
  );
}

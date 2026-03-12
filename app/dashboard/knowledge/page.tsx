"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function KnowledgePage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error: uploadErr } = await supabase.storage
      .from('documents')
      .upload(fileName, file);
    if (uploadErr) {
      alert(uploadErr.message);
      setUploading(false);
      return;
    }
    const url = supabase.storage.from('documents').getPublicUrl(fileName).data.publicUrl;
    // insert document entry
    const { data: docData, error: docErr } = await supabase
      .from('knowledge_documents')
      .insert({ name: file.name, type: fileExt, url, metadata: {} })
      .select('id')
      .single();
    if (docErr) {
      alert(docErr.message);
      setUploading(false);
      return;
    }
    // read text for embedding (if text or md)
    if (fileExt === 'txt' || fileExt === 'md') {
      const text = await file.text();
      await fetch('/api/knowledge/embed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: docData.id, text }),
      });
    }
    setUploading(false);
    alert('Uploaded');
    setFile(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Knowledge Base</h1>
      <div className="mb-4">
        <input type="file" onChange={handleFileChange} />
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </div>
  );
}

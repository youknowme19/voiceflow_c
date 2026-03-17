"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { 
  FileText, 
  UploadCloud, 
  Trash2, 
  FileCode, 
  File as FileIcon,
  Search,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { FadeInSection, GlassCard, GradientText } from "@/components/premium/PremiumUI";

export default function KnowledgePage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [teamId, setTeamId] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [agents, setAgents] = useState<any[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>("");

  useEffect(() => {
    async function loadInitialData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: teamData } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', session.user.id)
        .single();

      if (teamData?.team_id) {
        setTeamId(teamData.team_id);
        fetchDocuments(teamData.team_id);
        fetchAgents(teamData.team_id);
      } else {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  async function fetchAgents(tid: string) {
    const { data } = await supabase
      .from('agents')
      .select('id, name')
      .eq('team_id', tid);
    if (data) setAgents(data);
  }

  async function fetchDocuments(tid: string) {
    setLoading(true);
    const { data, error } = await supabase
      .from('knowledge_documents')
      .select('*')
      .eq('team_id', tid)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setDocuments(data);
    }
    setLoading(false);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setMsg(null);
    }
  };

  const handleUpload = async () => {
    if (!file || !teamId) return;
    setUploading(true);
    setMsg(null);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${file.name}`;
      
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from('knowledge')
        .upload(fileName, file);

      if (uploadErr) throw uploadErr;

      const url = supabase.storage.from('knowledge').getPublicUrl(fileName).data.publicUrl;

      // Get session for auth header
      const { data: { session } } = await supabase.auth.getSession();

      const { data: docData, error: docErr } = await supabase
        .from('knowledge_documents')
        .insert({ 
          name: file.name, 
          type: fileExt, 
          url, 
          team_id: teamId,
          agent_id: selectedAgentId || null,
          metadata: {} 
        })
        .select('*')
        .single();

      if (docErr) throw docErr;

      if (fileExt === 'txt' || fileExt === 'md') {
        const text = await file.text();
        await fetch('/api/knowledge/embed', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`
          },
          body: JSON.stringify({ documentId: docData.id, text }),
        });
      }

      setFile(null);
      setMsg({ type: 'success', text: 'Knowledge source added successfully!' });
      fetchDocuments(teamId);
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    const { error } = await supabase
      .from('knowledge_documents')
      .delete()
      .eq('id', docId);

    if (error) {
       setMsg({ type: 'error', text: error.message });
    } else {
      setDocuments(documents.filter(d => d.id !== docId));
      setMsg({ type: 'success', text: 'Document removed.' });
    }
  };

  const getFileIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'pdf': return <FileText className="text-red-400" />;
      case 'md':
      case 'txt': return <FileCode className="text-blue-400" />;
      default: return <FileIcon className="text-gray-400" />;
    }
  };

  return (
    <div className="space-y-8 p-6 pb-20">
      <FadeInSection>
        <div className="flex justify-between items-end mb-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">
              Knowledge <GradientText className="text-gradient">Base</GradientText>
            </h1>
            <p className="text-white/40 text-lg">Upload documents to give your agents specialized knowledge.</p>
          </div>
        </div>
      </FadeInSection>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Upload Card */}
        <FadeInSection delay={0.1}>
          <GlassCard variant="medium" className="p-8 border-accent-purple/20 bg-accent-purple/5">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
               <UploadCloud size={20} className="text-accent-purple" />
               Add New Source
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Assign to Agent</label>
                <select 
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-purple transition-colors appearance-none"
                >
                  <option value="">Specific Agent (Optional)</option>
                  {agents.map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>

              <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-accent-purple/5 transition-all cursor-pointer relative group bg-black/20">
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={handleFileChange}
                />
                <div className="w-12 h-12 rounded-xl bg-white/5 mx-auto flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                   <FileIcon size={24} className="text-white/20 group-hover:text-accent-purple transition-colors" />
                </div>
                <p className="text-sm font-medium text-white/60">
                  {file ? file.name : "Click or drag to upload"}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-white/30 mt-2 font-bold font-sans">Supports PDF, TXT, MD</p>
              </div>

              {msg && (
                <div className={`p-4 rounded-xl text-xs font-medium flex items-center gap-3 border ${
                  msg.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                  {msg.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                  {msg.text}
                </div>
              )}
              
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="w-full py-4 rounded-xl bg-white text-black font-bold text-sm hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-lg"
              >
                {uploading ? 'Synching to OS...' : 'Upload Knowledge'}
              </button>
            </div>
          </GlassCard>
        </FadeInSection>

        {/* Documents List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <span className="w-2 h-6 bg-accent-cyan rounded-full" />
            Active Sources
          </h3>

          {loading ? (
            <div className="text-white/40 py-10 flex items-center gap-3 animate-pulse">
               <Search size={18} />
               Searching archives...
            </div>
          ) : documents.length === 0 ? (
            <div className="p-16 border-2 border-dashed border-white/5 rounded-3xl text-center bg-white/[0.01]">
              <div className="w-16 h-16 rounded-full bg-white/5 mx-auto flex items-center justify-center mb-6">
                 <FileIcon size={24} className="text-white/10" />
              </div>
              <p className="text-white/20 font-medium font-sans">No knowledge sources attached yet.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {documents.map((doc, i) => (
                <FadeInSection key={doc.id} delay={0.1 + i * 0.05}>
                  <GlassCard variant="medium" className="p-5 flex items-center justify-between group hover:border-white/10 transition-all">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                        {getFileIcon(doc.type)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white group-hover:text-accent-cyan transition-colors">{doc.name}</h4>
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1 font-sans">
                           {doc.type} SOURCE • {new Date(doc.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDelete(doc.id)}
                      className="p-3 rounded-xl hover:bg-red-500/10 text-white/20 hover:text-red-500 transition-all active:scale-90"
                    >
                      <Trash2 size={18} />
                    </button>
                  </GlassCard>
                </FadeInSection>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

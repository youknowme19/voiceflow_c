"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import dynamic from "next/dynamic";

// load chart components client-side only
const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(mod => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });

export default function AnalyticsPage() {
  const [totalConversations, setTotalConversations] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const { data: convs } = await supabase.from('conversations').select('id');
      const { data: msgs } = await supabase.from('messages').select('id');
      setTotalConversations(convs?.length || 0);
      setTotalMessages(msgs?.length || 0);
    }
    fetchData();
  }, []);

  const avgPerConv = totalConversations ? totalMessages / totalConversations : 0;

  const chartData = [
    { name: 'Conversations', value: totalConversations },
    { name: 'Messages', value: totalMessages },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>
      <div className="mb-4">
        <p>Total Conversations: {totalConversations}</p>
        <p>Total Messages: {totalMessages}</p>
        <p>Avg msg per conv: {avgPerConv.toFixed(2)}</p>
      </div>
      <div style={{ width: '100%', height: 300 }}>
        <BarChart width={500} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ytiyrfliszifyuhghiqg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0aXlyZmxpc3ppZnl1aGdoaXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMTYzNjIsImV4cCI6MjA3Mzg5MjM2Mn0.DRmIJ0hee4kX7wdXt2OMXhaJ6-9RG6wL5FKZTw5hOz4'
const supabase = createClient(supabaseUrl, supabaseKey)

type Planejamento = {
  id: number;
  title: string;
  date: string | null;
  status: string | null;
};

interface Props {
  reload?: boolean;
}

export default function PlanejamentoGrid({ reload }: Props) {
  const [planejamentos, setPlanejamentos] = useState<Planejamento[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from<Planejamento>("planning")
        .select("id, title, date, status")
        .order("date", { ascending: true });

      if (error) {
        setError(error.message);
        setPlanejamentos([]);
      } else {
        setPlanejamentos(data ?? []);
      }
    } catch (err: any) {
      setError(err?.message ?? String(err));
      setPlanejamentos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);

  return (
    <div className="space-y-2">
      {loading && <p className="text-sm opacity-75">Carregando...</p>}
      {error && <p className="text-sm text-red-600">Erro: {error}</p>}

      {planejamentos.map((p) => (
        <div key={p.id} className="border p-3 rounded-md bg-white shadow-sm">
          <div className="font-semibold">{p.title}</div>
          <div className="text-sm opacity-75">
            Data:{" "}
            {p.date
              ? new Date(p.date).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              : "-"}
          </div>
          <div className="text-sm">Status: {p.status ?? "-"}</div>
        </div>
      ))}

      {!loading && planejamentos.length === 0 && !error && (
        <p className="opacity-60 text-sm">Nenhum planejamento criado ainda.</p>
      )}
    </div>
  );
}
"use client";

import React, { useEffect, useState } from "react";

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ytiyrfliszifyuhghiqg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0aXlyZmxpc3ppZnl1aGdoaXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMTYzNjIsImV4cCI6MjA3Mzg5MjM2Mn0.DRmIJ0hee4kX7wdXt2OMXhaJ6-9RG6wL5FKZTw5hOz4'
const supabase = createClient(supabaseUrl, supabaseKey)

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export default function PlanejamentoModal({ open, onClose, onSaved }: Props) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<"pendente" | "concluido">("pendente");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // reset modal state ao abrir/fechar
  useEffect(() => {
    if (!open) {
      setTitle("");
      setDate("");
      setStatus("pendente");
      setSaving(false);
      setError(null);
    }
  }, [open]);

  if (!open) return null;

  const save = async () => {
    setError(null);
    if (!title.trim()) {
      setError("O título é obrigatório.");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from("planning").insert([
        {
          title: title.trim(),
          date: date || null,
          status,
        },
      ]);

      if (error) {
        setError(error.message);
      } else {
        // limpa e notifica
        setTitle("");
        setDate("");
        setStatus("pendente");
        onSaved?.();
      }
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-md p-6 w-96 shadow-lg">
        <h2 className="text-lg font-medium mb-4">Novo Planejamento</h2>

        <div className="space-y-3">
          {error && <p className="text-sm text-red-600">{error}</p>}

          <input
            className="w-full border p-2 rounded"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={saving}
          />

          <input
            type="date"
            className="w-full border p-2 rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={saving}
          />

          <select
            className="w-full border p-2 rounded"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value === "concluido" ? "concluido" : "pendente")
            }
            disabled={saving}
          >
            <option value="pendente">Pendente</option>
            <option value="concluido">Concluído</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button
            className="px-3 py-1.5 border rounded"
            onClick={onClose}
            disabled={saving}
          >
            Cancelar
          </button>

          <button
            className="px-3 py-1.5 bg-blue-600 text-white rounded disabled:opacity-60"
            onClick={save}
            disabled={saving}
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
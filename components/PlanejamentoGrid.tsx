"use client";

import React, { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import { Calendar, CheckCircle, Clock, ListTodo, Target } from 'lucide-react';

const supabaseUrl = 'https://ytiyrfliszifyuhghiqg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0aXlyZmxpc3ppZnl1aGdoaXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMTYzNjIsImV4cCI6MjA3Mzg5MjM2Mn0.DRmIJ0hee4kX7wdXt2OMXhaJ6-9RG6wL5FKZTw5hOz4'
const supabase = createClient(supabaseUrl, supabaseKey)

type Planejamento = {
  id: string;
  title: string;
  date: string | null;
  status: string;
  totalTasks: number;
  completedTasks: number;
  completionPercentage: number;
};

interface Props {
  reload?: boolean;
  onEdit: (planejamentoId: string) => void;
  filtros?: {
    status: string;
    dataInicio: string;
    dataFim: string;
    busca: string;
  };
}

export default function PlanejamentoGrid({ reload, onEdit, filtros }: Props) {
  const [planejamentos, setPlanejamentos] = useState<Planejamento[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from("planning")
        .select(`
          id,
          title,
          date,
          status
        `)
        .order("date", { ascending: false });

      if (filtros) {
        if (filtros.status !== 'Todos') {
          query = query.eq('status', filtros.status);
        }
        if (filtros.dataInicio) {
          query = query.gte('date', filtros.dataInicio);
        }
        if (filtros.dataFim) {
          query = query.lte('date', filtros.dataFim);
        }
        if (filtros.busca) {
          query = query.ilike('title', `%${filtros.busca}%`);
        }
      }

      const { data, error: planningError } = await query;

      if (planningError) throw planningError;

      const planejamentosComStats = await Promise.all(
        (data || []).map(async (plan) => {
          const { data: tasks, error: tasksError } = await supabase
            .from("tasks")
            .select("completed")
            .eq("planning_id", plan.id);

          if (tasksError) {
            console.error("Erro ao buscar tarefas:", tasksError);
            return {
              ...plan,
              totalTasks: 0,
              completedTasks: 0,
              completionPercentage: 0
            };
          }

          const totalTasks = tasks?.length || 0;
          const completedTasks = tasks?.filter(t => t.completed).length || 0;
          const completionPercentage = totalTasks > 0 
            ? Math.round((completedTasks / totalTasks) * 100) 
            : 0;

          return {
            ...plan,
            totalTasks,
            completedTasks,
            completionPercentage
          };
        })
      );

      setPlanejamentos(planejamentosComStats);
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
  }, [reload, filtros]);

  const getStatusConfig = (status: string) => {
    const configs = {
      TODO: { 
        bg: 'rgba(245, 158, 11, 0.2)', 
        color: '#fbbf24', 
        border: 'rgba(245, 158, 11, 0.3)',
        label: 'A Fazer',
        icon: <Clock size={14} />
      },
      IN_PROGRESS: { 
        bg: 'rgba(59, 130, 246, 0.2)', 
        color: '#60a5fa', 
        border: 'rgba(59, 130, 246, 0.3)',
        label: 'Em Progresso',
        icon: <ListTodo size={14} />
      },
      DONE: { 
        bg: 'rgba(16, 185, 129, 0.2)', 
        color: '#10b981', 
        border: 'rgba(16, 185, 129, 0.3)',
        label: 'Concluído',
        icon: <CheckCircle size={14} />
      },
    };
    return configs[status as keyof typeof configs] || configs.TODO;
  };

  const formatarDataBR = (data: string) => {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage === 0) return '#4b5563';
    if (percentage < 30) return '#ef4444';
    if (percentage < 70) return '#f59e0b';
    if (percentage < 100) return '#3b82f6';
    return '#10b981';
  };

  return (
    <div style={{
      background: 'rgba(31, 41, 55, 0.6)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(75, 85, 99, 0.3)',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)'
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .spin { animation: spin 1s linear infinite; }
      `}</style>

      {loading && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 0'
        }}>
          <div className="spin" style={{
            width: '48px',
            height: '48px',
            border: '4px solid #8b5cf6',
            borderTopColor: 'transparent',
            borderRadius: '50%'
          }} />
        </div>
      )}

      {error && (
        <div style={{
          padding: '16px',
          background: 'rgba(239, 68, 68, 0.2)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          color: '#f87171',
          fontSize: '0.875rem'
        }}>
          Erro: {error}
        </div>
      )}

      {!loading && planejamentos.length === 0 && !error && (
        <div style={{
          textAlign: 'center',
          padding: '80px 20px'
        }}>
          <Calendar size={64} style={{ 
            color: '#4b5563', 
            margin: '0 auto 16px' 
          }} />
          <p style={{ color: '#9ca3af', fontSize: '1.125rem', marginBottom: '8px' }}>
            Nenhum planejamento encontrado
          </p>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            {filtros && (filtros.status !== 'Todos' || filtros.busca || filtros.dataInicio || filtros.dataFim)
              ? 'Tente ajustar os filtros ou criar um novo planejamento'
              : 'Clique em "Novo Planejamento" para começar'}
          </p>
        </div>
      )}

      {!loading && planejamentos.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '16px'
        }}>
          {planejamentos.map((p, index) => {
            const statusConfig = getStatusConfig(p.status);
            const isHovered = hoveredCard === p.id;
            const progressColor = getProgressColor(p.completionPercentage);
            
            return (
              <div
                key={p.id}
                onClick={() => onEdit(p.id)}
                onMouseEnter={() => setHoveredCard(p.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="fade-in"
                style={{
                  background: isHovered 
                    ? 'rgba(55, 65, 81, 0.5)' 
                    : 'rgba(31, 41, 55, 0.8)',
                  border: '1px solid rgba(75, 85, 99, 0.3)',
                  borderRadius: '10px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: isHovered 
                    ? '0 12px 30px rgba(0, 0, 0, 0.5)' 
                    : '0 4px 15px rgba(0, 0, 0, 0.3)',
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '16px'
                }}>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#fff',
                    margin: 0,
                    flex: 1
                  }}>
                    {p.title}
                  </h3>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    background: statusConfig.bg,
                    color: statusConfig.color,
                    border: `1px solid ${statusConfig.border}`,
                    whiteSpace: 'nowrap',
                    marginLeft: '12px'
                  }}>
                    {statusConfig.icon}
                    {statusConfig.label}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#9ca3af',
                    fontSize: '0.875rem'
                  }}>
                    <Calendar size={16} style={{ color: '#6b7280' }} />
                    <span>
                      {p.date 
                        ? formatarDataBR(p.date)
                        : 'Sem data definida'}
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#9ca3af',
                    fontSize: '0.875rem'
                  }}>
                    <ListTodo size={16} style={{ color: '#6b7280' }} />
                    <span>
                      {p.completedTasks} de {p.totalTasks} {p.totalTasks === 1 ? 'tarefa concluída' : 'tarefas concluídas'}
                    </span>
                  </div>

                  <div style={{ marginTop: '8px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '6px'
                    }}>
                      <span style={{
                        fontSize: '0.75rem',
                        color: '#9ca3af',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Target size={14} style={{ color: progressColor }} />
                        Progresso
                      </span>
                      <span style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: progressColor
                      }}>
                        {p.completionPercentage}%
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      background: 'rgba(17, 24, 39, 0.8)',
                      borderRadius: '9999px',
                      overflow: 'hidden',
                      border: '1px solid rgba(75, 85, 99, 0.3)'
                    }}>
                      <div style={{
                        width: `${p.completionPercentage}%`,
                        height: '100%',
                        background: progressColor,
                        borderRadius: '9999px',
                        transition: 'width 0.5s ease',
                        boxShadow: `0 0 10px ${progressColor}40`
                      }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
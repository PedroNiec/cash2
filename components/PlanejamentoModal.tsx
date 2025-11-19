"use client";

import React, { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import { X, Plus, Trash2, Save, Calendar, FileText, AlertCircle, CheckSquare, Square } from 'lucide-react';

const supabaseUrl = 'https://ytiyrfliszifyuhghiqg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0aXlyZmxpc3ppZnl1aGdoaXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMTYzNjIsImV4cCI6MjA3Mzg5MjM2Mn0.DRmIJ0hee4kX7wdXt2OMXhaJ6-9RG6wL5FKZTw5hOz4'
const supabase = createClient(supabaseUrl, supabaseKey)

type Task = {
  id?: string;
  title: string;
  description: string;
  completed: boolean;
  priority: string;
};

interface Props {
  open: boolean;
  planejamentoId?: string | null;
  onClose: () => void;
  onSaved?: () => void;
}

export default function PlanejamentoModal({ open, planejamentoId, onClose, onSaved }: Props) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [hoveredTask, setHoveredTask] = useState<number | null>(null);

  const isEditMode = !!planejamentoId;

  useEffect(() => {
    if (open && planejamentoId) {
      loadPlanejamento(planejamentoId);
    } else if (open && !planejamentoId) {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, planejamentoId]);

  const loadPlanejamento = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data: planData, error: planError } = await supabase
        .from("planning")
        .select("*")
        .eq("id", id)
        .single();

      if (planError) throw planError;

      const { data: tasksData, error: tasksError } = await supabase
        .from("tasks")
        .select("*")
        .eq("planning_id", id)
        .order("created_at", { ascending: true });

      if (tasksError) throw tasksError;

      setTitle(planData.title);
      setDate(planData.date || "");
      setTasks(tasksData || []);
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDate("");
    setTasks([]);
    setSaving(false);
    setLoading(false);
    setError(null);
  };

  const addTask = () => {
    setTasks([...tasks, { title: "", description: "", completed: false, priority: "MEDIA" }]);
  };

  const updateTask = (index: number, field: keyof Task, value: string | boolean) => {
    const newTasks = [...tasks];
    newTasks[index] = { ...newTasks[index], [field]: value };
    setTasks(newTasks);
  };

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId);

      if (error) throw error;
    } catch (err: any) {
      console.error("Erro ao deletar tarefa:", err);
      throw err;
    }
  };

  const calculateStatus = () => {
    if (tasks.length === 0) return "TODO";
    const completedCount = tasks.filter(t => t.completed).length;
    const percentage = (completedCount / tasks.length) * 100;
    
    if (percentage === 0) return "TODO";
    if (percentage === 100) return "DONE";
    return "IN_PROGRESS";
  };

  const save = async () => {
    setError(null);

    if (!title.trim()) {
      setError("O título do planejamento é obrigatório.");
      return;
    }

    if (tasks.length === 0) {
      setError("Adicione pelo menos uma tarefa ao planejamento.");
      return;
    }

    const invalidTask = tasks.find(t => !t.title.trim());
    if (invalidTask) {
      setError("Todas as tarefas devem ter um título.");
      return;
    }

    setSaving(true);

    try {
      let planningId = planejamentoId;
      const status = calculateStatus();

      if (isEditMode) {
        const { error: updateError } = await supabase
          .from("planning")
          .update({
            title: title.trim(),
            date: date || null,
            status,
            updated_at: new Date().toISOString(),
          })
          .eq("id", planejamentoId);

        if (updateError) throw updateError;

        const existingTaskIds = tasks.filter(t => t.id).map(t => t.id);
        const { data: currentTasks } = await supabase
          .from("tasks")
          .select("id")
          .eq("planning_id", planejamentoId);

        const tasksToDelete = currentTasks?.filter(
          t => !existingTaskIds.includes(t.id)
        ) || [];

        for (const task of tasksToDelete) {
          await deleteTask(task.id);
        }
      } else {
        const { data, error: insertError } = await supabase
          .from("planning")
          .insert([{
            title: title.trim(),
            date: date || null,
            status,
          }])
          .select()
          .single();

        if (insertError) throw insertError;
        planningId = data.id;
      }

      for (const task of tasks) {
        if (task.id) {
          const { error: taskUpdateError } = await supabase
            .from("tasks")
            .update({
              title: task.title.trim(),
              description: task.description.trim(),
              completed: task.completed,
              priority: task.priority,
              updated_at: new Date().toISOString(),
            })
            .eq("id", task.id);

          if (taskUpdateError) throw taskUpdateError;
        } else {
          const { error: taskInsertError } = await supabase
            .from("tasks")
            .insert([{
              planning_id: planningId,
              title: task.title.trim(),
              description: task.description.trim(),
              completed: task.completed,
              priority: task.priority,
            }]);

          if (taskInsertError) throw taskInsertError;
        }
      }

      resetForm();
      onSaved?.();
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setSaving(false);
    }
  };

  const getPriorityConfig = (priority: string) => {
    const configs = {
      BAIXA: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', label: '🟢 Baixa' },
      MEDIA: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', label: '🟡 Média' },
      ALTA: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', label: '🔴 Alta' }
    };
    return configs[priority as keyof typeof configs] || configs.MEDIA;
  };

  if (!open) return null;

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercentage = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes checkmark {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .slide-in { animation: slideIn 0.3s ease-out forwards; }
        .spin { animation: spin 1s linear infinite; }
        .checkmark { animation: checkmark 0.3s ease-out; }
      `}</style>

      <div className="slide-in" style={{
        background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
        border: '1px solid rgba(75, 85, 99, 0.5)',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '900px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7)'
      }}>
        <div style={{
          padding: '24px',
          borderBottom: '1px solid rgba(75, 85, 99, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(31, 41, 55, 0.5)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Calendar size={28} style={{ color: '#8b5cf6' }} />
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#fff',
              margin: 0
            }}>
              {isEditMode ? "Editar Planejamento" : "Novo Planejamento"}
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={saving || loading}
            onMouseEnter={() => setHoveredButton('close')}
            onMouseLeave={() => setHoveredButton(null)}
            style={{
              background: hoveredButton === 'close' ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
              border: 'none',
              color: hoveredButton === 'close' ? '#f87171' : '#9ca3af',
              padding: '8px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.2s ease'
            }}
          >
            <X size={24} />
          </button>
        </div>

        <div style={{
          padding: '24px',
          overflowY: 'auto',
          flex: 1
        }}>
          {loading ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 0'
            }}>
              <div className="spin" style={{
                width: '48px',
                height: '48px',
                border: '4px solid #8b5cf6',
                borderTopColor: 'transparent',
                borderRadius: '50%'
              }} />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {error && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: '#f87171'
                }}>
                  <AlertCircle size={20} />
                  <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{error}</span>
                </div>
              )}

              <div style={{
                background: 'rgba(31, 41, 55, 0.5)',
                border: '1px solid rgba(75, 85, 99, 0.3)',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#e5e7eb',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <FileText size={20} style={{ color: '#8b5cf6' }} />
                  Informações do Planejamento
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#d1d5db',
                      marginBottom: '6px'
                    }}>
                      Título *
                    </label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      disabled={saving}
                      placeholder="Ex: Planejamento do dia 18/11"
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: 'rgba(17, 24, 39, 0.8)',
                        border: '1px solid rgba(75, 85, 99, 0.5)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '0.9rem',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(75, 85, 99, 0.5)'}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#d1d5db',
                      marginBottom: '6px'
                    }}>
                      Data
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      disabled={saving}
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: 'rgba(17, 24, 39, 0.8)',
                        border: '1px solid rgba(75, 85, 99, 0.5)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '0.9rem',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(75, 85, 99, 0.5)'}
                    />
                  </div>

                  {tasks.length > 0 && (
                    <div style={{
                      background: 'rgba(17, 24, 39, 0.6)',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(75, 85, 99, 0.3)'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px'
                      }}>
                        <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                          Progresso: {completedCount} de {tasks.length} tarefas
                        </span>
                        <span style={{
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: progressPercentage === 100 ? '#10b981' : '#8b5cf6'
                        }}>
                          {progressPercentage}%
                        </span>
                      </div>
                      <div style={{
                        width: '100%',
                        height: '6px',
                        background: 'rgba(75, 85, 99, 0.3)',
                        borderRadius: '9999px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${progressPercentage}%`,
                          height: '100%',
                          background: progressPercentage === 100 
                            ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
                            : 'linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%)',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div style={{
                background: 'rgba(31, 41, 55, 0.5)',
                border: '1px solid rgba(75, 85, 99, 0.3)',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px'
                }}>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#e5e7eb',
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <CheckSquare size={20} style={{ color: '#10b981' }} />
                    Lista de Tarefas *
                  </h3>
                  <button
                    onClick={addTask}
                    disabled={saving}
                    onMouseEnter={() => setHoveredButton('addTask')}
                    onMouseLeave={() => setHoveredButton(null)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      background: hoveredButton === 'addTask'
                        ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                        : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '500',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      transform: hoveredButton === 'addTask' ? 'scale(1.05)' : 'scale(1)'
                    }}
                  >
                    <Plus size={16} />
                    Adicionar Tarefa
                  </button>
                </div>

                {tasks.length === 0 ? (
                  <div style={{
                    border: '2px dashed rgba(75, 85, 99, 0.4)',
                    borderRadius: '8px',
                    padding: '32px',
                    textAlign: 'center',
                    color: '#9ca3af',
                    fontSize: '0.875rem'
                  }}>
                    Nenhuma tarefa adicionada. Clique em "Adicionar Tarefa" para começar.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {tasks.map((task, index) => {
                      const priorityConfig = getPriorityConfig(task.priority);
                      const isHovered = hoveredTask === index;
                      
                      return (
                        <div 
                          key={index}
                          onMouseEnter={() => setHoveredTask(index)}
                          onMouseLeave={() => setHoveredTask(null)}
                          style={{
                            background: task.completed 
                              ? 'rgba(16, 185, 129, 0.08)' 
                              : (isHovered ? 'rgba(55, 65, 81, 0.5)' : 'rgba(17, 24, 39, 0.6)'),
                            border: task.completed
                              ? '1px solid rgba(16, 185, 129, 0.3)'
                              : '1px solid rgba(75, 85, 99, 0.4)',
                            borderRadius: '10px',
                            padding: '16px',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            gap: '12px',
                            alignItems: 'flex-start'
                          }}>
                            <button
                              onClick={() => updateTask(index, "completed", !task.completed)}
                              disabled={saving}
                              className={task.completed ? 'checkmark' : ''}
                              style={{
                                marginTop: '2px',
                                background: task.completed ? '#10b981' : 'transparent',
                                border: task.completed ? '2px solid #10b981' : '2px solid #4b5563',
                                borderRadius: '6px',
                                width: '24px',
                                height: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                flexShrink: 0
                              }}
                            >
                              {task.completed && <CheckSquare size={16} style={{ color: '#fff' }} />}
                            </button>

                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              <input
                                value={task.title}
                                onChange={(e) => updateTask(index, "title", e.target.value)}
                                disabled={saving}
                                placeholder="Título da tarefa *"
                                style={{
                                  width: '100%',
                                  padding: '10px',
                                  background: 'rgba(31, 41, 55, 0.6)',
                                  border: '1px solid rgba(75, 85, 99, 0.5)',
                                  borderRadius: '6px',
                                  color: '#fff',
                                  fontSize: '0.9rem',
                                  fontWeight: '500',
                                  outline: 'none',
                                  textDecoration: task.completed ? 'line-through' : 'none',
                                  opacity: task.completed ? 0.7 : 1
                                }}
                              />

                              <textarea
                                value={task.description}
                                onChange={(e) => updateTask(index, "description", e.target.value)}
                                disabled={saving}
                                placeholder="Descrição (opcional)"
                                rows={2}
                                style={{
                                  width: '100%',
                                  padding: '10px',
                                  background: 'rgba(31, 41, 55, 0.6)',
                                  border: '1px solid rgba(75, 85, 99, 0.5)',
                                  borderRadius: '6px',
                                  color: '#d1d5db',
                                  fontSize: '0.875rem',
                                  outline: 'none',
                                  resize: 'vertical',
                                  fontFamily: 'inherit',
                                  opacity: task.completed ? 0.7 : 1
                                }}
                              />

                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <select
                                  value={task.priority}
                                  onChange={(e) => updateTask(index, "priority", e.target.value)}
                                  disabled={saving}
                                  style={{
                                    padding: '8px 12px',
                                    background: priorityConfig.bg,
                                    border: `1px solid ${priorityConfig.color}40`,
                                    borderRadius: '6px',
                                    color: priorityConfig.color,
                                    fontSize: '0.8rem',
                                    fontWeight: '600',
                                    outline: 'none',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <option value="BAIXA" style={{ background: '#111827' }}>🟢 Baixa</option>
                                  <option value="MEDIA" style={{ background: '#111827' }}>🟡 Média</option>
                                  <option value="ALTA" style={{ background: '#111827' }}>🔴 Alta</option>
                                </select>

                                <button
                                  onClick={() => removeTask(index)}
                                  disabled={saving}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'
                                    e.currentTarget.style.color = '#f87171'
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent'
                                    e.currentTarget.style.color = '#9ca3af'
                                  }}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '6px 10px',
                                    background: 'transparent',
                                    color: '#9ca3af',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '0.8rem',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                  }}
                                >
                                  <Trash2 size={14} />
                                  Remover
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div style={{
          padding: '20px 24px',
          borderTop: '1px solid rgba(75, 85, 99, 0.3)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          background: 'rgba(31, 41, 55, 0.5)'
        }}>
          <button
            onClick={onClose}
            disabled={saving || loading}
            onMouseEnter={() => setHoveredButton('cancel')}
            onMouseLeave={() => setHoveredButton(null)}
            style={{
              padding: '10px 24px',
              background: hoveredButton === 'cancel' ? '#374151' : '#4b5563',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '500',
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              transform: hoveredButton === 'cancel' ? 'scale(1.05)' : 'scale(1)'
            }}
          >
            Cancelar
          </button>
          <button
            onClick={save}
            disabled={saving || loading}
            onMouseEnter={() => setHoveredButton('save')}
            onMouseLeave={() => setHoveredButton(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 24px',
              background: saving
                ? '#6b7280'
                : (hoveredButton === 'save'
                    ? 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)'
                    : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'),
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.9rem',
              cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              transform: hoveredButton === 'save' && !saving ? 'scale(1.05)' : 'scale(1)',
              opacity: saving ? 0.7 : 1
            }}
          >
            <Save size={18} />
            {saving ? "Salvando..." : (isEditMode ? "Atualizar" : "Salvar")}
          </button>
        </div>
      </div>
    </div>
  )}
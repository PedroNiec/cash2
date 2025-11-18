"use client";

import React, { useState } from "react";
import PlanejamentoGrid from "../../../components/PlanejamentoGrid";
import PlanejamentoModal from "../../../components/PlanejamentoModal";

export default function TarefasPage() {
  const [openModal, setOpenModal] = useState(false);
  const [reload, setReload] = useState(false);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Planejamentos</h1>
        <button
          onClick={() => setOpenModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Novo Planejamento
        </button>
      </div>

      <PlanejamentoGrid reload={reload} />

      <PlanejamentoModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSaved={() => {
          setOpenModal(false);
          setReload((r) => !r);
        }}
      />
    </div>
  );
}
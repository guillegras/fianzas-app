import { useState, useEffect, useCallback, useMemo } from "react";
import SettingsTypesList from "./SettingsTypesList";
import SettingsCategoriesPanel from "./SettingsCategoriesPanel";
import SettingsTypeModal from "./SettingsTypeModal";
import ConfirmModal from "./ConfirmModal";
import { API_URL } from "../services/api";

export default function SettingsView() {
    const [types, setTypes] = useState([]);
    const [selectedTypeId, setSelectedTypeId] = useState("");
    const [categories, setCategories] = useState([]);
    const [loadingTypes, setLoadingTypes] = useState(true);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [savingType, setSavingType] = useState(false);
    const [savingCategory, setSavingCategory] = useState(false);

    // Modals
    const [typeModalOpen, setTypeModalOpen] = useState(false);
    const [editingType, setEditingType] = useState(null);
    const [deleteTypeTarget, setDeleteTypeTarget] = useState(null);
    const [deleteCatTarget, setDeleteCatTarget] = useState(null);

    // Feedback
    const [feedback, setFeedback] = useState(null);

    const showFeedback = (type, message) => {
        setFeedback({ type, message });
        if (type === "success") {
            setTimeout(() => {
                setFeedback((prev) => (prev?.message === message ? null : prev));
            }, 3500);
        }
    };

    // 1. Cargar tipos
    const fetchTypes = useCallback(async (selectId = null) => {
        setLoadingTypes(true);
        try {
            const res = await fetch(`${API_URL}/transaction-types/`);
            if (!res.ok) throw new Error("Error al obtener los tipos de movimiento.");
            const data = await res.json();
            setTypes(data);

            setSelectedTypeId((currentSelected) => {
                if (selectId && data.some((t) => t.id === selectId)) {
                    return selectId;
                }
                if (currentSelected && data.some((t) => t.id === currentSelected)) {
                    return currentSelected;
                }
                return data.length > 0 ? data[0].id : "";
            });
        } catch (err) {
            showFeedback("error", err.message);
        } finally {
            setLoadingTypes(false);
        }
    }, []);

    useEffect(() => {
        fetchTypes();
    }, [fetchTypes]);

    // 2. Cargar categorías para el tipo seleccionado
    const fetchCategories = useCallback(async (tipoId) => {
        if (!tipoId) {
            setCategories([]);
            return;
        }
        setLoadingCategories(true);
        try {
            const res = await fetch(`${API_URL}/transaction-categories/${tipoId}`);
            if (!res.ok) throw new Error("Error al cargar las categorías.");
            const data = await res.json();
            setCategories(data);
        } catch (err) {
            showFeedback("error", err.message);
        } finally {
            setLoadingCategories(false);
        }
    }, []);

    useEffect(() => {
        if (selectedTypeId) {
            fetchCategories(selectedTypeId);
        } else {
            setCategories([]);
        }
    }, [selectedTypeId, fetchCategories]);

    // Helper para generar ID slug
    const generateId = (text) => {
        return text
            .toLowerCase()
            .trim()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9\s_]/g, "")
            .replace(/\s+/g, "_");
    };

    // Handlers para Tipos
    const handleOpenNewType = () => {
        setEditingType(null);
        setTypeModalOpen(true);
    };

    const handleOpenEditType = (type) => {
        setEditingType(type);
        setTypeModalOpen(true);
    };

    const handleSaveType = async (typeData) => {
        setSavingType(true);
        try {
            const isEditing = Boolean(editingType);
            const typeId = isEditing ? editingType.id : generateId(typeData.etiqueta);

            const payload = {
                ...typeData,
                id: typeId,
            };

            const url = isEditing
                ? `${API_URL}/transaction-types/${typeId}`
                : `${API_URL}/transaction-types/`;
            const method = isEditing ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errJson = await res.json().catch(() => ({}));
                throw new Error(errJson.detail || "No se ha podido guardar el tipo.");
            }

            showFeedback(
                "success",
                isEditing
                    ? `Tipo "${typeData.etiqueta}" actualizado con éxito.`
                    : `Tipo "${typeData.etiqueta}" creado con éxito.`
            );
            await fetchTypes(typeId);
        } finally {
            setSavingType(false);
        }
    };

    const handleConfirmDeleteType = async () => {
        if (!deleteTypeTarget) return;
        try {
            const res = await fetch(`${API_URL}/transaction-types/${deleteTypeTarget.id}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                throw new Error(
                    "No se puede eliminar el tipo porque tiene transacciones o categorías asociadas. Desactívalo en su lugar."
                );
            }
            showFeedback("success", `Tipo "${deleteTypeTarget.etiqueta}" eliminado.`);
            setDeleteTypeTarget(null);
            await fetchTypes();
        } catch (err) {
            setDeleteTypeTarget(null);
            showFeedback("error", err.message);
        }
    };

    // Handlers para Categorías
    const handleAddCategory = async (nombre) => {
        if (!selectedTypeId) return;
        setSavingCategory(true);
        try {
            const res = await fetch(`${API_URL}/transaction-categories/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre,
                    tipo_id: selectedTypeId,
                    activa: true,
                }),
            });
            if (!res.ok) throw new Error("No se ha podido crear la categoría.");
            showFeedback("success", `Categoría "${nombre}" añadida.`);
            await fetchCategories(selectedTypeId);
        } catch (err) {
            showFeedback("error", err.message);
        } finally {
            setSavingCategory(false);
        }
    };

    const handleUpdateCategory = async (catId, updateData) => {
        try {
            const res = await fetch(`${API_URL}/transaction-categories/${catId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateData),
            });
            if (!res.ok) throw new Error("No se ha podido actualizar la categoría.");
            // Actualización optimista
            setCategories((prev) =>
                prev.map((c) => (c.id === catId ? { ...c, ...updateData } : c))
            );
        } catch (err) {
            showFeedback("error", err.message);
            await fetchCategories(selectedTypeId);
        }
    };

    const handleConfirmDeleteCategory = async () => {
        if (!deleteCatTarget) return;
        try {
            const res = await fetch(`${API_URL}/transaction-categories/${deleteCatTarget.id}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                throw new Error(
                    "No se puede eliminar esta categoría porque está asignada a transacciones existentes. Desactívala para ocultarla."
                );
            }
            showFeedback("success", `Categoría "${deleteCatTarget.nombre}" eliminada.`);
            setCategories((prev) => prev.filter((c) => c.id !== deleteCatTarget.id));
            setDeleteCatTarget(null);
        } catch (err) {
            setDeleteCatTarget(null);
            showFeedback("error", err.message);
        }
    };

    const selectedType = useMemo(
        () => types.find((t) => t.id === selectedTypeId) || null,
        [types, selectedTypeId]
    );

    return (
        <div className="d-flex flex-column gap-3">
            {/* Banner de Feedback (Success / Error) */}
            {feedback && (
                <div
                    className={`alert alert-${
                        feedback.type === "error" ? "danger" : "success"
                    } alert-dismissible fade show d-flex align-items-center justify-content-between shadow-sm mb-0`}
                    role="alert"
                >
                    <div className="d-flex align-items-center gap-2">
                        <span>{feedback.type === "error" ? "⚠️" : "✅"}</span>
                        <span>{feedback.message}</span>
                    </div>
                    <button
                        type="button"
                        className="btn-close btn-close-white"
                        onClick={() => setFeedback(null)}
                        aria-label="Cerrar notificación"
                    />
                </div>
            )}

            {/* Vista Master-Detail: 2 Columnas */}
            <div className="row g-4 align-items-stretch">
                {/* Columna Izquierda: Tipos de Movimiento */}
                <div className="col-12 col-lg-5 col-xl-4">
                    <SettingsTypesList
                        types={types}
                        selectedTypeId={selectedTypeId}
                        onSelectType={setSelectedTypeId}
                        onEditType={handleOpenEditType}
                        onDeleteType={setDeleteTypeTarget}
                        onNewType={handleOpenNewType}
                        loading={loadingTypes}
                    />
                </div>

                {/* Columna Derecha: Categorías del Tipo Seleccionado */}
                <div className="col-12 col-lg-7 col-xl-8">
                    <SettingsCategoriesPanel
                        selectedType={selectedType}
                        categories={categories}
                        loading={loadingCategories}
                        onAddCategory={handleAddCategory}
                        onUpdateCategory={handleUpdateCategory}
                        onDeleteCategory={setDeleteCatTarget}
                        savingCategory={savingCategory}
                    />
                </div>
            </div>

            {/* Modal para Crear / Editar Tipo */}
            <SettingsTypeModal
                show={typeModalOpen}
                onClose={() => setTypeModalOpen(false)}
                onSave={handleSaveType}
                initialData={editingType}
                saving={savingType}
            />

            {/* Modal de confirmación para eliminar Tipo */}
            <ConfirmModal
                show={Boolean(deleteTypeTarget)}
                title={`¿Eliminar tipo "${deleteTypeTarget?.etiqueta}"?`}
                message="Esta acción no se puede deshacer. Si existen transacciones o categorías asociadas a este tipo, la base de datos no permitirá su eliminación (puedes desactivarlo en su lugar)."
                onConfirm={handleConfirmDeleteType}
                onCancel={() => setDeleteTypeTarget(null)}
            />

            {/* Modal de confirmación para eliminar Categoría */}
            <ConfirmModal
                show={Boolean(deleteCatTarget)}
                title={`¿Eliminar categoría "${deleteCatTarget?.nombre}"?`}
                message="Esta acción no se puede deshacer. Si existen transacciones registradas con esta categoría, la base de datos impedirá borrarla (puedes desactivarla para que no aparezca en nuevas transacciones)."
                onConfirm={handleConfirmDeleteCategory}
                onCancel={() => setDeleteCatTarget(null)}
            />
        </div>
    );
}

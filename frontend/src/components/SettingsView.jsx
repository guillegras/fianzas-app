import { useEffect, useState } from "react";
import SettingsTypeForm from "./SettingsTypeForm";
import SettingsTypesTable from "./SettingsTypesTable";
import SettingsCategories from "./SettingsCategories";
import { API_URL } from "../services/api";

export default function SettingsView() {
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        etiqueta: "",
        color: "#3B82F6",
        es_ingreso: false,
        activo: true,
    });

    const fetchTypes = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/transaction-types/`);
            if (!res.ok) throw new Error("Error al cargar los tipos");
            const data = await res.json();
            setTypes(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTypes();
    }, []);

    const generateId = (text) => {
        return text
            .toLowerCase()
            .trim()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9\s_]/g, "")
            .replace(/\s+/g, "_");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...form,
                id: editingId ? editingId : generateId(form.etiqueta),
            };

            const url = editingId
                ? `${API_URL}/transaction-types/${editingId}`
                : `${API_URL}/transaction-types/`;

            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.detail || "Error al guardar");
            }

            setForm({
                etiqueta: "",
                color: "#3B82F6",
                es_ingreso: false,
                activo: true,
            });
            setEditingId(null);
            fetchTypes();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleEdit = (type) => {
        setEditingId(type.id);
        setForm({
            etiqueta: type.etiqueta,
            color: type.color,
            es_ingreso: type.es_ingreso,
            activo: type.activo,
        });
    };

    const handleDelete = async (id) => {
        if (!confirm("¿Estás seguro de eliminar este tipo?")) return;
        try {
            const res = await fetch(`${API_URL}/transaction-types/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Error al eliminar");
            fetchTypes();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setForm({
            etiqueta: "",
            color: "#3B82F6",
            es_ingreso: false,
            activo: true,
        });
    };

    return (
        <div className="d-flex flex-column gap-4">
            <div className="card bg-dark border-0 shadow-sm p-4 text-light">
                <h5 className="mb-4">Configuración de Tipos de Movimiento</h5>
                {error && <div className="alert alert-danger">{error}</div>}

                <SettingsTypeForm
                    form={form}
                    setForm={setForm}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    editingId={editingId}
                />

                <SettingsTypesTable
                    types={types}
                    loading={loading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            <SettingsCategories types={types} />
        </div>
    );
}

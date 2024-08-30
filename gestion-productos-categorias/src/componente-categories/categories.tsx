import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import axios from 'axios';

import './categories.css'; // Importación del archivo CSS

// Definimos una interfaz para tipar los datos de las categorías
interface Category {
  id: number;
  name: string;
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [category, setCategory] = useState<Category>({ id: 0, name: '' });
  const [submitted, setSubmitted] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);
  const toast = React.useRef<any>(null);

  // useEffect para cargar las categorías desde el servidor al montar el componente
  useEffect(() => {
    axios.get('http://localhost:4000/api/categories')
      .then(response => setCategories(response.data))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  // Función para abrir el diálogo de nueva categoría
  const openNew = () => {
    setCategory({ id: 0, name: '' });
    setSubmitted(false);
    setCategoryDialog(true);
  };

  // Función para editar una categoría existente
  const editCategory = (category: Category) => {
    setCategory({ ...category });
    setCategoryDialog(true);
  };

  // Función para guardar una categoría (crear o actualizar)
  const saveCategory = () => {
    setSubmitted(true);

    if (category.name.trim() && category.name.length >= 3) {
      let _categories = [...categories];
      let _category = { ...category };

      if (category.id) {
        // Si la categoría tiene un ID, actualizamos la existente
        axios.put(`http://localhost:4000/api/categories/${category.id}`, _category)
          .then(() => {
            const index = _categories.findIndex(c => c.id === category.id);
            _categories[index] = _category;
            setCategories(_categories);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Category Updated', life: 3000 });
          })
          .catch(error => {
            console.error('Error updating category:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Category Update Failed', life: 3000 });
          });
      } else {
        // Si no tiene ID, creamos una nueva categoría
        axios.post('http://localhost:4000/api/categories', _category)
          .then(response => {
            _category.id = response.data.id;
            _categories.push(_category);
            setCategories(_categories);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Category Created', life: 3000 });
          })
          .catch(error => {
            console.error('Error creating category:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Category Creation Failed', life: 3000 });
          });
      }

      setCategoryDialog(false);
      setCategory({ id: 0, name: '' });
    }
  };

  // Función para eliminar una categoría
  const deleteCategory = () => {
    if (deleteCategoryId !== null) {
      axios.delete(`http://localhost:4000/api/categories/${deleteCategoryId}`)
        .then(() => {
          setCategories(categories.filter(category => category.id !== deleteCategoryId));
          toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Category Deleted', life: 3000 });
        })
        .catch(error => {
          console.error('Error deleting category:', error);
          toast.current.show({ severity: 'error', summary: 'Error', detail: 'Category Deletion Failed', life: 3000 });
        });
      setDeleteCategoryId(null); // Resetea el ID de la categoría a eliminar después de la operación
    }
  };

  return (
    <div>
      {/* Componente para mostrar notificaciones */}
      <Toast ref={toast} />
      {/* Botón para abrir el diálogo de nueva categoría */}
      <Button label="Nueva Categoría" icon="pi pi-plus" onClick={openNew} className="p-button-raised p-button-success" />

      {/* Tabla para mostrar la lista de categorías */}
      <DataTable value={categories} paginator rows={10} className="p-datatable-gridlines p-datatable-striped">
        {/* Columna para mostrar el nombre de la categoría */}
        <Column field="name" header="Nombre" sortable></Column>
        {/* Columna para acciones (editar y eliminar) */}
        <Column header="Acciones" body={(rowData) => (
          <div>
            {/* Botón para editar la categoría */}
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success" onClick={() => editCategory(rowData)} />
            {/* Botón para eliminar la categoría */}
            <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => setDeleteCategoryId(rowData.id)} />
          </div>
        )}></Column>
      </DataTable>

      {/* Diálogo para mostrar y editar detalles de la categoría */}
      <Dialog visible={categoryDialog} onHide={() => setCategoryDialog(false)} header="Detalles de la Categoría" modal className="p-fluid">
        <div className="p-field">
          <label htmlFor="name">Nombre</label>
          <InputText id="name" value={category.name} onChange={(e) => setCategory({ ...category, name: e.target.value })} required autoFocus className={submitted && (!category.name || category.name.length < 3) ? 'p-invalid' : ''} />
          {/* Mensaje de error si el nombre es requerido y no está ingresado o no cumple con la longitud mínima */}
          {submitted && (!category.name || category.name.length < 3) && (
            <small className="p-error">El nombre es requerido y debe tener al menos 3 caracteres.</small>
          )}
        </div>

        {/* Botón para guardar la categoría */}
        <Button label="Guardar" icon="pi pi-check" onClick={saveCategory} className="p-button-raised p-button-success" />
      </Dialog>

      {/* Diálogo para confirmar la eliminación de la categoría */}
      <Dialog visible={deleteCategoryId !== null} onHide={() => setDeleteCategoryId(null)} header="Confirmación de Eliminación" modal>
        <p>¿Está seguro de que desea eliminar esta categoría?</p>
        {/* Botón para confirmar la eliminación */}
        <Button label="Eliminar" icon="pi pi-check" onClick={deleteCategory} className="p-button-raised p-button-danger" />
        {/* Botón para cancelar la eliminación */}
        <Button label="Cancelar" icon="pi pi-times" onClick={() => setDeleteCategoryId(null)} className="p-button-raised p-button-secondary" />
      </Dialog>
    </div>
  );
};

export default Categories;

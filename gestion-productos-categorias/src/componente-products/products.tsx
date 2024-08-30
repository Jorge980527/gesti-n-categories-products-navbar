import React, { useReducer, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import './products.css';

// Define interfaces for Product and Category
interface Product {
  id: number;
  name: string;
  categoryId: number;
  category_name?: string;
}

interface Category {
  id: number;
  name: string;
}

// Define types for state and actions
interface State {
  products: Product[];
  categories: Category[];
  productDialog: boolean;
  product: Product;
  submitted: boolean;
}

interface Action {
  type: string;
  payload?: any;
}

// Initial state and reducer function
const initialState: State = {
  products: [],
  categories: [],
  productDialog: false,
  product: { id: 0, name: '', categoryId: 0 },
  submitted: false
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'SET_PRODUCT_DIALOG':
      return { ...state, productDialog: action.payload };
    case 'SET_PRODUCT':
      return { ...state, product: action.payload };
    case 'SET_SUBMITTED':
      return { ...state, submitted: action.payload };
    default:
      return state;
  }
};

const Products: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const toast = useRef<any>(null);

  useEffect(() => {
    axios.get<Product[]>('http://localhost:4000/api/products')
      .then(response => dispatch({ type: 'SET_PRODUCTS', payload: response.data }))
      .catch(error => console.error('Error fetching products:', error));

    axios.get<Category[]>('http://localhost:4000/api/categories')
      .then(response => dispatch({ type: 'SET_CATEGORIES', payload: response.data }))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const openNew = () => {
    dispatch({ type: 'SET_PRODUCT', payload: { id: 0, name: '', categoryId: 0 } });
    dispatch({ type: 'SET_SUBMITTED', payload: false });
    dispatch({ type: 'SET_PRODUCT_DIALOG', payload: true });
  };

  const saveProduct = () => {
    dispatch({ type: 'SET_SUBMITTED', payload: true });

    if (state.product.name.trim().length >= 3 && state.product.categoryId > 0) {
      const _products = [...state.products];
      const _product = { ...state.product };

      if (state.product.id) {
        axios.put(`http://localhost:4000/api/products/${state.product.id}`, _product)
          .then(() => {
            const index = _products.findIndex(p => p.id === state.product.id);
            if (index !== -1) {
              _products[index] = _product;
              dispatch({ type: 'SET_PRODUCTS', payload: _products });
            }
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Producto actualizado', life: 3000 });
          })
          .catch(error => {
            console.error('Error updating product:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Falló la actualización del producto', life: 3000 });
          });
      } else {
        axios.post<Product>('http://localhost:4000/api/products', _product)
          .then(response => {
            _product.id = response.data.id;
            _products.push(_product);
            dispatch({ type: 'SET_PRODUCTS', payload: _products });
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Producto creado', life: 3000 });
          })
          .catch(error => {
            console.error('Error creating product:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Falló la creación del producto', life: 3000 });
          });
      }

      dispatch({ type: 'SET_PRODUCT_DIALOG', payload: false });
      dispatch({ type: 'SET_PRODUCT', payload: { id: 0, name: '', categoryId: 0 } });
    } else {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'El nombre es obligatorio y debe tener al menos 3 caracteres. Selecciona una categoría.', life: 3000 });
    }
  };

  const editProduct = (product: Product) => {
    dispatch({ type: 'SET_PRODUCT', payload: { ...product } });
    dispatch({ type: 'SET_PRODUCT_DIALOG', payload: true });
  };

  const deleteProduct = (id: number) => {
    axios.delete(`http://localhost:4000/api/products/${id}`)
      .then(() => {
        dispatch({ type: 'SET_PRODUCTS', payload: state.products.filter(product => product.id !== id) });
        toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Producto eliminado', life: 3000 });
      })
      .catch(error => {
        console.error('Error deleting product:', error);
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Falló la eliminación del producto', life: 3000 });
      });
  };

  return (
    <div>
      <Toast ref={toast} />
      <Button label="Nuevo Producto" icon="pi pi-plus" onClick={openNew} className="p-button-raised p-button-success" />

      <DataTable value={state.products} paginator rows={10} className="p-datatable-gridlines p-datatable-striped">
        <Column field="name" header="Nombre" sortable />
        <Column 
          field="categoryId" 
          header="Categoría" 
          sortable 
          body={(rowData: Product) => {
            const category = state.categories.find(cat => cat.id === rowData.categoryId);
            return category ? category.name : 'Sin categoría';
          }} 
        />
        <Column 
          header="Acciones" 
          body={(rowData: Product) => (
            <div>
              <Button 
                icon="pi pi-pencil" 
                className="p-button-rounded p-button-success" 
                onClick={() => editProduct(rowData)} 
              />
              <Button 
                icon="pi pi-trash" 
                className="p-button-rounded p-button-danger" 
                onClick={() => deleteProduct(rowData.id)} 
              />
            </div>
          )} 
        />
      </DataTable>

      <Dialog 
        visible={state.productDialog} 
        style={{ width: '400px' }} 
        header="Producto" 
        modal 
        onHide={() => dispatch({ type: 'SET_PRODUCT_DIALOG', payload: false })}
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="name">Nombre</label>
            <InputText 
              id="name" 
              value={state.product.name} 
              onChange={(e) => dispatch({ type: 'SET_PRODUCT', payload: { ...state.product, name: e.target.value }})} 
              required 
              autoFocus 
              className={state.submitted && state.product.name.trim().length < 3 ? 'p-invalid' : ''}
            />
            {state.submitted && state.product.name.trim().length < 3 && <small className="p-invalid">El nombre es obligatorio y debe tener al menos 3 caracteres.</small>}
          </div>
          <div className="p-field">
            <label htmlFor="category">Categoría</label>
            <Dropdown 
              id="category" 
              value={state.product.categoryId} 
              options={state.categories} 
              onChange={(e) => dispatch({ type: 'SET_PRODUCT', payload: { ...state.product, categoryId: e.value }})} 
              optionLabel="name" 
              optionValue="id" 
              placeholder="Selecciona una categoría" 
              required 
              className={state.submitted && !state.product.categoryId ? 'p-invalid' : ''}
            />
            {state.submitted && !state.product.categoryId && <small className="p-invalid">Selecciona una categoría.</small>}
          </div>
          <Button label="Guardar" icon="pi pi-check" onClick={saveProduct} />
          <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary" onClick={() => dispatch({ type: 'SET_PRODUCT_DIALOG', payload: false })} />
        </div>
      </Dialog>
    </div>
  );
};

export default Products;

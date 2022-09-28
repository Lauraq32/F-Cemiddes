import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Toolbar } from 'primereact/toolbar';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';
import headers, { getHeaders } from '../service/token';
import { NavLink } from 'react-router-dom';
import { useDialog } from "../../hooks/useDialog";

const Products = () => {
    let emptyProduct = {
        _id: null,
        name: '',
        amount: 0,
        price: 0,
        status: ''
    };

    const [products, setProducts] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [adminDialog, setAdminDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [dialogIsVisible, dialogContent, showDialog, hideDialog] = useDialog();
    
    useEffect(() => {
        getAllProducts();
    }, []);
    
    const getAllProducts = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/products`, {headers: getHeaders()})
        .then((response) => {
            const allProducts = response.data.products;
            console.log(allProducts)
            setProducts(allProducts);
        })
        .catch(error => console.error('Error:',error));
    }

    const formatCurrency = (value) => {
        return value.toLocaleString('es-MX', { style: 'currency', currency: 'DOP' });
    }

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    }

    const hideAdminDialog = () => {
        //setSubmitted(false);
        setAdminDialog(false);
    }

    const hideProductDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    }

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    }

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    }

    const saveProduct = () => {
        setSubmitted(true);

        if (product.name.trim()) {
            let _products = [...products];
            let _product = { ...product };

            if (product._id) {
                axios.put(`${process.env.REACT_APP_API_URL}/api/products/` + _product._id, _product , {headers: getHeaders()}, )
                .then(response => {
                    toast.current.show({ severity: 'success', summary: 'Exito', detail: 'Actualizado Exitosamente', life: 5000 });
                    getAllProducts();

                })
                .catch(error => {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Oops! Algo salio mal', life: 5000 });
                    getAllProducts();
                });
            }
            else {   
                axios.post(`${process.env.REACT_APP_API_URL}/api/products`, _product, {headers: getHeaders()})
                .then(response => {
                    toast.current.show({ severity: 'success', summary: 'Exito', detail: 'Creado Exitosamente', life: 5000 });
                    getAllProducts();
                })
                .catch(error => {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Oops! Algo salio mal', life: 5000 });
                    getAllProducts();
                });
            }

            
            setProducts(_products);
            setProductDialog(false);
            setProduct(emptyProduct);
        }
    }

    const editProduct = (product) => {
        if(localStorage.getItem('role') !== 'ADMIN'){
            setAdminDialog(true);
        } else {
            setProduct({ ...product });
            setProductDialog(true);
        }
    }

    const confirmDeleteProduct = (product) => {
        if(localStorage.getItem('role') !== 'ADMIN'){
            setAdminDialog(true);
        } else {
            setProduct(product);
            setDeleteProductDialog(true);
        }
    }

    const deleteProduct = () => {
        let _products = products.filter(val => val._id !== product._id);
        setProducts(_products);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);

        axios.delete(`${process.env.REACT_APP_API_URL}/api/products/` + product._id, {headers: getHeaders()})
        .then(response => {
            toast.current.show({ severity: 'success', summary: 'Exito', detail: 'Borrado Exitosamente', life: 3000 });
        })
        .catch(error => console.error('Error in delete Product:',error));
        
    }

    const exportCSV = () => {
        dt.current.exportCSV();
    }

    const confirmDeleteSelected = () => {
        if(localStorage.getItem('role') !== 'ADMIN'){
            setAdminDialog(true);
        } else 
        setDeleteProductsDialog(true);
    }

    const deleteSelectedProducts = () => {
        let _products = products.filter(val => !selectedProducts.includes(val));
        setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        
        toast.current.show({ severity: 'success', summary: 'Exito', detail: 'Products Deleted', life: 3000 });
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    }

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nuevo" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    {/* <Button label="Borrar" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} /> */}
                </div>
            </React.Fragment>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Importar" chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        )
    }

    const nameBodyTemplate = (rowData) => {
        return (
                <NavLink to={`/products/${rowData._id}`}>{rowData.name}</NavLink>
        );
    }

    const quantityBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Precio</span>
                {rowData.amount}
            </>
        );
    }

    const priceBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Precio</span>
                {formatCurrency(rowData.price)}
            </>
        );
    };

    const statusBodyTemplate = (rowData) => {
        return (
          <>
            <span className="p-column-title">Status</span>
            {rowData.status}
          </>
        );
    }

    const showSelectedProductDialog = product => {
        showDialog(product);
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="datatable-actions">
                <Button icon="pi pi-eye" className="p-button-rounded p-button-info" onClick={() => showSelectedProductDialog(rowData)} />
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success" onClick={() => editProduct(rowData)} />
                {/* <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteProduct(rowData)} /> */}
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gestion de Productos</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideProductDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProducts} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={products} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="_id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando  {first} a {last} de {totalRecords} productos"
                        globalFilter={globalFilter} emptyMessage="No se encontraron productos." header={header} responsiveLayout="scroll">
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem'}}></Column>
                        <Column field="name" header="Productos" sortable body={nameBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="amount" header="Cantidad" body={quantityBodyTemplate} sortable headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="price" header="Precio" body={priceBodyTemplate} sortable headerStyle={{ width: '14%', minWidth: '8rem' }}></Column>
                        <Column field="status"header="Estado de los productos" body={statusBodyTemplate} sortable headerStyle={{ width: '14%', minWidth: '8rem' }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '450px' }} header="Detalles de los productos" modal className="p-fluid" footer={productDialogFooter} onHide={hideProductDialog}>
                        <div className="field">
                            <label htmlFor="products">Productos</label>
                            <InputText id="products" value={product.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
                            {submitted && !product.name && <small className="p-invalid">el nombre de la doctora es necesario.</small>}
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="amount">Cantidad</label>
                                <InputNumber id="amount" value={product.amount} onValueChange={(e) => onInputNumberChange(e, 'amount')} integeronly />
                                {submitted && !product.amount && <small className="p-invalid">el Cantidad es necesario.</small>}

                            </div>

                            <div className="field col">
                                <label htmlFor="price">Precio</label>
                                <InputNumber id="price" value={product.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="DOP" locale="es-MX" />
                                {submitted && !product.price && <small className="p-invalid">el precio es necesario.</small>}
                            </div>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && <span>¿Estás seguro de que quieres eliminar <b>{product.products}</b>?</span>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && <span>¿Está seguro de que desea eliminar los productos seleccionados?</span>}
                        </div>
                    </Dialog>
                    <Dialog visible={adminDialog} style={{ width: '450px' }}  modal  onHide={hideAdminDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && <span>No tienes los permisos necesarios</span>}
                        </div>
                    </Dialog>
                    {dialogIsVisible && 
                        <Dialog 
                        visible={dialogIsVisible}
                        style={{ width: "450px" }}
                        header="Detalles de producto"
                        footer={<div />}
                        className="p-fluid"
                        onHide={hideDialog}
                        modal>
                        <div className="modal-content">
                        <p><b>Nombre:</b>{" "}{dialogContent.name}</p>
                        <p><b>Cantidad:</b>{" "}{dialogContent.amount}</p>
                        <p><b>Precio:</b>{" "}{formatCurrency(dialogContent.price)}</p>
                        </div>
                        </Dialog>}
                </div>
            </div>
        </div>
    );
}

export default Products

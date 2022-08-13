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
import headers from '../service/token';

const Treatments = () => {
    let emptyTreatment = {
        _id: null,
        name: '',
        total: 0
    };

    const [treatments, setProducts] = useState(null);
    const [adminDialog, setAdminDialog] = useState(false);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [treatment, setProduct] = useState(emptyTreatment);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    
    useEffect(() => {
        getAllProducts();
    }, []);
    
    const getAllProducts = () => {
        axios.get("http://localhost:8080/api/treatments", {headers})
        .then((response) => {
            const allProducts = response.data.treatments;
            setProducts(allProducts);
        })
        .catch(error => console.error('Error:',error));
    }

    const formatCurrency = (value) => {
        return value.toLocaleString('es-MX', { style: 'currency', currency: 'DOP' });
    }

    const openNew = () => {
        if(localStorage.role !== 'ADMIN'){
            setAdminDialog(true);
        } else {
            setProduct(emptyTreatment);
            setSubmitted(false);
            setProductDialog(true);
        }
    }
    const hideAdminDialog = () => {
        setAdminDialog(false);
    }

    const hideDialog = () => {
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

        if (treatment.name.trim()) {
            let _treatments = [...treatments];
            let _treatment = { ...treatment };

            if (treatment._id) {
                axios.put('http://localhost:8080/api/treatments/' + _treatment._id, _treatment , {headers}, )
                .then(response => {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
                    getAllProducts();

                })
                .catch(error => console.error('Error in editProduct:',error));
            }
            else {   
                axios.post("http://localhost:8080/api/treatments", _treatment, {headers})
                .then(response => {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
                    getAllProducts();
                })
                .catch(error => console.error('Error while posting treatment',error));
            }

            
            setProducts(_treatments);
            setProductDialog(false);
            setProduct(emptyTreatment);
        }
    }

    const editProduct = (treatment) => {
        if(localStorage.role !== 'ADMIN'){
            setAdminDialog(true);
        } else {
            setProduct({ ...treatment });
            setProductDialog(true);
        }
    }

    const confirmDeleteProduct = (treatment) => {
        if(localStorage.role !== 'ADMIN'){
            setAdminDialog(true);
        } else {
            setProduct(treatment);
            setDeleteProductDialog(true);
        }
    }

    const deleteProduct = () => {
        let _treatments = treatments.filter(val => val._id !== treatment._id);
        setProducts(_treatments);
        setDeleteProductDialog(false);
        setProduct(emptyTreatment);

        axios.delete('http://localhost:8080/api/treatments/' + treatment._id, {headers})
        .then(response => {
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
        })
        .catch(error => console.error('Error in delete Product:',error));
        
    }

    const exportCSV = () => {
        dt.current.exportCSV();
    }

    const confirmDeleteSelected = () => {
        if(localStorage.role !== 'ADMIN'){
            setAdminDialog(true);
        } else 
            setDeleteProductsDialog(true);
    }

    const deleteSelectedProducts = () => {
        let _treatments = treatments.filter(val => !selectedProducts.includes(val));
        setProducts(_treatments);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Treatments Deleted', life: 3000 });
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _treatment = { ...treatment };
        _treatment[`${name}`] = val;

        setProduct(_treatment);
    }

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _treatment = { ...treatment };
        _treatment[`${name}`] = val;

        setProduct(_treatment);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nuevo" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    <Button label="Borrar" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
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
            <>
                <span className="p-column-title">Productos</span>
                {rowData.treatments}
            </>
        );
    }

    const treatmentBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Tratamiento</span>
                {rowData.name}
            </>
        );
    }

    const priceBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Totale</span>
                {/* {formatCurrency(rowData.total)} */}
                {formatCurrency(rowData.total)}
            </>
        );
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteProduct(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gestion de tratamientos</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProducts} />
        </>
    );

    return (
       
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={treatments} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="_id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando  {first} a {last} de {totalRecords} productos"
                        globalFilter={globalFilter} emptyMessage="No se encuentras los tratamientos." header={header} responsiveLayout="scroll">
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem'}}></Column>
                        <Column field="name" header="Nombre" body={treatmentBodyTemplate} sortable headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="total" header="Total" body={priceBodyTemplate} sortable headerStyle={{ width: '14%', minWidth: '8rem' }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '450px' }} header="nuevo tratamiento" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="treatment">Tratamiento</label>
                            <InputText id="treatment" value={treatment.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !treatment.name })} />
                            {submitted && !treatment.name && <small className="p-invalid">el nombre del tratamiento es necesario.</small>}
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="total">Total</label>
                                <InputNumber id="total" value={treatment.total} onValueChange={(e) => onInputNumberChange(e, 'total')} mode="currency" currency="USD" locale="en-US" />
                                {submitted && !treatment.total && <small className="p-invalid">el Total es necesario.</small>}
                            </div>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {treatment && <span>¿Estás seguro de que quieres eliminar <b>{treatment.treatments}</b>?</span>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {treatment && <span>¿Está seguro de que desea eliminar los tratamientos seleccionados?</span>}
                        </div>
                    </Dialog>
                    <Dialog visible={adminDialog} style={{ width: '450px' }}  modal  onHide={hideAdminDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {treatment && <span>Sorry, only admins can modify these fields</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}

export default Treatments
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
import { Dropdown } from 'primereact/dropdown';

import axios from 'axios';
import headers from '../service/token';

const Products = () => {
    let emptyCuotas = {
        _id: null,
        treatmentId:'',
        patientId:''
    };

    const [cuotas, setCuotas] = useState(null);
    const [adminDialog, setAdminDialog] = useState(false);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteCuotaDialog, setDeleteProductDialog] = useState(false);
    const [deleteCuotasDialog, setDeleteProductsDialog] = useState(false);
    const [cuota, setCuota] = useState(emptyCuotas);
    const [selectedCuotas, setSelectedCuotas] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    const [clients, setClients] = useState(null);
    const [treatments, setTreatments] = useState(null);

    const [dropDownClient, setDropDownClient] = useState([]);
    const [dropDownTreatment, setDropDownTreatment] = useState([]);


    //const [treatments, setTreatments] = useState(null);

    
    useEffect(() => {
        getAllCuotas();
        getAllClients();
        getAllTreatments();
    }, []);
    
    const getAllCuotas = () => {
        axios.get("http://localhost:8080/api/patients/treatments", {headers})
        .then((response) => {
            const allProducts = response.data; //comment
            setCuotas(allProducts);
        })
        .catch(error => console.error('Error:',error));
    }

    const getAllClients = () => {
        axios.get("http://localhost:8080/api/patients", {headers})
        .then((response) => {
            const allClients = response.data.patients;
            setClients(allClients);

        })
        .catch(error => console.error('Error:',error));
    }

    const getAllTreatments = () => {
        axios.get("http://localhost:8080/api/treatments", {headers})
        .then((response) => {
            const allTreatments = response.data.treatments;
            setTreatments(allTreatments);
        })
        .catch(error => console.error('Error:',error));
    }

    const dropDownClientValues = clients === null
    ? "Loading..." : clients.map(patient => ({
        client: patient.name,
        id: patient._id
    }));

    const dropDownTreatmentValues = treatments === null
    ? "Loading..." : treatments.map(treatment => ({
        treatment: treatment.name,
        id: treatment._id
    }));

    const formatCurrency = (value) => {
        return value.toLocaleString('es-MX', { style: 'currency', currency: 'DOP' });
    }

    const openNew = () => {
        if(localStorage.role !== 'ADMIN'){
            setAdminDialog(true);
        } else {
            setCuota(emptyCuotas);
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

        // if (cuota.cuotas.trim()) {
            let _cuotas = [...cuotas];
            let _cuota = { ...cuota };
            let patientId = dropDownClient.id;
            let treatmentId = dropDownTreatment.id;
            
            console.log("here", _cuota)
            
            _cuota.patientId =patientId;
            _cuota.treatmentId = treatmentId;
            // _cuota.clientId = dropDownClient.id;


            if (cuota._id) {
                axios.put('http://localhost:8080/api/patients/treatments/' + _cuota._id, _cuota , {headers}, )
                .then(response => {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
                    getAllCuotas();

                })
                .catch(error => console.error('Error in editProduct:',error));
            }
            else {   
                axios.post("http://localhost:8080/api/patients/treatments", _cuota, {headers})
                .then(response => {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
                    getAllCuotas();
                })
                .catch(error => console.error('Error while posting cuota',error));
            }

            
            setCuotas(_cuotas);
            setProductDialog(false);
            setCuota(emptyCuotas);
        //}
    }

    const editProduct = (cuota) => {
        if(localStorage.role !== 'ADMIN'){
            setAdminDialog(true);
        } else {
            setCuota({ ...cuota });
            setProductDialog(true);
        }
    }

    const confirmDeleteProduct = (cuota) => {
        if(localStorage.role !== 'ADMIN'){
            setAdminDialog(true);
        } else {
            setCuota(cuota);
            setDeleteProductDialog(true);
        }
    }

    const deleteProduct = () => {
        let _products = cuotas.filter(val => val._id !== cuota._id);
        setCuotas(_products);
        setDeleteProductDialog(false);
        setCuota(emptyCuotas);

        axios.delete('http://localhost:8080/api/patients/treatments/' + cuota._id, {headers})
        .then(response => {
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
        })
        .catch(error => console.error('Error in delete Product:',error));
        
    }

    const exportCSV = () => {
        dt.current.exportCSV();
    }

    const confirmDeleteSelected = () => {
        if(localStorage.role !== 'ADMIN')
            setAdminDialog(true);
        else 
            setDeleteProductsDialog(true);
    }

    const deleteSelectedProducts = () => {
        let _products = cuotas.filter(val => !selectedCuotas.includes(val));
        setCuotas(_products);
        setDeleteProductsDialog(false);
        setSelectedCuotas(null);
        
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...cuota };
        _product[`${name}`] = val;

        setCuota(_product);
    }

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _product = { ...cuota };
        _product[`${name}`] = val;

        setCuota(_product);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nuevo" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    <Button label="Borrar" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedCuotas || !selectedCuotas.length} />
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

    const treatmentBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Tratamiento</span>
                {/* {console.log("here",treatments)} */}
                {/* {treatments} */}
                {rowData.treatment.name}

            </>
        );
    }

    const clientBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Clientes</span>
                {rowData.patient.name}
            </>
        );
    }

    const totalPriceBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Totale</span>
                {/* {formatCurrency(rowData.treatment.total)} */}
                {rowData.treatment.total}

            </>
        );
    }

    const payableBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Amount Payable</span>
                {rowData.reservations.map(amount => amount.amountPayable)}
            </>
        );
    }

    const deudaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Deuda</span>
                {rowData.deuda}
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
            <h5 className="m-0">Manage Products</h5>
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

                    <DataTable ref={dt} value={cuotas} selection={selectedCuotas} onSelectionChange={(e) => setSelectedCuotas(e.value)}
                        dataKey="_id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando  {first} a {last} de {totalRecords} productos"
                        globalFilter={globalFilter} emptyMessage="No se encontraron productos." header={header} responsiveLayout="scroll">
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem'}}></Column>
                        <Column field="treatment" header="Tratamiento" sortable body={treatmentBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="client" header="Client" body={clientBodyTemplate} sortable headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="total" header="Total" body={totalPriceBodyTemplate} sortable headerStyle={{ width: '14%', minWidth: '8rem' }}></Column>
                        <Column field="amountPayable" header="Amount Payable" body={payableBodyTemplate} sortable headerStyle={{ width: '14%', minWidth: '8rem' }}></Column>
                        <Column field="deuda" header="Deuda" body={deudaBodyTemplate} sortable headerStyle={{ width: '14%', minWidth: '8rem' }}></Column>
                        
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '450px' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="treatment">Tratamiento</label>
                            <Dropdown id="treatment" value={dropDownTreatment} onChange={(e) => setDropDownTreatment(e.value)} options={dropDownTreatmentValues} optionLabel="treatment" placeholder="Select" />
                            {/* {submitted && !cuota.treatmentId && <small className="p-invalid">el nombre de la doctora es necesario.</small>} */}
                        </div>


                        <div className="field col">
                            <label htmlFor="client">Client</label>
                            <Dropdown id="client" value={dropDownClient} onChange={(e) => setDropDownClient(e.value)} options={dropDownClientValues} optionLabel="client" placeholder="Select" />
                        </div>


                    </Dialog>

                    <Dialog visible={deleteCuotaDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {cuota && <span>¿Estás seguro de que quieres eliminar <b>{cuota.cuotas}</b>?</span>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteCuotasDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {cuota && <span>¿Está seguro de que desea eliminar los productos seleccionados?</span>}
                        </div>
                    </Dialog>
                    <Dialog visible={adminDialog} style={{ width: '450px' }}  modal  onHide={hideAdminDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {cuota && <span>Sorry, only admins can modify these fields</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}

export default Products
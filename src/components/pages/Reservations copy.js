import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';
import { FileUpload } from 'primereact/fileupload';
import { Toolbar } from 'primereact/toolbar';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import {Calendar} from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { MultiSelect } from 'primereact/multiselect';


import axios from 'axios';
import headers from '../service/token';

const formatDate = (value) => {
    return new Date (value).toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

const Reservations = () => {
    let emptyReservation = {
        _id: null,
        client: '',
        concept: '',
        phone: '',
        amountpayable: null,
        paymenttype:'',
        doctor:'',
        doctoraId:'',
        percent: null,
        ganancia: null,
        date:formatDate(Date.now())
    };

    const [patients, setPatients] = useState(null);
    const [doctors, setDoctors] = useState(null);
    const [dropdownValue, setDropdownValue] = useState([]);

    const [clients, setClients] = useState(null);
    const [treatments, setTreatments] = useState(null);
    const [products, setProducts] = useState(null);

    const [dropDownClient, setDropDownClient] = useState([]);
    const [dropDownTreatment, setDropDownTreatment] = useState([]);
    const [dropDownProduct, setDropDownProduct] = useState([]);

    const [patientDialog, setPatientDialog] = useState(false);
    const [deletePatientDialog, setDeletePatientDialog] = useState(false);
    const [deletePatientsDialog, setDeletePatientsDialog] = useState(false);
    const [patient, setPatient] = useState(emptyReservation);
    const [selectedPatients, setSelectedPatients] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        getAllReservations();
        getDoctors();
        getAllClients();
        getAllTreatments();
        getAllProducts();
    }, []);

    const getAllReservations = () => {
        axios.get("http://localhost:8080/api/reservation/todos", {headers})
        .then((response) => {
            const allReservations = response.data.reservations.map(reservation => {
                return {
                    ...reservation,
                    doctor: reservation.doctor.doctor,
                    client: reservation.client.patient
                }
            });
            setPatients(allReservations);
        })
        .catch(error => console.error('Error in getting all reservations:',error));
    }

    const getDoctors = () => {
        axios.get("http://localhost:8080/api/doctoras/ganancias", {headers})
        .then((response) => {
            const allDoctors = response.data.doctor;
            setDoctors(allDoctors);
        })
        .catch(error => console.error('Error in getting all reservations:',error));
    }

    const getAllClients = () => {
        axios.get("http://localhost:8080/api/clientes/todos", {headers})
        .then((response) => {
            const allClients = response.data.clients;
            setClients(allClients);

        })
        .catch(error => console.error('Error:',error));
    }

    const getAllTreatments = () => {
        axios.get("http://localhost:8080/api/tratamiento/info", {headers})
        .then((response) => {
            const allTreatments = response.data.treatment
            setTreatments(allTreatments);
            console.log(allTreatments)
        })
        .catch(error => console.error('Error:',error));
    }

    const getAllProducts = () => {
        axios.get("http://localhost:8080/api/productos/todos", {headers})
        .then((response) => {
            const allProducts = response.data.Products
            setProducts(allProducts);
            console.log(allProducts)
        })
        .catch(error => console.error('Error:',error));
    }

    const dropDownClientValues = clients === null
    ? "Loading..." : clients.map(client => ({
        client: client.patient,
        id: client._id
    }));

    const dropDownTreatmentValues = treatments === null
    ? "Loading..." : treatments.map(treatment => ({
        id: treatment._id,
        client: treatment.client,
        treatment: treatment.treatment
    }));

    const dropDownProducttValues = products === null
    ? "Loading..." : products.map(products => ({
        id: products._id,
        product: products.products
    }));

    console.log("products", dropDownProducttValues);

    const dropdownValues = doctors === null
    ? "Loading..." : doctors.map(doctor => ({
        doctor: doctor.doctor,
        id: doctor._id
    }));

    const formatCurrency = (value) => {
        return value.toLocaleString('es-MX', { style: 'currency', currency: 'DOP' });
    }

    const openNew = () => {
        setPatient(emptyReservation);
        setSubmitted(false);
        setPatientDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setPatientDialog(false);
    }

    const hideDeletePatientDialog = () => {
        setDeletePatientDialog(false);
    }

    const hideDeletePatientsDialog = () => {
        setDeletePatientsDialog(false);
    }

    const savePatient = () => {
        setSubmitted(true);

        if (patient.client.trim()) {
            let _patients = [...patients];
            let _patient = { ...patient };
            let doctoraId = dropdownValue.id;
            _patient.doctor = dropdownValue.doctor;
            _patient.doctoraId = dropdownValue.id;

            if (patient._id) {
                axios.put('http://localhost:8080/api/reservation/update/' + _patient._id, _patient , {headers} )
                .then(response => {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Patient Updated', life: 3000 });
                    getAllReservations();
                })
                .catch(error => console.error('Error in editing reservation:',error));
            
            }
            else {
                axios.post("http://localhost:8080/api/reservation/paciente", _patient, doctoraId, {headers})
                .then(response => {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Patient Added', life: 3000 });
                    getAllReservations();
                })
                .catch(error => console.error('Error while posting reservation',error));
            
            }

            setPatients(_patients);
            setPatientDialog(false);
            setPatient(emptyReservation);
        }
    }

    const editPatient = (patient) => {
        setPatient({ ...patient });
        setPatientDialog(true);
    }

    const confirmDeletePatient = (patient) => {
        setPatient(patient);
        setDeletePatientDialog(true);
    }

    const deletePatient = () => {
        let _patients = patients.filter(val => val._id !== patient._id);
        setPatients(_patients);
        setDeletePatientDialog(false);
        setPatient(emptyReservation);
        axios.delete('http://localhost:8080/api/reservation/delete/' + patient._id, {headers})
        .then(response => {
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Patient Deleted', life: 3000 });
        })
        .catch(error => console.error('Error in delete reservation:',error));
        
    }

    const exportCSV = () => {
        dt.current.exportCSV();
    }

    const confirmDeleteSelected = () => {
        setDeletePatientsDialog(true);
    }

    const deleteSelectedPatients = () => {
        let _patients = patients.filter(val => !selectedPatients.includes(val));
        setPatients(_patients);
        setDeletePatientsDialog(false);
        setSelectedPatients(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Patient Deleted', life: 3000 });
    }

    const onPaymentTypeChange = (e) => {
        let _patient = { ...patient };
        _patient['paymenttype'] = e.value;
        setPatient(_patient);
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _patient = { ...patient };
        _patient[`${name}`] = val;

        setPatient(_patient);
    }

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _patient = { ...patient };
        _patient[`${name}`] = val;

        setPatient(_patient);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nuevo" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    <Button label="Borrar" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedPatients || !selectedPatients.length} />
                </div>
            </React.Fragment>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="doc/*" maxFileSize={1000000} label="Importar" chooseLabel="Importar" className="mr-2 inline-block" />
                <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        )
    }

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Patiente</span>
                {rowData.client}
            </>
        );
    }

    const treatmentBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Patiente</span>
                {rowData.concept}
            </>
        );
    }

    const phoneBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Telefono</span>
                {rowData.phone}
            </>
        );
    }
    
    const amountPayableBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Montoapagar</span>
                {/* {formatCurrency(rowData.amountpayable)} */}
                {formatCurrency(rowData.amountPayable)}

            </>
        );
    }

    const paymentTypeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Tipo de pago</span>
                {rowData.paymenTtype}
            </>
        );
    }

    const doctorBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Doctora</span>
                {rowData.doctor}
            </>
        );
    }

    const percentBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Porciento</span>
                {rowData.percent}{"%"}
            </>
        );
    }

    const dateBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Fetcha</span>
                {formatDate(rowData.date)}
            </>
        );
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editPatient(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeletePatient(rowData)} />
            </div>
        );
    }

    const onCalenderChange = (e, patient) => {
        const val = e.value || 0;
        let _patient = { ...patient };
        _patient[`${patient}`] = val;
        e.preventDefault();
        setPatient(patient);
    }
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gestion de Reservas</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const patientDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={savePatient} />
        </>
    );
    const deletePatientDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeletePatientDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deletePatient} />
        </>
    );
    const deletePatientsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeletePatientsDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedPatients} />
        </>
    );

    return (
        <div className="grid patients-table">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    {/* Display column */}
                    <DataTable ref={dt} value={patients} selection={selectedPatients} onSelectionChange={(e) => setSelectedPatients(e.value)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando  {first} a {last} de {totalRecords} patientes"
                        globalFilter={globalFilter} emptyMessage="No se encontraron productos." header={header} responsiveLayout="scroll">
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem'}}></Column>
                        <Column field="concept" header="Concepto" sortable body={treatmentBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="client" header="Paciente" sortable body={nameBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="phone" header="Telefono" sortable body={phoneBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="amountpayable" header="Monto a pagar" body={amountPayableBodyTemplate} sortable headerStyle={{ width: '14%', minWidth: '8rem' }}></Column>
                        <Column field="paymenttype" header="Tipo de pago" sortable body={paymentTypeBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="doctor" header="Doctora" sortable body={doctorBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="percent" header="Porciento" sortable body={percentBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="date" header="Fecha" sortable body={dateBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    {/* Add/edit product stuff */ }

                    <Dialog visible={patientDialog} style={{ width: '450px' }} header="Patient Details" modal className="p-fluid" footer={patientDialogFooter} onHide={hideDialog}>

                        <div className="field">
                            <label htmlFor="concept"> Concepto</label>
                            <InputText id="concept" value={patient.concept} onChange={(e) => onInputChange(e, 'concept')} required autoFocus className={classNames({ 'p-invalid': submitted && !patient.concept })} />
                            {submitted && !patient.concept && <small className="p-invalid">se necesita agregar el concepto.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="client">Paciente</label>
                            {console.log("herex",dropDownClientValues)}

                            <Dropdown id="client" value={dropDownClient} onChange={(e) => setDropDownClient(e.value)} options={dropDownClientValues} optionLabel="client" placeholder="Select" />                            
                            {submitted && !patient.client && <small className="p-invalid">el nombre del paciente es necesario.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="treatment">Treatment</label>
                            {console.log("here",dropDownTreatmentValues)}
                            <Dropdown id="client" value={dropDownTreatment} onChange={(e) => setDropDownTreatment(e.value)} options={dropDownTreatmentValues} optionLabel="treatment" placeholder="Select" />                            
                            
                            {/* {submitted && !patient.client && <small className="p-invalid">el nombre del client es necesario.</small>} */}
                        </div>

                        <div className="field">
                            <label className="mb-3">Telefono</label>
                            <InputText id="phone" value={patient.phone} onChange={(e) => onInputChange(e, 'phone')} required className={classNames({ 'p-invalid': submitted && !patient.phone })} />
                            {submitted && !patient.phone && <small className="p-invalid">el telefono es necesario.</small>}
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="amountpayable">Monto a pagar</label>
                                <InputNumber id="amountpayable" value={patient.amountpayable} onValueChange={(e) => onInputNumberChange(e, 'amountpayable')} mode="currency" currency="USD" locale="en-US" />
                                {submitted && !patient.amountpayable && <small className="p-invalid">el monto a pagar es necesario.</small>}
                            </div>
                        </div>

                        <div className="field">
                            <label className="mb-3">Tipo de pago</label>
                            <div className="formgrid grid">
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="paymentType1" name="paymenttype" value="Tarjeta" onChange={onPaymentTypeChange} checked={patient.paymenttype === 'Tarjeta'} />
                                    <label htmlFor="paymentType1">Tarjeta</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="paymentType2" name="paymenttype" value="Efectivo" onChange={onPaymentTypeChange} checked={patient.paymenttype === 'Efectivo'} />
                                    <label htmlFor="paymentType2">Efectivo</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="paymentType2" name="paymenttype" value="Transferencia" onChange={onPaymentTypeChange} checked={patient.paymenttype === 'Transferencia'} />
                                    <label htmlFor="paymentType2">Transferencia</label>
                                </div>
                                {submitted && !patient.paymenttype && <small className="p-invalid">la forma de pago en necesaria.</small>}

                            </div>
                        </div>

                        <div className="field">
                            <label htmlFor="doctor">Doctora</label>
                            <Dropdown id="doctor" value={dropdownValue} onChange={(e) => setDropdownValue(e.value)} options={dropdownValues} optionLabel="doctor" placeholder="Select" />
                        </div>

                        <div className="field">
                            <label htmlFor="products">Products</label>
                            <MultiSelect optionLabel="product" value={dropDownProduct} options={dropDownProducttValues} onChange={(e) => setDropDownProduct(e.value)} />
                        </div>
                        
                        <div className="field">
                            <label htmlFor="percent">Porciento</label>
                            <InputNumber id="percent" value={patient.percent} onValueChange={(e) => onInputNumberChange(e, 'percent')} required className={classNames({ 'p-invalid': submitted && !patient.percent })} />
                            {submitted && !patient.percent && <small className="p-invalid">Porciento is required.</small>}
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="fecha">Fecha</label>
                                <Calendar id="fecha" value={formatDate(patient.fecha)}  onChange={(e) => onCalenderChange(e,'date')} inputMode="date" inline={false} placeholder={formatDate(patient.date)} />
                                {submitted && !patient.date && <small className="p-invalid">la fecha es necesaria</small>}
                            </div>
                        </div>
                       
                    </Dialog>

                    <Dialog visible={deletePatientDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePatientDialogFooter} onHide={hideDeletePatientDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {patient && <span>¿Estás seguro de que quieres eliminar <b>{patient.name}</b>?</span>}
                        </div>
                    </Dialog>

                    <Dialog visible={deletePatientsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePatientsDialogFooter} onHide={hideDeletePatientsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {patient && <span>¿Está seguro de que desea eliminar los pacientes seleccionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}

// const comparisonFn = function (prevProps, nextProps) {
//     return prevProps.location.pathname === nextProps.location.pathname;
// };

export default React.memo(Reservations);
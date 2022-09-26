import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { NavLink } from 'react-router-dom';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import {Calendar} from 'primereact/calendar';
import headers, { getHeaders } from '../service/token';
import axios from 'axios';
import { useDialog } from "../../hooks/useDialog";

const formatDate = (value) => {
    return new Date (value).toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

const Doctors = () => {
    let emptyDoctor = {
        _id: null,
        doctor: '',
        phone:'',
        totaldeganancias: '',
        date: formatDate(Date.now()),
        reservations:''
    };

    const [doctors, setDoctors] = useState(null);
    const [doctorDialog, setDoctorDialog] = useState(false);
    const [adminDialog, setAdminDialog] = useState(false);
    const [deleteDoctorDialog, setDeleteDoctorDialog] = useState(false);
    const [deleteDoctorsDialog, setDeleteDoctorsDialog] = useState(false);
    const [doctor, setDoctor] = useState(emptyDoctor);
    const [selectedDoctors, setSelectedDoctors] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [dialogIsVisible, dialogContent, showDialog, hideDialog] = useDialog();

    useEffect(() => {
        // const doctorService = new DoctorService();
        // doctorService.getDoctors().then(data => setDoctors(data));
        getAllDoctors();
    }, []);

    const getAllDoctors = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/doctors`, {headers: getHeaders()})
        .then((response) => {
            const allDoctors = response.data.doctors;
            setDoctors(allDoctors);
        })
        .catch(error => console.error('Error:', error));
    }


    const formatCurrency = (value) => {
        return value.toLocaleString('es-MX', { style: 'currency', currency: 'DOP' });
    }

    const openNew = () => {
        setDoctor(emptyDoctor);
        setSubmitted(false);
        setDoctorDialog(true);
    }

    const hideAdminDialog = () => {
        //setSubmitted(false);
        setAdminDialog(false);
    }

    const hideDoctorDialog = () => {
        setSubmitted(false);
        setDoctorDialog(false);
    }

    const hideDeleteDoctorDialog = () => {
        setDeleteDoctorDialog(false);
    }

    const hideDeleteDoctorsDialog = () => {
        setDeleteDoctorsDialog(false);
    }

    const onCalenderChange = (e, doctor) => {
        const val = e.value || 0;
        let doctora = { ...doctor };
        doctora[`${doctor}`] = val;
        e.preventDefault();
        setDoctor(doctora);
    }

    const saveDoctor = () => {
        setSubmitted(true);
        if (doctor.name.trim()) {
            let _doctors = [...doctors];
            let _doctor = { ...doctor };
            if (doctor._id) {
                axios.put(`${process.env.REACT_APP_API_URL}/api/doctors/` + doctor._id, _doctor ,{headers: getHeaders()})
                .then(response => {
                    toast.current.show({ severity: 'success', summary: 'Exito', detail: 'Actualizado Exitosamente', life: 3000 });
                    getAllDoctors();                  
                })
                .catch(error => console.error('Error in editDoctor:',error));
            }
            else {
                axios.post(`${process.env.REACT_APP_API_URL}/api/doctors`, _doctor, {headers: getHeaders()})
                .then(response => {
                    toast.current.show({ severity: 'success', summary: 'Exito', detail: 'Creado Exitosamente', life: 3000 });
                    getAllDoctors();
                })
                .catch(error => console.error('Error while posting Doctor',error));
                setDoctors(_doctors);
            }

            setDoctorDialog(false);
            setDoctor(emptyDoctor);
        

            
        }
    }

    const editDoctor = (doctor) => {
        if(localStorage.getItem('role') !== 'ADMIN'){
            setAdminDialog(true);
        } else {
            setDoctor({ ...doctor });
            setDoctorDialog(true);
        }
    }

    const confirmDeleteDoctor = (doctor) => {
        if(localStorage.getItem('role') !== 'ADMIN'){
            setAdminDialog(true);
        } else {
            setDoctor(doctor);
            setDeleteDoctorDialog(true);
        }
    }

    const deleteDoctor = () => {
        let _doctors = doctors.filter(val => val._id !== doctor._id);
        setDoctors(_doctors);
        setDeleteDoctorDialog(false);
        setDoctor(emptyDoctor);
        axios.delete(`${process.env.REACT_APP_API_URL}/api/doctors/` + doctor._id, {headers: getHeaders()})
        .then(response => {
            toast.current.show({ severity: 'success', summary: 'Exito', detail: 'Borrado Exitosamente', life: 3000 });
        })
        .catch(error => console.error('Error in deleteDoctor():',error));
    }

    const exportCSV = () => {
        dt.current.exportCSV();
    }

    const confirmDeleteSelected = () => {
        if(localStorage.getItem('role') !== 'ADMIN')
            setAdminDialog(true);
        else 
            setDeleteDoctorsDialog(true);
    }

    const deleteSelectedDoctors = () => {
        let _doctors = doctors.filter(val => !selectedDoctors.includes(val));
        setDoctors(_doctors);
        setDeleteDoctorsDialog(false);
        setSelectedDoctors(null);
        toast.current.show({ severity: 'success', summary: 'Exito', detail: 'Doctor Deleted', life: 3000 });
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _doctor = { ...doctor };
        _doctor[`${name}`] = val;

        setDoctor(_doctor);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nuevo" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    {/* <Button label="Borrar" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedDoctors || !selectedDoctors.length} /> */}
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
            <NavLink to={`/doctors/${rowData._id}`}>{rowData.name}</NavLink>
        );
    }

    const phoneBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Numeromovil</span>
                {rowData.phone}
            </>
        );
    }

    const dateBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Fetcha</span>
                {/* {rowData.date} */}
                {formatDate(rowData.date)}

            </>
        );
    }

    const totalEarningsBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Total de ganancias</span>
                {formatCurrency(rowData.totaldeganancias)}
                {/* {rowData.totaldeganancias} */}
            </>
        );
    }

    const showSelectedDoctorDialog = doctor => {
        showDialog(doctor)
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="datatable-actions">
                <Button icon="pi pi-eye" className="p-button-rounded p-button-info" onClick={() => showSelectedDoctorDialog(rowData)} />
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success" onClick={() => editDoctor(rowData)} />
                {/* <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteDoctor(rowData)} /> */}
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gestion de Comisiones</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const doctorDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDoctorDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveDoctor} />
        </>
    );
    const deleteDoctorDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteDoctorDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteDoctor} />
        </>
    );
    const deleteDoctorsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteDoctorsDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedDoctors} />
        </>
    );

    return (  
        <div className="grid doctors-table">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={doctors} selection={selectedDoctors} onSelectionChange={(e) => setSelectedDoctors(e.value)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} doctoras"
                        globalFilter={globalFilter} emptyMessage="No hay Registros." header={header} responsiveLayout="scroll">
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem'}}></Column>
                        <Column field="name" header="Nombre" sortable body={nameBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="phone" header="Teléfono" sortable body={phoneBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        {/* <Column field="porciento" header="Porciento" sortable body={percentBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column> */}
                        <Column field="totaldeganancias" header="Ganancias" body={totalEarningsBodyTemplate} sortable headerStyle={{ width: '14%', minWidth: '8rem' }}></Column>
                        {/* <Column field="date" header="Fetcha" sortable body={dateBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column> */}
                    
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={doctorDialog} style={{ width: '450px' }} header="Detalles de la doctora" modal className="p-fluid" footer={doctorDialogFooter} onHide={hideDoctorDialog}>
                        <div className="field">
                            <label htmlFor="doctor">Doctora</label>
                            <InputText id="doctor" value={doctor.name} onChange={(e) => onInputChange(e, 'name')} autoFocus className={classNames({ 'p-invalid': submitted && !doctor.name })} />
                            {submitted && !doctor.name && <small className="p-invalid">el nombre de la doctora es necesario</small>}

                        </div>

                        <div className="field">
                            <label className="mb-3">Telefono</label>
                            <InputText id="phone" value={doctor.phone} onChange={(e) => onInputChange(e, 'phone')} required className={classNames({ 'p-invalid': submitted && !doctor.phone })} />
                            {submitted && !doctor.phone && <small className="p-invalid">el numeromovil es necesario</small>}
                        </div>

                        

                        {/* <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="ganancias">Total de ganancias</label>
                                <InputNumber id="ganancias" value={doctor.ganancias} onValueChange={(e) => onInputNumberChange(e, 'ganancias')} mode="currency" currency="USD" locale="en-US" />
                            </div>
                        </div> */}
                    </Dialog>

                    <Dialog visible={deleteDoctorDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteDoctorDialogFooter} onHide={hideDeleteDoctorDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {doctor && <span>¿Estás seguro de que quieres eliminar <b>{doctor.doctor}</b>?</span>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteDoctorsDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteDoctorsDialogFooter} onHide={hideDeleteDoctorsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {doctor && <span>¿Está seguro de que desea eliminar los médicos seleccionados?</span>}
                        </div>
                    </Dialog>
                    <Dialog visible={adminDialog} style={{ width: '450px' }}  modal  onHide={hideAdminDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {doctor && <span>No tienes los permisos necesarios</span>}
                        </div>
                    </Dialog>
                    {dialogIsVisible && 
                        <Dialog 
                        visible={dialogIsVisible}
                        style={{ width: "450px" }}
                        header="Detalles de doctor"
                        footer={<div />}
                        className="p-fluid"
                        onHide={hideDialog}
                        modal>
                        <div className="modal-content">
                        <p><b>Nombre:</b>{" "}{dialogContent.name}</p>
                        <p><b>Tel&eacute;fono:</b>{" "}{dialogContent.phone}</p>
                        <p><b>Ganancias:</b>{" "}{dialogContent.totaldeganancias}</p>
                        </div>
                        </Dialog>}
                </div>
            </div>
        </div>
    );
}

// const comparisonFn = function (prevProps, nextProps) {
//     return prevProps.location.pathname === nextProps.location.pathname;
// };

export default Doctors
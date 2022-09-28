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
import { NavLink } from 'react-router-dom';
import { Calendar } from 'primereact/calendar';
import axios from 'axios';
import headers, { getHeaders } from '../service/token';
import { useDialog } from "../../hooks/useDialog";

const formatDate = (value) => {
    return new Date(value).toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

const Clients = () => {
    let emptyClient = {
        _id: null,
        name: '',
        phone: '',
        email: '',
        status: 'activo'
    };

    const [clients, setClients] = useState(null);
    const [clientDialog, setClientDialog] = useState(false);
    const [adminDialog, setAdminDialog] = useState(false);
    const [deleteClientDialog, setDeleteClientDialog] = useState(false);
    const [deleteClientsDialog, setDeleteClientsDialog] = useState(false);
    const [client, setClient] = useState(emptyClient);
    const [selectedClients, setSelectedClients] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [dialogIsVisible, dialogContent, showDialog, hideDialog] = useDialog();

    useEffect(() => {
        // const clientService = new ClientService();
        // clientService.getClients().then(data => setClients(data));
        getAllClients();

    }, []);

    const getAllClients = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/patients`, {headers: getHeaders()})
            .then((response) => {
                const allClients = response.data.patients;
                setClients(allClients);
            })
            .catch(error => {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Oops! Algo salio mal', life: 5000 });
                getAllClients();
            });
    }



    const openNew = () => {
        setClient(emptyClient);
        setSubmitted(false);
        setClientDialog(true);
    }

    const hideClientDialog = () => {
        setSubmitted(false);
        setClientDialog(false);
    }

    const hideAdminDialog = () => {
        //setSubmitted(false);
        setAdminDialog(false);
    }

    const hideDeleteClientDialog = () => {
        setDeleteClientDialog(false);
    }

    const hideDeleteClientsDialog = () => {
        setDeleteClientsDialog(false);
    }

    const saveClient = () => {
        setSubmitted(true);

        if (client.name.trim()) {
            console.log(client)
            let _clients = [...clients];
            let _client = { ...client };
            if (client._id) {
                axios.put(`${process.env.REACT_APP_API_URL}/api/patients/` + _client._id, _client, {headers: getHeaders()},)
                    .then(response => {
                        toast.current.show({ severity: 'success', summary: 'Exito', detail: 'Actualizado Exitosamente', life: 3000 });
                        getAllClients();

                    })
                    .catch(error => {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Oops! Algo salio mal', life: 5000 });
                        getAllClients();
                    });
            }
            else {
                axios.post(`${process.env.REACT_APP_API_URL}/api/patients`, _client, {headers: getHeaders()})
                    .then(response => {
                        toast.current.show({ severity: 'success', summary: 'Exito', detail: 'Creado Exitosamente', life: 3000 });
                        getAllClients();
                    })
                    .catch(error => {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Oops! Algo salio mal', life: 5000 });
                        getAllClients();
                    });
            }

            setClients(_clients);
            setClientDialog(false);
            setClient(emptyClient);
        }
    }

    const editClient = (client) => {
        if (localStorage.getItem('role') !== 'ADMIN') {
            setAdminDialog(true);
        } else {
            setClient({ ...client });
            setClientDialog(true);
        }
    }

    const confirmDeleteClient = (client) => {
        if(localStorage.getItem('role') !== 'ADMIN'){
            setAdminDialog(true);
        } else {
            setClient(client);
            setDeleteClientDialog(true);
        }
    }

    const deleteClient = () => {
        let _clients = clients.filter(val => val._id !== client._id);
        setClients(_clients);
        setDeleteClientDialog(false);
        setClient(emptyClient);
        axios.delete(`${process.env.REACT_APP_API_URL}/api/patients/` + client._id, {headers: getHeaders()})
            .then(response => {
                toast.current.show({ severity: 'success', summary: 'Exito', detail: 'Borrado Exitosamente', life: 3000 });
            })
            .catch(error => console.error('Error in editProduct:', error));
    }

    const exportCSV = () => {
        dt.current.exportCSV();
    }

    const confirmDeleteSelected = () => {
        if(localStorage.getItem('role') !== 'ADMIN'){
            setAdminDialog(true);
        } else 
            setDeleteClientsDialog(true);
    }

    const deleteSelectedClients = () => {
        let _clients = clients.filter(val => !selectedClients.includes(val));
        setClients(_clients);
        setDeleteClientsDialog(false);
        setSelectedClients(null);
        toast.current.show({ severity: 'success', summary: 'Exito', detail: 'Borrado Exitosamente', life: 3000 });
    }

    const onCalenderChange = (e, patient) => {
        const val = e.value || 0;
        let _client = { ...client };
        _client[`${patient}`] = val;
        e.preventDefault();
        setClient(_client);
    }

    const onInputChange = (e, patient) => {
        const val = (e.target && e.target.value) || '';
        let _client = { ...client };
        _client[`${patient}`] = val;

        setClient(_client);
    }

    const onInputNumberChange = (e, patient) => {
        const val = e.value || 0;
        let _client = { ...client };
        _client[`${patient}`] = val;

        setClient(_client);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nuevo" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    {/* <Button label="Borrar" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedClients || !selectedClients.length} /> */}
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
            <NavLink to={`/clients/${rowData._id}`}>{rowData.name}</NavLink>
        );
    }

    const emailBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Tratamiento</span>
                {rowData.email}
            </>
        );
    }

    const statusBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                {rowData.status}
            </>
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

    const visitsBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Visitas del Paciente</span>
                {rowData.visitas}
            </>
        );
    }

    const showSelectedClientDialog = client => {
        showDialog(client);
    }



    const actionBodyTemplate = (rowData) => {
        return (
            <div className="datatable-actions">
                <Button icon="pi pi-eye" className="p-button-rounded p-button-info" onClick={() => showSelectedClientDialog(rowData)} />
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success" onClick={() => editClient(rowData)} />
                {/* <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteClient(rowData)} /> */}
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gestion de Clientes</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const clientDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideClientDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveClient} />
        </>
    );
    const deleteClientDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteClientDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteClient} />
        </>
    );
    const deleteClientsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteClientsDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedClients} />
        </>
    );

    return (
        <div className="grid clients-table">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={clients} selection={selectedClients} onSelectionChange={(e) => setSelectedClients(e.value)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando  {first} a {last} de {totalRecords} clientes"
                        globalFilter={globalFilter} emptyMessage="No se encontraron clientes." header={header} responsiveLayout="scroll">
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                        <Column field="name" header="Paciente" sortable body={nameBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="phone" header="Telefono" sortable body={phoneBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="email" header="Correo Electronico" sortable body={emailBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="status" header="Estatus" sortable body={statusBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>

                        {<Column field="visitas" header="Visitas" sortable body={visitsBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>}
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={clientDialog} style={{ width: '450px' }} header="Detalles del cliente" modal className="p-fluid" footer={clientDialogFooter} onHide={hideClientDialog}>
                        <div className="field">
                            <label htmlFor="patient">Nombre del Paciente</label>
                            <InputText id="patient" value={client.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !client.name })} />
                            {submitted && !client.name && <small className="p-invalid">el nombre del paciente es necesario</small>}
                        </div>
                        <div className="field">
                            <label className="mb-3">Telefono</label>
                            <InputText id="phone" value={client.phone} onChange={(e) => onInputChange(e, 'phone')} required className={classNames({ 'p-invalid': submitted && !client.phone })} />
                        </div>

                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <InputText id="email" value={client.email} onChange={(e) => onInputChange(e, 'email')} required className={classNames({ 'p-invalid': submitted && !client.email })} />
                            {submitted && !client.email && <small className="p-invalid">se necesita agregar el email</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="status">Status</label>
                            <InputText id="status" value={client.status} onChange={(e) => onInputChange(e, 'status')} required className={classNames({ 'p-invalid': submitted && !client.status })} />
                            {submitted && !client.status && <small className="p-invalid">se necesita agregar el status</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteClientDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteClientDialogFooter} onHide={hideDeleteClientDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {client && <span>¿Estás seguro de que quieres eliminar <b>{client.patient}</b>?</span>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteClientsDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteClientsDialogFooter} onHide={hideDeleteClientsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {client && <span>¿Está seguro de que desea eliminar los clientes seleccionados?</span>}
                        </div>
                    </Dialog>
                    <Dialog visible={adminDialog} style={{ width: '450px' }} modal onHide={hideAdminDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {client && <span>No tienes los permisos necesarios</span>}
                        </div>
                    </Dialog>
                    {dialogIsVisible &&
                        <Dialog
                            visible={dialogIsVisible}
                            style={{ width: "450px" }}
                            header="Detalles de cliente"
                            footer={<div />}
                            className="p-fluid"
                            onHide={hideDialog}
                            modal>
                            <div className="modal-content">
                                <p><b>Paciente:</b>{" "}{dialogContent.name}</p>
                                <p><b>Tel&eacute;fono:</b>{" "}{dialogContent.phone}</p>
                                <p><b>Correo electr&oacute;nico:</b>{" "}{dialogContent.email}</p>
                                <p><b>Visitas:</b>{" "}{dialogContent.visitas}</p>
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

export default Clients
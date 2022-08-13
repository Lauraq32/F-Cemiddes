import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";

import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import classNames from 'classnames';
import {Calendar} from 'primereact/calendar';


import leftToolbar from "./leftToolbar";
import rightToolbar from "./rightToolbar";
import axios from "axios";

// TODO: fetch reservations from the backend

const headerStyle = { width: "14%", minWidth: "10rem" };

const header = (
  <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
    <h5 className="m-0">Gestion de Reservas</h5>
    <span className="block mt-2 md:mt-0 p-input-icon-left">
      <i className="pi pi-search" />
      <InputText type="search" placeholder="Buscar..." />
    </span>
  </div>
);

const ReservationsTable = ({ onEdit, onDelete }) => {
  const toast = useRef(null);
  const dt = useRef(null);

  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetchReservations();
  }, []);

  async function fetchReservations() {
    try {
      const url = "http://localhost:8080/api/reservations";
      const token = localStorage.getItem("token");
      if (!token) return;

      const options = {
        headers: {
          Authorization: token,
        },
      };
      const res = await axios.get(url, options);

      setReservations(res.data.reservations);
    } catch (error) {
      console.error(error);
    }
  }

  const dateBodyTemplate = (rowData) => {
    return <>{formatDate(rowData.date)}</>;
  };

  const formatDate = (value) => {
    return new Date(value).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatCurrency = (value) => {
    return value.toLocaleString("es-MX", {
      style: "currency",
      currency: "DOP",
    });
  };

  const percentBodyTemplate = (rowData) => {
    return (
      <>
        {rowData.percent}
        {"%"}
      </>
    );
  };

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <div className="my-2">
          <Button
            label="Nuevo"
            icon="pi pi-plus"
            className="p-button-success mr-2"
          />
          <Button
            label="Borrar"
            icon="pi pi-trash"
            className="p-button-danger"
          />
        </div>
      </React.Fragment>
    );
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        <FileUpload
          mode="basic"
          accept="doc/*"
          maxFileSize={1000000}
          label="Importar"
          chooseLabel="Importar"
          className="mr-2 inline-block"
        />
        <Button
          label="Exportar"
          icon="pi pi-upload"
          className="p-button-help"
          onClick={exportCSV}
        />
      </React.Fragment>
    );
  };

  const amountPayableBodyTemplate = (rowData) => {
    return (
      <>
        {/* {formatCurrency(rowData.amountpayable)} */}
        {rowData.amountPayable}
      </>
    );
  };

  const selectReservation = (e) => {
    console.log(e.target.value);
  };

  const editReservation = (reservation) => {
    onEdit(reservation);
  };

  const deleteReservation = (reservation) => {
    onDelete(reservation);
  };

  const actionButtons = (rowData) => {
    return (
      <div className="actions">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => editReservation(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning mt-2"
          onClick={() => deleteReservation(rowData)}
        />
      </div>
    );
  };

  return (
    <div className="grid patients-table">
      <div className="col-12">
        <div className="card">
          <Toast ref={toast} />
          <Toolbar
            className="mb-4"
            left={leftToolbarTemplate}
            right={rightToolbarTemplate}
          ></Toolbar>
          <DataTable
            ref={dt}
            value={reservations}
            //selection={selectedReservation}
            onSelectionChange={selectReservation}
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando  {first} a {last} de {totalRecords} patientes"
            emptyMessage="No se encontraron productos."
            header={header}
            responsiveLayout="scroll"
          >
            <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
            <Column field="concept" header="Concepto" sortable />
            <Column
              field="amountPayable"
              header="monto pagado"
              body={amountPayableBodyTemplate}
              headerStyle={headerStyle}
              sortable
            />
            <Column
              field="paymentType"
              header="metodo de pago"
              headerStyle={headerStyle}
              sortable
            />
            <Column
              field="doctor.name"
              header="doctora"
              headerStyle={headerStyle}
              sortable
            />
            <Column
              field="patient.name"
              header="paciente"
              headerStyle={headerStyle}
              sortable
            />
            <Column
              field="date"
              header="Fecha"
              sortable
              body={dateBodyTemplate}
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            ></Column>
            <Column
              field="percent"
              header="Porciento"
              sortable
              body={percentBodyTemplate}
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            ></Column>
            <Column body={actionButtons} />
          </DataTable>

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
        </div>
      </div>
    </div>
  );
};

export default ReservationsTable;

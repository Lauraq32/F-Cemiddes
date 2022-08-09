import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";

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
        {formatCurrency(rowData.amountPayable)}
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
        </div>
      </div>
    </div>
  );
};

export default ReservationsTable;

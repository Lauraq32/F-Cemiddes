import React,{ useState, useMemo, useEffect, useRef } from "react";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";
import { Toast } from "primereact/toast";
import classNames from "classnames";

import { useDoctors } from "../../hooks/useDoctors";
import { Toolbar } from "primereact/toolbar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useDialog } from "../../hooks/useDialog";
import { FileUpload } from "primereact/fileupload";

const EarningsPage = () => {
  const [doctors] = useDoctors();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [earnings, setEarnings] = useState(null);
  const [pagos, setPagos] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [pago, setPago] = useState();
  // form fields
  const [doctor, setDoctor] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endingDate, setEndingDate] = useState("");
  const toast = useRef(null);
  const dt = useRef(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [showDialog] = useDialog();

  const doctorsOpts = useMemo(
    () => doctors.map((doctor) => ({ value: doctor._id, label: doctor.name })),
    [doctors]
  );

  const formatCurrency = (value) => {
    return value.toLocaleString("es-MX", {
      style: "currency",
      currency: "DOP",
    });
  };

  useEffect(() => {
    getPagos();
    getEarningsByDate();
  }, []);
  

  async function getPagos() {
    try {
      const url = `${process.env.REACT_APP_API_URL}/api/pagos`;
      const token = localStorage.getItem("token");
      if (!token) return;

      const options = {
        headers: {
          Authorization: token,
        },
      };
      const res = await axios.get(url, options);

      setPagos(res.data.pagos);
    } catch (error) {
      console.error(error);
    }
  }

  async function getEarningsByDate(e) {
    e.preventDefault();
    try {
      const url = `${process.env.REACT_APP_API_URL}/api/doctors/earnings/${doctor}?firstDate=2022-05-10&lastDate=2022-05-10`;
      const token = localStorage.getItem("token");
      if (!token) return;

      const options = {
        headers: {
          Authorization: token,
        },
      };
      const res = await axios.get(url, options);
      const earnings = res.data.earnings[0] ?? null;

      setEarnings(earnings);
    } catch (error) {
      console.error(error);
    }
  }

  const quantityBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Cantidad Pagada</span>
        {rowData.amount}
      </>
    );
  };

  const nameBodyTemplate = (rowData) => {
    return (
        <>
            <span className="p-column-title">Doctora</span>
            {rowData.name}
        </>
    );
}

  // const dropdownValues =
  //   doctors === null
  //     ? "Loading..."
  //     : doctors.map((doctor) => ({
  //         doctor: doctor.name,
  //         id: doctor._id,
  //       }));

  const formatDate = (value) => {
    return new Date(value).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Status</span>
        {rowData.status}
      </>
    );
  };

  const showSelectedProductDialog = (pago) => {
    showDialog(pago);
  };

  // const editProduct = (pago) => {
  //   if(localStorage.getItem('role') !== 'ADMIN'){
  //       setAdminDialog(true);
  //   } else {
  //       setPago({ ...pago });
  //       setProductDialog(true);
  //   }
  // }

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="datatable-actions">
        <Button
          icon="pi pi-eye"
          className="p-button-rounded p-button-info"
          onClick={() => showSelectedProductDialog(rowData)}
        />
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success"
        />
        {/* <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteProduct(rowData)} /> */}
      </div>
    );
  };

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <div className="my-2">
          <Button
            label="Nuevo"
            // onClick={openNewReservation}
            icon="pi pi-plus"
            className="p-button-success mr-2"
          />
          {/* <Button
            label="Borrar"
            icon="pi pi-trash"
            className="p-button-danger"
          /> */}
        </div>
      </React.Fragment>
    );
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
          // onClick={exportCSV}
        />
      </React.Fragment>
    );
  };

  const dateBodyTemplate = (rowData) => {
    return <>{formatDate(rowData.date)}</>;
  };

  const headerStyle = { width: "14%", minWidth: "10rem" };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Gestion de Pagos</h5>
      <span className="block mt-2 md:mt-0 p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Buscar..."
        />
      </span>
    </div>
  );

  return (
    <>
    <div className="grid clients-table">
      <div className="col-12">
        <div className="card">
          <h4 className="mb-4">Ganancias</h4>
          <form
            onSubmit={getEarningsByDate}
            className="formgroup-inline d-flex"
          >
            <div className="field">
              <label htmlFor="doctor" className="p-sr-only">
                Doctor/ra
              </label>
              <Dropdown
                id="doctor"
                value={doctor}
                onChange={(e) => setDoctor(e.value)}
                options={doctorsOpts}
                placeholder="Seleccione un/una"
              />
              {submitted && !doctor && (
                <span className="block mt-2 ml-1 text-pink-500">
                  Campo requerido
                </span>
              )}
            </div>
            <div className="field">
              <label htmlFor="start-date" className="p-sr-only">
                Fecha de inicio
              </label>
              <Calendar
                id="start-date"
                value={startDate}
                onChange={(e) => setStartDate(e.value)}
                placeholder="Fecha inicio"
                showIcon
              />
              {submitted && !startDate && (
                <span className="block mt-2 ml-1 text-pink-500">
                  Campo requerido
                </span>
              )}
            </div>
            <div className="field">
              <label htmlFor="ending-date" className="p-sr-only">
                Fecha final
              </label>
              <Calendar
                id="ending-date"
                value={endingDate}
                onChange={(e) => setEndingDate(e.value)}
                placeholder="Fecha fin"
                showIcon
              />
              {submitted && !endingDate && (
                <span className="block mt-2 ml-1 text-pink-500">
                  Campo requerido
                </span>
              )}
            </div>
            <button type="submit" className="p-button p-component">
              Ver ganancias
            </button>
          </form>
          <div className="mt-5" style={{ height: 50 }}>
            {!loading && !earnings && <p>No hay datos para mostrar</p>}
            {loading && (
              <p className="text-center">
                <i
                  className="pi pi-spin pi-spinner"
                  style={{ fontSize: "2rem" }}
                ></i>
              </p>
            )}
            {!loading && earnings && (
              <p>Ganancias: {formatCurrency(earnings.total)}</p>
            )}
          </div>
        </div>
      </div>
    </div>
    <div className="card">
            <Toast ref={toast} />
            <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

            <DataTable
              ref={dt}
              value={pagos}
              selection={selectedProducts}
              onSelectionChange={(e) => setSelectedProducts(e.value)}
              dataKey="_id"
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25]}
              className="datatable-responsive"
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Mostrando  {first} a {last} de {totalRecords} productos"
              globalFilter={globalFilter}
              emptyMessage="No se encontraron productos."
              header={header}
              responsiveLayout="scroll"
            >
              <Column
                selectionMode="multiple"
                headerStyle={{ width: "3rem" }}
              ></Column>
              <Column
                field="name"
                header="Nombre"
                body={nameBodyTemplate}
                headerStyle={headerStyle}
              ></Column>
              <Column
                field="amount"
                header="Cantidad"
                body={quantityBodyTemplate}
                sortable
               
              ></Column>
              <Column
                field="date"
                header="Fecha"
                sortable
                body={dateBodyTemplate}
       
              ></Column>
              <Column
                field="status"
                header="Estado del Pago"
                body={statusBodyTemplate}
                sortable

              ></Column>
              <Column body={actionBodyTemplate}></Column>
            </DataTable>
          </div>
    </>
  );
};

export default EarningsPage;

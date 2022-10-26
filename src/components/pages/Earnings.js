import React, { useState, useMemo, useEffect, useRef } from "react";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";
import { Toast } from "primereact/toast";
import { useDoctors } from "../../hooks/useDoctors";
import { Toolbar } from "primereact/toolbar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useDialog } from "../../hooks/useDialog";
import { FileUpload } from "primereact/fileupload";
import { format } from "date-fns";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";

const EarningsPage = () => {
  const formatDate = (value) => {
    return new Date(value).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  let emptyPago = {
    _id: null,
    doctorId: "",
    amount: "0",
    status: "",
    date: formatDate(Date.now()),
  };

  const [doctors] = useDoctors();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [earnings, setEarnings] = useState(null);
  const [adminDialog, setAdminDialog] = useState(false);
  const [payments, setPayments] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [pagoDialog, setPagoDialog] = useState(false);
  const [payment, setPayment] = useState(emptyPago);
  const [submitting, setSubmitting] = useState(false);
  // form fields
  const [doctor, setDoctor] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endingDate, setEndingDate] = useState("");
  const toast = useRef(null);
  const dt = useRef(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [dialogIsVisible, dialogContent, showDialogs, hideDialogs] = useDialog();

  const doctorsOpts = useMemo(
    () =>
      doctors.map((doctor) => ({
        value: doctor._id,
        label: doctor.name,
        id: doctor._id,
      })),
    [doctors]
  );

  const updateDoctor = (e) => {
    setPayment({ ...payment, doctorId: e.value._id });
  };

  const formatCurrency = (value) => {
    return value.toLocaleString("es-MX", {
      style: "currency",
      currency: "DOP",
    });
  };

  useEffect(() => {
    getPagos();
  }, []);

  const hideDialog = () => {
    setSubmitted(false);
    setPagoDialog(false);
    hideDialogs(false);
  };

  const uptdatePago = async () => {
    setSubmitting(true);
    if (payment._id) {
      try {
        const url =
          `${process.env.REACT_APP_API_URL}/api/payments/` + payment._id;
        const token = localStorage.getItem("token");
        if (!token) return;

        const options = {
          headers: {
            Authorization: token,
          },
        };
        await axios.put(url, payment, options);

        toast.current.show({
          severity: "success",
          summary: "Exito",
          detail: "Actualizado Exitosamente",
          life: 3000,
        });

        await getPagos();

        hideDialog();
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const url = `${process.env.REACT_APP_API_URL}/api/payments`;
        const token = localStorage.getItem("token");
        if (!token) return;

        const options = {
          headers: {
            Authorization: token,
          },
        };

        const response = await axios.post(url, payment, options);

        if (response.status === 201) {
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Creado Exitosamente",
            life: 3000,
          });
          await getPagos();
          setPayment(emptyPago);
          hideDialog();
        }
      } catch (error) {
        console.error(error);
      }
    }
    setSubmitting(false);
  };

  async function getPagos() {
    try {
      const url = `${process.env.REACT_APP_API_URL}/api/payments/list`;
      const token = localStorage.getItem("token");
      if (!token) return;

      const options = {
        headers: {
          Authorization: token,
        },
      };
      const res = await axios.get(url, options);

      console.log("PAGOS");
      setPayments(res.data.payments);
    } catch (error) {
      console.error(error);
    }
  }

  async function getEarningsByDate(e) {
    e.preventDefault();

    const firstDate = format(startDate, "yyyy-MM-dd");
    const lastDate = format(endingDate, "yyyy-MM-dd");

    try {
      const url = `${process.env.REACT_APP_API_URL}/api/doctors/earnings/${doctor}?firstDate=${firstDate}&lastDate=${lastDate}`;
      console.log(url);
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

  const onInputNumberChange = (e, name) => {
    const value = e.value || 0;
    let _payment = { ...payment };
    _payment[`${name}`] = value;

    setPayment(_payment);
  };

  const hideAdminDialog = () => {
    //setSubmitted(false);
    setAdminDialog(false);
  };

  const quantityBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Cantidad Pagada</span>
        {rowData.amount}
      </>
    );
  };

  // const nameBodyTemplate = (rowData) => {
  //   return (
  //     <>
  //       <span className="p-column-title">Doctora</span>
  //       {rowData.name}
  //     </>
  //   );
  // };

  // const dropdownValues =
  //   doctors === null
  //     ? "Loading..."
  //     : doctors.map((doctor) => ({
  //         doctor: doctor.name,
  //         id: doctor._id,
  //       }));

  const statusBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Status</span>
        {rowData.status}
      </>
    );
  };

  const showSelectedProductDialog = (payment) => {
    showDialogs(payment);
  };

  const statusOptions = [
    { id: 1, name: "Pagado", status: "Pagado" },
    { id: 2, name: "Pendiente", status: "Pendiente" },
  ];

  const [status, setStatus] = useState();

  const updateStatus = (e) => {
    setStatus(e.value);
    setPayment({ ...payment, status: e.value.status });
  };

  const editProduct = (payment) => {
    if (localStorage.getItem("role") !== "ADMIN") {
      setAdminDialog(true);
    } else {
      setPayment({ ...payment });
      setPagoDialog(true);
    }
  };

  const openNewPago = () => {
    setPayment(emptyPago);
    setSubmitted(false);
    setPagoDialog(true);
  };

  const pagoDialogFooter = (
    <>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialog}
      />
      <Button
        loading={submitting}
        disabled={submitting}
        label="Guardar"
        icon="pi pi-check"
        className="p-button-text"
        onClick={uptdatePago}
      />
    </>
  );

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
          onClick={() => editProduct(rowData)}
        />
        {/* <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteProduct(rowData)} /> */}
      </div>
    );
  };

  const findDoctor = () => {
    return doctors.find((doctor) => doctor._id === payment.doctorId);
  };

  const onCalenderChange = (e) => {
    const value = e.value;
    const fields = { ...payment, date: value };
    setPayment(fields);
  };

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <div className="my-2">
          <Button
            label="Nuevo"
            onClick={openNewPago}
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
        {/* <FileUpload
          mode="basic"
          accept="doc/*"
          maxFileSize={1000000}
          label="Importar"
          chooseLabel="Importar"
          className="mr-2 inline-block"
        /> */}
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
      <h5 className="m-0">Gestión de pagos</h5>
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
                  Doctor/a
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
        <Toolbar
          className="mb-4"
          left={leftToolbarTemplate}
          right={rightToolbarTemplate}
        ></Toolbar>

        <DataTable
          ref={dt}
          value={payments}
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
          emptyMessage="No se encontrarón productos."
          header={header}
          responsiveLayout="scroll"
        >
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}
          ></Column>
          <Column
            field="doctor.name"
            header="Nombre"
            // body={nameBodyTemplate}
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
        <Dialog
          visible={pagoDialog}
          style={{ width: "450px" }}
          header="Detalles de la doctora"
          modal
          className="p-fluid"
          footer={pagoDialogFooter}
          onHide={hideDialog}
          // onEdit={editReservation}
        >
          <div className="field">
            <label htmlFor="doctor">Doctora</label>
            <Dropdown
              id="doctor"
              options={doctors}
              optionLabel="name"
              placeholder="Select"
              onChange={updateDoctor}
              value={findDoctor()}
            />
          </div>
          <div className="field">
            <label htmlFor="amount">Monto pagado</label>
            <InputNumber
              id="amount"
              value={payment.amount}
              onValueChange={(e) => onInputNumberChange(e, "amount")}
              mode="currency"
              currency="DOP"
              locale="es-MX"
            />
          </div>
          <div className="field">
            <label htmlFor="status">Estatus</label>
            <Dropdown
              id="status"
              optionLabel="name"
              value={status}
              options={statusOptions}
              onChange={updateStatus}
              placeholder="Seleccionar"
            />
            {submitted && !payment.status && (
              <small className="p-invalid">
                Se necesita agregar el estatus
              </small>
            )}
          </div>
          <div className="formgrid grid">
            <div className="field col">
              <label htmlFor="fecha">Fecha</label>
              <Calendar
                id="fecha"
                value={new Date(payment.date)}
                onChange={(e) => onCalenderChange(e, "date")}
                inputMode="date"
                inline={false}
                dateFormat="dd/mm/yy"
                placeholder="Seleccionar"
              />
              {submitted && !payment.date && (
                <small className="p-invalid">La fecha es necesaria</small>
              )}
            </div>
          </div>
        </Dialog>
        {dialogIsVisible && 
                        <Dialog 
                        visible={dialogIsVisible}
                        style={{ width: "450px" }}
                        header="Detalles de los Pagos"
                        footer={<div />}
                        className="p-fluid"
                        onHide={hideDialogs}
                        modal>
                        <div className="modal-content">
                        <p><b>Doctora:</b>{" "}{dialogContent.doctor.name}</p>
                        <p><b>Cantidad:</b>{" "}{formatCurrency(dialogContent.amount)}</p>
                        <p><b>Fecha:</b>{" "}{formatDate(dialogContent.date)}</p>
                        <p><b>Estado Del Pago:</b>{" "}{dialogContent.status}</p>
                        </div>
                        </Dialog>}
        <Dialog
            visible={adminDialog}
            style={{ width: "450px" }}
            modal
            onHide={hideAdminDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {payment && <span>No tienes los permisos necesarios</span>}
            </div>
          </Dialog>
      </div>
    </>
  );
};

export default EarningsPage;

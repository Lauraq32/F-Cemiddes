import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Dialog } from "primereact/dialog";
import axios from "axios";
import classNames from "classnames";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { RadioButton } from "primereact/radiobutton";

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

const ReservationsTable = ({ onEdit, onDelete, onShowDetails }) => {
  const formatDate = (value) => {
    return new Date(value).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  let emptyReservation = {
    _id: null,
    patientId: "",
    concept: "",
    phone: "",
    amountPayable: 0,
    paymentType: "",
    doctorId: "",
    productIds: [],
    percent: 0,
    patientTreatmentId: "",
    date: formatDate(Date.now()),
    status: 'pendiente',
  };
  const toast = useRef(null);
  const dt = useRef(null);

  const [reservations, setReservations] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [reservation, setReservation] = useState(emptyReservation);
  const [reservationDialog, setReservationDialog] = useState(false);
  const [patients, setPatients] = useState([]);
  const [products, setProducts] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patientTreatments, setPatientTreatments] = useState([]);
  const [dropDownPatient, setDropDownPatient] = useState([]);
  const [dropDownTreatment, setDropDownTreatment] = useState([]);
  const [dropDownProduct, setDropDownProduct] = useState([]);
  const [dropDownDoctor, setDropDownDoctor] = useState([]);
  const [patient, setPatient] = useState(emptyReservation);
  const [submitting, setSubmitting] = useState(false);
  const [deleteReservationDialog, setDeleteReservationDialog] = useState(false);

  useEffect(() => {
    fetchReservations();
    getAllPatients();
    getAllDoctors();
    getAllProducts();
  }, []);

  async function fetchReservations() {
    try {
      const url = `${process.env.REACT_APP_API_URL}/api/reservations`;
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

  async function getAllPatients() {
    try {
      const url = `${process.env.REACT_APP_API_URL}/api/patients`;
      const token = localStorage.getItem("token");
      if (!token) return;

      const options = {
        headers: {
          Authorization: token,
        },
      };
      const res = await axios.get(url, options);

      setPatients(res.data.patients);
    } catch (error) {
      console.error(error);
    }
  }

  async function getAllTreatments(patientId) {
    try {
      const url = `${process.env.REACT_APP_API_URL}/api/patients/${patientId}/treatments`;
      const token = localStorage.getItem("token");
      if (!token) return;

      const options = {
        headers: {
          Authorization: token,
        },
      };
      const res = await axios.get(url, options);

      setPatientTreatments(res.data.patientTreatments);
    } catch (error) {
      console.error(error);
    }
  }

  async function getAllProducts() {
    try {
      const url = `${process.env.REACT_APP_API_URL}/api/products`;
      const token = localStorage.getItem("token");
      if (!token) return;

      const options = {
        headers: {
          Authorization: token,
        },
      };
      const res = await axios.get(url, options);

      setProducts(res.data.products);
    } catch (error) {
      console.error(error);
    }
  }

  async function getAllDoctors() {
    try {
      const url = `${process.env.REACT_APP_API_URL}/api/doctors`;
      const token = localStorage.getItem("token");
      if (!token) return;

      const options = {
        headers: {
          Authorization: token,
        },
      };
      const res = await axios.get(url, options);

      setDoctors(res.data.doctors);
    } catch (error) {
      console.error(error);
    }
  }

  async function saveReservation() {
    setSubmitting(true);
    try {
      const url = `${process.env.REACT_APP_API_URL}/api/reservations`;
      const token = localStorage.getItem("token");
      if (!token) return;

      const options = {
        headers: {
          Authorization: token,
        },
      };

      const response = await axios.post(url, reservation, options);

      if (response.status === 201) {
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Creado Exitosamente', life: 3000 });
        await fetchReservations();
        setReservation(emptyReservation);
        hideDialog();
      }

      // success
    } catch (error) {
      console.error(error);
    }
    setSubmitting(false);
  }

  // async function deleteReservations() {
  //   try {
  //     const url = `${process.env.REACT_APP_API_URL}/api/reservations/`;
  //     const token = localStorage.getItem("token");
  //     if (!token) return;

  //     const options = {
  //       headers: {
  //         Authorization: token,
  //       },
  //     };
  //     await axios.delete(url, options);
  //     toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Borrado Exitosamente', life: 3000 });

  //     setReservation(emptyReservation);
  //     setDeleteReservationDialog(false)
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  const onInputChange = (e, name) => {
    const value = (e.target && e.target.value) || "";
    const fields = { ...reservation, [name]: value };

    setReservation(fields);
  };

  const dateBodyTemplate = (rowData) => {
    return <>{formatDate(rowData.date)}</>;
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

  const phoneBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Numeromovil</span>
        {rowData.phone}
      </>
    );
  };

  const openNewReservation = () => {
    setReservation(emptyReservation);
    setSubmitted(false);
    setReservationDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setReservationDialog(false);
  };

  const hideDeleteReservationDialog = () => {
    setDeleteReservationDialog(false);
  };

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <div className="my-2">
          <Button
            label="Nuevo"
            onClick={openNewReservation}
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

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const reservationDialogFooter = (
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
        onClick={saveReservation}
      />
    </>
  );

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

  const statusBodyTemplate = (rowData) => {
    return (
        <>
            <span className="p-column-title">Status</span>
            {rowData.status}
        </>
    );
}

  const amountPayableBodyTemplate = (rowData) => {
    return (
      <>
        {/* {formatCurrency(rowData.amountpayable)} */}
        {formatCurrency(rowData.amountPayable)}
      </>
    );
  };

  const patientOptions =
    patients === null
      ? "Loading..."
      : patients.map((patient) => ({
          patient: patient.name,
          id: patient._id,
        }));

  const showDetails = (reservationData) => {
    onShowDetails(reservationData);
  };

  const dropDownTreatmentValues =
    patientTreatments === null
      ? "Loading..."
      : patientTreatments.map((patientTreatment) => ({
          id: patientTreatment._id,
          name: patientTreatment.treatment.name,
        }));

  const changeDropdownPatient = (e) => {
    const patientId = e.value ? e.value.id : "";

    if (patientId) {
      getAllTreatments(patientId);
    }

    setDropDownPatient(e.value);
    setReservation({ ...reservation, patientId });
  };

  const changeTreatment = (e) => {
    const patientTreatmentId = e.value ? e.value.id : "";
    setDropDownTreatment(e.value);
    setReservation({ ...reservation, patientTreatmentId });
  };

  const changeDoctor = (e) => {
    const doctorId = e.value ? e.value.id : "";
    setDropDownDoctor(e.value);
    setReservation({ ...reservation, doctorId });
  };

  const changeProducts = (e) => {
    const productIds = e.value.map((product) => product.id);
    setDropDownProduct(e.value);
    setReservation({ ...reservation, productIds });
  };

  const dropDownProducttValues =
    products === null
      ? "Loading..."
      : products.map((products) => ({
          id: products._id,
          product: products.name,
        }));

  const dropdownValues =
    doctors === null
      ? "Loading..."
      : doctors.map((doctor) => ({
          doctor: doctor.name,
          id: doctor._id,
        }));

  const onInputNumberChange = (e, name) => {
    const value = e.value || 0;
    const fields = { ...reservation, [name]: value };
    setReservation(fields);
  };

  const onPaymentTypeChange = (e) => {
    const fields = { ...reservation, paymentType: e.value };
    setReservation(fields);
  };

  const onCalenderChange = (e, name) => {
    const value = e.value;
    const fields = { ...reservation, [name]: value };
    setReservation(fields);
  };

  const treatmentBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Tratamiento</span>
        {rowData.patientTreatment.treatment.name}
      </>
    );
  };

  const editReservation = (reservation) => {
    onEdit(reservation);
  };

  const deleteReservation = (reservation) => {
    setReservation(reservation);
    setDeleteReservationDialog(true)
  };

  const deleteReservationDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteReservationDialog}
      />
      <Button
        label="Si"
        icon="pi pi-check"
        className="p-button-text"
        //onClick={deleteReservations}
      />
    </>
  );

  const actionButtons = (rowData) => {
    return (
      <div className="datatable-actions">
        <Button
          icon="pi pi-eye"
          className="p-button-rounded p-button-info"
          onClick={() => showDetails(rowData)}
        />
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success"
          onClick={() => editReservation(rowData)}
        />
        {/* <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => deleteReservation(rowData)}
        /> */}
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
            selectionMode="multiple"
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
             <Column field="tratamiento" header="Tratamiento" sortable body={treatmentBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
            <Column
              field="phone"
              header="Telefono"
              sortable
              body={phoneBodyTemplate}
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            ></Column>
            <Column
              field="date"
              header="Fecha"
              sortable
              body={dateBodyTemplate}
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            ></Column>
            <Column
              field="percent"
              header="Porcentaje"
              sortable
              body={percentBodyTemplate}
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            ></Column>
            <Column
              field="status"
              header="Estatus de la reserva"
              headerStyle={headerStyle}
              sortable
            />
            <Column body={actionButtons} />
          </DataTable>

          <Dialog
            visible={reservationDialog}
            style={{ width: "450px" }}
            header="Nueva Reservacion"
            modal
            className="p-fluid"
            footer={reservationDialogFooter}
            onHide={hideDialog}
          >
            <div className="field">
              <label htmlFor="concept"> Concepto</label>
              <InputText
                id="concept"
                value={reservations.concept}
                onChange={(e) => onInputChange(e, "concept")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !reservations.concept,
                })}
              />
              {submitted && !reservations.concept && (
                <small className="p-invalid">
                  se necesita agregar el concepto.
                </small>
              )}
            </div>

            <div className="field">
              <label htmlFor="client">Paciente</label>
              <Dropdown
                id="client"
                value={dropDownPatient}
                onChange={changeDropdownPatient}
                options={patientOptions}
                optionLabel="patient"
                placeholder="Seleccionar"
              />
              {submitted && !reservations.patient && (
                <small className="p-invalid">
                  el nombre del paciente es necesario.
                </small>
              )}
            </div>
            <div className="field">
              <label className="mb-3">Telefono</label>
              <InputText
                id="phone"
                value={reservations.phone}
                onChange={(e) => onInputChange(e, "phone")}
                required
                className={classNames({
                  "p-invalid": submitted && !reservations.phone,
                })}
              />
              {submitted && !reservations.phone && (
                <small className="p-invalid">el telefono es necesario.</small>
              )}
            </div>
            <div className="field">
              <label htmlFor="treatment">Tratamiento</label>
              <Dropdown
                id="patientTreatment"
                value={dropDownTreatment}
                onChange={changeTreatment}
                options={dropDownTreatmentValues}
                optionLabel="name"
                placeholder="Seleccionar"
              />
            </div>
            <div className="field">
              <label htmlFor="doctor">Doctora</label>
              <Dropdown
                id="doctor"
                value={dropDownDoctor}
                onChange={changeDoctor}
                options={dropdownValues}
                optionLabel="doctor"
                placeholder="Seleccionar"
              />
            </div>
            <div className="field">
              <label htmlFor="percent">Porcentaje</label>
              <InputNumber
                id="percent"
                value={patient.percent}
                onValueChange={(e) => onInputNumberChange(e, "percent")}
                required
                className={classNames({
                  "p-invalid": submitted && !patient.percent,
                })}
              />
            </div>
            <div className="field">
              <label htmlFor="products">Productos</label>
              <MultiSelect
                optionLabel="product"
                value={dropDownProduct}
                options={dropDownProducttValues}
                placeholder="Seleccionar"
                onChange={changeProducts}
              />
            </div>
            <div className="formgrid grid">
              <div className="field col">
                <label htmlFor="fecha">Fecha</label>
                <Calendar
                  id="date"
                  value={formatDate(patient.date)}
                  onChange={(e) => onCalenderChange(e, "date")}
                  inputMode="date"
                  inline={false}
                  placeholder={formatDate(patient.date)}
                />
                {submitted && !patient.date && (
                  <small className="p-invalid">la fecha es necesaria</small>
                )}
              </div>
            </div>
            <div className="formgrid grid">
              <div className="field col">
                <label htmlFor="amountPayable">Monto a pagar</label>
                <InputNumber
                  id="amountPayable"
                  value={patient.amountPayable}
                  onValueChange={(e) => onInputNumberChange(e, "amountPayable")}
                  mode="currency"
                  currency="DOP"
                  locale="es-MX"
                />
                {submitted && !patient.amountPayable && (
                  <small className="p-invalid">
                    el monto a pagar es necesario.
                  </small>
                )}
              </div>
            </div>
            <div className="field">
              <label className="mb-3">Tipo de pago</label>
              <div className="formgrid grid">
                <div className="field-radiobutton col-6">
                  <RadioButton
                    inputId="paymentType1"
                    name="paymentType"
                    value="Tarjeta"
                    onChange={onPaymentTypeChange}
                    checked={reservation.paymentType === "Tarjeta"}
                  />
                  <label htmlFor="paymentType1">Tarjeta</label>
                </div>
                <div className="field-radiobutton col-6">
                  <RadioButton
                    inputId="paymentType2"
                    name="paymentType"
                    value="Efectivo"
                    onChange={onPaymentTypeChange}
                    checked={reservation.paymentType === "Efectivo"}
                  />
                  <label htmlFor="paymentType2">Efectivo</label>
                </div>
                <div className="field-radiobutton col-6">
                  <RadioButton
                    inputId="paymentType2"
                    name="paymentType"
                    value="Transferencia"
                    onChange={onPaymentTypeChange}
                    checked={reservation.paymentType === "Transferencia"}
                  />
                  <label htmlFor="paymentType2">Transferencia</label>
                </div>
                {submitted && !reservation.paymentType && (
                  <small className="p-invalid">
                    la forma de pago en necesaria.
                  </small>
                )}
              </div>
            </div>
            <Column
              field="status"
              header="Estado de la reserva"
              body={statusBodyTemplate}
              headerStyle={headerStyle}
              sortable
            />
            <Dialog
              visible={deleteReservationDialog}
              style={{ width: "450px" }}
              header="Confirmar"
              modal
              footer={deleteReservationDialogFooter}
              onHide={hideDeleteReservationDialog}
            >
              <div className="flex align-items-center justify-content-center">
                <i
                  className="pi pi-exclamation-triangle mr-3"
                  style={{ fontSize: "2rem" }}
                />
                {reservation && (
                  <span>
                    ¿Estás seguro de que quieres eliminar <b>{reservation}</b>?
                  </span>
                )}
              </div>
            </Dialog>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default ReservationsTable;

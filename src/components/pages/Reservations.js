import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { RadioButton } from "primereact/radiobutton";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { MultiSelect } from "primereact/multiselect";
import { useDoctors } from "../../hooks/useDoctors";
import ReservationsTable from "../tables/ReservationsTable";
import axios from "axios";
import { useDialog } from "../../hooks/useDialog";
import { format } from "date-fns";

const Reservations = () => {
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

  const [selectedReservation, setSelectedReservation] = useState(null);
  const [products, setProducts] = useState([]);
  // const [adminDialog, setAdminDialog] = useState(false);
  const [patientTreatments, setPatientTreatments] = useState([]);
  const [patients, setPatients] = useState([]);
  const toast = useRef(null);
  const [deleteReservationDialog, setDeleteReservationDialog] = useState(false);
  const [doctor, setDoctors] = useState([]);
  const [doctors] = useDoctors();
  const [dialogIsVisible, dialogContent, showDialog, hideDialog] = useDialog();
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetchReservations();
    getAllProducts();
    getAllPatients();
    getAllDoctors();
  }, []);

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

      // console.log(res.data);
      setPatientTreatments(res.data.patientTreatments);
    } catch (error) {
      console.error(error);
    }
  }

  const editReservation = async (reservation) => {
    await getAllTreatments(reservation.patient._id);
    setSelectedReservation(reservation);
  };

  const formData = (reservation) => {
    const productIds = reservation.products.map((product) => product.id);
    return {
      ...reservation,
      doctorId: reservation.doctor._id,
      patientId: reservation.patient._id,
      patientTreatmentId: reservation.patientTreatment._id,
      productIds,
    };
  };

  // const hideAdminDialog = () => {
  //   //setSubmitted(false);
  //   setAdminDialog(false);
  // };

  const deleteReservation = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/api/reservations/`;
      const token = localStorage.getItem("token");
      if (!token) return;

      const options = {
        headers: {
          Authorization: token,
        },
      };
      const res = await axios.delete(url, options);
      toast.current.show({
        severity: "success",
        summary: "Exito",
        detail: "Borrado Exitosamente",
        life: 3000,
      });

      selectedReservation(reservation);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Oops! Algo salio mal",
        life: 5000,
      });
    }
  };

  const hideEditDialog = () => {
    setSelectedReservation(null);
  };

  const saveReservation = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/api/reservations/${selectedReservation._id}`;
      const token = localStorage.getItem("token");
      if (!token) return;

      const options = {
        headers: {
          Authorization: token,
        },
      };
      await axios.put(url, formData(selectedReservation), options);

      toast.current.show({
        severity: "success",
        summary: "Exito",
        detail: "Actualizado Exitosamente",
        life: 3000,
      });

      await fetchReservations();

      hideEditDialog();
    } catch (error) {
      console.log(error);
    }
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedReservation({ ...selectedReservation, [name]: value });
  };

  const hideDeleteReservationDialog = () => {
    setDeleteReservationDialog(false);
  };

  const showSelectedReservationDialog = (reservation) => {
    showDialog(reservation);
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
        onClick={deleteReservation}
      />
    </>
  );

  const Footer = (
    <>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideEditDialog}
      />
      <Button
        label="Guardar"
        icon="pi pi-check"
        className="p-button-text"
        onClick={saveReservation}
      />
    </>
  );

  const onCalenderChange = (e) => {
    const value = format(e.value, "yyyy-MM-dd");
    const fields = { ...selectedReservation, date: value };
    setSelectedReservation(fields);
  };

  const findDoctor = () => {
    return doctors.find(
      (doctor) => doctor._id === selectedReservation?.doctor._id
    );
  };

  const patientOptions = patients.map((patient) => ({
    ...patient,
    id: patient._id,
    name: patient.name,
  }));

  const findPatient = () => {
    return patientOptions.find(
      (patient) => patient.id === selectedReservation?.patient._id
    );
  };

  const dropDownTreatmentValues = patientTreatments.map((patientTreatment) => ({
    ...patientTreatment,
    id: patientTreatment._id,
    name: patientTreatment.treatment.name,
  }));

  const findTreatment = () => {
    return dropDownTreatmentValues.find(
      (patientTreatment) =>
        patientTreatment.id === selectedReservation?.patientTreatment._id
    );
  };

  const findProducts = () => {
    const reservationProducts = {};
    selectedReservation.products.forEach((product) => {
      reservationProducts[product.id || product._id] = true;
    });

    const selectedProducts = products
      .filter((product) => reservationProducts[product._id])
      .map((product) => ({
        ...product,
        id: product._id,
      }));

    return selectedProducts;
  };

  const onInputNumberChange = (e, name) => {
    const value = e.value || 0;
    const fields = { ...selectedReservation, [name]: value };

    setSelectedReservation(fields);
  };

  const onPaymentTypeChange = (e) => {
    let fields = { ...selectedReservation };
    fields["paymentType"] = e.value;
    setSelectedReservation(fields);
  };

  const changeDropdownPatient = async (e) => {
    const patientId = e.value ? e.value.id : "";

    if (patientId) {
      await getAllTreatments(patientId);
    }

    setSelectedReservation({ ...selectedReservation, patient: e.value });
  };

  const changeProducts = (e) => {
    setSelectedReservation({ ...selectedReservation, products: e.value });
  };

  const changeDoctor = (e) => {
    setSelectedReservation({ ...selectedReservation, doctor: e.value });
  };

  const changeTreatment = (e) => {
    setSelectedReservation({
      ...selectedReservation,
      patientTreatment: e.value,
    });
  };

  const statusOptions = [
    { id: 1, name: "Pendiente", status: "pendiente" },
    { id: 2, name: "Completado", status: "completado" },
    { id: 3, name: "Cancelado", status: "cancelado" },
  ];

  const [status, setStatus] = useState();

  const updateStatus = (e) => {
    setStatus(e.value);
    setSelectedReservation({ ...selectedReservation, status: e.value.status });
  };

  const productOptions = products.map((product) => ({
    ...product,
    id: product._id,
  }));

  const submitted = false;
  const reservation = selectedReservation;

  return (
    <>
      <Toast ref={toast} />
      <ReservationsTable
        reservations={reservations}
        onEdit={editReservation}
        onDelete={deleteReservation}
        onShowDetails={showSelectedReservationDialog}
        onSaveReservation={fetchReservations}
      />
      {reservation && (
        <Dialog
          visible={reservation}
          style={{ width: "450px" }}
          header="Detalles de la reservacion"
          modal
          footer={Footer}
          className="p-fluid"
          onHide={hideEditDialog}
        >
          <div className="field">
            <label htmlFor="patient">Paciente</label>
            <Dropdown
              id="client"
              optionLabel="name"
              value={findPatient()}
              options={patientOptions}
              onChange={changeDropdownPatient}
              placeholder="Seleccionar"
            />
          </div>
          <div className="field">
            <label className="mb-3">Telefono</label>
            <InputText
              id="phone"
              value={reservation.phone}
              name="phone"
              onChange={(e) => onInputChange(e, "phone")}
              required
              className={classNames({
                "p-invalid": submitted && !reservation.phone,
              })}
            />
            {submitted && !reservation.phone && (
              <small className="p-invalid">el telefono es necesario.</small>
            )}
          </div>
          <div className="field">
            <label htmlFor="treatment">Tratamiento</label>
            <Dropdown
              id="patientTreatment"
              optionLabel="name"
              onChange={changeTreatment}
              options={dropDownTreatmentValues}
              value={findTreatment()}
            />
          </div>
          <div className="field">
            <label htmlFor="concept">Concepto</label>
            <InputText
              id="concept"
              value={reservation.concept}
              required
              onChange={onInputChange}
              name="concept"
              autoFocus
              className={classNames({
                "p-invalid": submitted && !reservation.concept,
              })}
            />
            {submitted && !reservation.concept && (
              <small className="p-invalid">
                se necesita agregar el concepto.
              </small>
            )}
          </div>
          <div className="formgrid grid">
            <div className="field col">
              <label htmlFor="fecha">Fecha</label>
              <Calendar
                id="fecha"
                value={new Date(reservation.date)}
                onChange={(e) => onCalenderChange(e, "date")}
                inputMode="date"
                inline={false}
                placeholder="Seleccione una fecha"
                dateFormat="dd/mm/yy"
              />
              {submitted && !reservation.date && (
                <small className="p-invalid">la fecha es necesaria</small>
              )}
            </div>
          </div>
          <div className="formgrid grid">
            <div className="field col">
              <label htmlFor="amountPayable">Monto a pagar</label>
              <InputNumber
                id="amountPayable"
                value={reservation.amountPayable}
                onValueChange={(e) => onInputNumberChange(e, "amountPayable")}
                mode="currency"
                currency="DOP"
                locale="es-MX"
              />
              {submitted && !reservation.amountPayable && (
                <small className="p-invalid">
                  el monto a pagar es necesario.
                </small>
              )}
            </div>
          </div>
          <div className="field">
            <label htmlFor="percent">Porcentaje</label>
            <InputNumber
              id="percent"
              value={reservation.percent}
              onValueChange={(e) => onInputNumberChange(e, "percent")}
              required
              className={classNames({
                "p-invalid": submitted && !reservation.percent,
              })}
            />
            {submitted && !reservation.percent && (
              <small className="p-invalid">Porciento is required.</small>
            )}
          </div>
          <div className="field">
            <label className="mb-3">método de pago</label>
            <div className="formgrid grid">
              <div className="field-radiobutton col-6">
                <RadioButton
                  inputId="paymentType1"
                  name="paymentType"
                  onChange={onPaymentTypeChange}
                  value="Tarjeta"
                  checked={reservation.paymentType === "Tarjeta"}
                />
                <label htmlFor="paymentType1">Tarjeta</label>
              </div>
              <div className="field-radiobutton col-6">
                <RadioButton
                  inputId="paymentType2"
                  name="paymentType"
                  onChange={onPaymentTypeChange}
                  value="Efectivo"
                  checked={reservation.paymentType === "Efectivo"}
                />
                <label htmlFor="paymentType2">Efectivo</label>
              </div>
              <div className="field-radiobutton col-6">
                <RadioButton
                  inputId="paymentType2"
                  name="paymentType"
                  onChange={onPaymentTypeChange}
                  value="Transferencia"
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
          <div className="field">
            <label htmlFor="doctor">Doctora</label>
            <Dropdown
              id="doctor"
              options={doctors}
              optionLabel="name"
              placeholder="Select"
              onChange={changeDoctor}
              value={findDoctor()}
            />
          </div>
          <div className="field">
            <label htmlFor="products">Productos</label>
            <MultiSelect
              optionLabel="name"
              value={findProducts()}
              options={productOptions}
              placeholder="Seleccionar"
              onChange={changeProducts}
            />
          </div>
          <div className="field">
            <label htmlFor="status">Status</label>
            <Dropdown
              id="status"
              optionLabel="name"
              value={status}
              options={statusOptions}
              onChange={updateStatus}
              placeholder="Seleccionar"
            />
          </div>
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
              {selectedReservation && (
                <span>
                  ¿Estás seguro de que quieres eliminar <b>{reservation}</b>?
                </span>
              )}
            </div>
          </Dialog>
        </Dialog>
      )}
      {dialogIsVisible && (
        <Dialog
          visible={dialogIsVisible}
          style={{ width: "450px" }}
          header="Detalles de la reservación"
          footer={<div />}
          className="p-fluid"
          onHide={hideDialog}
          modal
        >
          <div className="modal-content">
            <p>
              <b>Concepto:</b> {dialogContent.concept}
            </p>
            <p>
              <b>Monto pagado:</b> {formatCurrency(dialogContent.amountPayable)}
            </p>
            <p>
              <b>Fecha:</b> {formatDate(dialogContent.date)}
            </p>
            <p>
              <b>Doctor:</b> {dialogContent.doctor.name}
            </p>
            <p>
              <b>Paciente:</b> {dialogContent.patient.name}
            </p>
            <p>
              <b>Tipo de pago:</b> {dialogContent.paymentType}
            </p>
            <p>
              <b>Porcentaje:</b> {dialogContent.percent}{"%"}
            </p>
            <p>
              <b>Tel&eacute;fono:</b> {dialogContent.phone}
            </p>
          </div>
        </Dialog>
      )}
    </>
  );
};

export default Reservations;

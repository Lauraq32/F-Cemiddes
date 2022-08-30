import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { RadioButton } from "primereact/radiobutton";
import { FileUpload } from "primereact/fileupload";
import { Toolbar } from "primereact/toolbar";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import { MultiSelect } from "primereact/multiselect";
import useDoctors from "../../hooks/useDoctors";
import ReservationsTable from "../tables/ReservationsTable";
import { formatDate } from "../../utils";
import axios from "axios";

const Reservations = () => {
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [products, setProducts] = useState([]);
  const [patientTreatments, setPatientTreatments] = useState([]);
  const [dropDownPatient, setDropDownPatient] = useState([]);
  const [patients, setPatients] = useState([]);
  const [dropDownTreatment, setDropDownTreatment] = useState([]);

  const [doctors] = useDoctors();

  useEffect(() => {
    getAllProducts();
    getAllPatients();
  }, []);

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

  const editReservation = (reservation) => {
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

  const deleteReservation = (reservation) => {
    console.log(reservation);
  };

  const hideEditDialog = () => {
    setSelectedReservation(null);
  };

  const saveReservation = async () => {
    try {
      console.log(selectedReservation);
      const url = `${process.env.REACT_APP_API_URL}/api/reservations/${selectedReservation._id}`;
      const token = localStorage.getItem("token");
      if (!token) return;

      const options = {
        headers: {
          Authorization: token,
        },
      };
      await axios.put(url, formData(selectedReservation), options);

      hideEditDialog();
    } catch (error) {
      console.log(error);
    }
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedReservation({ ...selectedReservation, [name]: value });
  };

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
    const value = e.value;
    const fields = { ...selectedReservation, date: value };
    setSelectedReservation(fields);
  };
  const findDoctor = () => {
    return doctors.find(
      (doctor) => doctor._id === selectedReservation?.doctor._id
    );
  };

  const findProducts = () => {
    const products = selectedReservation.products.map((product) => ({
      ...product,
      id: product._id,
    }));

    return products;
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
    selectedReservation({ ...selectedReservation, patientId });
  };

  const patientOptions =
    patients === null
      ? "Loading..."
      : patients.map((patient) => ({
          patient: patient.name,
          id: patient._id,
        }));

  const changeProducts = (e) => {
    setSelectedReservation({ ...selectedReservation, products: e.value });
  };

  const changeDoctor = (e) => {
    setSelectedReservation({ ...selectedReservation, doctor: e.value });
  };

  const changeTreatment = (e) => {
    const patientTreatmentId = e.value ? e.value.id : "";
    setDropDownTreatment(e.value);
    selectedReservation({ ...reservation, patientTreatmentId });
  };

  const productOptions = products.map((product) => ({
    ...product,
    id: product._id,
  }));

  const submitted = false;
  const reservation = selectedReservation;

  return (
    <>
      <ReservationsTable
        onEdit={editReservation}
        onDelete={deleteReservation}
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
              optionLabel="patient"
              value={dropDownPatient}
              options={patientOptions}
              onChange={changeDropdownPatient}
              placeholder="Seleccionar"
            />
          </div>
          <div className="field">
            <label htmlFor="treatment">Tratamiento</label>
            <Dropdown
              id="patientTreatment"
              name="patientTreatment.treatment.name"
              onChange={changeTreatment}
              options={dropDownTreatmentValues}
              value={dropDownTreatment}
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
                onChange={onCalenderChange}
                inputMode="date"
                inline={false}
                placeholder="Coloca la fecha de reservación"
              />
              {submitted && !reservation.date && (
                <small className="p-invalid">la fecha es necesaria</small>
              )}
            </div>
          </div>
          <div className="formgrid grid">
            <div className="field col">
              <label htmlFor="amountpayable">Monto a pagar</label>
              <InputNumber
                id="amountPayable"
                value={reservation.amountPayable}
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
            <label htmlFor="percent">Porciento</label>
            <InputNumber
              id="percent"
              value={reservation.percent}
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
            <label className="mb-3">metodo de pago</label>
            <div className="formgrid grid">
              <div className="field-radiobutton col-6">
                <RadioButton
                  inputId="paymentType1"
                  name="paymentType"
                  value="tarjeta"
                  checked={reservation.paymentType === "Tarjeta"}
                />
                <label htmlFor="paymentType1">Tarjeta</label>
              </div>
              <div className="field-radiobutton col-6">
                <RadioButton
                  inputId="paymentType2"
                  name="paymentType"
                  value="efectivo"
                  checked={reservation.paymentType === "Efectivo"}
                />
                <label htmlFor="paymentType2">Efectivo</label>
              </div>
              <div className="field-radiobutton col-6">
                <RadioButton
                  inputId="paymentType2"
                  name="paymentType"
                  value="transferencia"
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
        </Dialog>
      )}
    </>
  );
};

export default Reservations;

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

const Reservations = () => {
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [doctors] = useDoctors();

  const editReservation = (reservation) => {
    setSelectedReservation(reservation);
  };

  const deleteReservation = (reservation) => {
    console.log(reservation);
  };

  const hideEditDialog = () => {
    setSelectedReservation(null);
  };

  const onCalenderChange = (event) => {
    event.preventDefault();
  };

  const findDoctor = () => {
    return doctors.find(
      (doctor) => doctor._id === selectedReservation?.doctor._id
    );
  };

  const submitted = false;
  const reservation = selectedReservation;
  const reservationDoctor = findDoctor();

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
          header="Reservation Details"
          modal
          className="p-fluid"
          onHide={hideEditDialog}
        >
          <div className="field">
            <label htmlFor="patient">Paciente</label>
            <InputText
              id="patient"
              value={reservation.patient.name}
            />
          </div>
          <div className="field">
            <label htmlFor="treatment">Tratamiento</label>
            <InputText
              id="treatment"
              value={reservation.patientTreatment.treatment.name}
            />
          </div>
          <div className="field">
            <label htmlFor="concept">Concepto</label>
            <InputText
              id="concept"
              value={reservation.concept}
              required
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
                  checked={reservation.paymentType === "tarjeta"}
                />
                <label htmlFor="paymentType1">Tarjeta</label>
              </div>
              <div className="field-radiobutton col-6">
                <RadioButton
                  inputId="paymentType2"
                  name="paymentType"
                  value="efectivo"
                  checked={reservation.paymentType === "efectivo"}
                />
                <label htmlFor="paymentType2">Efectivo</label>
              </div>
              <div className="field-radiobutton col-6">
                <RadioButton
                  inputId="paymentType2"
                  name="paymentType"
                  value="transferencia"
                  checked={reservation.paymentType === "transferencia"}
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
              value={reservationDoctor}
            />
          </div>
        </Dialog>
      )}
    </>
  );
};

export default Reservations;

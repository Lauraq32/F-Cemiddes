import { useState, useMemo } from "react";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import classNames from "classnames";

import { useDoctors } from "../../hooks/useDoctors";

const EarningsPage = () => {
  const [doctors] = useDoctors();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [earnings, setEarnings] = useState(null);
  // form fields
  const [doctor, setDoctor] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endingDate, setEndingDate] = useState("");

  const doctorsOpts = useMemo(
    () => doctors.map(doctor => ({ value: doctor._id, label: doctor.name })),
    [doctors]
  );

  const submit = event => {
    event.preventDefault();
    setSubmitted(true);

    if (!doctor || !startDate || !endingDate) {
      return;
    }

    setLoading(true);
    // console.log(doctor);
    // console.log(startDate);
    // console.log(endingDate);
    setTimeout(() => {
      setEarnings({ percent: 20 });
      setLoading(false);
    }, 1000);
  };
  return (
    <div className="grid clients-table">
      <div className="col-12">
        <div className="card">
          <h4 className="mb-4">Ganancias</h4>
          <form onSubmit={submit} className="formgroup-inline d-flex">
            <div className="field">
              <label htmlFor="doctor" className="p-sr-only">
                Doctor/ra
              </label>
              <Dropdown
                id="doctor"
                value={doctor}
                onChange={e => setDoctor(e.value)}
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
                onChange={e => setStartDate(e.value)}
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
                onChange={e => setEndingDate(e.value)}
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
                  style={{ "fontSize": "2rem" }}
                ></i>
              </p>
            )}
            {!loading && earnings && <p>Porcentaje: {earnings.percent}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsPage;

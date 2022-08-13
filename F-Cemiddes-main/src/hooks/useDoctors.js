import { useState, useEffect } from 'react'
import api from '../service/api'

const useDoctors = () => {
  const [doctors, setDoctors] = useState([]);


  useEffect(() => {
      const formatDoctor = doctor => ({
        id: doctor._id,
        ...doctor 
      })

    const fetchData = async () => {
      const response = await api.get('doctors').catch(console.error)
      const doctors = response.data.doctors;
      setDoctors(doctors.map(formatDoctor))
    }

    fetchData();
  }, [])

  return [doctors, setDoctors];
}

export default useDoctors;
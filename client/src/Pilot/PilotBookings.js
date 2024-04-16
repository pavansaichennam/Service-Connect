import React, { useState, useEffect } from 'react';
import BasicTable from '../Table1';
import './PilotBookings.css';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

function SPBookings() {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState([]);
  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    const serviceProviderId = localStorage.getItem('userId');
    const url = `http://localhost:3001/all/getActiveSPBookings/${serviceProviderId}`;
    axios.get(url).then(res => {
      setBookingData(res.data);
      setShowSpinner(false);
    }).catch(error => {
      console.error('Error fetching the bookings:', error);
      setShowSpinner(false);
    });
  }, []);

  const handleStatusChange = (id, newStatus) => {
    axios.patch(`http://localhost:3001/all/updateBookingStatus/${id}`, { status: newStatus })
      .then(() => {
        const updatedData = bookingData.map(item => item._id === id ? { ...item, status: newStatus } : item);
        setBookingData(updatedData);
      })
      .catch(error => console.error('Error updating booking status:', error));
  };

  return (
    <div className='container-fluid bookDrone'>
      <div className='row bookDroneTable'>
        {showSpinner && <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>}
        {!showSpinner && (
          <BasicTable rows={bookingData} handleStatusChange={handleStatusChange} />
        )}
      </div>
      <div className='row'>
        <button onClick={() => navigate('/Pilot')} className="buttonPayment">Back to dashboard</button>
      </div>
    </div>
  );
}

export default SPBookings;
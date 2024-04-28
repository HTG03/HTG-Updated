import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './EventDetail.css';
import "react-toastify/dist/ReactToastify.css";
import {ToastContainer, toast} from 'react-toastify';
import { Link } from 'react-router-dom'
import party from './party.jpeg';
import annual from './annual.jpg';
import seminar from './seminar.jpg';
import fresher from './freshers.jpg';
import farewell from './farewell.jpg';
import art from './art.jpg';
import corporate from './corporate.png';

const EventDetail = () => {
  const [showForm, setShowForm] = useState(false);

  const toastOption={
    position: 'bottom-right',
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
};

  const toggleForm = () => {
    setShowForm(!showForm);
    if (!showForm) {
      document.body.style.position = 'fixed';
    } else {
      document.body.style.position = 'static';
    }
  };

  const [randomImages] = useState([party, annual, seminar, fresher, farewell, art, corporate]);
  const [event, setEvent] = useState([]);
  const { id } = useParams();

  const getEvent = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/event/eventDetail/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        }
      });
      const json = await response.json();
      setEvent(json);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      getEvent();
    }
  }, []);

  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * randomImages.length);
    return randomImages[randomIndex];
  };

  const closeForm = () => {
    setShowForm(false);
    document.body.style.position = 'static';
  };

  // const handleSubmit = (event) => {
  //   event.preventDefault();
    
  // };

  //Event Registration
  const [credentials, setCredentials] = useState({studentname: '', studentrollno: '', studentemail: '', studentmobile: '', eventname: ''});

  const handleInputChange = (e) => {
    setCredentials({...credentials,[e.target.name]: e.target.value })
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    // Check if any field is empty
    if (!credentials.studentname || !credentials.studentrollno || !credentials.studentemail || !credentials.studentmobile || !credentials.eventname ) {
      toast.error('All fields are mandatory. Please fill in all the fields.');
      return;
     }
    const response = await fetch("http://localhost:5000/api/event/registerEvent",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({studentname: credentials.studentemail, studentrollno: credentials.studentrollno, studentemail: credentials.studentemail, studentmobile: credentials.studentmobile, eventname: credentials.eventname})  
    });
    const json = await response.json();
    console.log(json); 
    toast.success("Event is saved in database.");
    setShowForm(false);
    window.location.reload();
    window.scrollTo(0,0);
  };

  

  return (
    <div>
        <div className='ED-container'>
          <br />
          <div className='ed-img-div'>
            <img src={getRandomImage()} className='ed-img' alt='Event-detail-Pic' />
          </div>
          <br />
          <div className='event-name'>
            <h3><i>{event.eventname}</i></h3>
          </div>
          <br />
          <div className='event-info '>
            <div className='event-time'>
              <h5>Date:&nbsp;<span className='e-t'>{event.eventdate}</span></h5>
              <h5>Time:&nbsp;<span className='e-t'>{event.eventtime}</span></h5>
            </div>
            <div className='e-con'>
              <h5>Phone:&nbsp;<span className='e-t'>+91-{event.eventPhone}</span></h5>
              <h5>Email:&nbsp;<span className='e-t'>&nbsp;{event.eventemail}</span></h5>
            </div>
          </div>
          <div className='event-d-d'>
            <p>{event.eventdescription}</p>
          </div>
          {localStorage.getItem('token')?<div>
          <div className='r-btn'>
            <button className="r-b" onClick={toggleForm}>Register</button>
            <button className='b-b'>Back</button>
          </div> 

          <div className="container">
            {showForm && (
              <div className="registration-form">
                <button className="close-btn" onClick={closeForm}>X</button>
                <h3 className='text-center mb-3'>Event Registration Form</h3>
                <form onSubmit={handleSubmit}>
                  <div className="form-group reg-form-label">
                    <label htmlFor="name">Name</label>
                    <input type="text" className="form-control" id="name" name="studentname" value={credentials.studentname} onChange={handleInputChange} placeholder="Enter your name" required />
                  </div>
                  <div className="form-group reg-form-label">
                    <label  htmlFor="rollNo">Roll No</label>
                    <input type="text" className="form-control" id="rollNo" name="studentrollno" rows="2" value={credentials.studentrollno} onChange={handleInputChange} placeholder="Enter your roll number" required />
                  </div>
                  <div className="form-group reg-form-label">
                    <label htmlFor="email">Email</label>
                    <input type="email" className="form-control" id="email" name="studentemail" value={credentials.studentemail} onChange={handleInputChange} placeholder="Enter your email" required />
                  </div>
                  <div className="form-group reg-form-label">
                    <label htmlFor="mobile">Mobile</label>
                    <input type="tel" className="form-control" id="mobile" placeholder="Enter your mobile number" name="studentmobile" value={credentials.studentmobile} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group reg-form-label">
                    <label htmlFor="interestedEvent">Interested Event</label>
                    <input type="text" className="form-control" id="interestedEvent" name="eventname" value={credentials.eventname} onChange={handleInputChange} placeholder="Enter the event you're interested in" required />
                  </div>
                  <div className='r-btn'>
                    <button type='submit' className="r-b">Submit</button>
                  </div>
                </form>
              </div>
            )}
          </div>
          </div>:<div className="container mt-5">
              <div className='create-btn'><Link to="/CllgLogin"><button>Register</button></Link></div>
            </div>}
        </div>
        <ToastContainer {...toastOption}/>
    </div>
  );
}

export default EventDetail;
import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import moment from 'moment';
import { collection, query, onSnapshot, addDoc,doc,getDoc } from 'firebase/firestore';
import { db } from './firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


export const FilterSearch = () => {
  const [filter, setFilter] = useState('all');
  const journalEntriesref = collection(db,  "journalEntries")
  const [docs, loading, error] = useCollectionData (journalEntriesref);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });


  function numberWithCommas(x) {
    return ((Math.round(x * 100) / 100).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const filteredDocs = docs?.filter((doc) => {
  if (filter === 'all') return true;
  if (filter === 'approved') return doc.approved === 'approved';
  if (filter === 'rejected') return doc.approved === 'rejected';  
  if (filter === 'pending') return doc.approved === 'pending';
  return false;
});



const filteredDocsByDate = filteredDocs?.filter((doc) => {
    const docDate = moment(doc.dateTime.toDate().toLocaleString);
    return docDate.isBetween(moment(dateRange.startDate), moment(dateRange.endDate), 'day', '[]');
  });
 
 

  const rangeFilteredDocs = filteredDocs?.filter((doc) => {
    if (!startDate || !endDate) return true;
    let date = moment(doc.dateTime);
    return date.isBetween(startDate, endDate, null, '[]');
  });
 

  

  function TableWithFilter() {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Account ID</th>
            <th>Account Name</th>
            <th>Acceptance Status</th>
            <th>Date</th>
            <th>Post Reference</th>
          </tr>
        </thead>
        <tbody>
          {filteredDocs?.map((doc)=>(
            <tr key={Math.random()}>
              <td>{doc.jeNumber}</td>
              <td>{doc.category}</td>
              <td>{doc.user}</td>
              <td>{doc.approved}</td>
              <td>{doc.dateTime.toDate().toLocaleString()}</td> 
              <td>{doc.pr}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }

 return (
    <div>
       <div>
        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
        <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
      </div>
      <div>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('approved')}>Approved</button>
        <button onClick={() => setFilter('rejected')}>Rejected</button>
        <button onClick={() => setFilter('pending')}>Pending</button>
      </div>
     
      <TableWithFilter />
    </div>
  );
};
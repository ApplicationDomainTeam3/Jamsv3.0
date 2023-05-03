import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import moment from 'moment';
import { collection, query, onSnapshot, addDoc, doc, getDoc } from 'firebase/firestore';
import { db } from './firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export const FilterSearch = () => {
  const [filter, setFilter] = useState('all');
  const journalEntriesRef = collection(db, 'journalEntries');
  const [docs, loading, error] = useCollectionData(journalEntriesRef);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  function numberWithCommas(x) {
    return ((Math.round(x * 100) / 100).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const filteredEntriesByDate = docs?.filter(doc => {
    if (!startDate || !endDate) return true;
    const docDate = moment(doc.dateTime.toDate());
    return docDate.isBetween(moment(startDate), moment(endDate), 'day', '[]');
  });

  const filteredEntriesByApproval = filteredEntriesByDate?.filter(doc => {
    if (filter === 'all') return true;
    return doc.approved === filter;
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
          {filteredEntriesByApproval?.map(doc => (
            <tr key={Math.random()}>
              <td>{doc.jeNumber}</td>
              <td>{doc.category}</td>
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
        <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
        <DatePicker selected={endDate} onChange={date => setEndDate(date)} />
      </div>
      <div>
        <button className="custom-button"  onClick={() => setFilter('all')}>All</button>
        <button className="custom-button" onClick={() => setFilter('approved')}>Approved</button>
        <button className="custom-button"  onClick={() => setFilter('rejected')}>Rejected</button>
        <button className="custom-button"  onClick={() => setFilter('pending')}>Pending</button>
      </div>
      <TableWithFilter />
    </div>
  );
};

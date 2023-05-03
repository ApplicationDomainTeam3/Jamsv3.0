import { IoIosCreate } from 'react-icons/io';
import { ImEye } from 'react-icons/im';
import { Link } from 'react-router-dom';
import {FaBalanceScaleLeft} from 'react-icons/fa'
import React, { useState } from 'react';
export const AccountantHome = (props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [journalEntries, setJournalEntries] = useState([]);
  const [filteredEntryIds, setFilteredEntryIds] = useState([]);
  const [searchByDate, setSearchByDate] = useState(false);

  const handleSearch = () => {
    const matchingEntry = journalEntries.find((entry) => {
      const lowerQuery = searchQuery.toLowerCase();
      const lowerUsername = entry.username.toLowerCase();
      const dateString = entry.date.toLowerCase();
      if (searchByDate) {
        return lowerUsername.includes(lowerQuery) || dateString.includes(lowerQuery);
      } else {
        return lowerUsername.includes(lowerQuery);
      }
    });
  
    if (matchingEntry) {
      alert(`The information you entered matches Journal #${matchingEntry.id}`);
    } else {
      alert('No journal entries found.');
    }
  };
  
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleToggle = () => {
    setSearchByDate(!searchByDate);
  };
    return (
        <>
         <div className='dash-container'>
         <h1>Accountant Dashboard</h1>
            <div className="dashbox">
        
            <Link to="viewaccounts">
                <div className = "card">
                    <h3>View<br></br> Accounts</h3>
                    <br></br>
                    <ImEye size={50}/>
                </div>
            </Link>
            <Link to="viewje">
                <div className = "card">
                    <h3>View<br></br>Journal Entries</h3>
                    <br></br>
                    <ImEye size={50}/>
                </div>
            </Link>
            </div>
            <div className="dashbox">
            <Link to="createje">
                <div className = "card">
                    <h3>Create<br></br>Journal Entries</h3>
                    <br></br>
                    < IoIosCreate size={50}/>
                </div>
            </Link>
   <div className="card">
            <h3>Search Journal Entries</h3>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <label>
              <input
                type="checkbox"
                checked={searchByDate}
                onChange={handleToggle}
              />
              Search by date
            </label>
            <button onClick={handleSearch}>Search</button>
            {filteredEntryIds.length > 0 ? (
              <div>
                {filteredEntryIds.map((id) => (
                  <div key={id}>Journal entry {id}</div>
                ))}
              </div>
            ) : (
              <div>.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
            <Link to="financialreport">
                    <div className = "card">
                        <h3>Financial</h3>
                        <h3>Report</h3>
                        <br></br>
                        <FaBalanceScaleLeft size={50}/>
                    </div>
                </Link>
      
  
          
         
        
      
        
 


import React from 'react';

export default function MainNv() {
  return (
    <div style={{ width: "150px", height: "150px", backgroundColor: "#00457e"  }}>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={listItemStyle}>Dashboard</li>
        <li style={listItemStyle}>Profile</li>
        <li style={listItemStyle}>Settings</li>
      </ul>
    </div>
  );
}

const listItemStyle = {
  marginTop:'10px',
  marginBottom: '7px',
  marginLeft:'5px',
  color: '#F5F5F5',
  padding: '7px 0',
  borderBottom: '1px solid #F5F5F5',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
};

listItemStyle[':hover'] = {
  backgroundColor: '#083d63',
};

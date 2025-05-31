import React, { useEffect } from 'react';


const JSmolViewer = ({ pdbFile }) => {
 useEffect(() => {
   if (!pdbFile) return;


   const loadScript = (src) =>
     new Promise((resolve) => {
       const script = document.createElement('script');
       script.src = src;
       script.onload = resolve;
       document.head.appendChild(script);
     });


   const loadAll = async () => {
     await loadScript('https://code.jquery.com/jquery-3.6.0.min.js');
     await loadScript('/jsmol/JSmol.min.js');
     setTimeout(initializeViewer, 100);
   };


   const initializeViewer = () => {
     const container = document.getElementById('jsmol-container');
     if (!container || container.offsetWidth === 0 || container.offsetHeight === 0) {
       setTimeout(initializeViewer, 100);
       return;
     }


     const Info = {
       width: '100%',
       height: '100%',
       j2sPath: '/jsmol/j2s',
       use: 'HTML5',
       script: `load ${pdbFile}; zoom 100; spin on;`,
       disableInitialConsole: true,
     };


     container.innerHTML = window.Jmol.getAppletHtml('jmolApplet0', Info);
   };
   loadAll();
}, [pdbFile]);

return (
  <div
    id="jsmol-container"
   
    style={{
      width: '100%',
      height: '70vh',
      minHeight: '500px',
      backgroundColor: '#f5f7fa',
      border: '2px solid #3a7bd5',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}
  />
);
};


export default JSmolViewer;

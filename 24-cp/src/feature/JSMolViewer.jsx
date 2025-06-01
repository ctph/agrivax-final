// import React, { useEffect } from 'react';

// const JSmolViewer = ({ pdbFile }) => {
//  useEffect(() => {
//    if (!pdbFile) return;


  //  const loadScript = (src) =>
  //    new Promise((resolve) => {
  //      const script = document.createElement('script');
  //      script.src = src;
  //      script.onload = resolve;
  //      document.head.appendChild(script);
  //    });


  //  const loadAll = async () => {
  //     await loadScript('https://code.jquery.com/jquery-3.6.0.min.js');
  //     await loadScript('/jsmol/JSmol.min.js');
  //   //  setTimeout(initializeViewer, 100);
  //  };


//    const initializeViewer = () => {
//       const container = document.getElementById('jsmol-container');
//       if (!container || container.offsetWidth === 0 || container.offsetHeight === 0) {
//       //  setTimeout(initializeViewer, 100);
//       return;
//     }


//      const Info = {
//        width: '100%',
//        height: '100%',
//        j2sPath: '/jsmol/j2s',
//        use: 'HTML5',
//        script: `load ${pdbFile}; zoom 100; spin on;`,
//        disableInitialConsole: true,
//      };


//      container.innerHTML = window.Jmol.getAppletHtml('jmolApplet0', Info);
//    };
//    loadAll();
// }, [pdbFile]);

// return (
//   <div
//     id="jsmol-container"
   
//     style={{
//       width: '100%',
//       height: '70vh',
//       minHeight: '500px',
//       backgroundColor: '#f5f7fa',
//       border: '2px solid #3a7bd5',
//       borderRadius: '8px',
//       boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
//     }}
//   />
// );
// };


// export default JSmolViewer;


import React, { useEffect, useRef } from 'react';

const JSmolViewer = ({ pdbFile }) => {
  const viewerRef = useRef(null);

  useEffect(() => {
    if (!pdbFile || !window.Jmol) return;

    const initializeViewer = () => {
      if (!viewerRef.current) return;

      const { offsetWidth, offsetHeight } = viewerRef.current;
      if (offsetWidth === 0 || offsetHeight === 0) return;

      const Info = {
        width: offsetWidth,
        height: offsetHeight,
        j2sPath: process.env.PUBLIC_URL + '/jsmol/j2s',
        use: 'HTML5',
        script: `load ${pdbFile}; zoom 100; spin on;`,
        disableInitialConsole: true
      };

      viewerRef.current.innerHTML = window.Jmol.getAppletHtml('jmolApplet0', Info);
    };

    initializeViewer();

    const handleResize = () => {
      if (window.Jmol?._applets?.jmolApplet0 && viewerRef.current) {
        window.Jmol.resizeApplet(
          'jmolApplet0',
          viewerRef.current.offsetWidth,
          viewerRef.current.offsetHeight
        );
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [pdbFile]);

  return (
    <div
      ref={viewerRef}
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
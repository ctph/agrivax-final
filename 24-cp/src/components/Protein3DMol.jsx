import React, { useEffect, useRef } from "react";
import * as $3Dmol from "3dmol";

const Protein3DMol = ({
  pdbIdStructure,
  viewStyle,
  surfaceStyle,
  partialViewStyle,
  style,
  className,
}) => {
  const viewerRef = useRef(null);
  const viewerInstance = useRef(null); // Track 3Dmol viewer

  useEffect(() => {
    if (!viewerRef.current || !pdbIdStructure) return;

    const element = viewerRef.current;

    const tryInitViewer = () => {
      const width = element.clientWidth;
      const height = element.clientHeight;

      if (width === 0 || height === 0) {
        requestAnimationFrame(tryInitViewer);
        return;
      }

      const config = { backgroundColor: "white" };
      const viewer = $3Dmol.createViewer(element, config);
      viewer.clear();

      if (typeof pdbIdStructure === "string") {
        viewer.addModel(pdbIdStructure, "pdb");
      }

      if (viewStyle) viewer.setStyle(...viewStyle);
      if (surfaceStyle) viewer.addSurface(...surfaceStyle);
      if (partialViewStyle) viewer.setStyle(...partialViewStyle);

      viewer.zoomTo();
      viewer.render();

      viewerInstance.current = viewer;
    };

    tryInitViewer();

    // Clean up WebGL context on unmount
    return () => {
      if (viewerInstance.current) {
        viewerInstance.current.clear();
        viewerInstance.current = null;

        // Also force dispose of canvas if needed
        const canvas = viewerRef.current?.querySelector("canvas");
        if (canvas) {
          const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
          if (gl && typeof gl.getExtension === "function") {
            const loseCtx = gl.getExtension("WEBGL_lose_context");
            if (loseCtx) loseCtx.loseContext();
          }
        }
      }
    };
  }, [pdbIdStructure, viewStyle, surfaceStyle, partialViewStyle]);

  return (
    <div
      ref={viewerRef}
      className={className}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "300px",
        ...style,
      }}
    />
  );
};

export default Protein3DMol;


// import React, { useEffect, useRef } from "react";
// import * as $3Dmol from "3dmol";

// const Protein3DMol = ({
//   pdbId,                 // 4-char PDB ID
//   viewStyle,
//   surfaceStyle,
//   partialViewStyle,
//   style,
//   className,
// }) => {
//   const divRef   = useRef(null);   // <div> that holds the canvas
//   const viewer   = useRef(null);   // 3Dmol GLViewer
//   const roRef    = useRef(null);   // ResizeObserver

//   useEffect(() => {
//     if (!divRef.current || !pdbId) return;

//     /* 1 ▸ wait until the div has a positive size */
//     const init = () => {
//       if (!divRef.current.clientWidth || !divRef.current.clientHeight) {
//         requestAnimationFrame(init);
//         return;
//       }

//       /* 2 ▸ create viewer */
//       viewer.current = $3Dmol.createViewer(divRef.current, {
//         backgroundColor: "white",
//       });

//       /* 3 ▸ patch render(): skip frame if canvas is 0 × 0 */
//       const rawRender = viewer.current.render.bind(viewer.current);
//       viewer.current.render = () => {
//         if (divRef.current.clientWidth && divRef.current.clientHeight) {
//           rawRender();
//         }
//       };

//       /* 4 ▸ load PDB and apply styles */
//       $3Dmol.download(`pdb:${pdbId}`, viewer.current, {}, () => {
//         if (viewStyle)        viewer.current.setStyle(...viewStyle);
//         if (partialViewStyle) viewer.current.setStyle(...partialViewStyle);
//         if (surfaceStyle)     viewer.current.addSurface(...surfaceStyle);
//         viewer.current.zoomTo();
//         viewer.current.setSpin(true);   // ◂ keeps it continuously animating
//         viewer.current.render();
//       });

//       /* 5 ▸ auto-resize on layout changes */
//       const ro = new ResizeObserver(() => viewer.current.resize());
//       ro.observe(divRef.current);
//       roRef.current = ro;
//     };

//     init();

//     /* cleanup */
//     return () => {
//       roRef.current?.disconnect();
//       roRef.current = null;

//       viewer.current?.clear();
//       // lose the GL context to be extra safe
//       const canvas = divRef.current.querySelector("canvas");
//       const gl =
//         canvas?.getContext("webgl") || canvas?.getContext("experimental-webgl");
//       gl?.getExtension("WEBGL_lose_context")?.loseContext();

//       viewer.current = null;
//     };
//   }, [pdbId, viewStyle, surfaceStyle, partialViewStyle]);

//   return (
//     <div
//       ref={divRef}
//       className={className}
//       style={{
//         width:  "100%",
//         height: "100%",
//         minHeight: 300,
//         ...style,
//       }}
//     />
//   );
// };

// export default Protein3DMol;


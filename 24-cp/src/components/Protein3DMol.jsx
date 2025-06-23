// import React, { useEffect, useRef } from "react";
// import * as $3Dmol from "3dmol";

// const Protein3DMol = ({ pdbIdStructure, viewStyle, surfaceStyle, partialViewStyle, style, className }) => {
//   const viewerRef = useRef(null);

//   useEffect(() => {
//     if (!viewerRef.current || !pdbIdStructure) return;

//     const element = viewerRef.current;
//     const config = { backgroundColor: "white" };

//     const viewer = $3Dmol.createViewer(element, config);
//     viewer.clear();

//     // Handle string vs blob
//     if (typeof pdbIdStructure === "string") {
//       viewer.addModel(pdbIdStructure, "pdb");
//     } else {
//       console.warn("Invalid structure format:", pdbIdStructure);
//     }

//     if (viewStyle) viewer.setStyle(...viewStyle);
//     if (surfaceStyle) viewer.addSurface(...surfaceStyle);
//     if (partialViewStyle) viewer.setStyle(...partialViewStyle);

//     viewer.zoomTo();
//     viewer.render();
//   }, [pdbIdStructure, viewStyle, surfaceStyle, partialViewStyle]);

//   return <div ref={viewerRef} className={className} style={style} />;
// };

// export default Protein3DMol;


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

    // 🔥 Clean up WebGL context on unmount
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

import React, { useEffect, useRef } from "react";
import * as $3Dmol from "3dmol";

const Protein3DMol = ({ pdbIdStructure, viewStyle, surfaceStyle, partialViewStyle, style, className }) => {
  const viewerRef = useRef(null);

  useEffect(() => {
    if (!viewerRef.current || !pdbIdStructure) return;

    const element = viewerRef.current;
    const config = { backgroundColor: "white" };

    const viewer = $3Dmol.createViewer(element, config);
    viewer.clear();

    // Handle string vs blob
    if (typeof pdbIdStructure === "string") {
      viewer.addModel(pdbIdStructure, "pdb");
    } else {
      console.warn("Invalid structure format:", pdbIdStructure);
    }

    if (viewStyle) viewer.setStyle(...viewStyle);
    if (surfaceStyle) viewer.addSurface(...surfaceStyle);
    if (partialViewStyle) viewer.setStyle(...partialViewStyle);

    viewer.zoomTo();
    viewer.render();
  }, [pdbIdStructure, viewStyle, surfaceStyle, partialViewStyle]);

  return <div ref={viewerRef} className={className} style={style} />;
};

export default Protein3DMol;

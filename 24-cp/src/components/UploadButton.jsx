import React from 'react';
import { Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';


const UploadButton = () => {
 const handleFileUpload = (file) => {
   const reader = new FileReader();
   reader.onload = () => {
     const content = reader.result;
     localStorage.setItem("uploadedPdb", content);
     window.location.href = "/upload/view";
   };
   reader.readAsText(file);
   return false; // Prevent automatic upload
 };


 return (
   <Upload
     beforeUpload={handleFileUpload}
     showUploadList={false}
     accept=".pdb"
   >
<Button icon={<UploadOutlined />} type="primary">
       Upload PDB & View
     </Button>
   </Upload>
 );
};

export default UploadButton;
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';

const rightToolbar = ({ onExport }) => {
  return (
    <>
      <FileUpload mode="basic" accept="doc/*" maxFileSize={1000000} label="Importar" chooseLabel="Importar" className="mr-2 inline-block" />
      <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={onExport} />
    </>
  )
}

export default rightToolbar
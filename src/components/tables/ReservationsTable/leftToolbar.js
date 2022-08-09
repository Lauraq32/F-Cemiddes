import { Button } from 'primereact/button';

const leftToolbar = ({ onNew, onDelete, disabledNewBtn, disabledDeleteBtn }) => {
  return (
      <>
          <div className="my-2">
              <Button label="Nuevo" icon="pi pi-plus" className="p-button-success mr-2" onClick={onNew} disabled={disabledNewBtn} />
              <Button label="Borrar" icon="pi pi-trash" className="p-button-danger" onClick={onDelete} disabled={disabledDeleteBtn} />
          </div>
      </>
  )
}

export default leftToolbar
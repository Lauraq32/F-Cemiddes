import React from 'react';



const Dashboard = () => {

return (
    <div className="surface-ground px-4 py-5 md:px-6 lg:px-8">
        <div className="grid justify-content-around">
            <div className="col-12 md:col-6 lg:col-3 pt-3">
                <a href='/doctors'>
                    <div className="surface-card shadow-2 p-3 border-round">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <div className="text-800 font-medium ml-4 mt-3" style={{/* fontSize: '2rem'*/ }}>Comision</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '3rem'/*, height: '4.5rem'*/ }}>
                                <i className="pi pi-user-edit text-blue-500 dashboard-icon" style={{ fontSize: '2rem' }}></i>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
            
            <div className="col-12 md:col-6 lg:col-3 pt-3">
                <a href='/reservations'>
                    <div className="surface-card shadow-2 p-3 border-round">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <div className="text-800 font-medium ml-4 mt-3" style={{/* fontSize: '2rem'*/ }}>Reservaciones</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '3rem'/*, height: '4.5rem'*/ }}>
                                <i className="pi pi-id-card text-orange-500 dashboard-icon" style={{ fontSize: '2rem' }}></i>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
            
            <div className="col-12 md:col-6 lg:col-3 pt-3">
                <a href='/clients'>
                    <div className="surface-card shadow-2 p-3 border-round">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <div className="text-800 font-medium ml-4 mt-3" style={{/* fontSize: '2rem'*/ }}>Clientes</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '3rem'/*, height: '4.5rem'*/ }}>
                                <i className="pi pi-users text-cyan-500 dashboard-icon" style={{ fontSize: '2rem' }}></i>
                            </div>
                        </div>
                    </div>
                </a>
            </div>

            <div className="col-12 md:col-6 lg:col-3 pt-3">
                <a href='/treatment'>
                    <div className="surface-card shadow-2 p-3 border-round">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <div className="text-800 font-medium ml-4 mt-3" style={{/* fontSize: '2rem'*/ }}>Treatments</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '3rem'/*, height: '4.5rem'*/ }}>
                                <i className="pi pi-plus-circle text-orange-500 dashboard-icon" style={{ fontSize: '2rem' }}></i>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
            
            <div className="col-12 md:col-6 lg:col-3 pt-3">
                <a href='/cuotas'>
                    <div className="surface-card shadow-2 p-3 border-round">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <div className="text-800 font-medium ml-4 mt-3" style={{/* fontSize: '2rem'*/ }}>Cuotas</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-red-100 border-round" style={{ width: '3rem'/*, height: '4.5rem'*/ }}>
                                <i className="pi pi-user-plus text-purple-500 dashboard-icon" style={{ fontSize: '2rem' }}></i>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
            
            <div className="col-12 md:col-6 lg:col-3 pt-3">
                <a href='/products'>
                    <div className="surface-card shadow-2 p-3 border-round">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <div className="text-800 font-medium ml-4 mt-3" style={{/* fontSize: '2rem'*/ }}>Productos</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '3rem'/*, height: '4.5rem'*/ }}>
                                <i className="pi pi-shopping-cart text-purple-500 dashboard-icon" style={{ fontSize: '2rem' }}></i>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    </div>

);
}

export default React.memo(Dashboard);
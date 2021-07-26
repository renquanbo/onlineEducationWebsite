import { useEffect } from 'react';
import areaService from '../../../app/services/areaService';
import storage from '../../../app/services/storage';
import AppLayout from '../../../components/layout/AppLayout';



const ManagerDashboard = () => {

    useEffect(() => {
        async function fetchAreas() {
            const { data } = await areaService.getAreas();
            if(!!data) {
                storage.setAreas(data);
            }
        }
        fetchAreas();
    },[])

    return (
        <AppLayout>
            <h1>This is index page of manager dashboard</h1>
        </AppLayout>
    )
}

export default ManagerDashboard;
import { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import TermekKartya from './TermekKartya';

export default function TermekLista() {
    const [termekLista, setTermekLista] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/termekek');
                setTermekLista(response.data);
            }
            catch (error) {
                console.error('Hiba a termékek lekérésekor:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <h2>Termékek</h2>
            {termekLista.map((termek) => (
                <TermekKartya key={termek.id} termek={termek} />
            ))}

        </div>
    );
}
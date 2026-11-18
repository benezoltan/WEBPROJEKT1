import axios from 'axios';

//axios instance létrehozása a baseURL beállításával
const api = axios.create({  
    baseURL: 'http://localhost:3000',
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true, // Engedélyezi a cookie-k küldését a kérésekkel
});

// --- RESPONSE INTERCEPTOR ---
api.interceptors.response.use(
    (response) => {
        // Ha a válasz sikeres, csak simán továbbadjuk
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Ellenőrizzük, hogy 401-es (Unauthorized) hibát kaptunk-e, 
        // és hogy ezt a kérést még nem próbáltuk-e meg újrafrissíteni (_retry flag)
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Beállítjuk, hogy elkerüljük a végtelen hurok (loop) veszélyét

            try {
                // Meghívjuk a refresh tokent a szerveren
                // A böngésző a withCredentials miatt automatikusan csatolja a refresh token sütit is!
                await api.post('/users/refresh-token', {}, {
                    withCredentials: true
                });

                // Ha a frissítés sikeres volt, a szerver beállította az új Access Token sütit.
                // Megismételjük az eredeti, elbukott kérést az új sütivel!
                return api(originalRequest);

            } catch (refreshError) {
                // Ha a refresh token is lejárt vagy érvénytelen (pl. 403 Forbidden a szervertől),
                // akkor a felhasználó munkamenete véget ért. Kiléptetjük / átirányítjuk a loginra.
                console.error('A refresh token is lejárt vagy érvénytelen. Kérlek, jelentkezz be újra.');
                
                // Opcionális: Törölhetsz kliens oldali userstate-et, majd átirányítás:
                window.location.href = '/login'; 

                return Promise.reject(refreshError);
            }
        }

        // Ha bármilyen más hiba van (pl. 403, 404, 500), azt simán tovább dobjuk
        return Promise.reject(error);
    }
);

export default api;
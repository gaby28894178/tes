# TP Cripto – API y Frontend

Proyecto simple con backend Express y un frontend estático para interactuar con un contrato que expone `data()` (lectura) e `inc()` (incremento).

## Requisitos
- Node.js 18+
- `.env` con:
  - `RPC_URL` (por ejemplo, de Alchemy/Infura)
  - `PRIVATE_KEY` con fondos para pagar gas
- Para obtener `RPC_URL` se usó registro en `https://www.infura.io/` para crear el endpoint.

## Instalación y ejecución
```bash
npm install
npm run start
```
Servidor en `http://localhost:3000/`.

## Rutas del Backend
- `GET /data`
  - Obtiene el valor actual de `data` desde el contrato.
  - Ejemplo: `curl http://localhost:3000/data`
  - Respuesta: `{ "data": "<valor_uint256>" }`

- `POST /sumar`
  - Incrementa `data` llamando a `inc()` una o múltiples veces.
  - Body: `{ "amount": <entero_positivo> }`
  - Ejemplos:
    - `curl -X POST -H "Content-Type: application/json" -d "{\"amount\":1}" http://localhost:3000/sumar`
    - `curl -X POST -H "Content-Type: application/json" -d "{\"amount\":3}" http://localhost:3000/sumar`
  - Respuesta:
    - `amount = 1`: `{ "txHash": "0x..." }`
    - `amount > 1`: `{ "txHashes": ["0x...", "0x...", ...] }`

> Nota: No existe la ruta `/restar`; el contrato actual no soporta decrementos.

## Frontend
- Servido en `http://localhost:3000/`.
- Página: `public/index.html` muestra una tarjeta con:
  - Valor actual de `data` (cargado desde `/data`).
  - Input `amount` para elegir cuántas veces sumar.
  - Botón “Aumentar” que llama a `POST /sumar`.
- Script: `public/main.js`
  - Al cargar, lee `/data` y muestra el valor.
  - Al hacer clic en “Aumentar”, envía `{ amount }` a `/sumar` y vuelve a leer `/data`.
  - Logs en consola del navegador:
    - Al leer `data`: `[data] Estado actual: <valor>`
    - Al incrementar: `Estado actual (UI)`, `se suma: <amount>`, `esperado: <actual+amount>`
    - Tras actualizar: `Nuevo estado: <valor_actualizado>`

Para ver los logs, abrir DevTools en el navegador (F12) y la pestaña “Console”.

## Ver JSON de `data`
- Ruta directa: `http://localhost:3000/data`
- Muestra el estado actual en formato JSON: `{ "data": "<valor_uint256>" }`

## ABI utilizado
El backend usa un ABI JSON compatible con ethers v6, incluyendo:
```json
[
  {
    "inputs": [],
    "name": "data",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "inc",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
```

## Notas
- Si quieres soportar decremento en el futuro, se puede agregar `dec()` al contrato y adaptar el backend y la UI.
- Asegúrate de que `PRIVATE_KEY` tenga fondos en la red configurada por `RPC_URL`.# test_block
# test_block
# test_block
"# test_block" 

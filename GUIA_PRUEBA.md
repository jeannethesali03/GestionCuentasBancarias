# 📋 GUÍA DE PRUEBA - Gestión de Cuentas Bancarias

## Pasos para Probar la Aplicación Completa

### 1️⃣ Crear una Cuenta (Requisito 1: Gestión de Cuenta)
**Ubicación**: Panel Izquierdo → "Gestión de Cuentas"
1. Ingresa nombre: "Ana Pérez"
2. Ingresa saldo inicial: 500
3. Click en "Crear Cuenta"
✅ **Esperado**: Cuenta creada, aparece en lista, UUID generado

---

### 2️⃣ Realizar Depósito Menor a $1000 (Requisito 2a: Depósitos sin justificación)
**Ubicación**: Panel Derecho → "Realizar Depósito"
1. Selecciona la cuenta creada (click en "Ana Pérez" abajo)
2. Ingresa monto: 300
3. Click en "Depositar"
✅ **Esperado**:
- Saldo actualiza a $800
- No pide justificación
- Transacción registrada

---

### 3️⃣ Realizar Depósito Mayor a $1000 (Requisito 2b: Depósitos con justificación)
**Ubicación**: Panel Derecho → "Realizar Depósito"
1. Ingresa monto: 1500
2. Verifica que pida justificación (debe aparecer campo)
3. Ingresa justificación: "Ahorro mensual"
4. Click en "Depositar"
✅ **Esperado**:
- Saldo actualiza a $2300
- Requiere justificación (campo aparece automáticamente)
- Transacción registrada con justificación

---

### 4️⃣ Primer Retiro del Día (Requisito 3 & 4: Sin comisión primer retiro)
**Ubicación**: Panel Derecho → "Realizar Retiro"
1. Ingresa monto: 500
2. Verifica barra de progreso límite diario
3. Click en "Retirar"
✅ **Esperado**:
- Saldo: $1800
- Barra de progreso: 500/1000 (50%)
- Sin comisión ($1 no se cobra)
- Transacción de retiro registrada

---

### 5️⃣ Segundo Retiro del Día (Requisito 4: Comisión $1)
**Ubicación**: Panel Derecho → "Realizar Retiro"
1. Ingresa monto: 200
2. Verifica aviso "El próximo retiro tendrá una comisión de $1.00"
3. Click en "Retirar"
✅ **Esperado**:
- Saldo: 1800 - 200 - 1 = $1599
- Barra de progreso: 700/1000 (70%)
- Se cobra $1 de comisión
- Se registran 2 transacciones:
  - Retiro: 200
  - Comisión: 1

---

### 6️⃣ Verificar Límite Diario (Requisito 3: Límite $1000)
**Ubicación**: Panel Derecho → "Realizar Retiro"
1. Intenta retirar: 600
✅ **Esperado**:
- Error: "Límite diario excedido"
- Muestra: "Acumulado hoy: $700.00, Límite: $1000"
- Disponible: $300

---

### 7️⃣ Consultar Saldo (Requisito 5: Consulta de Saldo)
**Ubicación**: Panel Izquierdo → Tarjeta azul
✅ **Esperado**:
- Muestra saldo actual actualizado: $1599
- Muestra nombre titular
- Muestra ID de cuenta
- Se actualiza en tiempo real

---

### 8️⃣ Calcular Interés Simple (Requisito 6: I = C·r·t)
**Ubicación**: Panel Derecho → "Calcular Interés Simple"
1. Tasa Anual: 5
2. Período: 12
3. Verificar cálculo:
   - I = 1599 × (5/100) × (12/12) = 1599 × 0.05 × 1 = $79.95
4. Click en "Aplicar Interés"
✅ **Esperado**:
- Nuevo saldo: $1678.95
- Transacción de interés registrada
- Se muestra cálculo: 1599 × 5% × 1 año = $79.95

---

### 9️⃣ Historial de Transacciones (Requisito 7: Registro)
**Ubicación**: Panel Derecho Inferior → "Historial de Transacciones"
✅ **Esperado**: Tabla completa con:
- [ ] Depósito: 300 → Saldo: 800
- [ ] Depósito: 1500 (Ahorro mensual) → Saldo: 2300
- [ ] Retiro: 500 → Saldo: 1800
- [ ] Retiro: 200 → Saldo: 1599
- [ ] Comisión: 1 → Saldo: 1599
- [ ] Interés: 79.95 → Saldo: 1678.95

Cada uno con fecha/hora correcta

---

### 🔟 Estado de Cuenta Detallado (Requisito 8: Detalle mes)
**Ubicación**: Panel Derecho Inferior → "Estado de Cuenta Detallado"
1. Mes actual debe estar seleccionado
2. Tabla "Detalle de Transacciones" muestra todas las transacciones del mes
✅ **Esperado**: 6 transacciones listadas con fecha, tipo, monto

---

### 1️⃣1️⃣ Resumen del Período (Requisito 9: Resumen período)
**Ubicación**: Panel Derecho Inferior → "Estado de Cuenta Detallado" → Sección "Resumen del Período"
✅ **Esperado**:
- 📥 Total Depósitos: $1800.00
- 📤 Total Retiros: $700.00 ($500 + $200)
- 💸 Total Comisiones: $1.00
- 📊 Total Intereses: $79.95

---

### 1️⃣2️⃣ Resumen Global (Requisito 10: Saldo inicial/final)
**Ubicación**: Panel Derecho Inferior → "Estado de Cuenta Detallado" → Sección "Resumen Global"
✅ **Esperado**:
- Saldo Inicial: $500.00
- Saldo Final: $1678.95
- Total Movimientos: (Depósitos + Intereses - Retiros - Comisiones)

---

### 1️⃣3️⃣ Cambiar Mes (Requisito 8: Filtro mes/año)
**Ubicación**: Panel Derecho Inferior → "Estado de Cuenta Detallado"
1. Click en "Anterior" o "Siguiente"
2. Mes cambia a anterior/siguiente
✅ **Esperado**:
- Mes/Año actualiza
- Si no hay transacciones: "No hay transacciones en este período"

---

### 1️⃣4️⃣ Validaciones (Requisito 11: Manejo de reglas)
**Pruebas de excepción**:

#### a) Monto Negativo
```
Depósito: -100
❌ Error: "El monto debe ser un valor positivo"
```

#### b) Monto Cero
```
Retiro: 0
❌ Error: "El monto debe ser un valor positivo"
```

#### c) Retiro Mayor al Saldo
```
Retiro: 3000
❌ Error: "No hay suficiente saldo"
```

#### d) Exceder Límite Diario
```
Ya retiró $700, intenta retirar $400
❌ Error: "Límite diario excedido"
```

#### e) Depósito ≥$1000 sin Justificación
```
Depósito: $1000, sin justificación
❌ Error: "requieren justificación"
```

---

### 💾 Persistencia (localStorage)
1. Cierra la pestaña
2. Abre nuevamente
✅ **Esperado**: Todos los datos permanecen (localStorage)

---

## Checklist de Validación

- [ ] Gestión de cuenta: Crear, UUID, estado global
- [ ] Depósito < $1000: Sin justificación
- [ ] Depósito ≥ $1000: Con justificación obligatoria
- [ ] Retiro 1: Sin comisión, -$1 comisión en retiro 2
- [ ] Límite diario: $1000 acumulado
- [ ] Saldo disponible: No retirar más
- [ ] Interés: Fórmula I=C·r·t correcta
- [ ] Historial: Todas las transacciones
- [ ] Estado detalle: Mes/año filtrado
- [ ] Resumen periodo: Totales correctos
- [ ] Resumen global: Saldos inicial/final
- [ ] Persistencia: localStorage funciona

**SI TODO PASA: 100% REQUISITOS CUMPLIDOS ✅**

# **Parkio - Sistema de Gestión de Parqueaderos** 

---

## **Tabla de contenido**
1. [Introducción](#introducción)
2. [Características principales](#características-principales)
3. [Tecnologías utilizadas](#tecnologías-utilizadas)
4. [Instalación y configuración](#instalación-y-configuración)

---

## **Introducción**

**Parkio** está diseñado para optimizar y automatizar las operaciones de parqueaderos, ayudando a los administradores a gestionar clientes, empleados y el desempeño general del negocio. Su enfoque intuitivo y funcional asegura que cualquier usuario pueda operar el sistema con facilidad.

---

## **Características principales**

### 🕒 **Gestión de clientes por hora y mensuales**
- Registro rápido y sencillo para clientes por fracción (hora).
- Administración avanzada de clientes mensuales con envió de correos electrónicos para usuarios proximos a renovar el servicio.

### 👥 **Gestión de empleados y horarios**
- Control de empleados, roles y permisos.
- Creación de horarios personalizados.

### 📊 **Analíticas y reportes**
- Visualización de métricas clave del negocio mediante gráficas interactivas.
- Generación de reportes detallados de ingresos, ocupación y desempeño.

### 💡 **Otros beneficios**
- Interfaz responsiva para uso desde cualquier dispositivo.
- Seguridad robusta en el manejo de datos y autenticación de usuarios.

---

## **Tecnologías utilizadas**

### **Entorno de ejecución**
- [Bun](https://bun.sh/)

### **Frontend**
- [Next.js](https://nextjs.org/) 14  
- [Tailwind CSS](https://tailwindcss.com/)  

### **Backend**
- [Prisma ORM](https://www.prisma.io/)  
- [PostgreSQL](https://www.postgresql.org/)  

### **Autenticación**
- [Auth.js](https://authjs.dev/)  

---

## **Instalación y Configuración**

Sigue estos pasos para configurar y ejecutar **Parkio** en tu entorno local:

---

### 1️⃣ **Clonar el repositorio**
Utiliza el siguiente comando para clonar el proyecto desde GitHub:  
```bash
git clone https://github.com/JamesGalvis/Parkio.git
cd parkio
```

### 2️⃣ **Instalar dependencias**
Instala las dependencias necesarias para el proyecto con:  
```bash
bun install
```

### 3️⃣ **Configurar variables de entorno**
Crea un archivo .env en la raíz del proyecto con la siguiente configuración:  
```bash
# Base de datos
DATABASE_URL=tu_url_de_postgresql

# Autenticación
AUTH_SECRET=tu_secreto_de_autenticacion

# Url de redireccion por defecto de la autenticación
DEFAULT_LOGIN_REDIRECT=/

# API de envio de correos con Brevo
BREVO_API_KEY=tu_brevo_api_url
```

### 4️⃣ **Inicializar la base de datos**
Ejecuta los siguientes comandos para configurar la base de datos:  
```bash
bunx prisma generate
bunx prisma db push
```

### 5️⃣ **Ejecutar el proyecto**
Para iniciar un servidor local, usa el siguiente comando:  
```bash
bunx run dev
```
Accede al proyecto en tu navegador en:
```bash
http://localhost:3000
```

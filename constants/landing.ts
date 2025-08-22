import { PricingPlan } from "@/types/landing";
import {
  Users,
  ListChecks,
  BarChart2,
  Settings2,
  FileText,
  Bot,
} from "lucide-react";

export const navLinks = [
  { label: "Inicio", href: "#home" },
  { label: "Características", href: "#features" },
  // { label: "Precios", href: "#pricing" },
  { label: "FAQs", href: "#faqs" },
  { label: "Contacto", href: "#contact" },
];

export const features = [
  {
    title: "Gestión de clientes",
    description:
      "Registra y administra clientes mensuales y por hora de forma sencilla.",
    Icon: Users,
  },
  {
    title: "Historial de actividades",
    description:
      "Consulta todos los movimientos realizados durante la jornada: registros, ediciones y eliminaciones, con trazabilidad por usuario.",
    Icon: ListChecks,
  },
  {
    title: "Reportes inteligentes",
    description:
      "Exporta datos en Excel y obtén resúmenes automáticos con IA para tomar mejores decisiones.",
    Icon: FileText,
  },
  {
    title: "Configuración personalizada",
    description:
      "Configura tipos de vehículos, tipos de clientes y tarifas específicas según cada caso.",
    Icon: Settings2,
  },
  {
    title: "Analíticas visuales",
    description:
      "Visualiza ingresos, ocupación y rendimiento del parqueadero mediante gráficas interactivas.",
    Icon: BarChart2,
  },
  {
    title: "Asistente con IA",
    description:
      "Resuelve dudas frecuentes y obtén ayuda sobre el sistema en tiempo real con un asistente virtual.",
    Icon: Bot,
  },
];

export const pricingPlans: PricingPlan[] = [
  {
    title: "Básico",
    price: "$49.000",
    billed: "COP / mes",
    isMostPopular: false,
    list: {
      items: [
        { title: "Registro de clientes por hora y mensual" },
        { title: "Impresión de tickets" },
        { title: "Configuración de tarifas" },
        { title: "Reportes básicos en Excel" },
        { title: "Acceso para hasta 5 personas de tu personal" },
        { title: "Multiusuario y control por roles" },
      ],
    },
  },
  {
    title: "Estándar",
    price: "$79.000",
    billed: "COP / mes",
    isMostPopular: true,
    list: {
      items: [
        { title: "Todo lo del plan Básico" },
        { title: "Reportes avanzados y exportación en Excel" },
        { title: "Analíticas de ingresos por cliente" },
        { title: "Acceso para hasta 10 personas de tu personal" },
        { title: "Resumen inteligente de reportes con IA" },
        { title: "Panel de estadísticas personalizado" },
        { title: "Soporte vía WhatsApp y correo" },
        { title: "Asistente virtual con IA para administración" },
      ],
    },
  },
  {
    title: "Avanzado",
    price: "$119.000",
    billed: "COP / mes",
    isMostPopular: false,
    list: {
      items: [
        { title: "Todo lo del plan Estándar" },

        { title: "Copias de seguridad automáticas" },
        { title: "Gestión de múltiples sedes" },
        { title: "Acceso ilimitado para tu personal" },
        { title: "Proyecciones de ocupación y rendimiento" },
        { title: "Soporte prioritario" },
      ],
    },
  },
];

export const faqs = [
  {
    title: "¿Puedo gestionar varias sedes desde una sola cuenta?",
    answer:
      "La gestión de múltiples sedes está disponible únicamente en el plan Avanzado. Con este plan, puedes administrar todos tus parqueaderos desde una sola plataforma y controlar el acceso de tu personal en cada sede.",
  },
  {
    title: "¿Cuántas personas de mi personal pueden acceder al sistema?",
    answer:
      "Depende del plan. El plan Básico permite hasta 5 personas de tu personal; los planes Estándar y Avanzado no tienen límite de usuarios.",
  },
  {
    title: "¿Puedo personalizar las tarifas y los tipos de clientes?",
    answer:
      "Sí, el sistema te permite configurar diferentes tipos de clientes, vehículos y tarifas según las necesidades de tu negocio.",
  },
  {
    title: "¿El sistema genera reportes de ingresos y estadísticas?",
    answer:
      "Por supuesto. Puedes acceder a reportes detallados y estadísticas para tomar decisiones informadas y optimizar tu operación.",
  },
  {
    title: "¿Es posible imprimir tickets de ingreso y salida?",
    answer:
      "Sí, la aplicación permite la impresión rápida de tickets tanto para clientes por hora como mensuales.",
  },
  {
    title: "¿Qué tipo de soporte recibo según el plan contratado?",
    answer:
      "El plan Básico incluye soporte por correo. Los planes superiores ofrecen soporte prioritario y atención por WhatsApp.",
  },
];

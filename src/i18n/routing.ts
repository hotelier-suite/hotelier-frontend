import { defineRouting } from "next-intl/routing";

export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/login": {
      en: "/login",
      es: "/iniciar-sesion",
    },
    "/forgot-password": {
      en: "/forgot-password",
      es: "/recuperar-contrasena",
    },
    "/register": {
      en: "/register",
      es: "/registro",
    },
    "/reservations": {
      en: "/reservations",
      es: "/reservaciones",
    },
    "/my-reservations": {
      en: "/my-reservations",
      es: "/mis-reservaciones",
    },
    "/room-board": {
      en: "/room-board",
      es: "/tablero-habitaciones",
    },
    "/room-service": {
      en: "/room-service",
      es: "/servicio-habitacion",
    },
    "/guests": {
      en: "/guests",
      es: "/huespedes",
    },
    "/guest-requests": {
      en: "/guest-requests",
      es: "/solicitudes-huespedes",
    },
    "/housekeeping": {
      en: "/housekeeping",
      es: "/limpieza",
    },
    "/restaurant": {
      en: "/restaurant",
      es: "/restaurante",
    },
    "/events": {
      en: "/events",
      es: "/eventos",
    },
    "/recreation": {
      en: "/recreation",
      es: "/recreacion",
    },
    "/billing": {
      en: "/billing",
      es: "/facturacion",
    },
    "/inventory": {
      en: "/inventory",
      es: "/inventario",
    },
    "/staff": {
      en: "/staff",
      es: "/personal",
    },
    "/attendance": {
      en: "/attendance",
      es: "/asistencia",
    },
    "/parking": {
      en: "/parking",
      es: "/estacionamiento",
    },
    "/parking-lot": {
      en: "/parking-lot",
      es: "/lote-estacionamiento",
    },
    "/maintenance": {
      en: "/maintenance",
      es: "/mantenimiento",
    },
    "/reports": {
      en: "/reports",
      es: "/reportes",
    },
    "/settings": {
      en: "/settings",
      es: "/configuracion",
    },
    "/users": {
      en: "/users",
      es: "/usuarios",
    },
    "/audit": {
      en: "/audit",
      es: "/auditoria",
    },
    "/profile": {
      en: "/profile",
      es: "/perfil",
    },
  },
});

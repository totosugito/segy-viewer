import AppLogo from "@/assets/app/well-perfo.png";
export const APP_CONFIG = {
  prefixStore: "cer",
  isDev: false,
  dayFormat: "yyyy-MM-dd",
  app: {
    name: "Cerebro",
    description: "Waviv AI",
    logo: AppLogo,
    version: "1.0.0",
  },
  demoUser: {
    email: "",
    password: "",
  },
  path: {
    defaultPublic: "/login",
    defaultPrivate: "/segy-list",
  }
}
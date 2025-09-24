const APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL
const APP_URL_V1 = APP_BASE_URL + "/api/v1"

export const AppApi = {
  auth: {
    login: APP_BASE_URL + "/api/auth/sign-in-email",
  },
}

export const AppRoute = {
  dataManagement: {
    segyList: {
      url: "/segy-list",
      breadcrumb: [
        {title: "Dashboard", ulr: "/"}
      ]
    },
    segyViewer: {
      url: "/segy-viewer",
      breadcrumb: [
        {title: "SEGY List", url: "/segy-list"},
        {title: "SEGY Viewer", url: "/segy-viewer"}
      ]
    },
    lasList: {
      url: "/las-list",
      breadcrumb: [
        {title: "Dashboard", ulr: "/"}
      ]
    },
    lasViewer: {
      url: "/las-viewer",
      breadcrumb: [
        {title: "LAS List", url: "/las-list"},
        {title: "LAS Viewer", url: "/las-viewer"}
      ]
    }
  },
}
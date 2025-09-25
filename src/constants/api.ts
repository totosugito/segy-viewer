const APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL
const APP_URL_V1 = APP_BASE_URL + "/api"

export const AppApi = {
  auth: {
    login: APP_BASE_URL + "/api/auth/sign-in-email",
  },
  seismicData: {
    segyList: APP_URL_V1 + "/seismic-data/segy/list",
    segyRead: APP_URL_V1 + "/seismic-data/segy/read",
    lasList: APP_URL_V1 + "/seismic-data/las/list",
    lasRead: APP_URL_V1 + "/seismic-data/las/read",
  }
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
  ragFiles: {
    ragFileList: {
      url: "/rag-files",
      breadcrumb: [
        {title: "Dashboard", ulr: "/"}
      ]
    },
    ragFilesChat: {
      url: "/rag-files/chat",
      breadcrumb: [
        {title: "RAG Files", url: "/rag-files/list"},
        {title: "RAG Files Chat", url: "/rag-files/chat"}
      ]
    }
  },
}
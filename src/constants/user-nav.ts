import {TbFileReport} from "react-icons/tb";
import {AiOutlineFileSearch} from "react-icons/ai";
import {TbFileSpark} from "react-icons/tb";
import {AppRoute} from "@/constants/api";

export const AdminNav = {
  user: {},
  teams: {},
  navGroups: [
    {
      title: "Data Management",
      items: [
        {
          title: "SEGY List",
          url: AppRoute.dataManagement.segyList.url,
          icon: AiOutlineFileSearch,
        },
        {
          title: "LAS List",
          url: AppRoute.dataManagement.lasList.url,
          icon: TbFileSpark,
        },
      ],
      permitUser: true,
    },
    {
      title: "RAG Files",
      items: [
        {
          title: "File List",
          url: AppRoute.ragFiles.ragFileList.url,
          icon: AiOutlineFileSearch,
        },
      ]
    }
  ]
}

export const UserNav = {
  ...AdminNav,
  // navGroups: AdminNav.navGroups.filter(group => group.permitUser)
}
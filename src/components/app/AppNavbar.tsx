import React, {useState} from 'react';
import {SidebarTrigger} from '@/components/ui/sidebar';
import {Separator} from '@/components/ui/separator';
import {ThemeToggle} from '@/components/custom/components/ThemeToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {MdLogout} from "react-icons/md";
import {useTranslation} from "react-i18next";
import {Button} from "@/components/ui/button";
import {FaRegUser} from "react-icons/fa";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Breadcrumbs, DialogModal, ModalProps} from "@/components/custom/components";
import {useAuthStore} from "@/stores/useAuthStore";

type Props = {
  title?: React.ReactNode;
}

export default function AppNavbar({title, ...props}: Props) {
  const {t} = useTranslation();
  const [confirmationModal, setConfirmationModal] = useState<ModalProps | null>(null);
  const user = useAuthStore((state) => state?.user ?? null);

  const onLogoutClick = () => {
    setConfirmationModal({
      title: t("dialog.logOutTitle"),
      desc: t("dialog.logOutDesc"),
      textConfirm: t("shared.logout"),
      textCancel: t("shared.cancel"),
      onConfirmClick: () => {
      },
      onCancelClick: () => setConfirmationModal(null),
    })
  }

  return (
    <header
      className='sticky top-0 py-1 bg-muted flex h-12 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-10 rounded-l-lg'>
      <div className='flex items-center gap-2 pl-2 flex-1'>
        <SidebarTrigger variant={"outline"} onClick={() => {}}/>
        <Separator orientation={"vertical"} className={'h-6'} style={{height: "20px"}}/>
        {/*<Breadcrumbs />*/}
        {title}
      </div>

      <div className='flex items-center gap-2 px-4'>
        <ThemeToggle/>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size={"icon"} className='rounded-full'>
              <FaRegUser/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className={"flex flex-row gap-2 items-center"}>
                <Avatar className='h-8 w-8 rounded-full'>
                  <AvatarImage
                    src={user?.image || ''}
                    alt={user?.name || ''}
                  />
                  <AvatarFallback className='rounded-lg text-background font-bold bg-chart-3 shadow-md'>{user ? user?.user?.name?.substring(0, 2)?.toUpperCase() : "U"}</AvatarFallback>
                </Avatar>
                <div className={"flex flex-col"}>
                  <div className='truncate font-semibold'>{user?.user?.name ?? ""}</div>
                  <div className={'text-xs text-muted-foreground'}>{user?.user?.email ?? ""}</div>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator/>
            {/*<DropdownMenuItem className='flex items-center gap-2' onClick={()=> {}}>*/}
            {/*  <TbLockPassword/> {t("shared.changePassword")}*/}
            {/*</DropdownMenuItem>*/}
            {/*<DropdownMenuSeparator/>*/}
            <DropdownMenuItem onClick={onLogoutClick}><MdLogout/> Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {confirmationModal && <DialogModal modal={confirmationModal}/>}
    </header>
  );
}
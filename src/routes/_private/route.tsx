import {createFileRoute, Outlet} from '@tanstack/react-router'
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import AppSidebar from "@/components/app/sidebar/AppSidebar";
import {AdminNav} from "@/constants/user-nav";
import {AppNavbar} from '@/components/app';
import {cn} from '@/lib/utils';

export const Route = createFileRoute('/_private')({
  // loader: ({context}) => {
  //   if (!context?.auth?.isAuthenticated) {
  //     throw redirect({to: APP_CONFIG.path.defaultPublic})
  //   }
  // },
  component: RouteComponent,
})

function RouteComponent() {
  // const auth = useAuth();
  // const userRole = auth?.user?.user?.role;
  //
  // const webNav: any = userRole === USER_ROLE.admin.value ? AdminNav : UserNav
  const webNav = AdminNav;

  const bg: string = "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950"
  return (
    <div className={cn("h-screen flex flex-row overflow-hidden", bg)}>
      <SidebarProvider defaultOpen={true} className={bg}>
        <AppSidebar navItems={webNav}/>

        <SidebarInset className={cn("flex flex-col flex-1 overflow-hidden", bg)}>
          <AppNavbar/>
          <div className={" overflow-auto"}>
            <div className='flex flex-col w-full items-center p-4 max-w-7xl mx-auto'>
              <Outlet/>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

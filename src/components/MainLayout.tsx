
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import UserNav from './UserNav';
interface MainLayoutProps {
  children: React.ReactNode;
}
const MainLayout = ({
  children
}: MainLayoutProps) => {
  return <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1">
          <div className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-200 bg-white px-3 sm:px-6 py-3 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-4">
              <SidebarTrigger className="hover:bg-orange-50 hover:text-orange-600" />
              <div className="flex items-center space-x-2 sm:space-x-3 lg:hidden">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shadow-lg overflow-hidden flex-shrink-0">
                  <img alt="Soko Smart Logo" src="/lovable-uploads/79fe9f77-6c77-4b5c-b7e0-4c0f7d6b4b4b.png" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h1 className="text-sm sm:text-lg font-bold text-gray-900">Soko Smart</h1>
                  <p className="text-xs text-gray-600 hidden sm:block">Kenya's Marketplace</p>
                </div>
              </div>
            </div>
            <UserNav />
          </div>
          <div className="p-2 sm:p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>;
};
export default MainLayout;

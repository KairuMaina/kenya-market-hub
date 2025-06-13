
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { 
  Home, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  BarChart3,
  Truck,
  DollarSign,
  Tag,
  MessageSquare,
  FileText,
  Shield
} from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { useCart } from "@/contexts/CartContext"
import { Badge } from "@/components/ui/badge"

const AppSidebar = () => {
  const location = useLocation()
  const { isAdmin } = useAuth()
  const { getTotalItems } = useCart()
  const cartItems = getTotalItems()

  const menuItems = [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Products",
      url: "/products", 
      icon: Package,
    },
    {
      title: "Cart",
      url: "/cart",
      icon: ShoppingCart,
      badge: cartItems > 0 ? cartItems : undefined,
    },
  ]

  const adminItems = [
    {
      title: "Dashboard",
      url: "/admin",
      icon: BarChart3,
    },
    {
      title: "Products",
      url: "/admin/products",
      icon: Package,
    },
    {
      title: "Orders",
      url: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      title: "Customers",
      url: "/admin/customers",
      icon: Users,
    },
    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: BarChart3,
    },
    {
      title: "Inventory",
      url: "/admin/inventory",
      icon: Truck,
    },
    {
      title: "Categories",
      url: "/admin/categories",
      icon: Tag,
    },
    {
      title: "Reviews",
      url: "/admin/reviews",
      icon: MessageSquare,
    },
    {
      title: "Reports",
      url: "/admin/reports",
      icon: FileText,
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings,
    },
  ]

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Soko Smart</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url} className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                      </div>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                      <Link to={item.url}>
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar

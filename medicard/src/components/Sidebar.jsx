import { NavLink } from "react-router-dom";
import { 
  HeartPulse, 
  LayoutDashboard, 
  CreditCard, 
  Wallet, 
  Stethoscope, 
  Users, 
  LogOut,
  UserPlus
} from "lucide-react";
import { cn } from "../lib/utils";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Medical Card", href: "/medical-card", icon: CreditCard },
  { name: "Finance Card", href: "/finance-card", icon: Wallet },
  { name: "Emergency View", href: "/emergency-view", icon: Stethoscope },
  { name: "Admin Panel", href: "/admin-panel", icon: Users },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-full shrink-0 shadow-[0_2px_12px_rgba(0,0,0,0.02)] z-10 hidden md:flex">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-gray-50">
        <HeartPulse className="h-6 w-6 text-primary mr-2" />
        <span className="font-bold text-lg tracking-tight text-secondary">
          Medi<span className="text-primary">card</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center px-3 py-2.5 rounded-xl font-medium transition-colors duration-200",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-secondary/70 hover:bg-gray-50 hover:text-secondary"
              )
            }
          >
            <item.icon className="h-5 w-5 mr-3 shrink-0" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User Profile Widget */}
      <div className="p-4 border-t border-gray-50">
        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-[14px]">
          <div className="flex items-center gap-3 w-full">
            <div className="bg-primary/20 text-primary h-9 w-9 rounded-full flex items-center justify-center font-bold shrink-0">
              EK
            </div>
            <div className="flex flex-col text-sm truncate flex-1">
              <span className="font-semibold text-secondary truncate">Eleanor K.</span>
              <span className="text-xs text-secondary/60">ID: MC-4921</span>
            </div>
          </div>
          <NavLink to="/" className="text-secondary/50 hover:text-red-500 transition-colors p-1" title="Logout">
            <LogOut className="h-4 w-4" />
          </NavLink>
        </div>
      </div>
    </aside>
  );
}

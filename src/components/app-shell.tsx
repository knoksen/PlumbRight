
'use client';
import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Wrench, Calculator, Library, Home, LogOut, Sun, Moon, CheckCircle, Construction, Wand2, ChevronDown, Shapes } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const menuItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/parts', label: 'Parts Library', icon: Library },
];

const aiTools = [
    { href: '/studio', label: 'Studio', icon: Construction },
    { href: '/validate', label: 'Part Validation', icon: CheckCircle },
    { href: '/quote', label: 'Quote Generator', icon: Calculator },
]

function ThemeSwitcher() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className='h-9 w-9'>
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isQuoteView = pathname === '/quote/view';

  if (isQuoteView) {
    return <main className="p-4 sm:p-6">{children}</main>;
  }
  
  return (
      <SidebarInset>
        <header className="no-print sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
          <SidebarTrigger className="sm:hidden" />
          <div className="flex items-center gap-4 ml-auto">
            <ThemeSwitcher />
             <Avatar className="h-9 w-9">
              <AvatarImage src="https://placehold.co/40x40.png" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
  );
}


export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-3">
            <Wrench className="size-7 text-primary" />
            <h1 className="text-2xl font-bold">PlumbRight</h1>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)}
                  tooltip={{
                    children: item.label,
                    className: 'no-print',
                  }}
                >
                  <Link href={item.href}>
                    <item.icon className="size-5" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}

             <Collapsible defaultOpen className="data-[state=open]:space-y-1">
                <CollapsibleTrigger className="group flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground [&[data-state=open]>svg]:rotate-180">
                  <div className="flex items-center gap-2">
                    <Wand2 className="size-5" />
                    <span>AI Tools</span>
                  </div>
                  <ChevronDown className="size-4 shrink-0 transition-transform duration-200" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                   <SidebarMenu className="ml-4">
                        {aiTools.map((item) => (
                          <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton
                              asChild
                              size="sm"
                              isActive={pathname.startsWith(item.href)}
                              tooltip={{
                                children: item.label,
                                className: 'no-print',
                              }}
                            >
                              <Link href={item.href}>
                                <item.icon className="size-4" />
                                <span>{item.label}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </CollapsibleContent>
             </Collapsible>


          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
          <Button variant="ghost">
            <LogOut className="mr-2" />
            Logout
          </Button>
        </SidebarFooter>
      </Sidebar>
      <Layout>
        {children}
      </Layout>
    </SidebarProvider>
  );
}

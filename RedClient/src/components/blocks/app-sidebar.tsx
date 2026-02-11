"use client";

import * as React from "react";
import Image from "next/image";

import { NavMain } from "@/components/blocks/nav-main";
import { NavSecondary } from "@/components/blocks/nav-secondary";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import data  from "./tree";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props} side="right" className="font-sans print:hidden">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex items-center">
            <Image
              src={"https://alexasfor.com/wp-content/uploads/2023/03/Alex.png"}
              alt="logo"
              width={100}
              height={100}
            />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-bold text-green-600 dark:text-white">
                نظام شركة أليكس
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                Alex for Agriculture Tools
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                نظام إدارة الشركة
              </p>
            </div>
          </div>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain groups={data.navMainGroups} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
}

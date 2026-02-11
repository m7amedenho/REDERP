"use client";

import * as React from "react";
import { IconHome, IconNotification } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
export function NavMain({
  groups,
}: {
  groups: {
    label: string;
    items: {
      title: string;
      url: string;
      icon?: React.ElementType;
    }[];
  }[];
}) {
  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <SidebarMenuButton
                tooltip="الرئيسية"
                className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-8 duration-200 ease-linear"
              >
                <IconHome />
                <Link href="/dashboard" className="flex items-center gap-2">
                  <span>الصفحة الرئيسية</span>
                </Link>
              </SidebarMenuButton>
              <Button
                size="icon"
                className="size-8 group-data-[collapsible=icon]:opacity-0"
                variant="outline"
              >
                <IconNotification />
                <span className="sr-only">Inbox</span>
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      {groups.map((group) => (
        <Collapsible key={group.label} className="px-2">
          <CollapsibleTrigger
            className="flex items-center justify-between w-full px-3 py-2 text-xs font-bold 
               text-muted-foreground uppercase hover:text-foreground hover:bg-muted 
               rounded transition-colors duration-300"
          >
            {group.label}
            <ChevronDown className="h-4 w-4 opacity-70 transition-transform duration-300 group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>

          <CollapsibleContent className="overflow-hidden transition-all duration-300 data-[state=closed]:animate-slide-up data-[state=open]:animate-slide-down">
            <div className="flex flex-col gap-1 mt-1">
              {group.items.map((item) => (
                <Link
                  key={item.title}
                  href={item.url}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2 px-4 py-2 rounded-md text-sm hover:bg-accent cursor-pointer transition">
                    {item.icon && <item.icon className="w-4 h-4" />}
                    <span>{item.title}</span>
                  </div>
                </Link>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </>
  );
}

"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PERMISSION_LIST } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

interface PermissionsSelectorProps {
  selectedPermissions: string[];
  onChange: (perms: string[]) => void;
}

export function PermissionsSelector({ selectedPermissions, onChange }: PermissionsSelectorProps) {
  
  const handleToggle = (value: string) => {
    if (selectedPermissions.includes(value)) {
      onChange(selectedPermissions.filter((p) => p !== value));
    } else {
      onChange([...selectedPermissions, value]);
    }
  };

  const handleToggleCategory = (items: { value: string }[]) => {
    const allValues = items.map(i => i.value);
    const isAllSelected = allValues.every(v => selectedPermissions.includes(v));

    if (isAllSelected) {
      // إلغاء تحديد الكل في هذا القسم
      onChange(selectedPermissions.filter(p => !allValues.includes(p)));
    } else {
      // تحديد الكل في هذا القسم
      const newPerms = Array.from(new Set([...selectedPermissions, ...allValues]));
      onChange(newPerms);
    }
  };

  return (
    <div className="border rounded-md p-2 bg-muted/20">
      <p className="text-sm font-semibold mb-2 px-2">صلاحيات المستخدم</p>
      <Accordion type="multiple" className="w-full">
        {PERMISSION_LIST.map((group, idx) => {
          const selectedCount = group.items.filter(i => selectedPermissions.includes(i.value)).length;
          
          return (
            <AccordionItem key={idx} value={`item-${idx}`} className="border-b-0">
              <AccordionTrigger className="hover:no-underline py-2 px-2 rounded-md hover:bg-muted/50">
                <div className="flex items-center justify-between w-full">
                  <span>{group.category}</span>
                  {selectedCount > 0 && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {selectedCount} مفعل
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-2 pb-2">
                <div className="flex justify-end mb-2">
                    <button 
                        type="button" 
                        onClick={(e) => { e.preventDefault(); handleToggleCategory(group.items); }}
                        className="text-xs text-blue-600 hover:underline"
                    >
                        تحديد/إلغاء الكل
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {group.items.map((perm) => (
                    <div key={perm.value} className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox 
                        id={perm.value} 
                        checked={selectedPermissions.includes(perm.value)}
                        onCheckedChange={() => handleToggle(perm.value)}
                      />
                      <Label htmlFor={perm.value} className="text-sm cursor-pointer">
                        {perm.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/axios";
import { buildTree, OrgNode, OrgUnitFlat, orgTypeLabel } from "@/lib/orgTree";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getErrorMessage } from "@/lib/toast-error";
import {
  ChevronRight,
  ChevronDown,
  Building2,
  Users,
  FolderTree,
  Network,
  Plus,
  RefreshCw,
  Edit,
  Move,
  Power,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Filter,
  Home,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type CreateDto = { name: string; type: number; parentId: string | null };
type MoveDto = { orgUnitId: string; newParentId: string | null };
type UpdateDto = { id: string; name: string; isActive: boolean };
type DeactivateDto = { id: string };

function can(permissionKeys: string[], key: string) {
  return permissionKeys?.includes(key);
}

const getTypeIcon = (type: number) => {
  switch (type) {
    case 1: return <Building2 className="h-4 w-4 text-blue-500" />;
    case 2: return <Home className="h-4 w-4 text-green-500" />;
    case 3: return <Briefcase className="h-4 w-4 text-purple-500" />;
    case 4: return <Users className="h-4 w-4 text-orange-500" />;
    default: return <FolderTree className="h-4 w-4" />;
  }
};

export default function OrgPage() {
  const { permissions, roles, selectedOrgUnitId, loadMyAccess, isLoading } =
    useAuth();

  const [flat, setFlat] = useState<OrgUnitFlat[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [showInactive, setShowInactive] = useState(false);

  // Create modal
  const [cName, setCName] = useState("");
  const [cType, setCType] = useState<string>("2");
  const [cParentId, setCParentId] = useState<string>("");

  // Move modal
  const [mNewParent, setMNewParent] = useState<string | "ROOT">("ROOT");
  const [alexRootId, setAlexRootId] = useState<string | null>(null);

  // Update
  const [uName, setUName] = useState("");
  const [uActive, setUActive] = useState(true);

  const tree = useMemo(() => buildTree(flat), [flat]);

  const filteredTree = useMemo(() => {
    if (!searchQuery && showInactive) return tree;
    
    const filterNode = (node: OrgNode): OrgNode | null => {
      const matchesSearch = searchQuery 
        ? node.name.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      
      const matchesActive = showInactive ? true : node.isActive;
      
      const filteredChildren = node.children
        ?.map(filterNode)
        .filter((child): child is OrgNode => child !== null) || [];
      
      if (matchesSearch && matchesActive) {
        return { ...node, children: filteredChildren };
      }
      
      if (filteredChildren.length > 0) {
        return { ...node, children: filteredChildren };
      }
      
      return null;
    };
    
    return tree.map(filterNode).filter((node): node is OrgNode => node !== null);
  }, [tree, searchQuery, showInactive]);

  const selected = useMemo(() => {
    return flat.find((x) => x.id === selectedId) || null;
  }, [flat, selectedId]);

  const parentOptions = useMemo(() => {
    return flat
      .filter((x) => x.isActive)
      .map((x) => ({ id: x.id, name: x.name, type: x.type }));
  }, [flat]);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await api.get<OrgUnitFlat[]>("/org/tree");
      setFlat(res.data || []);
      toast.success("تم تحديث البيانات", {
        icon: <RefreshCw className="h-4 w-4" />,
      });
    } catch (error: any) {
      console.error(error);
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await refresh();
      try {
        const root = await api.get<{ id: string }>("/org/root");
        setAlexRootId(root.data.id);
        setCParentId(root.data.id);
      } catch {
        // ignore
      }
      if (!selectedOrgUnitId) {
        try {
          const root = await api.get<{ id: string }>("/org/root");
          if (root.data?.id) await loadMyAccess(root.data.id);
        } catch {
          // ignore
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selected) {
      setUName(selected.name);
      setUActive(selected.isActive);
    }
  }, [selected]);

  const toggleExpand = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const create = async () => {
    if (!cName.trim()) {
      toast.error("الرجاء إدخال اسم الوحدة التنظيمية");
      return;
    }
    if (!alexRootId) {
      toast.error("جذر المنظمة غير جاهز");
      return;
    }
    
    const dto: CreateDto = {
      name: cName.trim(),
      type: Number(cType),
      parentId: cParentId || alexRootId,
    };
    
    try {
      await api.post("/org/create", dto);
      toast.success("تم إنشاء الوحدة التنظيمية بنجاح");
      setCName("");
      setCType("2");
      await refresh();
    } catch (error: any) {
      console.error(error);
      toast.error(getErrorMessage(error));
    }
  };

  const update = async () => {
    if (!selected) return;
    const dto: UpdateDto = {
      id: selected.id,
      name: uName.trim(),
      isActive: uActive,
    };
    try {
      await api.post("/org/update", dto);
      toast.success("تم تحديث الوحدة بنجاح");
      await refresh();
    } catch (error: any) {
      console.error(error);
      toast.error(getErrorMessage(error));
    }
  };

  const deactivate = async () => {
    if (!selected) return;
    const dto: DeactivateDto = { id: selected.id };
    try {
      await api.post("/org/deactivate", dto);
      toast.success("تم تعطيل الوحدة وجميع الأقسام الفرعية");
      setSelectedId(null);
      await refresh();
    } catch (error: any) {
      console.error(error);
      toast.error(getErrorMessage(error));
    }
  };

  const move = async () => {
    if (!selected) return;
    const dto: MoveDto = {
      orgUnitId: selected.id,
      newParentId: mNewParent === "ROOT" ? null : mNewParent,
    };
    try {
      await api.post("/org/move", dto);
      toast.success("تم نقل الوحدة بنجاح");
      await refresh();
    } catch (error: any) {
      console.error(error);
      toast.error(getErrorMessage(error));
    }
  };

  const NodeRow = ({ n, level = 0 }: { n: OrgNode; level?: number }) => {
    const hasChildren = n.children && n.children.length > 0;
    const isExpanded = expandedNodes.has(n.id);
    const isSelected = n.id === selectedId;
    const indent = level * 20;

    return (
      <div className="space-y-1">
        <div
          className={cn(
            "group flex items-center gap-2 p-2 rounded-lg transition-all duration-200 cursor-pointer",
            isSelected
              ? " border-r-4 border-primary"
              : "hover:border-r-4 hover:border-muted-foreground/30"
          )}
          onClick={() => setSelectedId(n.id)}
          style={{ marginRight: `${indent}px` }}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {hasChildren ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(n.id);
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </Button>
            ) : (
              <div className="w-6" />
            )}
            
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>{getTypeIcon(n.type)}</div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{orgTypeLabel(n.type)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <span className="font-medium truncate">{n.name}</span>
              
              <div className="flex items-center gap-1 ml-auto">
                {!n.isActive && (
                  <Badge variant="destructive" className="text-xs">
                    متوقف
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs",
                    n.type === 1
                      ? "border-blue-200 text-blue-700"
                      : n.type === 2
                      ? "border-green-200 text-green-700 "
                      : n.type === 3
                      ? "border-purple-200 text-purple-700"
                      : "border-orange-200 text-orange-700"
                  )}
                >
                  {orgTypeLabel(n.type)}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {isExpanded && hasChildren && (
          <div className="space-y-1">
            {n.children?.map((child) => (
              <NodeRow key={child.id} n={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading || loading) {
    return (
      <div className="p-6 space-y-6" dir="rtl">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const canOrgView = can(permissions, "Org.View");
  if (!canOrgView) {
    return (
      <div className="p-6" dir="rtl">
        <Card className="max-w-md mx-auto mt-12">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <EyeOff className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl">غير مصرح بالوصول</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              ليس لديك الصلاحيات اللازمة لعرض الهيكل التنظيمي
            </p>
            <Button variant="outline" onClick={() => window.history.back()}>
              العودة
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl shadow-sm border">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg">
                <Network className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  الهيكل التنظيمي
                </h1>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <span>النطاق الحالي:</span>
                  <Badge variant="secondary" className="font-normal">
                    {selectedOrgUnitId ? "محدد" : "ALEX"}
                  </Badge>
                  <span className="mx-1">•</span>
                  <span>الأدوار:</span>
                  <Badge variant="outline" className="font-normal">
                    {roles?.join(", ") || "-"}
                  </Badge>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={refresh}
                    className="h-10 w-10"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>تحديث البيانات</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="gap-2 pr-3"
                  disabled={!can(permissions, "Org.Create")}
                >
                  <Plus className="h-4 w-4" />
                  إضافة وحدة جديدة
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    إنشاء وحدة تنظيمية جديدة
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">اسم الوحدة</Label>
                    <Input
                      id="name"
                      value={cName}
                      onChange={(e) => setCName(e.target.value)}
                      placeholder="أدخل اسم الوحدة التنظيمية"
                      className="text-right"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">نوع الوحدة</Label>
                    <Select value={cType} onValueChange={setCType}>
                      <SelectTrigger id="type" className="text-right">
                        <SelectValue placeholder="اختر نوع الوحدة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            منطقة/وجه
                          </div>
                        </SelectItem>
                        <SelectItem value="2">
                          <div className="flex items-center gap-2">
                            <Home className="h-4 w-4" />
                            فرع
                          </div>
                        </SelectItem>
                        <SelectItem value="3">
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            قسم
                          </div>
                        </SelectItem>
                        <SelectItem value="4">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            فريق
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="parent">الوحدة الأم</Label>
                    <Select value={cParentId} onValueChange={setCParentId}>
                      <SelectTrigger id="parent" className="text-right">
                        <SelectValue placeholder="اختر الوحدة الأم" />
                      </SelectTrigger>
                      <SelectContent>
                        {parentOptions.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            <div className="flex items-center gap-2">
                              {getTypeIcon(p.type)}
                              {p.name}
                              <Badge variant="outline" className="text-xs">
                                {orgTypeLabel(p.type)}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter>
                  <Button onClick={create} className="w-full gap-2">
                    <Plus className="h-4 w-4" />
                    إنشاء الوحدة
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tree Panel */}
          <Card className="lg:col-span-1 border shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FolderTree className="h-5 w-5 text-primary" />
                  الشجرة التنظيمية
                </CardTitle>
                <Badge variant="outline" className="font-normal">
                  {flat.length} وحدة
                </Badge>
              </div>
              
              <div className="space-y-3 pt-3">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="بحث في الوحدات..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10 text-right"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">تصفية</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={showInactive}
                      onCheckedChange={setShowInactive}
                      id="show-inactive"
                    />
                    <Label htmlFor="show-inactive" className="text-sm">
                      عرض الوحدات المتوقفة
                    </Label>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <Separator />
            
            <CardContent className="p-4">
              <ScrollArea className="h-[calc(100vh-350px)]">
                {filteredTree.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FolderTree className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>لا توجد وحدات تنظيمية</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredTree.map((n) => (
                      <NodeRow key={n.id} n={n} />
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Details Panel */}
          <Card className="lg:col-span-2 border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Edit className="h-5 w-5 text-primary" />
                تفاصيل الوحدة المحددة
              </CardTitle>
            </CardHeader>
            
            <Separator />
            
            <CardContent className="p-6">
              {!selected ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center">
                    <Eye className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      لم يتم تحديد وحدة
                    </h3>
                    <p className="text-muted-foreground">
                      اختر وحدة من الشجرة لعرض وتعديل تفاصيلها
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Header Info */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(selected.type)}
                        <h2 className="text-xl font-bold">{selected.name}</h2>
                        <Badge
                          variant={selected.isActive ? "default" : "destructive"}
                          className="gap-1"
                        >
                          {selected.isActive ? (
                            <>
                              <Power className="h-3 w-3" />
                              نشط
                            </>
                          ) : (
                            <>
                              <Power className="h-3 w-3" />
                              متوقف
                            </>
                          )}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {orgTypeLabel(selected.type)} • ID:{" "}
                        <code className="px-1 rounded text-xs">
                          {selected.id}
                        </code>
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                setExpandedNodes(new Set([selected.id]));
                              }}
                            >
                              <FolderTree className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>توسيع في الشجرة</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <Separator />

                  {/* Edit Form */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-name">اسم الوحدة</Label>
                          <Input
                            id="edit-name"
                            value={uName}
                            onChange={(e) => setUName(e.target.value)}
                            className="text-right"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>حالة الوحدة</Label>
                          <div className="flex items-center gap-4">
                            <Button
                              type="button"
                              variant={uActive ? "default" : "outline"}
                              className="flex-1 gap-2"
                              onClick={() => setUActive(true)}
                            >
                              <Power className="h-4 w-4" />
                              نشط
                            </Button>
                            <Button
                              type="button"
                              variant={!uActive ? "destructive" : "outline"}
                              className="flex-1 gap-2"
                              onClick={() => setUActive(false)}
                            >
                              <Power className="h-4 w-4" />
                              متوقف
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>الإجراءات السريعة</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              onClick={update}
                              disabled={!can(permissions, "Org.Update")}
                              className="gap-2"
                            >
                              <Edit className="h-4 w-4" />
                              حفظ التعديلات
                            </Button>

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  disabled={
                                    !can(permissions, "Org.Update") ||
                                    selected.name === "ALEX"
                                  }
                                  className="gap-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  تعطيل
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle className="text-destructive">
                                    تأكيد التعطيل
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="py-4">
                                  <p className="mb-4">
                                    هل أنت متأكد من تعطيل الوحدة{" "}
                                    <span className="font-bold">{selected.name}</span>؟
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    سيتم تعطيل هذه الوحدة وجميع الأقسام الفرعية
                                    التابعة لها.
                                  </p>
                                </div>
                                <DialogFooter>
                                  <Button
                                    variant="destructive"
                                    onClick={deactivate}
                                  >
                                    نعم، تعطيل
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Move Section */}
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Move className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold">نقل الوحدة</h3>
                        </div>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="gap-2"
                              disabled={
                                !can(permissions, "Org.Update") ||
                                selected.name === "ALEX"
                              }
                            >
                              <Move className="h-4 w-4" />
                              نقل الوحدة
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <Move className="h-5 w-5" />
                                نقل الوحدة التنظيمية
                              </DialogTitle>
                            </DialogHeader>
                            
                            <div className="space-y-4 py-4">
                              <div className="rounded-lg p-3">
                                <p className="text-sm">
                                  سيتم نقل الوحدة:{" "}
                                  <span className="font-bold">{selected.name}</span>
                                </p>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="move-parent">الوحدة الأم الجديدة</Label>
                                <Select
                                  value={mNewParent}
                                  onValueChange={setMNewParent}
                                >
                                  <SelectTrigger id="move-parent" className="text-right">
                                    <SelectValue placeholder="اختر الوحدة الأم" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value={alexRootId || "disabled"}>
                                      <div className="flex items-center gap-2">
                                        <Building2 className="h-4 w-4" />
                                        ALEX (الجذر)
                                      </div>
                                    </SelectItem>
                                    
                                    {parentOptions
                                      .filter((p) => p.id !== selected.id)
                                      .map((p) => (
                                        <SelectItem key={p.id} value={p.id}>
                                          <div className="flex items-center gap-2">
                                            {getTypeIcon(p.type)}
                                            {p.name}
                                            <Badge variant="outline" className="text-xs">
                                              {orgTypeLabel(p.type)}
                                            </Badge>
                                          </div>
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            
                            <DialogFooter>
                              <Button onClick={move} className="w-full gap-2">
                                <Move className="h-4 w-4" />
                                تأكيد النقل
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        يمكنك نقل هذه الوحدة إلى وحدة أم أخرى. سيتم نقل جميع
                        الأقسام الفرعية معها.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
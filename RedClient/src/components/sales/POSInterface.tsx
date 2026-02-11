"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShoppingCart,
  User,
  Barcode,
  Search,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  Building2,
  Check,
  X,
  AlertTriangle,
  Package,
  Camera,
} from "lucide-react";
import { Customer, POSCart, POSItem } from "@/lib/types/sales";
import { toast } from "sonner";
import { BarcodeScanner } from "./BarcodeScanner";
import { Label } from "../ui/label";
import { useAuth } from "@/context/auth-context";

interface POSInterfaceProps {
  products?: any[];
  customers?: Customer[];
  onSaleComplete?: (cart: POSCart, payment: any) => void;
}

export function POSInterface({
  products = [],
  customers = [],
  onSaleComplete,
}: POSInterfaceProps) {
  const [cart, setCart] = useState<POSItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "card" | "transfer" | "credit"
  >("cash");
  const [cashReceived, setCashReceived] = useState<number>(0);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);

  // حساب المجاميع
  const subtotal = cart.reduce((total, item) => total + item.total, 0);
  const discountAmount = cart.reduce(
    (total, item) => total + item.discount * item.quantity,
    0,
  );
  const taxAmount = cart.reduce((total, item) => total + item.tax, 0);
  const totalAmount = subtotal - discountAmount + taxAmount;
  const changeAmount =
    paymentMethod === "cash" ? cashReceived - totalAmount : 0;
  const { user } = useAuth();
  // إضافة منتج للسلة
  const addToCart = (product: any) => {
    const existingItem = cart.find((item) => item.productId === product.id);

    if (existingItem) {
      if (existingItem.quantity >= existingItem.availableQuantity) {
        toast.error("الكمية المطلوبة غير متوفرة في المخزون");
        return;
      }
      updateQuantity(existingItem.id, existingItem.quantity + 1);
    } else {
      const newItem: POSItem = {
        id: `item-${Date.now()}`,
        productId: product.id,
        productName: product.name,
        productCode: product.code,
        barcode: product.barcode,
        category: product.category,
        image: product.image,
        quantity: 1,
        availableQuantity: product.currentStock || 0,
        unit: product.unit,
        unitPrice: product.retailPrice || product.price,
        originalPrice: product.retailPrice || product.price,
        discount: 0,
        discountType: "fixed",
        tax: 0,
        taxRate: 0.15, // 15% ضريبة
        total: product.retailPrice || product.price,
        warehouseId: product.warehouseId || "default",
      };

      // حساب الضريبة
      newItem.tax = newItem.unitPrice * newItem.quantity * newItem.taxRate;
      newItem.total =
        newItem.unitPrice * newItem.quantity - newItem.discount + newItem.tax;

      setCart([...cart, newItem]);
      toast.success(`تم إضافة ${product.name} إلى السلة`);
    }
  };

  // تحديث الكمية
  const updateQuantity = (itemId: string, newQuantity: number) => {
    setCart(
      cart.map((item) => {
        if (item.id === itemId) {
          if (newQuantity > item.availableQuantity) {
            toast.error("الكمية المطلوبة غير متوفرة");
            return item;
          }
          if (newQuantity <= 0) {
            return item;
          }
          const updatedItem = { ...item, quantity: newQuantity };
          updatedItem.tax =
            updatedItem.unitPrice * updatedItem.quantity * updatedItem.taxRate;
          updatedItem.total =
            updatedItem.unitPrice * updatedItem.quantity -
            updatedItem.discount +
            updatedItem.tax;
          return updatedItem;
        }
        return item;
      }),
    );
  };

  // معالجة مسح الباركود
  const handleBarcodeScanned = (barcode: string) => {
    const product = products.find(
      (p) => p.barcode === barcode || p.code === barcode,
    );

    if (product) {
      addToCart(product);
      toast.success(`تم إضافة المنتج: ${product.name}`);
    } else {
      toast.error("لم يتم العثور على منتج بهذا الباركود");
    }
  };

  // حذف عنصر
  const removeItem = (itemId: string) => {
    setCart(cart.filter((item) => item.id !== itemId));
  };

  // تفريغ السلة
  const clearCart = () => {
    setCart([]);
    setSelectedCustomer(null);
    setCashReceived(0);
  };

  // إتمام البيع
  const completeSale = () => {
    if (cart.length === 0) {
      toast.error("السلة فارغة");
      return;
    }

    if (paymentMethod === "credit" && !selectedCustomer) {
      toast.error("يجب اختيار عميل للبيع الآجل");
      return;
    }

    if (
      paymentMethod === "credit" &&
      selectedCustomer &&
      selectedCustomer.currentBalance + totalAmount >
        selectedCustomer.creditLimit
    ) {
      toast.error("تجاوز حد الائتمان - يتطلب موافقة");
      return;
    }

    if (paymentMethod === "cash" && cashReceived < totalAmount) {
      toast.error("المبلغ المستلم أقل من المطلوب");
      return;
    }

    const posCart: POSCart = {
      id: `cart-${Date.now()}`,
      customerId: selectedCustomer?.id,
      customerName: selectedCustomer?.name,
      items: cart,
      subtotal,
      discounts: [],
      discountAmount,
      taxes: [],
      taxAmount,
      totalAmount,
      paymentMethod,
      paidAmount: paymentMethod === "cash" ? cashReceived : totalAmount,
      changeAmount: paymentMethod === "cash" ? changeAmount : 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (onSaleComplete) {
      onSaleComplete(posCart, {
        method: paymentMethod,
        amount: totalAmount,
        received: cashReceived,
        change: changeAmount,
      });
    }

    toast.success("تم إتمام البيع بنجاح");
    clearCart();
  };

  // البحث في المنتجات
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.barcode?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // الفئات الفريدة
  const categories = [
    "all",
    ...Array.from(new Set(products.map((p) => p.category))).filter(Boolean),
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
      {/* لوحة المنتجات */}
      <div className="lg:col-span-2 flex flex-col">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="pb-4">
            <div className="space-y-4">
              {/* شريط البحث */}
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="ابحث بالمنتج أو الباركود..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="text-lg pr-10"
                  />
                </div>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => setShowBarcodeScanner(true)}
                >
                  <Camera className="h-4 w-4" />
                  مسح باركود
                </Button>
              </div>

              {/* فلترة الفئات */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="whitespace-nowrap"
                  >
                    {category === "all" ? "الكل" : category}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              {/* شبكة المنتجات */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => addToCart(product)}
                  >
                    <CardContent className="p-4">
                      <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Package className="h-12 w-12 text-muted-foreground" />
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="font-medium text-sm line-clamp-2">
                          {product.name}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary">
                            {(
                              product.retailPrice || product.price
                            )?.toLocaleString()}{" "}
                            ج.م
                          </span>
                          {product.currentStock < 10 && (
                            <Badge variant="destructive" className="text-xs">
                              {product.currentStock}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <Package className="h-16 w-16 mb-4 opacity-50" />
                  <p className="text-lg">لا توجد منتجات</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* سلة البيع */}
      <div className="flex flex-col gap-4">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                سلة البيع
                {cart.length > 0 && (
                  <Badge variant="secondary">{cart.length}</Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm text-muted-foreground">
                  اسم المستخدم:
                </Label>
                <Input
                  type="text"
                  value={user?.fullName || ""}
                  readOnly
                  className="text-sm mt-1 bg-transparent"
                />
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col space-y-4">
            {/* معلومات العميل */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                العميل
              </label>
              <Select
                value={selectedCustomer?.id || ""}
                onValueChange={(value) => {
                  const customer = customers.find((c) => c.id === value);
                  setSelectedCustomer(customer || null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر عميل أو بيع مباشر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"direct"}>بيع مباشر</SelectItem>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{customer.name}</span>
                        {customer.currentBalance > 0 && (
                          <Badge
                            variant={
                              customer.currentBalance > customer.creditLimit
                                ? "destructive"
                                : "secondary"
                            }
                            className="mr-2"
                          >
                            {customer.currentBalance.toLocaleString()}
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedCustomer && (
                <div className="p-3 bg-muted rounded-lg space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      الرصيد الحالي:
                    </span>
                    <span className="font-medium">
                      {selectedCustomer.currentBalance.toLocaleString()} ج.م
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">حد الائتمان:</span>
                    <span className="font-medium">
                      {selectedCustomer.creditLimit.toLocaleString()} ج.م
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">المتاح:</span>
                    <span
                      className={`font-medium ${
                        selectedCustomer.creditLimit -
                          selectedCustomer.currentBalance <
                        0
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {(
                        selectedCustomer.creditLimit -
                        selectedCustomer.currentBalance
                      ).toLocaleString()}{" "}
                      ج.م
                    </span>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* قائمة المنتجات في السلة */}
            <ScrollArea className="flex-1">
              <div className="space-y-2 pr-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 p-3 border rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {item.productName}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{item.unitPrice.toLocaleString()} ج.م</span>
                        {item.discount > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            خصم {item.discount}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <div className="w-12 text-center font-medium">
                        {item.quantity}
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.availableQuantity}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <div className="font-bold">
                        {item.total.toLocaleString()}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-3 w-3 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {cart.length === 0 && (
                <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mb-2 opacity-50" />
                  <p>السلة فارغة</p>
                </div>
              )}
            </ScrollArea>

            <Separator />

            {/* المجاميع */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">المجموع الفرعي:</span>
                <span>{subtotal.toLocaleString()} ج.م</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>الخصم:</span>
                  <span>- {discountAmount.toLocaleString()} ج.م</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">الضريبة (15%):</span>
                <span>{taxAmount.toLocaleString()} ج.م</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>الإجمالي:</span>
                <span className="text-primary">
                  {totalAmount.toLocaleString()} ج.م
                </span>
              </div>
            </div>

            {/* طرق الدفع */}
            <div className="space-y-2">
              <label className="text-sm font-medium">طريقة الدفع</label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={paymentMethod === "cash" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("cash")}
                  className="gap-2"
                >
                  <Banknote className="h-4 w-4" />
                  نقدي
                </Button>
                <Button
                  variant={paymentMethod === "card" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("card")}
                  className="gap-2"
                >
                  <CreditCard className="h-4 w-4" />
                  بطاقة
                </Button>
                <Button
                  variant={paymentMethod === "transfer" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("transfer")}
                  className="gap-2"
                >
                  <Building2 className="h-4 w-4" />
                  تحويل
                </Button>
                <Button
                  variant={paymentMethod === "credit" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("credit")}
                  className="gap-2"
                  disabled={!selectedCustomer}
                >
                  <AlertTriangle className="h-4 w-4" />
                  آجل
                </Button>
              </div>
            </div>

            {/* المبلغ المستلم (للدفع النقدي) */}
            {paymentMethod === "cash" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">المبلغ المستلم</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={cashReceived || ""}
                  onChange={(e) => setCashReceived(Number(e.target.value))}
                  className="text-lg"
                />
                {changeAmount > 0 && (
                  <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded text-sm">
                    <div className="flex justify-between">
                      <span>الباقي:</span>
                      <span className="font-bold text-green-600">
                        {changeAmount.toLocaleString()} ج.م
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* أزرار الإجراءات */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={clearCart}
                disabled={cart.length === 0}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                إلغاء
              </Button>
              <Button
                onClick={completeSale}
                disabled={cart.length === 0}
                className="gap-2"
              >
                <Check className="h-4 w-4" />
                إتمام البيع
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barcode Scanner Modal */}
      <BarcodeScanner
        open={showBarcodeScanner}
        onClose={() => setShowBarcodeScanner(false)}
        onScan={handleBarcodeScanned}
      />
    </div>
  );
}

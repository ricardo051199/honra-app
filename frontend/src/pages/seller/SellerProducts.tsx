import React, { useState } from "react";
import { Card } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import { useToast } from "../../components/ui/Toast";
import {
  SELLER_PRODUCTS,
  SELLER_PRODUCT_STATUS_LABELS,
  type SellerProduct,
  type SellerProductStatus,
} from "../../mock/sellerData";

// ─── Status badge ─────────────────────────────────────────────────────────────

type BadgeVariant = "default" | "primary" | "success" | "warning" | "destructive" | "outline";

const productStatusVariant: Record<SellerProductStatus, BadgeVariant> = {
  active:   "success",
  inactive: "default",
  draft:    "warning",
};

function ProductStatusBadge({ status }: { status: SellerProductStatus }) {
  return (
    <Badge variant={productStatusVariant[status]} size="sm" dot>
      {SELLER_PRODUCT_STATUS_LABELS[status]}
    </Badge>
  );
}

// ─── Add product form ─────────────────────────────────────────────────────────

interface ProductFormData {
  title: string;
  description: string;
  priceUsdc: string;
  imageUrl: string;
  stock: string;
}

const EMPTY_FORM: ProductFormData = {
  title: "",
  description: "",
  priceUsdc: "",
  imageUrl: "",
  stock: "",
};

interface FormFieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}

function FormField({ label, required, hint, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-[var(--foreground)] flex items-center gap-1">
        {label}
        {required && <span className="text-[var(--destructive)]">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-[var(--muted-foreground)]">{hint}</p>}
    </div>
  );
}

const inputClass =
  "w-full h-9 px-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent transition-shadow";

const textareaClass =
  "w-full px-3 py-2.5 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent transition-shadow resize-none";

function AddProductForm({
  onSubmit,
  onCancel,
  loading,
}: {
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [form, setForm] = useState<ProductFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<ProductFormData>>({});

  const set = (field: keyof ProductFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<ProductFormData> = {};
    if (!form.title.trim())       next.title = "El nombre del producto es obligatorio.";
    if (!form.description.trim()) next.description = "La descripción es obligatoria.";
    if (!form.priceUsdc || isNaN(Number(form.priceUsdc)) || Number(form.priceUsdc) <= 0)
      next.priceUsdc = "Ingresa un precio válido mayor a 0.";
    if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0)
      next.stock = "Ingresa una cantidad de stock válida.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSubmit(form);
  };

  return (
    <div className="space-y-4">
      <FormField label="Nombre del producto" required>
        <input
          className={`${inputClass} ${errors.title ? "border-[var(--destructive)] ring-1 ring-[var(--destructive)]" : ""}`}
          placeholder="e.g. Sony WH-1000XM5"
          value={form.title}
          onChange={set("title")}
        />
        {errors.title && <p className="text-[11px] text-[var(--destructive)] mt-1">{errors.title}</p>}
      </FormField>

      <FormField label="Descripción" required>
        <textarea
          className={`${textareaClass} ${errors.description ? "border-[var(--destructive)] ring-1 ring-[var(--destructive)]" : ""}`}
          placeholder="Describe la condición, características y qué incluye el producto…"
          rows={3}
          value={form.description}
          onChange={set("description")}
        />
        {errors.description && <p className="text-[11px] text-[var(--destructive)] mt-1">{errors.description}</p>}
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Precio" required hint="Monto en USDC">
          <div className="relative">
            <input
              className={`${inputClass} pr-14 ${errors.priceUsdc ? "border-[var(--destructive)] ring-1 ring-[var(--destructive)]" : ""}`}
              placeholder="0"
              type="number"
              min="0"
              step="0.01"
              value={form.priceUsdc}
              onChange={set("priceUsdc")}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[var(--muted-foreground)]">
              USDC
            </span>
          </div>
          {errors.priceUsdc && <p className="text-[11px] text-[var(--destructive)] mt-1">{errors.priceUsdc}</p>}
        </FormField>

        <FormField label="Stock" required>
          <input
            className={`${inputClass} ${errors.stock ? "border-[var(--destructive)] ring-1 ring-[var(--destructive)]" : ""}`}
            placeholder="0"
            type="number"
            min="0"
            value={form.stock}
            onChange={set("stock")}
          />
          {errors.stock && <p className="text-[11px] text-[var(--destructive)] mt-1">{errors.stock}</p>}
        </FormField>
      </div>

      <FormField label="URL de imagen" hint="Pega una URL de imagen directa (jpg, png, webp)">
        <input
          className={inputClass}
          placeholder="https://…"
          value={form.imageUrl}
          onChange={set("imageUrl")}
        />
        {form.imageUrl && (
          <div className="mt-2 w-20 h-20 rounded-[var(--radius)] overflow-hidden bg-slate-100 border border-[var(--border)]">
            <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          </div>
        )}
      </FormField>

      <div className="flex gap-3 pt-1">
        <Button variant="outline" size="sm" onClick={onCancel} disabled={loading} className="flex-1">
          Cancelar
        </Button>
        <Button size="sm" loading={loading} onClick={handleSubmit} className="flex-1">
          Crear producto
        </Button>
      </div>
    </div>
  );
}

// ─── Product row (desktop table row / mobile card) ────────────────────────────

interface ProductRowProps {
  product: SellerProduct;
  onToggleStatus: (id: string) => void;
}

function ProductTableRow({ product, onToggleStatus }: ProductRowProps) {
  return (
    <tr className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--muted)/50] transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[var(--radius)] overflow-hidden bg-slate-100 shrink-0">
            <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[var(--foreground)] truncate max-w-[200px]" style={{ fontFamily: "var(--font-heading)" }}>
              {product.title}
            </p>
            <p className="text-[11px] text-[var(--muted-foreground)] truncate max-w-[200px]">
              {product.category}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-sm font-semibold text-[var(--foreground)] whitespace-nowrap">
        {product.priceUsdc.toLocaleString("en-US")}{" "}
        <span className="text-[10px] font-medium text-[var(--muted-foreground)]">USDC</span>
      </td>
      <td className="px-4 py-3">
        <span className={`text-sm font-medium ${product.stock === 0 ? "text-[var(--destructive)]" : "text-[var(--foreground)]"}`}>
          {product.stock}
        </span>
      </td>
      <td className="px-4 py-3">
        <ProductStatusBadge status={product.status} />
      </td>
      <td className="px-4 py-3">
        <button
          onClick={() => onToggleStatus(product.id)}
          className={`text-xs font-medium transition-colors ${product.status === "active" ? "text-[var(--muted-foreground)] hover:text-[var(--destructive)]" : "text-[var(--primary)] hover:text-emerald-700"}`}
        >
          {product.status === "active" ? "Desactivar" : "Activar"}
        </button>
      </td>
    </tr>
  );
}

function ProductMobileCard({ product, onToggleStatus }: ProductRowProps) {
  return (
    <div className="border-b border-[var(--border)] last:border-0 py-3 flex items-center gap-3">
      <div className="w-12 h-12 rounded-[var(--radius)] overflow-hidden bg-slate-100 shrink-0">
        <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[var(--foreground)] truncate mb-0.5" style={{ fontFamily: "var(--font-heading)" }}>
          {product.title}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-[var(--foreground)]">
            {product.priceUsdc.toLocaleString("en-US")} <span className="font-medium text-[var(--muted-foreground)]">USDC</span>
          </span>
          <span className="text-[var(--muted-foreground)]">·</span>
          <span className={`text-xs ${product.stock === 0 ? "text-[var(--destructive)]" : "text-[var(--muted-foreground)]"}`}>
            {product.stock} en stock
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <ProductStatusBadge status={product.status} />
        <button
          onClick={() => onToggleStatus(product.id)}
          className={`text-[11px] font-medium ${product.status === "active" ? "text-[var(--muted-foreground)]" : "text-[var(--primary)]"}`}
        >
          {product.status === "active" ? "Desactivar" : "Activar"}
        </button>
      </div>
    </div>
  );
}

// ─── Seller Products ──────────────────────────────────────────────────────────

export default function SellerProducts() {
  const [products, setProducts] = useState<SellerProduct[]>(SELLER_PRODUCTS);
  const [addOpen, setAddOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const { toast } = useToast();

  const handleAdd = async (data: ProductFormData) => {
    setAddLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    const newProduct: SellerProduct = {
      id: `sp${Date.now()}`,
      title: data.title,
      description: data.description,
      priceUsdc: Number(data.priceUsdc),
      imageUrl: data.imageUrl || "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=300&fit=crop&auto=format",
      stock: Number(data.stock),
      status: "active",
      category: "General",
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    setAddLoading(false);
    setAddOpen(false);
    toast({ type: "success", title: "Producto creado", description: `${data.title} ya está publicado.` });
  };

  const handleToggleStatus = (id: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "active" ? ("inactive" as SellerProductStatus) : ("active" as SellerProductStatus) }
          : p
      )
    );
  };

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
            Productos
          </p>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
            {products.filter((p) => p.status === "active").length} activos · {products.length} en total
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setAddOpen(true)}
          icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>}
        >
          Agregar producto
        </Button>
      </div>

      {/* Desktop table */}
      <Card padding="none" className="hidden md:block overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
              {["Producto", "Precio", "Stock", "Estado", "Acciones"].map((col) => (
                <th key={col} className="px-4 py-2.5 text-left text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <ProductTableRow key={p.id} product={p} onToggleStatus={handleToggleStatus} />
            ))}
          </tbody>
        </table>
      </Card>

      {/* Mobile cards */}
      <Card padding="none" className="md:hidden">
        <div className="px-4">
          {products.map((p) => (
            <ProductMobileCard key={p.id} product={p} onToggleStatus={handleToggleStatus} />
          ))}
        </div>
      </Card>

      {/* Add product modal */}
      <Modal
        open={addOpen}
        onClose={() => !addLoading && setAddOpen(false)}
        title="Agregar producto"
        description="Crea una nueva publicación. Aparecerá en el mercado de Honra."
        size="md"
      >
        <AddProductForm
          onSubmit={handleAdd}
          onCancel={() => setAddOpen(false)}
          loading={addLoading}
        />
      </Modal>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, updateProduct, getProduct } from '../../api/productApi';
import { getCategories } from '../../api/categoryApi';
import { getMaterials } from '../../api/materialApi';
import { getWorkTypes } from '../../api/workTypeApi';
import { getOccasions } from '../../api/occasionApi';
import api from '../../api/axios';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import FieldError from '../../components/ui/FieldError';
import { validateProduct } from '../../utils/validate';

const emptyVariant = { size: '', color: '', colorCode: '', sku: '', stock: 0, images: [] };

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [categories, setCategories] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [workTypes, setWorkTypes] = useState([]);
  const [occasions, setOccasions] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [variantUploadIdx, setVariantUploadIdx] = useState(null);
  const [errors, setErrors] = useState({});
  const fileRef = useRef(null);
  const variantFileRef = useRef(null);
  const [form, setForm] = useState({
    name: '', description: '', price: '', offerPrice: '', costPrice: '',
    category: '', material: '', workType: '', occasion: '', gender: '',
    tags: '', featured: false, isNew: false,
    images: [''],
    variants: [{ ...emptyVariant }],
  });

  useEffect(() => {
    getCategories().then((c) => setCategories(c.data.data.categories));
    getMaterials().then((m) => setMaterials(m.data.data.materials));
    getWorkTypes().then((w) => setWorkTypes(w.data.data.workTypes));
    getOccasions().then((o) => setOccasions(o.data.data.occasions));

    if (isEdit) {
      getProduct(id)
        .then((res) => {
          const p = res.data.data.product;
          setForm({
            name: p.name || '',
            description: p.description || '',
            price: p.price || '',
            offerPrice: p.offerPrice || '',
            costPrice: p.costPrice || '',
            category: p.category?._id || p.category || '',
            material: p.material || '',
            workType: p.workType || '',
            occasion: p.occasion || '',
            gender: p.gender || '',
            tags: p.tags?.join(', ') || '',
            featured: p.featured || false,
            isNew: p.isNew || false,
            images: p.images?.length ? p.images : [''],
            variants: p.variants?.length ? p.variants : [{ ...emptyVariant }],
          });
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const updateField = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const updateImage = (idx, value) => {
    const imgs = [...form.images];
    imgs[idx] = value;
    if (idx === imgs.length - 1 && value) imgs.push('');
    setForm((f) => ({ ...f, images: imgs }));
  };

  const removeImage = (idx) => {
    const imgs = form.images.filter((_, i) => i !== idx);
    setForm((f) => ({ ...f, images: imgs.length ? imgs : [''] }));
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      const url = res.data.data.url;
      const imgs = form.images.filter(Boolean);
      imgs.push(url);
      imgs.push('');
      setForm((f) => ({ ...f, images: imgs }));
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleVariantUpload = async (e, variantIdx) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      const url = res.data.data.url;
      const v = [...form.variants];
      v[variantIdx].images = [...(v[variantIdx].images || []), url];
      setForm((f) => ({ ...f, variants: v }));
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (variantFileRef.current) variantFileRef.current.value = '';
    }
  };

  const removeVariantImage = (variantIdx, imgIdx) => {
    const v = [...form.variants];
    v[variantIdx].images = v[variantIdx].images.filter((_, i) => i !== imgIdx);
    setForm((f) => ({ ...f, variants: v }));
  };

  const updateVariant = (idx, field, value) => {
    const v = [...form.variants];
    v[idx][field] = value;
    setForm((f) => ({ ...f, variants: v }));
  };

  const addVariant = () => {
    setForm((f) => ({ ...f, variants: [...f.variants, { ...emptyVariant }] }));
  };

  const removeVariant = (idx) => {
    if (form.variants.length === 1) return;
    setForm((f) => ({ ...f, variants: f.variants.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fieldErrors = validateProduct(form);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSaving(true);

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      offerPrice: form.offerPrice ? Number(form.offerPrice) : undefined,
      costPrice: form.costPrice ? Number(form.costPrice) : undefined,
      category: form.category,
      material: form.material || undefined,
      workType: form.workType || undefined,
      occasion: form.occasion || undefined,
      gender: form.gender || undefined,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      featured: form.featured,
      isNew: form.isNew,
      images: form.images.filter(Boolean),
      variants: form.variants.filter((v) => v.sku).map((v) => ({
        ...v,
        stock: Number(v.stock),
        images: (v.images || []).filter(Boolean),
      })),
    };

    try {
      if (isEdit) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }
      navigate('/admin/products');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner className="mt-16" />;

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Product' : 'New Product'}</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input className={`w-full border rounded px-3 py-2 text-sm ${errors.name ? 'border-red-500' : ''}`} value={form.name}
              onChange={(e) => updateField('name', e.target.value)} required />
            <FieldError message={errors.name} />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea className="w-full border rounded px-3 py-2 text-sm" rows={3} value={form.description}
              onChange={(e) => updateField('description', e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input type="number" step="0.01" className={`w-full border rounded px-3 py-2 text-sm ${errors.price ? 'border-red-500' : ''}`} value={form.price}
              onChange={(e) => updateField('price', e.target.value)} required />
            <FieldError message={errors.price} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Offer Price</label>
            <input type="number" step="0.01" className={`w-full border rounded px-3 py-2 text-sm ${errors.offerPrice ? 'border-red-500' : ''}`} value={form.offerPrice}
              onChange={(e) => updateField('offerPrice', e.target.value)} />
            <FieldError message={errors.offerPrice} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select className={`w-full border rounded px-3 py-2 text-sm ${errors.category ? 'border-red-500' : ''}`} value={form.category}
              onChange={(e) => updateField('category', e.target.value)} required>
              <option value="">Select</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <FieldError message={errors.category} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Material</label>
            <select className="w-full border rounded px-3 py-2 text-sm" value={form.material}
              onChange={(e) => updateField('material', e.target.value)}>
              <option value="">Select</option>
              {materials.map((m) => (
                <option key={m._id} value={m.name}>{m.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Work Type</label>
            <select className="w-full border rounded px-3 py-2 text-sm" value={form.workType}
              onChange={(e) => updateField('workType', e.target.value)}>
              <option value="">Select</option>
              {workTypes.map((w) => (
                <option key={w._id} value={w.name}>{w.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Occasion</label>
            <select className="w-full border rounded px-3 py-2 text-sm" value={form.occasion}
              onChange={(e) => updateField('occasion', e.target.value)}>
              <option value="">Select</option>
              {occasions.map((o) => (
                <option key={o._id} value={o.name}>{o.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <select className="w-full border rounded px-3 py-2 text-sm" value={form.gender}
              onChange={(e) => updateField('gender', e.target.value)}>
              <option value="">Select</option>
              {['Women', 'Men', 'Unisex'].map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
            <input className="w-full border rounded px-3 py-2 text-sm" value={form.tags}
              onChange={(e) => updateField('tags', e.target.value)} />
          </div>
        </div>

          <div>
          <label className="block text-sm font-medium mb-1">Or paste image URLs</label>
          {form.images.map((img, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input className="flex-1 border rounded px-3 py-2 text-sm" placeholder="Image URL" value={img}
                onChange={(e) => updateImage(i, e.target.value)} />
              {form.images.length > 1 && (
                <button type="button" onClick={() => removeImage(i)} className="text-red-500 text-sm">Remove</button>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.featured}
              onChange={(e) => updateField('featured', e.target.checked)} />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isNew}
              onChange={(e) => updateField('isNew', e.target.checked)} />
            New Arrival
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Images</label>
          <div className="flex flex-wrap gap-3 mb-3">
            {form.images.filter(Boolean).map((img, i) => (
              <div key={i} className="relative w-24 h-24 rounded border overflow-hidden group">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-0.5 right-0.5 bg-red-600 text-white text-xs w-5 h-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >×</button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="text-sm"
            />
            {uploading && <Spinner size="sm" />}
          </div>
          <p className="text-xs text-gray-400 mt-1">Max 5MB per image. Uploaded via Cloudinary.</p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium">Variants (Color / SKU / Stock)</label>
            <button type="button" onClick={addVariant} className="text-sm text-blue-600 hover:underline">+ Add</button>
          </div>
          {form.variants.map((v, i) => (
            <div key={i} className="border rounded p-3 mb-3">
              <div className="flex gap-2 mb-2">
                <input className="w-20 border rounded px-2 py-1 text-sm" placeholder="Size" value={v.size}
                  onChange={(e) => updateVariant(i, 'size', e.target.value)} />
                <input className="flex-1 border rounded px-2 py-1 text-sm" placeholder="Color" value={v.color}
                  onChange={(e) => updateVariant(i, 'color', e.target.value)} required />
                <input className="w-24 border rounded px-2 py-1 text-sm" placeholder="SKU" value={v.sku}
                  onChange={(e) => updateVariant(i, 'sku', e.target.value)} required />
                <input type="number" className="w-20 border rounded px-2 py-1 text-sm" placeholder="Stock" value={v.stock}
                  onChange={(e) => updateVariant(i, 'stock', e.target.value)} required />
                {form.variants.length > 1 && (
                  <button type="button" onClick={() => removeVariant(i)} className="text-red-500 text-sm">X</button>
                )}
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Color Images</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(v.images || []).length === 0 && form.images.filter(Boolean).length > 0 && (
                    <div className="relative w-16 h-16 rounded border overflow-hidden opacity-50">
                      <img src={form.images.filter(Boolean)[0]} alt="" className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[8px] text-center py-0.5">Default</span>
                    </div>
                  )}
                  {(v.images || []).map((img, j) => (
                    <div key={j} className="relative w-16 h-16 rounded border overflow-hidden group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeVariantImage(i, j)}
                        className="absolute top-0.5 right-0.5 bg-red-600 text-white text-xs w-4 h-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >×</button>
                    </div>
                  ))}
                </div>
                <input
                  ref={variantUploadIdx === i ? variantFileRef : undefined}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleVariantUpload(e, i)}
                  className="text-xs"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { updateProductDiscount, deleteProduct, createProduct } from '@/app/actions/admin';

type Product = any; // simplified for this example
type Category = any;

export default function AdminTable({ initialProducts, categories }: { initialProducts: Product[], categories: Category[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingDiscount, setEditingDiscount] = useState<string | null>(null);
  const [discountValue, setDiscountValue] = useState('');

  const handleSaveDiscount = async (productId: string) => {
    const val = discountValue ? parseFloat(discountValue) : null;
    await updateProductDiscount(productId, val);
    setProducts(products.map(p => p.id === productId ? { ...p, oldPrice: val, isFeatured: val !== null } : p));
    setEditingDiscount(null);
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>ახალი პროდუქტის დამატება</h2>
        <form action={createProduct} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label className="label">დასახელება</label>
            <input name="name" required className="input" placeholder="მაგ: Varta Silver Dynamic..." />
          </div>
          <div>
            <label className="label">ფასი (₾)</label>
            <input name="price" type="number" step="0.01" required className="input" placeholder="150" />
          </div>
          <div>
            <label className="label">კატეგორია</label>
            <select name="categoryId" required className="input" style={{ appearance: 'auto' }}>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">სურათის URL</label>
            <input name="imageUrl" className="input" placeholder="https://..." />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label className="label">აღწერა</label>
            <textarea name="description" className="input" rows={3} placeholder="დეტალური მახასიათებლები..." />
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary">პროდუქტის დამატება</button>
          </div>
        </form>
      </div>

      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem' }}>პროდუქტების მართვა</h2>
          <input 
            type="text" 
            placeholder="ძებნა..." 
            className="input" 
            style={{ width: '300px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--muted)' }}>
                <th style={{ padding: '1rem' }}>ID</th>
                <th style={{ padding: '1rem' }}>სურათი</th>
                <th style={{ padding: '1rem' }}>დასახელება</th>
                <th style={{ padding: '1rem' }}>კატეგორია</th>
                <th style={{ padding: '1rem' }}>ფასი</th>
                <th style={{ padding: '1rem' }}>ძველი ფასი (SALE)</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>მოქმედება</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(product => (
                <tr key={product.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem', color: 'var(--muted)' }}>#{product.id}</td>
                  <td style={{ padding: '1rem' }}>
                    {product.imageUrl ? (
                      <div style={{ width: '40px', height: '40px', background: `url(${product.imageUrl}) center/contain no-repeat`, backgroundSize: 'cover', borderRadius: '4px' }} />
                    ) : (
                      <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }} />
                    )}
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{product.name}</td>
                  <td style={{ padding: '1rem', color: 'var(--muted)' }}>{product.category?.name || '-'}</td>
                  <td style={{ padding: '1rem', color: 'var(--accent)', fontWeight: 600 }}>{product.price} ₾</td>
                  <td style={{ padding: '1rem' }}>
                    {editingDiscount === product.id ? (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input 
                          type="number" 
                          className="input" 
                          style={{ width: '100px', padding: '0.5rem' }} 
                          value={discountValue}
                          onChange={(e) => setDiscountValue(e.target.value)}
                          placeholder="ფასი..."
                        />
                        <button className="btn btn-primary" style={{ padding: '0.5rem' }} onClick={() => handleSaveDiscount(product.id)}>✓</button>
                        <button className="btn btn-outline" style={{ padding: '0.5rem' }} onClick={() => setEditingDiscount(null)}>✕</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ color: product.oldPrice ? 'var(--primary)' : 'var(--muted)', textDecoration: product.oldPrice ? 'line-through' : 'none' }}>
                          {product.oldPrice ? `${product.oldPrice} ₾` : 'არ არის'}
                        </span>
                        <button 
                          style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.85rem' }}
                          onClick={() => {
                            setEditingDiscount(product.id);
                            setDiscountValue(product.oldPrice?.toString() || '');
                          }}
                        >
                          შეცვლა
                        </button>
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button 
                      className="btn btn-outline" 
                      style={{ padding: '0.5rem 1rem', borderColor: 'var(--primary)', color: 'var(--primary)' }}
                      onClick={async () => {
                        if(confirm('ნამდვილად გსურთ წაშლა?')) {
                          await deleteProduct(product.id);
                          setProducts(products.filter(p => p.id !== product.id));
                        }
                      }}
                    >
                      წაშლა
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

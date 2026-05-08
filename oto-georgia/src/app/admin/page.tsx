import { prisma } from '@/lib/prisma';
import AdminTable from '@/components/AdminTable';

export default async function AdminPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { id: 'desc' }
  });
  
  const categories = await prisma.category.findMany();

  return (
    <div className="container" style={{ padding: '4rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '2.5rem' }}>ადმინ პანელი</h1>
        <div className="badge">სულ: {products.length} პროდუქტი</div>
      </div>
      
      <AdminTable initialProducts={products} categories={categories} />
    </div>
  );
}

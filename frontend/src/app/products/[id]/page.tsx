'use client';

import { useEffect, useState } from 'react';

type Product = {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    stock: number;
    images: string[];
    category: { id: number; name: string; slug: string };
};

export default function ProductPage({ params }: { params: { id: string } }) {
    const [product, setProduct] = useState<Product | null>(null);

    useEffect(() => {
        async function fetchProduct() {
            const res = await fetch(`http://localhost:3001/products/${params.id}`);
            const data = await res.json();
            setProduct(data);
        }
        fetchProduct();
    }, [params.id]);

    if (!product) return <p>Chargement...</p>;

    return (
        <div style={{ padding: '2rem' }}>
            <h1>{product.name}</h1>
            <p><strong>Catégorie :</strong> {product.category.name}</p>
            <p>{product.description}</p>
            <p><strong>Prix :</strong> {product.price} €</p>
            <p><strong>Stock :</strong> {product.stock}</p>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                {product.images.map((url, i) => (
                    <img
                        key={i}
                        src={url}
                        alt={`${product.name} ${i + 1}`}
                        style={{ width: '200px', borderRadius: '8px' }}
                    />
                ))}
            </div>
        </div>
    );
}

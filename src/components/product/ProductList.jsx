import React from "react";
import { CRow, CCol } from "@coreui/react";
import ProductCard from "./ProductCard.jsx";

const products = [
  {
    id: "oyy8s4",
    name: "Gulnaar Silk Saree",
    price: 8900,
    originalPrice: 10900,
    discount: 18,
    description: "Handwoven tussar silk",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85",
    tag: "New arrival",
    rating: 4.8,
    reviews: 124,
  },
  {
    id: "neelambari-cotton",
    name: "Neelambari Cotton",
    price: 3600,
    originalPrice: 4500,
    discount: 20,
    description: "Soft kala cotton",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85",
    tag: "Everyday edit",
    rating: 4.7,
    reviews: 98,
  },
  {
    id: "mogra-organza",
    name: "Mogra Organza",
    price: 6200,
    originalPrice: 7800,
    discount: 21,
    description: "Lightweight silk organza",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85",
    tag: "Bestseller",
    rating: 4.9,
    reviews: 156,
  },
  {
    id: "gulabi-banarasi",
    name: "Gulabi Banarasi",
    price: 7800,
    originalPrice: 9500,
    discount: 18,
    description: "Rich handwoven Banarasi silk",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85",
    tag: "Festive edit",
    rating: 4.8,
    reviews: 87,
  },
  {
    id: "chandni-chanderi",
    name: "Chandni Chanderi",
    price: 5200,
    originalPrice: 6500,
    discount: 20,
    description: "Elegant handloom Chanderi silk",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85",
    tag: "New arrival",
    rating: 4.7,
    reviews: 73,
  },
  {
    id: "meher-kanjeevaram",
    name: "Meher Kanjeevaram",
    price: 12500,
    originalPrice: 15000,
    discount: 17,
    description: "Traditional Kanjeevaram silk",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85",
    tag: "Premium",
    rating: 4.9,
    reviews: 112,
  },
  {
    id: "gulmohar-linen",
    name: "Gulmohar Linen",
    price: 4200,
    originalPrice: 5200,
    discount: 19,
    description: "Breathable linen handloom",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85",
    tag: "Summer edit",
    rating: 4.6,
    reviews: 64,
  },
  {
    id: "noor-tissue",
    name: "Noor Tissue Silk",
    price: 6900,
    originalPrice: 8500,
    discount: 19,
    description: "Shimmering tissue silk",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85",
    tag: "Party wear",
    rating: 4.8,
    reviews: 91,
  },
];

const ProductList = () => {
  return (
        <CRow className="g-4">
            {products.map((product) => (
                <CCol key={product.id} xs={12} sm={6} md={4} lg={3}>
                <ProductCard product={product} />
                </CCol>
            ))}
        </CRow>
  );
};

export default ProductList;
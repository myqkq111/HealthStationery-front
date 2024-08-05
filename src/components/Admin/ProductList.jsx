import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductForm from "./ProductForm"; // ProductForm 임포트

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // 상품 목록을 가져오는 함수
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("상품 목록을 가져오는 데 실패했습니다.", error);
      }
    };
    fetchProducts();
  }, []);

  // 상품 추가 또는 수정 후 업데이트
  const handleProductUpdated = (updatedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
    setIsFormOpen(false);
  };

  // 상품 추가 버튼 클릭 핸들러
  const handleAddProductClick = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  // 상품 수정 버튼 클릭 핸들러
  const handleEditProductClick = (product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  // 상품 삭제 핸들러
  const handleDeleteProductClick = async (productId) => {
    try {
      await axios.delete(`/api/products/${productId}`);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
    } catch (error) {
      console.error("상품 삭제에 실패했습니다.", error);
    }
  };

  return (
    <div>
      <button
        onClick={handleAddProductClick}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        상품 추가
      </button>
      <div className="mt-4">
        <h2 className="text-2xl font-semibold mb-4">상품 목록</h2>
        <ul>
          {products.map((product) => (
            <li key={product.id} className="mb-2">
              <div className="flex justify-between items-center">
                <span>
                  {product.name} - ${product.price}
                </span>
                <div>
                  <button
                    onClick={() => handleEditProductClick(product)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDeleteProductClick(product.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* ProductForm 컴포넌트 조건부 렌더링 */}
      {isFormOpen && (
        <ProductForm
          product={selectedProduct}
          onClose={() => setIsFormOpen(false)}
          onProductUpdated={handleProductUpdated}
        />
      )}
    </div>
  );
};

export default ProductList;

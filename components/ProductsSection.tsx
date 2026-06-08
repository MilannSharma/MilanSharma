import React from 'react';
import { Download, ExternalLink, Package } from 'lucide-react';
import { Product } from '../types';

interface ProductsSectionProps {
  products: Product[];
  onDownloadTrack?: () => void;
}

const ProductsSection: React.FC<ProductsSectionProps> = ({ products, onDownloadTrack }) => {
  return (
    <div className="space-y-10 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="text-xl md:text-2xl font-black text-white tracking-tighter mb-4 md:mb-6">Breakthrough Products</h2>
        <p className="text-gray-400 text-[14px] md:text-[16px] leading-relaxed font-medium max-w-2xl">
          Innovative tools, applications, and assets built to solve complex software engineering and data workflows.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="bg-[#121212] rounded-[24px] p-12 border border-[#222] text-center text-gray-500 font-bold text-xs">
          No products listed yet. Access the admin panel to add products!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pb-20">
          {products.map((product) => (
            <div 
              key={product.id}
              className="bg-[#121212] rounded-[24px] md:rounded-[32px] p-5 md:p-6 border border-[#222] hover:border-[#f59e0b]/40 transition-all flex flex-col gap-4 group shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#f59e0b]/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-[#f59e0b]/10 transition-colors"></div>
              
              {/* Product Image */}
              <div className="aspect-[16/10] w-full rounded-xl md:rounded-2xl overflow-hidden border border-[#222] bg-[#1a1a1a] relative">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 scale-100 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-700">
                    <Package size={48} className="group-hover:text-[#f59e0b]/50 transition-colors" />
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-2 flex-1 flex flex-col">
                <h3 className="text-base md:text-lg font-black text-white group-hover:text-[#f59e0b] transition-colors leading-tight">
                  {product.title}
                </h3>
                <p className="text-gray-400 text-[12px] md:text-[13px] leading-relaxed font-medium flex-1 line-clamp-3">
                  {product.description}
                </p>
                
                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-[#222]/40 mt-auto">
                  {product.fileUrl && (
                    <a 
                      href={product.fileUrl} 
                      onClick={onDownloadTrack}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-[#f59e0b] hover:bg-white text-black px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      <Download size={12} /> Download Asset
                    </a>
                  )}
                  {product.link && (
                    <a 
                      href={product.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#222] text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-[#333] hover:border-[#f59e0b]/40 transition-all"
                    >
                      <ExternalLink size={12} /> Explore Project
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsSection;

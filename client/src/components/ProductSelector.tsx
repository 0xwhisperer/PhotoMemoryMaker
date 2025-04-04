import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { 
  ProductType, 
  ProductSize, 
  FilterType, 
  PRODUCT_SIZES, 
  formatPrice,
  calculateTotalPrice
} from "@/lib/utils";
import type { ProductPricing } from "@shared/schema";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { 
  Minus, 
  Plus, 
  ChevronRight 
} from "lucide-react";

interface ProductSelectorProps {
  imageUrl: string;
  rotation: number;
  filter: FilterType;
  onBack: () => void;
  onStartOver: () => void;
  onContinue: (
    productType: ProductType,
    productSize: ProductSize,
    quantity: number,
    unitPrice: number,
    totalPrice: number
  ) => void;
}

export function ProductSelector({
  imageUrl,
  rotation,
  filter,
  onBack,
  onStartOver,
  onContinue,
}: ProductSelectorProps) {
  const [productType, setProductType] = useState<ProductType | null>(null);
  const [productSize, setProductSize] = useState<ProductSize>("medium");
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  // Fetch product pricing
  const { data: pricing, isLoading } = useQuery<ProductPricing>({
    queryKey: ["/api/pricing"],
  });

  // Update price when product type, size or quantity changes
  useEffect(() => {
    if (pricing && productType) {
      const unitPrice = pricing[productType][productSize];
      const { subtotal } = calculateTotalPrice(unitPrice, quantity);
      setTotalPrice(subtotal);
    }
  }, [pricing, productType, productSize, quantity]);

  const handleContinue = () => {
    if (pricing && productType) {
      const unitPrice = pricing[productType][productSize];
      onContinue(productType, productSize, quantity, unitPrice, totalPrice);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < 100) {
      setQuantity(quantity + 1);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 100) {
      setQuantity(value);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-200">Choose Your Product</h1>
      <p className="mb-6 text-gray-400">
        Select the type of print you'd like to create with your image.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Postcard Option */}
        <div
          onClick={() => {
            setProductType("postcard");
            setProductSize("medium");
          }}
          className={`card-dark rounded-lg overflow-hidden cursor-pointer transition duration-200 transform hover:-translate-y-1 hover:shadow-lg ${
            productType === "postcard"
              ? "border-primary ring-2 ring-primary ring-opacity-50"
              : "border-gray-800"
          }`}
        >
          <div className="aspect-w-3 aspect-h-2 bg-gray-800">
            <svg 
              className="w-full h-full text-gray-400" 
              viewBox="0 0 100 66"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="100" height="66" rx="2" fill="currentColor" opacity="0.2" />
              <path d="M35 33L50 18L65 33" stroke="currentColor" strokeWidth="2" />
              <circle cx="60" cy="23" r="3" fill="currentColor" />
            </svg>
          </div>
          <div className="p-4">
            <h3 className="font-medium text-lg mb-1 text-gray-200">Postcards</h3>
            <p className="text-gray-400 text-sm mb-3">
              High-quality printed postcards, perfect for greetings and
              announcements.
            </p>
            <div className="flex items-center text-sm text-primary">
              <span>
                Starting at {pricing && formatPrice(pricing.postcard.small)} each
              </span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </div>
          </div>
        </div>

        {/* Poster Option */}
        <div
          onClick={() => {
            setProductType("poster");
            setProductSize("medium");
          }}
          className={`card-dark rounded-lg overflow-hidden cursor-pointer transition duration-200 transform hover:-translate-y-1 hover:shadow-lg ${
            productType === "poster"
              ? "border-primary ring-2 ring-primary ring-opacity-50"
              : "border-gray-800"
          }`}
        >
          <div className="aspect-w-3 aspect-h-2 bg-gray-800">
            <svg 
              className="w-full h-full text-gray-400" 
              viewBox="0 0 100 66"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="100" height="66" rx="2" fill="currentColor" opacity="0.2" />
              <rect x="25" y="13" width="50" height="40" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M35 43L45 33L65 53" stroke="currentColor" strokeWidth="2" />
              <circle cx="40" cy="28" r="3" fill="currentColor" />
            </svg>
          </div>
          <div className="p-4">
            <h3 className="font-medium text-lg mb-1 text-gray-200">Posters</h3>
            <p className="text-gray-400 text-sm mb-3">
              Premium 11×17 posters and other sizes, perfect for showcasing your
              artwork with stunning quality.
            </p>
            <div className="flex items-center text-sm text-primary">
              <span>
                Starting at {pricing && formatPrice(pricing.poster.small)} each
              </span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Product Configuration */}
      {productType && (
        <div>
          <h2 className="text-lg font-medium mb-4 text-gray-200">
            Customize Your{" "}
            <span className="capitalize">
              {productType === "postcard" ? "Postcard" : "Poster"}
            </span>
          </h2>

          <div className="card-dark rounded-lg shadow-lg overflow-hidden mb-6">
            <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Preview */}
              <div className="bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center" style={{ minHeight: "200px" }}>
                <img
                  src={imageUrl}
                  alt="Product preview"
                  className="max-w-full max-h-full object-contain"
                  style={{ transform: `rotate(${rotation}deg)`, filter }}
                />
              </div>

              {/* Size Options */}
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Size
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["small", "medium", "large"].map((size) => (
                      <button
                        key={size}
                        onClick={() => setProductSize(size as ProductSize)}
                        className={`py-2 px-4 rounded-md text-sm text-center border ${
                          productSize === size
                            ? "bg-gray-800 text-primary border-primary"
                            : "bg-gray-900 text-gray-300 border-gray-700 hover:bg-gray-800"
                        } transition-colors duration-200`}
                      >
                        {size.charAt(0).toUpperCase() + size.slice(1)}
                        <div className={`text-xs mt-1 ${productSize === size ? "text-cyan-400" : "text-gray-500"}`}>
                          {productType && PRODUCT_SIZES[productType][size as ProductSize]}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="mb-4">
                  <label
                    htmlFor="quantity"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Quantity
                  </label>
                  <div className="flex items-center">
                    <Button
                      type="button"
                      variant="outline"
                      className="p-2 border border-gray-700 rounded-l-md bg-gray-800 text-gray-300 hover:bg-gray-700"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <input
                      type="number"
                      id="quantity"
                      value={quantity}
                      onChange={handleQuantityChange}
                      min="1"
                      max="100"
                      className="w-16 text-center border-y border-gray-700 py-2 bg-gray-900 text-gray-200 focus:ring-primary focus:border-primary sm:text-sm"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="p-2 border border-gray-700 rounded-r-md bg-gray-800 text-gray-300 hover:bg-gray-700"
                      onClick={increaseQuantity}
                      disabled={quantity >= 100}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Price Display */}
                <div className="bg-gray-800 p-3 rounded-md border border-gray-700">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Unit Price:</span>
                    <span className="text-gray-200">
                      {pricing && productType && formatPrice(pricing[productType][productSize])}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-gray-400">Quantity:</span>
                    <span className="text-gray-200">{quantity}</span>
                  </div>
                  <div className="flex justify-between mt-2 font-medium text-lg border-t border-gray-700 pt-2">
                    <span className="text-gray-300">Total:</span>
                    <span className="text-primary">{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <div className="space-x-2">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-200"
          >
            Back
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onStartOver} 
            className="text-gray-400 hover:text-gray-200"
          >
            Start Over
          </Button>
        </div>
        <Button
          onClick={handleContinue}
          disabled={!productType || !productSize}
          className={`btn-glow ${!productType || !productSize ? 'opacity-50' : ''}`}
        >
          Continue to Checkout
        </Button>
      </div>
    </div>
  );
}

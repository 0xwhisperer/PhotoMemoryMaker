import { useState } from "react";
import { PrintProgressBar } from "@/components/PrintProgressBar";
import { ImageUploader } from "@/components/ImageUploader";
import { ImageEditor } from "@/components/ImageEditor";
import { ProductSelector } from "@/components/ProductSelector";
import { CheckoutForm } from "@/components/CheckoutForm";
import { FilterType, ProductSize, ProductType } from "@/lib/utils";
import { User, ShoppingCart } from "lucide-react";

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [imageId, setImageId] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [filter, setFilter] = useState<FilterType>("none");
  const [productType, setProductType] = useState<ProductType | null>(null);
  const [productSize, setProductSize] = useState<ProductSize | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const resetOrder = () => {
    setCurrentStep(1);
    setImageId(null);
    setImageUrl(null);
    setRotation(0);
    setFilter("none");
    setProductType(null);
    setProductSize(null);
    setQuantity(1);
    setUnitPrice(0);
    setTotalPrice(0);
  };

  const handleImageUploaded = (id: number, url: string) => {
    setImageId(id);
    setImageUrl(url);
  };

  const handleImageEdited = (newRotation: number, newFilter: FilterType) => {
    setRotation(newRotation);
    setFilter(newFilter);
    setCurrentStep(3);
  };

  const handleProductSelected = (
    newProductType: ProductType,
    newProductSize: ProductSize,
    newQuantity: number,
    newUnitPrice: number,
    newTotalPrice: number
  ) => {
    setProductType(newProductType);
    setProductSize(newProductSize);
    setQuantity(newQuantity);
    setUnitPrice(newUnitPrice);
    setTotalPrice(newTotalPrice);
    setCurrentStep(4);
  };

  return (
    <div className="bg-gray-50 font-sans text-gray-800 min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-primary">PrintPerfect</span>
              </div>
            </div>
            <div className="flex items-center">
              <button className="p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none">
                <span className="sr-only">Account</span>
                <User className="h-6 w-6" />
              </button>
              <button className="ml-3 p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none">
                <span className="sr-only">Cart</span>
                <ShoppingCart className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Progress Tracker */}
      <PrintProgressBar currentStep={currentStep} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        {currentStep === 1 && (
          <ImageUploader
            onImageUploaded={handleImageUploaded}
            onContinue={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 2 && imageUrl && (
          <ImageEditor
            imageUrl={imageUrl}
            onBack={() => setCurrentStep(1)}
            onContinue={handleImageEdited}
          />
        )}

        {currentStep === 3 && imageUrl && (
          <ProductSelector
            imageUrl={imageUrl}
            rotation={rotation}
            filter={filter}
            onBack={() => setCurrentStep(2)}
            onContinue={handleProductSelected}
          />
        )}

        {currentStep === 4 &&
          imageId &&
          imageUrl &&
          productType &&
          productSize && (
            <CheckoutForm
              imageId={imageId}
              imageUrl={imageUrl}
              rotation={rotation}
              filter={filter}
              productType={productType}
              productSize={productSize}
              quantity={quantity}
              unitPrice={unitPrice}
              totalPrice={totalPrice}
              onBack={() => setCurrentStep(3)}
              onOrderComplete={resetOrder}
            />
          )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <span className="text-xl font-bold text-primary">PrintPerfect</span>
              <p className="mt-2 text-sm text-gray-500">
                Creating beautiful custom prints from your digital images. Turn your
                memories into tangible keepsakes.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">
                Support
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                    Printing Specs
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                    Shipping Info
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">
                Company
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                    Terms & Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} PrintPerfect. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { OrderSummary } from "@/components/OrderSummary";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/queryClient";
import { ProductType, ProductSize, FilterType, calculateTotalPrice } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Create checkout form schema
const checkoutFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "ZIP code is required"),
  country: z.string().min(1, "Country is required"),
  cardNumber: z.string().min(1, "Card number is required"),
  expDate: z.string().min(1, "Expiration date is required"),
  cvc: z.string().min(1, "CVC is required")
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

interface CheckoutFormProps {
  imageId: number;
  imageUrl: string;
  rotation: number;
  filter: FilterType;
  productType: ProductType;
  productSize: ProductSize;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  onBack: () => void;
  onStartOver: () => void;
  onOrderComplete: () => void;
}

export function CheckoutForm({
  imageId,
  imageUrl,
  rotation,
  filter,
  productType,
  productSize,
  quantity,
  unitPrice,
  totalPrice,
  onBack,
  onStartOver,
  onOrderComplete
}: CheckoutFormProps) {
  const { toast } = useToast();
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Create form
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "US",
      cardNumber: "",
      expDate: "",
      cvc: ""
    }
  });

  // Handle order creation
  const orderMutation = useMutation({
    mutationFn: async (data: CheckoutFormValues) => {
      const { subtotal, shipping, tax, total } = calculateTotalPrice(
        unitPrice,
        quantity,
        true
      );

      const orderData = {
        imageId,
        productType,
        productSize,
        quantity,
        unitPrice,
        totalPrice: total,
        rotation,
        filter,
        customerInfo: {
          ...data,
          shipping,
          tax,
          total
        }
      };

      const response = await apiRequest("POST", "/api/orders", orderData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Order placed successfully!",
        description: "Thank you for your order. We'll process it shortly."
      });
      setOrderPlaced(true);
      setTimeout(() => {
        onOrderComplete();
      }, 2000);
    },
    onError: (error) => {
      toast({
        title: "Failed to place order",
        description: error.message || "Please try again.",
        variant: "destructive"
      });
    }
  });

  // Handle form submission
  const onSubmit = (data: CheckoutFormValues) => {
    orderMutation.mutate(data);
  };

  if (orderPlaced) {
    return (
      <div className="card-dark p-8 rounded-lg shadow-lg text-center">
        <div className="flex justify-center mb-4">
          <svg 
            className="h-16 w-16 text-green-400" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2 text-gray-200">Order Placed Successfully!</h2>
        <p className="text-gray-400 mb-6">
          Thank you for your order. We'll process it shortly and send you a confirmation email.
        </p>
        <Button onClick={onOrderComplete} className="px-6 btn-glow">Return to Home</Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-200">Checkout</h1>
      <p className="mb-6 text-gray-400">Complete your order details below.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Form */}
        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="card-dark shadow-lg overflow-hidden rounded-md">
                {/* Shipping Information */}
                <div className="p-6 border-b border-gray-800">
                  <h2 className="text-lg font-medium mb-4 text-gray-200">Shipping Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First name</FormLabel>
                          <FormControl>
                            <Input placeholder="Jane" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel>Email address</FormLabel>
                          <FormControl>
                            <Input placeholder="jane.doe@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel>Street address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="San Francisco" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State / Province</FormLabel>
                          <FormControl>
                            <Input placeholder="CA" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="zip"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP / Postal code</FormLabel>
                          <FormControl>
                            <Input placeholder="94103" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="US">United States</SelectItem>
                              <SelectItem value="CA">Canada</SelectItem>
                              <SelectItem value="UK">United Kingdom</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                {/* Payment Information */}
                <div className="p-6">
                  <h2 className="text-lg font-medium mb-4 text-gray-200">Payment Method</h2>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        id="card"
                        name="paymentMethod"
                        type="radio"
                        checked
                        className="focus:ring-primary h-4 w-4 text-primary border-gray-700 bg-gray-800"
                        readOnly
                      />
                      <label
                        htmlFor="card"
                        className="ml-3 block text-sm font-medium text-gray-300"
                      >
                        Credit Card
                      </label>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                      <FormField
                        control={form.control}
                        name="cardNumber"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-2">
                            <FormLabel>Card number</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="•••• •••• •••• ••••" 
                                {...field} 
                                maxLength={19}
                                onChange={(e) => {
                                  // Format card number with spaces
                                  const val = e.target.value.replace(/\s/g, '');
                                  let newVal = '';
                                  for (let i = 0; i < val.length; i++) {
                                    if (i > 0 && i % 4 === 0) {
                                      newVal += ' ';
                                    }
                                    newVal += val[i];
                                  }
                                  field.onChange(newVal);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="expDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiration date</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="MM/YY" 
                                {...field} 
                                maxLength={5}
                                onChange={(e) => {
                                  let value = e.target.value.replace(/\D/g, '');
                                  if (value.length > 2) {
                                    value = value.substring(0, 2) + '/' + value.substring(2);
                                  }
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="cvc"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CVC</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="123" 
                                {...field} 
                                maxLength={3}
                                type="password"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="mt-8">
                    <Button
                      type="submit"
                      className={`btn-glow w-full px-6 py-3 text-lg ${orderMutation.isPending ? 'opacity-50' : ''}`}
                      disabled={orderMutation.isPending}
                    >
                      {orderMutation.isPending ? (
                        <div className="flex items-center">
                          <LoadingSpinner color="white" className="mr-2" />
                          Processing...
                        </div>
                      ) : (
                        "Place Order"
                      )}
                    </Button>
                    <p className="mt-2 text-xs text-gray-500 text-center">
                      By placing your order, you agree to our Terms of Service and
                      Privacy Policy.
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </div>

        {/* Order Summary */}
        <div>
          <OrderSummary
            imageUrl={imageUrl}
            rotation={rotation}
            filter={filter}
            productType={productType}
            productSize={productSize}
            quantity={quantity}
            unitPrice={unitPrice}
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex space-x-2">
        <Button 
          variant="outline" 
          onClick={onBack} 
          disabled={orderMutation.isPending}
          className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800"
        >
          Back to Product Selection
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onStartOver} 
          className="text-gray-400 hover:text-gray-200 hover:bg-gray-800" 
          disabled={orderMutation.isPending}
        >
          Start Over
        </Button>
      </div>
    </div>
  );
}

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Star } from "lucide-react";

interface FiltersProps {
  categories: string[];
  brands: string[];
  selectedCategories: string[];
  selectedBrands: string[];
  priceRange: [number, number];
  maxPrice: number;
  minRating: number;
  minDiscount: number;
  onCategoryChange: (cat: string) => void;
  onBrandChange: (brand: string) => void;
  onPriceChange: (range: [number, number]) => void;
  onRatingChange: (rating: number) => void;
  onDiscountChange: (discount: number) => void;
  onClearAll: () => void;
}

const discountOptions = [
  { label: "10% and above", value: 10 },
  { label: "20% and above", value: 20 },
  { label: "30% and above", value: 30 },
];

const FilterSidebar = ({
  categories, brands, selectedCategories, selectedBrands,
  priceRange, maxPrice, minRating, minDiscount,
  onCategoryChange, onBrandChange, onPriceChange, onRatingChange, onDiscountChange, onClearAll,
}: FiltersProps) => {
  return (
    <aside className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Filters</h2>
        <button onClick={onClearAll} className="text-xs text-primary hover:underline">Clear all</button>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Category</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${cat}`}
                checked={selectedCategories.includes(cat)}
                onCheckedChange={() => onCategoryChange(cat)}
              />
              <Label htmlFor={`cat-${cat}`} className="text-sm cursor-pointer">{cat}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Price Range</h3>
        <Slider
          min={0}
          max={maxPrice}
          step={100}
          value={[priceRange[0], priceRange[1]]}
          onValueChange={(val) => onPriceChange([val[0], val[1]])}
          className="mb-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>₹{priceRange[0]}</span>
          <span>₹{priceRange[1]}</span>
        </div>
      </div>

      {/* Ratings */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((r) => (
            <div key={r} className="flex items-center gap-2">
              <Checkbox
                id={`rating-${r}`}
                checked={minRating === r}
                onCheckedChange={() => onRatingChange(minRating === r ? 0 : r)}
              />
              <Label htmlFor={`rating-${r}`} className="flex items-center gap-1 text-sm cursor-pointer">
                {r} <Star className="h-3 w-3 fill-primary text-primary" /> & above
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Discount */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Discount</h3>
        <div className="space-y-2">
          {discountOptions.map((d) => (
            <div key={d.value} className="flex items-center gap-2">
              <Checkbox
                id={`disc-${d.value}`}
                checked={minDiscount === d.value}
                onCheckedChange={() => onDiscountChange(minDiscount === d.value ? 0 : d.value)}
              />
              <Label htmlFor={`disc-${d.value}`} className="text-sm cursor-pointer">{d.label}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Brand</h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center gap-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => onBrandChange(brand)}
              />
              <Label htmlFor={`brand-${brand}`} className="text-sm cursor-pointer">{brand}</Label>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;

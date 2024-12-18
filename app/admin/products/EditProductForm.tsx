'use client'

import { useState } from 'react'
import { Product } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { PREDEFINED_CATEGORIES, MainCategory } from '@/lib/categories'
import { Switch } from '@/components/ui/switch'
import ImageUpload from './ImageUpload'

interface EditProductFormProps {
  product: Product
  onClose: () => void
  onProductUpdated: () => void
}

export function EditProductForm({ product, onClose, onProductUpdated }: EditProductFormProps) {
  const [formData, setFormData] = useState({
    ...product,
    mainCategory: product.mainCategory as MainCategory
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          initialPrice: Number(formData.initialPrice),
          topDealsPrice: Number(formData.topDealsPrice)
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update product')
      }

      onProductUpdated()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="ref">Reference</Label>
            <Input
              id="ref"
              value={formData.ref}
              onChange={(e) => setFormData({ ...formData, ref: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="mainCategory">Main Category</Label>
            <Select
              value={formData.mainCategory}
              onValueChange={(value: MainCategory) => setFormData({ 
                ...formData, 
                mainCategory: value,
                subCategory: '' // Reset subcategory when main category changes
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(PREDEFINED_CATEGORIES) as MainCategory[]).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="subCategory">Sub Category</Label>
            <Select
              value={formData.subCategory}
              onValueChange={(value) => setFormData({ ...formData, subCategory: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select subcategory" />
              </SelectTrigger>
              <SelectContent>
                {PREDEFINED_CATEGORIES[formData.mainCategory].map((subCategory) => (
                  <SelectItem key={subCategory} value={subCategory}>
                    {subCategory}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="initialPrice">Initial Price</Label>
            <Input
              id="initialPrice"
              type="number"
              value={formData.initialPrice}
              onChange={(e) => setFormData({ ...formData, initialPrice: parseFloat(e.target.value) })}
              required
            />
          </div>
          <div>
            <Label htmlFor="topDealsPrice">Top Deals Price</Label>
            <Input
              id="topDealsPrice"
              type="number"
              value={formData.topDealsPrice}
              onChange={(e) => setFormData({ ...formData, topDealsPrice: parseFloat(e.target.value) })}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="dimensions">Dimensions</Label>
          <Input
            id="dimensions"
            value={formData.dimensions}
            onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
          />
          <Label>Active</Label>
        </div>

        <ImageUpload
          mainImage={formData.mainImage}
          gallery={formData.gallery}
          onImagesUpdated={(mainImage, gallery) => 
            setFormData({ ...formData, mainImage, gallery })
          }
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Product'}
        </Button>
      </div>
    </form>
  )
} 
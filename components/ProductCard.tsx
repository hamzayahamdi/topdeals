/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Product } from '@/lib/types'
import { Tag, Ruler, Truck, Check, AlertCircle, Loader2, Eye } from 'lucide-react'
import { fetchStoreAvailability } from '@/lib/api'
import type { StoreAvailability } from '@/lib/api'
import Link from 'next/link'

interface ProductCardProps {
  product: Product
  onQuickView?: (product: Product) => void
}

const getCategoryColor = (category: string) => {
  const stringToColor = (str: string, lightness: number) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 30%, ${lightness}%)`;
  };

  const baseColor = stringToColor(category, 30);
  const lighterColor = stringToColor(category, 40);
  return { baseColor, lighterColor };
};

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [availability, setAvailability] = useState<StoreAvailability | null>(null)

  useEffect(() => {
    const getAvailability = async () => {
      try {
        const data = await fetchStoreAvailability(product.ref)
        setAvailability(data)
      } catch (err) {
        console.error(err)
      }
    }

    getAvailability()
  }, [product.ref])

  const discountPercentage = Math.round((1 - product.topDealsPrice / product.initialPrice) * 100)
  const { baseColor, lighterColor } = getCategoryColor(product.mainCategory);

  const { stockStatus, totalStock } = useMemo(() => {
    if (!availability) return {
      stockStatus: {
        icon: <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />,
        text: "Vérification...",
        textColor: "text-gray-400",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200"
      },
      totalStock: 0
    }

    const totalStock = Object.values(availability)
      .reduce((sum, value) => sum + (typeof value === 'number' ? value : 0), 0)

    if (totalStock > 5) {
      return {
        stockStatus: {
          icon: <Check className="h-4 w-4 text-emerald-600" />,
          text: "En stock",
          textColor: "text-emerald-700",
          bgColor: "bg-emerald-50",
          borderColor: "border-emerald-200"
        },
        totalStock
      }
    } else if (totalStock > 0) {
      return {
        stockStatus: {
          icon: <AlertCircle className="h-4 w-4 text-amber-600" />,
          text: `${totalStock} en stock`,
          textColor: "text-amber-700",
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200"
        },
        totalStock
      }
    } else {
      return {
        stockStatus: {
          icon: <AlertCircle className="h-4 w-4 text-red-600" />,
          text: "Rupture de stock",
          textColor: "text-red-700",
          bgColor: "bg-red-50",
          borderColor: "border-red-200"
        },
        totalStock
      }
    }
  }, [availability])

  return (
    <div className="h-full">
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.2 }}
        className="h-full cursor-pointer relative group"
      >
        <Card className="overflow-hidden h-full flex flex-col bg-white">
          <CardContent className="p-0 relative">
            <Link 
              href={`/products/${product.slug}`} 
              className="block"
            >
              <div className="relative aspect-square">
                <Image
                  src={product.mainImage}
                  alt={product.name}
                  fill
                  sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                  priority={true}
                  loading="eager"
                />
                
                <motion.div 
                  className="absolute left-2 top-2 z-20"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <div className="absolute inset-0 blur-md bg-orange-400/30 rounded-full" />
                  <Image
                    src="https://sketch-design.ma/wp-content/uploads/2024/12/topdeal.svg"
                    alt="Top Deal"
                    width={160}
                    height={48}
                    className="w-auto h-12 relative z-20"
                    priority
                  />
                </motion.div>

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent backdrop-blur-sm p-2">
                  <motion.div 
                    className="flex items-center justify-between px-3"
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="bg-white/20 p-1.5 rounded-full">
                        <Truck className="h-3.5 w-3.5 text-white" />
                      </div>
                      <div className="flex flex-col leading-none">
                        <span className="text-white text-xs font-medium">
                          Livraison Gratuite
                        </span>
                        <span className="text-white/80 text-[9px]">
                          En ligne uniquement
                        </span>
                      </div>
                    </div>
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="bg-gradient-to-r from-[#e95123] to-[#641910] px-2.5 py-1 rounded-full"
                    >
                      <span className="text-[10px] font-bold text-white flex items-center gap-1">
                        <span>✨</span>
                        <span>OFFERT</span>
                      </span>
                    </motion.div>
                  </motion.div>
                </div>

                <Badge 
                  className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1.5 text-base font-bold"
                >
                  -{discountPercentage}%
                </Badge>
              </div>
            </Link>
          </CardContent>
          <CardFooter className="flex-grow flex flex-col justify-between w-full py-3 px-2">
            <div className="mb-2 w-full">
              <h3 className="font-semibold text-base mb-1 uppercase line-clamp-2">{product.name}</h3>
              <div className="flex flex-wrap gap-1">
                <Badge 
                  variant="custom"
                  className="text-xs font-semibold px-2 py-0.5 text-white border-none"
                  style={{
                    background: `linear-gradient(to right, ${baseColor}, ${lighterColor})`
                  }}
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {product.subCategory}
                </Badge>
                <Badge 
                  variant="outline" 
                  className="text-xs font-semibold bg-gray-100 px-2 py-0.5"
                >
                  <Ruler className="h-3 w-3 mr-1" />
                  {product.dimensions}
                </Badge>
              </div>
            </div>
            <div className="mt-auto w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <motion.div
                    className="relative"
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <span className="text-xl font-bold text-gray-900">
                      {product.topDealsPrice.toLocaleString('fr-FR').replace(',', ' ')}
                    </span>
                    <span className="text-sm font-medium text-gray-700 ml-0.5">DH</span>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="text-sm text-gray-400 line-through">
                      {product.initialPrice.toLocaleString('fr-FR').replace(',', ' ')} DH
                    </span>
                  </motion.div>
                </div>

                <motion.div
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-full border ${stockStatus.bgColor} ${stockStatus.borderColor}`}
                  animate={{ 
                    scale: totalStock > 0 && totalStock <= 5 ? [1, 1.05, 1] : 1 
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {stockStatus.icon}
                  <span className={`text-xs font-medium ${stockStatus.textColor}`}>
                    {stockStatus.text}
                  </span>
                </motion.div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}


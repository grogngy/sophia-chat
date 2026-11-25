import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  width?: number
  height?: number
  className?: string
}

export default function Logo({ width = 32, height = 32, className = "" }: LogoProps) {
  return (
    <Link 
      href="/" 
      className={cn("flex items-center gap-2 hover:opacity-80 transition-opacity", className)}
      aria-label="Sophia by IdentIA Lab - Ir al inicio"
    >
      <Image
        src="/logo.png"
        alt="Sophia by IdentIA Lab Logo"
        width={width}
        height={height}
        className="flex-shrink-0"
        priority
      />
      <div className="hidden sm:block">
        <div className="text-2xl font-bold text-primary">Sophia</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
          by IdentIA Lab
        </div>
      </div>
    </Link>
  )
}

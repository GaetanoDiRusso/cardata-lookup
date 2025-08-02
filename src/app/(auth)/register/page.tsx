'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Register() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const formatCedula = (value: string) => {
    // Remove all non-digit characters
    const numbers = value.replace(/\D/g, '')
    
    // Limit to 8 digits
    const limitedNumbers = numbers.slice(0, 8)
    
    // Add hyphen after 7 digits if we have 8 digits
    if (limitedNumbers.length === 8) {
      return `${limitedNumbers.slice(0, 7)}-${limitedNumbers.slice(7)}`
    }
    
    return limitedNumbers
  }

  const handleCedulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCedula(e.target.value)
    e.target.value = formatted
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const fullName = formData.get('fullName') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const cedula = formData.get('cedula') as string

    // Validate cedula format
    const cedulaRegex = /^\d{7}-\d{1}$/
    if (!cedulaRegex.test(cedula)) {
      setError('El formato de la cédula debe ser XXXXXXX-X')
      setIsLoading(false)
      return
    }

    // Remove hyphen from cedula before sending
    const cleanCedula = cedula.replace('-', '')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
          cedula: cleanCedula,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Error al crear la cuenta')
      }

      router.push('/login')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al crear la cuenta')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="px-4 h-screen w-full max-w-md mx-auto flex flex-col justify-center items-center">
      <div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Crear una cuenta nueva
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          O{' '}
          <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            iniciar sesión si ya tienes una cuenta
          </Link>
        </p>
      </div>
      <form className="mt-8 space-y-6 w-full" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="fullName" className="sr-only">
              Nombre completo
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Nombre completo"
            />
          </div>
          <div>
            <label htmlFor="cedula" className="sr-only">
              Cédula de Identidad
            </label>
            <input
              id="cedula"
              name="cedula"
              type="text"
              maxLength={9}
              onChange={handleCedulaChange}
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Cédula de Identidad (XXXXXXX-X)"
            />
          </div>
          <div>
            <label htmlFor="email" className="sr-only">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Correo electrónico"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Contraseña"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="group cursor-pointer relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </div>
      </form>
    </div>
  )
} 
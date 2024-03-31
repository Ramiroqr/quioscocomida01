"use client"

import { useStore } from "@/src/store"
import { toast } from "react-toastify"
import ProductDetails from "./ProductDetails"
import { useMemo } from "react"
import { formatCurrency } from "@/src/utils"
import { createOrder } from "@/actions/create-order-actions"
import { OrderSchema } from "@/src/schema"

export default function OrderSummary() {
  const order = useStore((state) => state.order)
  const clearOrder = useStore((state) => state.clearOrder)
  const total = useMemo(() => order.reduce((total, item) => total + (item.quantity * item.price), 0), [order])

  const handleCreateOrder = async (formData: FormData) => {
    const data = {
      name: formData.get('name'),
      total,
      order
    }

    const result = OrderSchema.safeParse(data)
    console.log(result)
    if(!result.success) {
      result.error.issues.forEach((issue) => {
        toast.error(issue.message)
      })

      return
    }
  

    const response = await createOrder(data);
    if( response?.error) {
      response.error.forEach(issue => {
        toast.error(issue.message);
      })
    }

    toast.success('Pedido Realizado Correctamente...');
    clearOrder();
  }

  return (
    <aside className='lg:h-screen lg:overflow-y-scroll md:w-64 lg:w-96 p-5'>
      <h1 className='text-4xl text-center font-black'>Mi Pedido</h1>

      {order.length === 0 
        ? <p className="text-center my-10">El Pedido esta vacio</p>
        : <div className="mt-5">
            {order.map(item => (
              <ProductDetails 
                key={item.id}
                item={item}
              />
            ))}

            <p className="text-2xl mt-20 text-center">
                Total a pagar: {''}
                <span className="font-bold">{formatCurrency(total)}</span>
            </p>

            <form
              className="w-full mt-10 space-y-5"
              action={handleCreateOrder}
            >
              <input 
                type="text" 
                placeholder="Tu nombre"
                className="bg-white border border-gray-100 p-2 w-full"
                name="name"
              />

              <input 
                type="submit"
                className="py-2 rounded uppercase text-white bg-black font-bold w-full text-center cursor-pointer"
                value='Confirmar Pedido' 
              />
            </form>
          </div> 
        
      }
    </aside>
  )
}

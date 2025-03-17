"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import ListItem from "./ListItem"; 

// defind form Schema
const formSchema = z.object({
  activity: z.string().min(2, { message: "Please Key In" }),
  price: z.preprocess((val) => parseFloat(val as string), z.number().min(0, { message: "Price must be a positive number." })),
  type: z.enum([
    "education", "recreational", "social", "diy",
    "charity", "cooking", "relaxation", "music", "busywork"
  ], { message: "Please select a valid type." }),
  bookingRequired: z.boolean(),
  accessibility: z.number().min(0).max(1, { message: "Accessibility must be between 0.0 and 1.0." }),
})

type AddListItem = z.infer<typeof formSchema>

export function AddListForm() {
    // store list
    const [addList, setAddList] = useState<AddListItem[]>([])
    // track accessibility value
    const [accessibilityValue, setAccessibilityValue] = useState(0)
    // caculate the item lsit
    const totalItems = useMemo(() => addList.length, [addList]); 

    // saved list from localStorage
    useEffect(() => {
        const storedList = localStorage.getItem("addList")
        if (storedList) setAddList(JSON.parse(storedList))
    }, [])
    // save list to localStorage
    useEffect(() => {
        localStorage.setItem("addList", JSON.stringify(addList))
    }, [addList])

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AddListItem>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        activity: "",
        price: 0,
        type: "education",
        bookingRequired: false,
        accessibility: 0,
        },
    })

    // submission function
    const onSubmit = (values: AddListItem) => {
        setAddList((prev) => [...prev, values]) 
        reset() 
        setAccessibilityValue(0)
    }

    // delete Item Function
    const removeItem = useCallback((index: number) => {
        setAddList((prev) => prev.filter((_, i) => i !== index));
    }, []);
    
    return (
        <div className="max-w-lg mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">Add List</h1>
        <p>Total Items: {totalItems}</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 border p-4 rounded">
            <div>
            <label>Activity:</label>
            <input {...register("activity")} placeholder="Activity" className="border p-2 w-full rounded" />
            {errors.activity && <p className="text-red-500 text-sm">{errors.activity.message}</p>}
            </div>

            <div>
            <label>Price:</label>
            <input
                type="number"
                step="0.01"  // Allows decimal input
                {...register("price", { setValueAs: (v) => (v === "" ? undefined : parseFloat(v)) })}  
                className="border p-2 w-full rounded"
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
            </div>

            <div>
            <label>Type:</label>
            <select {...register("type")} className="border p-2 w-full rounded">
                {["education", "recreational", "social", "diy", "charity", "cooking", "relaxation", "music", "busywork"].map((t) => (
                <option key={t} value={t}>{t}</option>
                ))}
            </select>
            {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
            </div>

            <div>
            <label className="flex items-center space-x-2">
                <input type="checkbox" {...register("bookingRequired")} />
                <span>Booking Required</span>
            </label>
            </div>

            <div>
                <label>Accessibility (0.0 to 1.0):</label>
                <div className="flex items-center space-x-2">
                    <input
                    type="range"
                    {...register("accessibility", {
                        valueAsNumber: true,
                        onChange: (e) => setAccessibilityValue(parseFloat(e.target.value)), 
                    })}
                    min="0"
                    max="1"
                    step="0.1"
                    />
                    <span className="font-semibold">{accessibilityValue.toFixed(1)}</span>
                </div>
            </div>

            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Add List
            </button>
        </form>
        
        {/* show item lists */}
        <div className="mt-4 space-y-2">
        {addList.map((item, index) => (
          <ListItem key={index} item={item} onDelete={() => removeItem(index)} />
        ))}
      </div>
    </div>
  )
}

export default AddListForm

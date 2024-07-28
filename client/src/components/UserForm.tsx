import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Loader2 } from "lucide-react"
import { User } from "@/types"
import { toast } from "sonner"

const formSchema = z.object({
    name: z.string().min(2).max(50),
    phone: z.string().min(10).max(10),
    email: z.string().email(),
    hobbies: z.string().min(2)
})

type props = {
    data: User | null | "create",
    closeModel: () => void,
    action: "create" | "update"
    setUsers: React.Dispatch<React.SetStateAction<User[] | undefined>>
}

export default function UserForm({ data, closeModel, action, setUsers }: props) {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: (data && typeof data !== "string") ? data.name : "",
            phone: (data && typeof data !== "string") ? data.phone : "",
            email: (data && typeof data !== "string") ? data.email : "",
            hobbies: (data && typeof data !== "string") ? data.hobbies.join(", ") : ""
        },
    })

    const loading = form.formState.isSubmitting

    async function handleUpdate(user: User) {
        const id = (data && data !== "create") ? data._id : ""

        try {
            const res = await fetch(`https://the-it-studio-assignment.onrender.com/user/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            })

            const updatedUser = await res.json()
            if (res.status !== 200) {
                throw new Error(updatedUser)
            }
            setUsers((prev) => {
                if (prev) {
                    return prev.map((u) => {
                        if (u._id === updatedUser._id) {
                            return updatedUser
                        } else {
                            return u
                        }
                    })
                } else {
                    return [updatedUser]
                }
            }
            )
            toast.success("User updated successfully")
        } catch (error) {
            console.log(error);
            toast.error("Failed to update user")
        }
    }

    async function handleCreate(user: User) {
        try {
            const res = await fetch(`https://the-it-studio-assignment.onrender.com/user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            })

            const data = await res.json()
            if (res.status !== 200) {
                throw new Error(data)
            }
            setUsers((prev) => {
                if (prev) {
                    return [...prev, data]
                } else {
                    return [data]
                }
            })
            toast.success("User created successfully")
        } catch (error) {
            console.log(error);
            toast.error("Failed to create user")
        }
    }

    async function onSubmit(data: z.infer<typeof formSchema>) {
        const hobbies = data.hobbies.split(",").map((hobby) => hobby.trim())

        try {
            if (action === "create") {
                await handleCreate({ ...data, hobbies })
            } else {
                await handleUpdate({ ...data, hobbies })
            }

            closeModel()

        } catch (error) {
            console.log(error);

        }
    }



    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className=" flex flex-col items-center gap-10">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="w-full h-12">
                            <FormControl>
                                <Input placeholder="Enter name of user" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem className="w-full h-12">
                            <FormControl>
                                <Input placeholder="phone of user (8862928826)" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="w-full h-12">
                            <FormControl>
                                <Input placeholder="email of user (example@gmail.com)" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="hobbies"
                    render={({ field }) => (
                        <FormItem className="w-full h-12">
                            <FormControl>
                                <Input placeholder="hobbies of users (hobby1 , hobby2)" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className={`${loading ? "w-20 rounded-full" : "w-1/2"} transition-all`}>{
                    loading ? <Loader2 className=" animate-spin" /> : "Submit"
                }</Button>

            </form>
        </Form>
    )

}